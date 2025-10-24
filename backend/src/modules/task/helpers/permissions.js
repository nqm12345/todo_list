/**
 * Permission Helpers
 * Extracted from task.controller.js for better code organization
 */

/**
 * Check if user can modify (update/delete) a task
 * @param {Object} task - Task object
 * @param {Object} currentUser - Current user object (with role)
 * @param {string} userId - Current user ID
 * @returns {boolean} True if user can modify
 */
export const canModifyTask = (task, currentUser, userId) => {
  // Check if user is the owner
  const isOwner = task.userId.toString() === userId;
  
  // Check if user is admin
  const isAdmin = currentUser && currentUser.role === 'admin';
  
  return isOwner || isAdmin;
};

/**
 * Get permission error message
 * @param {string} action - Action being performed (update/delete)
 * @returns {string} Error message in Vietnamese
 */
export const getPermissionError = (action = 'cập nhật') => {
  return `Bạn chỉ có thể ${action} công việc của mình. Chỉ admin mới có quyền ${action} công việc của người khác.`;
};

