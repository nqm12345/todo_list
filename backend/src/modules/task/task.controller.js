import Task from './task.model.js';
import User from '../auth/auth.model.js';
import { createError } from '../../utils/error.js';
import xlsx from 'xlsx';

// Import helpers
import { normalizeStatus, validateAndParseTasks } from './helpers/taskValidator.js';
import { parseExcelFile, parseCSVFile } from './helpers/excelParser.js';
import { tasksToCSV, getCSVFilename, getJSONFilename } from './helpers/csvExporter.js';
import { canModifyTask, getPermissionError } from './helpers/permissions.js';

// Get all tasks (SHARED MODE - all users see all tasks)
export const getTasks = async (req, res, next) => {
  try {
    // Get ALL tasks from all users, populate user info
    const tasks = await Task.find({})
      .populate('userId', 'username email')
      .sort({ createdAt: -1 });
    
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách công việc thành công',
      data: tasks
    });
  } catch (err) {
    next(createError(500, 'Đã xảy ra lỗi khi lấy danh sách công việc'));
  }
};

// Get task by ID (SHARED MODE - anyone can view)
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id)
      .populate('userId', 'username email');
    
    if (!task) {
      return next(createError(404, 'Không tìm thấy công việc này'));
    }

    res.status(200).json({
      success: true,
      message: 'Lấy thông tin công việc thành công',
      data: task
    });
  } catch (err) {
    next(createError(500, 'Đã xảy ra lỗi khi lấy thông tin công việc'));
  }
};

// Create new task
export const createTask = async (req, res, next) => {
  try {
    const task = await Task.create({
      ...req.body,
      userId: req.user.id
    });

    // Populate user info before returning
    await task.populate('userId', 'username email');

    res.status(201).json({
      success: true,
      message: 'Tạo công việc mới thành công',
      data: task
    });
  } catch (err) {
    next(createError(500, 'Đã xảy ra lỗi khi tạo công việc mới'));
  }
};

// Update task (Owner or Admin only)
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return next(createError(404, 'Không tìm thấy công việc này'));
    }

    // Get current user and check permissions
    const currentUser = await User.findById(req.user.id);
    
    if (!canModifyTask(task, currentUser, req.user.id)) {
      return next(createError(403, getPermissionError('cập nhật')));
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    ).populate('userId', 'username email');

    res.status(200).json({
      status: 'thành công',
      message: 'Cập nhật công việc thành công',
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
};

// Delete task (Owner or Admin only)
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return next(createError(404, 'Không tìm thấy công việc này'));
    }

    // Get current user and check permissions
    const currentUser = await User.findById(req.user.id);
    
    if (!canModifyTask(task, currentUser, req.user.id)) {
      return next(createError(403, getPermissionError('xóa')));
    }

    await Task.findByIdAndDelete(req.params.id);

    res.status(200).json({
      status: 'thành công',
      message: 'Xóa công việc thành công'
    });
  } catch (err) {
    next(err);
  }
};

// Export tasks (theo trạng thái hoặc tất cả)
export const exportTasks = async (req, res, next) => {
  try {
    const { status, format = 'json' } = req.query;
    
    // Build filter query
    const filter = { userId: req.user.id };
    if (status && status !== 'all') {
      filter.status = status;
    }

    // Get tasks
    const tasks = await Task.find(filter).select('-userId -__v').lean();

    // Format response based on requested format
    if (format === 'csv') {
      if (tasks.length === 0) {
        return res.status(200).send('Không có công việc nào để xuất');
      }

      const csvContent = tasksToCSV(tasks);
      const filename = getCSVFilename(status);
      
      res.setHeader('Content-Type', 'text/csv; charset=utf-8');
      res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
      return res.status(200).send(csvContent);
    }

    // Default: JSON format
    const filename = getJSONFilename(status);
    res.setHeader('Content-Type', 'application/json');
    res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
    
    res.status(200).json({
      success: true,
      message: 'Xuất danh sách công việc thành công',
      exportedAt: new Date().toISOString(),
      totalTasks: tasks.length,
      status: status || 'all',
      data: tasks
    });
  } catch (err) {
    console.error('Export error:', err);
    next(createError(500, 'Đã xảy ra lỗi khi xuất danh sách công việc: ' + err.message));
  }
};

