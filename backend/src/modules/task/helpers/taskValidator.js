/**
 * Task Validation Helpers
 * Extracted from task.controller.js for better code organization
 */

// Valid task statuses
const VALID_STATUSES = ['pending', 'in-progress', 'completed'];

// Vietnamese to English status mapping
const STATUS_MAPPING = {
  'chờ xử lý': 'pending',
  'chờ': 'pending',
  'pending': 'pending',
  'đang làm': 'in-progress',
  'đang thực hiện': 'in-progress',
  'in-progress': 'in-progress',
  'in progress': 'in-progress',
  'hoàn thành': 'completed',
  'completed': 'completed',
  'xong': 'completed'
};

// Validation constraints
const VALIDATION_RULES = {
  title: {
    minLength: 3,
    maxLength: 200,
    required: true
  },
  description: {
    maxLength: 1000,
    required: false
  },
  status: {
    validValues: VALID_STATUSES,
    required: false,
    default: 'pending'
  }
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
 * Sanitize string input to prevent XSS
 * @param {string} str - String to sanitize
 * @returns {string} Sanitized string
 */
const sanitizeInput = (str) => {
  if (typeof str !== 'string') return '';
  
  // Remove potentially dangerous characters
  return str
    .trim()
    .replace(/[<>]/g, '') // Remove < and > to prevent HTML injection
    .replace(/javascript:/gi, '') // Remove javascript: protocol
    .replace(/on\w+=/gi, ''); // Remove event handlers like onclick=
};

/**
 * Validate title field
 * @param {string} title - Title to validate
 * @param {number} taskIndex - Task index for error messages
 * @returns {Object} { valid, error, sanitized }
 */
const validateTitle = (title, taskIndex) => {
  if (!title || typeof title !== 'string') {
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1}: ❌ THIẾU TIÊU ĐỀ - Cột "Title" hoặc "Tiêu đề" là bắt buộc phải có giá trị`,
      field: 'title'
    };
  }

  const sanitized = sanitizeInput(title);
  const originalTitle = title.trim();

  if (sanitized.length === 0) {
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1} - Tiêu đề "${originalTitle}": ❌ Tiêu đề không được để trống hoặc chỉ chứa ký tự đặc biệt`,
      field: 'title',
      value: originalTitle
    };
  }

  if (sanitized.length < VALIDATION_RULES.title.minLength) {
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1} - Tiêu đề "${sanitized}": ❌ Quá ngắn (cần tối thiểu ${VALIDATION_RULES.title.minLength} ký tự, hiện tại chỉ có ${sanitized.length} ký tự)`,
      field: 'title',
      value: sanitized,
      expected: `${VALIDATION_RULES.title.minLength}-${VALIDATION_RULES.title.maxLength} ký tự`,
      actual: `${sanitized.length} ký tự`
    };
  }

  if (sanitized.length > VALIDATION_RULES.title.maxLength) {
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1} - Tiêu đề "${sanitized.substring(0, 30)}...": ❌ Quá dài (tối đa ${VALIDATION_RULES.title.maxLength} ký tự, hiện tại có ${sanitized.length} ký tự)`,
      field: 'title',
      value: sanitized.substring(0, 50),
      expected: `≤ ${VALIDATION_RULES.title.maxLength} ký tự`,
      actual: `${sanitized.length} ký tự`
    };
  }

  return { valid: true, sanitized };
};

/**
 * Validate description field
 * @param {string} description - Description to validate
 * @param {number} taskIndex - Task index for error messages
 * @param {string} taskTitle - Title of the task for error context
 * @returns {Object} { valid, error, sanitized }
 */
