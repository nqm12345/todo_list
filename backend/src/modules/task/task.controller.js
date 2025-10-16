import Task from './task.model.js';
import { createError } from '../../utils/error.js';

// Get all tasks
export const getTasks = async (req, res, next) => {
  try {
    const tasks = await Task.find({ userId: req.user.id });
    res.status(200).json({
      success: true,
      message: 'Lấy danh sách công việc thành công',
      data: tasks
    });
  } catch (err) {
    next(createError(500, 'Đã xảy ra lỗi khi lấy danh sách công việc'));
  }
};

// Get task by ID
export const getTaskById = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return next(createError(404, 'Không tìm thấy công việc này'));
    }

    // Kiểm tra xem người dùng có quyền xem task này không
    if (task.userId.toString() !== req.user.id) {
      return next(createError(403, 'Bạn không có quyền xem công việc này'));
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

    res.status(201).json({
      success: true,
      message: 'Tạo công việc mới thành công',
      data: task
    });
  } catch (err) {
    next(createError(500, 'Đã xảy ra lỗi khi tạo công việc mới'));
  }
};

// Update task
export const updateTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return next(createError(404, 'Không tìm thấy công việc này'));
    }

    // Check if user owns this task
    if (task.userId.toString() !== req.user.id) {
      return next(createError(403, 'Bạn chỉ có thể cập nhật công việc của mình'));
    }

    const updatedTask = await Task.findByIdAndUpdate(
      req.params.id,
      { $set: req.body },
      { new: true, runValidators: true }
    );

    res.status(200).json({
      status: 'thành công',
      message: 'Cập nhật công việc thành công',
      data: updatedTask
    });
  } catch (err) {
    next(err);
  }
};

// Delete task
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findById(req.params.id);
    
    if (!task) {
      return next(createError(404, 'Không tìm thấy công việc này'));
    }

    // Check if user owns this task
    if (task.userId.toString() !== req.user.id) {
      return next(createError(403, 'Bạn chỉ có thể xóa công việc của mình'));
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
