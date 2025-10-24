// ============================================
// APPLICATION CONSTANTS
// ============================================

// Import/Export Limits
export const IMPORT_LIMITS = {
  MAX_FILE_SIZE: 5 * 1024 * 1024,  // 5MB
  MAX_FILE_SIZE_MB: 5,
  MAX_TASKS: 100,
  SUPPORTED_FORMATS: ['.json', '.xlsx', '.xls', '.csv']
};

// Task Status
export const TASK_STATUS = {
  PENDING: 'pending',
  IN_PROGRESS: 'in-progress',
  COMPLETED: 'completed'
};

// Task Status Labels (Vietnamese)
export const TASK_STATUS_LABELS = {
  pending: 'Chờ xử lý',
  'in-progress': 'Đang làm',
  completed: 'Hoàn thành'
};

// Task Status Emojis
export const TASK_STATUS_EMOJIS = {
  pending: '⏳',
  'in-progress': '⚡',
  completed: '✅'
};

// Task Status Colors
export const TASK_STATUS_COLORS = {
  pending: '#ef4444',
  'in-progress': '#f59e0b',
  completed: '#10b981'
};

// User Roles
export const USER_ROLES = {
  USER: 'user',
  ADMIN: 'admin'
};

// API Endpoints
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register'
  },
  TASKS: {
    LIST: '/tasks',
    CREATE: '/tasks',
    UPDATE: (id) => `/tasks/${id}`,
    DELETE: (id) => `/tasks/${id}`,
    EXPORT: '/tasks/export',
    IMPORT: '/tasks/import',
    IMPORT_EXCEL: '/tasks/import-excel',
    IMPORT_CSV: '/tasks/import-csv'
  }
};

// Inactivity Settings
export const INACTIVITY = {
  TIMEOUT: 60 * 60 * 1000,  // 1 hour in milliseconds
  TIMEOUT_MINUTES: 60
};

// Date Formats
export const DATE_FORMATS = {
  DISPLAY: 'vi-VN',
  OPTIONS: {
    day: '2-digit',
    month: '2-digit',
    year: 'numeric'
  }
};

// Responsive Breakpoints (matching CSS)
export const BREAKPOINTS = {
  MOBILE: 480,
  TABLET: 640,
  DESKTOP: 768,
  LARGE: 1024
};

// Error Messages
export const ERROR_MESSAGES = {
  IMPORT: {
    INVALID_FORMAT: 'Chỉ hỗ trợ file JSON, Excel (.xlsx) hoặc CSV',
    FILE_TOO_LARGE: 'File quá lớn. Tối đa',
    TOO_MANY_TASKS: 'Chỉ được import tối đa',
    NO_TASKS: 'Không tìm thấy task nào trong text',
    FAILED: 'Import thất bại'
  },
  EXPORT: {
    NO_TASKS: 'Không có công việc nào để xuất. Hãy tạo tasks trước!',
    NO_TASKS_STATUS: 'Không có công việc nào đang',
    FAILED: 'Xuất danh sách thất bại'
  },
  AUTH: {
    PASSWORD_MISMATCH: 'Mật khẩu xác nhận không khớp!',
    LOGIN_FAILED: 'Đăng nhập thất bại.',
    REGISTER_FAILED: 'Đăng ký thất bại.'
  },
  TASK: {
    DELETE_CONFIRM: 'Bạn có chắc muốn xóa công việc này?',
    UPDATE_FAILED: 'Cập nhật công việc thất bại',
    DELETE_FAILED: 'Xóa công việc thất bại',
    CREATE_FAILED: 'Tạo công việc thất bại'
  }
};

// Success Messages
export const SUCCESS_MESSAGES = {
  IMPORT: {
    JSON: 'Import thành công',
    EXCEL: 'Import thành công',
    CSV: 'Import thành công',
    TEXT: 'Import thành công'
  },
  EXPORT: {
    SUCCESS: 'Xuất thành công',
    CSV: 'Xuất file CSV'
  },
  AUTH: {
    LOGIN: 'Đăng nhập thành công',
    REGISTER: 'Đăng ký thành công'
  },
  TASK: {
    CREATED: 'Tạo công việc mới thành công',
    UPDATED: 'Cập nhật công việc thành công',
    DELETED: 'Xóa công việc thành công',
    STATUS_CHANGED: 'Đổi trạng thái thành công'
  }
};