const validateDescription = (description, taskIndex, taskTitle = '') => {
  if (!description) {
    return { valid: true, sanitized: '' };
  }

  if (typeof description !== 'string') {
    return { valid: true, sanitized: '' };
  }

  const sanitized = sanitizeInput(description);

  if (sanitized.length > VALIDATION_RULES.description.maxLength) {
    const titleContext = taskTitle ? ` - Công việc "${taskTitle}"` : '';
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1}${titleContext}: ❌ Mô tả quá dài (tối đa ${VALIDATION_RULES.description.maxLength} ký tự, hiện tại có ${sanitized.length} ký tự)`,
      field: 'description',
      value: sanitized.substring(0, 100) + '...',
      expected: `≤ ${VALIDATION_RULES.description.maxLength} ký tự`,
      actual: `${sanitized.length} ký tự`
    };
  }

  return { valid: true, sanitized };
};

/**
 * Validate status field
 * @param {string} status - Status to validate
 * @param {number} taskIndex - Task index for error messages
 * @param {string} taskTitle - Title of the task for error context
 * @returns {Object} { valid, error, normalized }
 */
const validateStatus = (status, taskIndex, taskTitle = '') => {
  const titleContext = taskTitle ? ` - Công việc "${taskTitle}"` : '';
  
  // Check data type - must be string or undefined/null
  if (status !== null && status !== undefined && typeof status !== 'string') {
    const actualType = Array.isArray(status) ? 'array' : typeof status;
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1}${titleContext}: ❌ SAI KIỂU DỮ LIỆU - Trạng thái phải là text (string), không phải ${actualType}\n   🔴 Giá trị hiện tại: ${JSON.stringify(status)} (kiểu: ${actualType})\n   ✅ Chỉ chấp nhận: "pending", "in-progress", "completed", "chờ xử lý", "đang làm", "hoàn thành"`,
      field: 'status',
      value: status,
      expected: 'string (text)',
      actual: actualType,
      actualValue: JSON.stringify(status)
    };
  }
  
  const normalized = normalizeStatus(status);
  
  if (!VALID_STATUSES.includes(normalized)) {
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1}${titleContext}: ❌ Trạng thái không hợp lệ "${status}"\n   ✅ Chỉ chấp nhận: pending/chờ xử lý, in-progress/đang làm, completed/hoàn thành`,
      field: 'status',
      value: status,
      expected: 'pending | in-progress | completed | chờ xử lý | đang làm | hoàn thành',
      actual: status
    };
  }

  return { valid: true, normalized };
};

/**
 * Validate due date field
 * @param {string|Date} dueDate - Due date to validate
 * @param {number} taskIndex - Task index for error messages
 * @param {string} taskTitle - Title of the task for error context
 * @returns {Object} { valid, error, parsed }
 */
const validateDueDate = (dueDate, taskIndex, taskTitle = '') => {
  if (!dueDate) {
    return { valid: true, parsed: null };
  }

  const titleContext = taskTitle ? ` - Công việc "${taskTitle}"` : '';
  
  // Check data type - must be string or Date object
  const actualType = Array.isArray(dueDate) ? 'array' : typeof dueDate;
  if (actualType !== 'string' && !(dueDate instanceof Date) && actualType !== 'number') {
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1}${titleContext}: ❌ SAI KIỂU DỮ LIỆU - Ngày hết hạn phải là text (string) hoặc Date, không phải ${actualType}\n   🔴 Giá trị hiện tại: ${JSON.stringify(dueDate)} (kiểu: ${actualType})\n   ✅ Định dạng đúng: "YYYY-MM-DD" (ví dụ: "2025-11-30")`,
      field: 'dueDate',
      value: dueDate,
      expected: 'string (YYYY-MM-DD) hoặc Date object',
      actual: actualType,
      actualValue: JSON.stringify(dueDate)
    };
  }
  
  // If it's a number, reject it (could be timestamp but we want explicit format)
  if (typeof dueDate === 'number') {
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1}${titleContext}: ❌ SAI KIỂU DỮ LIỆU - Ngày hết hạn phải là text (string), không phải số (number)\n   🔴 Giá trị hiện tại: ${dueDate} (kiểu: number)\n   ✅ Định dạng đúng: "YYYY-MM-DD" (ví dụ: "2025-11-30")`,
      field: 'dueDate',
      value: dueDate,
      expected: 'string (YYYY-MM-DD)',
      actual: 'number',
      actualValue: dueDate
    };
  }
  
  const parsed = new Date(dueDate);
  
  if (isNaN(parsed.getTime())) {
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1}${titleContext}: ❌ Ngày hết hạn không hợp lệ "${dueDate}"\n   ✅ Định dạng đúng: YYYY-MM-DD (ví dụ: 2025-11-30)`,
      field: 'dueDate',
      value: dueDate,
      expected: 'YYYY-MM-DD (ví dụ: 2025-11-30)',
      actual: dueDate
    };
  }

  // Check if date is too far in the past (more than 1 year)
  const oneYearAgo = new Date();
  oneYearAgo.setFullYear(oneYearAgo.getFullYear() - 1);
  
  if (parsed < oneYearAgo) {
    const yearAgoFormatted = oneYearAgo.toISOString().split('T')[0];
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1}${titleContext}: ❌ Ngày hết hạn "${dueDate}" quá xa trong quá khứ\n   ✅ Phải từ ${yearAgoFormatted} trở đi`,
      field: 'dueDate',
      value: dueDate,
      expected: `Từ ${yearAgoFormatted} đến 10 năm sau`,
      actual: dueDate
    };
  }

  // Check if date is too far in the future (more than 10 years)
  const tenYearsLater = new Date();
  tenYearsLater.setFullYear(tenYearsLater.getFullYear() + 10);
  
  if (parsed > tenYearsLater) {
    const tenYearsFormatted = tenYearsLater.toISOString().split('T')[0];
    return {
      valid: false,
      error: `📍 Dòng ${taskIndex + 1}${titleContext}: ❌ Ngày hết hạn "${dueDate}" quá xa trong tương lai\n   ✅ Phải trước ${tenYearsFormatted}`,
      field: 'dueDate',
      value: dueDate,
      expected: `Trước ${tenYearsFormatted}`,
      actual: dueDate
    };
  }

  return { valid: true, parsed };
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
  const seenTitles = new Map(); // Track duplicate titles

  tasks.forEach((task, index) => {
    // Validate title first
    const titleResult = validateTitle(task.title, index);
    if (!titleResult.valid) {
      errors.push(titleResult.error);
      return;
    }

    const taskTitle = titleResult.sanitized;

    // Check for duplicate titles
    const titleLower = taskTitle.toLowerCase();
    if (seenTitles.has(titleLower)) {
      const duplicateRow = seenTitles.get(titleLower);
      errors.push(
        `📍 Dòng ${index + 1} - Tiêu đề "${taskTitle}": ❌ TRÙNG LẶP với dòng ${duplicateRow + 1}\n   ⚠️ Mỗi tiêu đề phải là duy nhất trong file`
      );
      return;
    }
    seenTitles.set(titleLower, index);

    // Validate description (với context của taskTitle)
    const descResult = validateDescription(task.description, index, taskTitle);
    if (!descResult.valid) {
      errors.push(descResult.error);
      return;
    }

    // Validate status (với context của taskTitle)
    const statusResult = validateStatus(task.status, index, taskTitle);
    if (!statusResult.valid) {
      errors.push(statusResult.error);
      return;
    }

    // Validate due date (với context của taskTitle)
    const dueDateResult = validateDueDate(task.dueDate, index, taskTitle);
    if (!dueDateResult.valid) {
      errors.push(dueDateResult.error);
      return;
    }

    // Build valid task object
    const validTask = {
      title: taskTitle,
      description: descResult.sanitized,
      status: statusResult.normalized,
      userId: userId
    };

    // Add dueDate if exists
    if (dueDateResult.parsed) {
      validTask.dueDate = dueDateResult.parsed;
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