// Import tasks từ JSON
export const importTasks = async (req, res, next) => {
  try {
    const { tasks } = req.body;

    if (!tasks || !Array.isArray(tasks)) {
      return next(createError(400, 'Dữ liệu import không hợp lệ. Cần một mảng tasks.'));
    }

    if (tasks.length === 0) {
      return next(createError(400, 'Danh sách tasks trống'));
    }

    if (tasks.length > 100) {
      return next(createError(400, 'Chỉ được import tối đa 100 tasks một lần'));
    }

    const { validTasks, errors } = validateAndParseTasks(tasks, req.user.id);

    // If too many errors, reject
    if (errors.length > 0 && validTasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có task hợp lệ nào để import',
        errors: errors
      });
    }

    // Import valid tasks
    const importedTasks = await Task.insertMany(validTasks);

    res.status(201).json({
      success: true,
      message: `Import thành công ${importedTasks.length}/${tasks.length} công việc`,
      importedCount: importedTasks.length,
      totalSubmitted: tasks.length,
      errors: errors.length > 0 ? errors : undefined,
      data: importedTasks
    });
  } catch (err) {
    console.error('Import error:', err);
    next(createError(500, 'Đã xảy ra lỗi khi import danh sách công việc'));
  }
};

// Import tasks từ CSV
export const importCSV = async (req, res, next) => {
  try {
    const { csvText } = req.body;

    if (!csvText || typeof csvText !== 'string') {
      return next(createError(400, 'Dữ liệu CSV không hợp lệ'));
    }

    // Parse CSV using helper
    const buffer = Buffer.from(csvText, 'utf-8');
    const tasks = parseCSVFile(buffer);

    if (tasks.length === 0) {
      return next(createError(400, 'Không có task nào để import'));
    }

    if (tasks.length > 100) {
      return next(createError(400, 'Chỉ được import tối đa 100 tasks một lần'));
    }

    const { validTasks, errors } = validateAndParseTasks(tasks, req.user.id);

    if (validTasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có task hợp lệ nào để import',
        errors: errors
      });
    }

    const importedTasks = await Task.insertMany(validTasks);

    res.status(201).json({
      success: true,
      message: `Import thành công ${importedTasks.length}/${tasks.length} công việc từ CSV`,
      importedCount: importedTasks.length,
      totalSubmitted: tasks.length,
      errors: errors.length > 0 ? errors : undefined,
      data: importedTasks
    });
  } catch (err) {
    console.error('CSV import error:', err);
    next(createError(500, 'Đã xảy ra lỗi khi import CSV: ' + err.message));
  }
};

// Import tasks từ Excel
export const importExcel = async (req, res, next) => {
  try {
    const { excelData } = req.body;

    if (!excelData) {
      return next(createError(400, 'Thiếu dữ liệu Excel'));
    }

    // Parse Excel từ base64
    const buffer = Buffer.from(excelData, 'base64');
    const tasks = parseExcelFile(buffer);

    if (tasks.length === 0) {
      return next(createError(400, 'File Excel không có dữ liệu'));
    }

    if (tasks.length > 100) {
      return next(createError(400, 'Chỉ được import tối đa 100 tasks một lần'));
    }

    const { validTasks, errors } = validateAndParseTasks(tasks, req.user.id);

    if (validTasks.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'Không có task hợp lệ nào để import',
        errors: errors
      });
    }

    const importedTasks = await Task.insertMany(validTasks);

    res.status(201).json({
      success: true,
      message: `Import thành công ${importedTasks.length}/${tasks.length} công việc từ Excel`,
      importedCount: importedTasks.length,
      totalSubmitted: tasks.length,
      errors: errors.length > 0 ? errors : undefined,
      data: importedTasks
    });
  } catch (err) {
    console.error('Excel import error:', err);
    next(createError(500, 'Đã xảy ra lỗi khi import Excel: ' + err.message));
  }
};