/**
 * Task Helper Functions
 */

import { TASK_STATUS_LABELS, TASK_STATUS_EMOJIS, TASK_STATUS_COLORS } from '../constants';

/**
 * Get status label in Vietnamese
 * @param {string} status - Task status
 * @returns {string} Vietnamese label
 */
export const getStatusLabel = (status) => {
  return TASK_STATUS_LABELS[status] || 'Không xác định';
};

/**
 * Get status emoji
 * @param {string} status - Task status
 * @returns {string} Emoji
 */
export const getStatusEmoji = (status) => {
  return TASK_STATUS_EMOJIS[status] || '❓';
};

/**
 * Get status color
 * @param {string} status - Task status
 * @returns {string} Color hex code
 */
export const getStatusColor = (status) => {
  return TASK_STATUS_COLORS[status] || '#6b7280';
};

/**
 * Get short task ID (last 8 characters)
 * @param {string} taskId - Full task ID
 * @returns {string} Short ID with # prefix
 */
export const getShortTaskId = (taskId) => {
  if (!taskId) return '#00000000';
  return `#${taskId.slice(-8).toUpperCase()}`;
};

/**
 * Get user initials from username
 * @param {string} username - User's username
 * @returns {string} Initials (first character)
 */
export const getUserInitials = (username) => {
  if (!username) return 'U';
  return username.charAt(0).toUpperCase();
};

/**
 * Check if current user can modify task
 * @param {Object} task - Task object
 * @param {Object} user - Current user object
 * @returns {boolean} True if user can modify
 */
export const canModifyTask = (task, user) => {
  if (!user) return false;
  
  // Owner can always modify
  if (task.userId?._id === user.id || task.userId === user.id) {
    return true;
  }
  
  // Admin can modify any task
  if (user.role === 'admin') {
    return true;
  }
  
  return false;
};

/**
 * Parse text input to tasks array
 * @param {string} text - Text input
 * @returns {Array} Array of task objects
 */
export const parseTextToTasks = (text) => {
  const lines = text.split('\n').filter(line => line.trim());
  const tasks = [];

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed) continue;

    // Remove common prefixes
    let title = trimmed
      .replace(/^[-*•]\s*/, '')
      .replace(/^\d+[\.\)]\s*/, '')
      .trim();

    if (title) {
      tasks.push({
        title,
        description: '',
        status: 'pending'
      });
    }
  }

  return tasks;
};

/**
 * Filter tasks by search query
 * @param {Array} tasks - Tasks array
 * @param {string} query - Search query
 * @returns {Array} Filtered tasks
 */
export const filterTasksBySearch = (tasks, query) => {
  if (!query || !query.trim()) return tasks;
  
  const lowerQuery = query.toLowerCase().trim();
  
  return tasks.filter(task => 
    task.title?.toLowerCase().includes(lowerQuery) ||
    task.description?.toLowerCase().includes(lowerQuery)
  );
};

/**
 * Filter tasks by status
 * @param {Array} tasks - Tasks array
 * @param {string} status - Status filter ('all' or specific status)
 * @returns {Array} Filtered tasks
 */
export const filterTasksByStatus = (tasks, status) => {
  if (status === 'all') return tasks;
  return tasks.filter(task => task.status === status);
};

/**
 * Get tasks count by status
 * @param {Array} tasks - Tasks array
 * @returns {Object} Counts by status
 */
export const getTasksCountByStatus = (tasks) => {
  return {
    all: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    'in-progress': tasks.filter(t => t.status === 'in-progress').length,
    completed: tasks.filter(t => t.status === 'completed').length
  };
};

