/**
 * Task Validation Helpers
 * Extracted from task.controller.js for better code organization
 */

// Valid task statuses
const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

// Vietnamese to English status mapping
const STATUS_MAPPING = {
  'chờ xử lý': 'pending',
  'đang làm': 'in-progress',
  'đang thực hiện': 'in-progress',
  'hoàn thành': 'completed'
};

/**
 * Normalize status from Vietnamese or English to English
 * @param {string} status - Task status
 * @returns {string} Normalized status
 */
export const normalizeStatus = (status) => {
  if (!status) return 'pending';
  
  const lowerStatus = status.toLowerCase().trim();
  
  // Check if already in English
  if (VALID_STATUSES.includes(lowerStatus)) {
    return lowerStatus;
  }
  
  // Convert from Vietnamese
  return STATUS_MAPPING[lowerStatus] || 'pending';
};

/**
 * Validate and parse tasks array
 * @param {Array} tasks - Array of tasks to validate
 * @param {string} userId - User ID to assign to tasks
 * @returns {Object} { validTasks, errors }
 */
export const validateAndParseTasks = (tasks, userId) => {
  const validTasks = [];
  const errors = [];

  tasks.forEach((task, index) => {
    // Validate required fields
    if (!task.title || typeof task.title !== 'string' || task.title.trim() === '') {
      errors.push(`Task ${index + 1}: Thiếu tiêu đề hoặc tiêu đề không hợp lệ`);
      return;
    }

    // Normalize and validate status
    const status = normalizeStatus(task.status);
    
    if (!VALID_STATUSES.includes(status)) {
      errors.push(`Task ${index + 1}: Trạng thái không hợp lệ (${task.status})`);
      return;
    }

    // Build valid task object
    const validTask = {
      title: task.title.trim(),
      description: task.description ? task.description.trim() : '',
      status: status,
      userId: userId
    };

    // Parse dueDate if exists
    if (task.dueDate) {
      const dueDate = new Date(task.dueDate);
      if (!isNaN(dueDate.getTime())) {
        validTask.dueDate = dueDate;
      }
    }

    validTasks.push(validTask);
  });

  return { validTasks, errors };
};

/**
 * Validate single task data
 * @param {Object} taskData - Task data to validate
 * @returns {Object} { valid, errors }
 */
export const validateTaskData = (taskData) => {
  const errors = [];

  if (!taskData.title || taskData.title.trim() === '') {
    errors.push('Tiêu đề công việc là bắt buộc');
  }

  if (taskData.status && !VALID_STATUSES.includes(taskData.status)) {
    errors.push('Trạng thái không hợp lệ');
  }

  return {
    valid: errors.length === 0,
    errors
  };
};

