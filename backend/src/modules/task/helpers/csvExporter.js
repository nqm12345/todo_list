/**
 * CSV Export Helpers
 * Extracted from task.controller.js for better code organization
 */

/**
 * Escape CSV field (handle quotes and commas)
 * @param {string} field - Field value
 * @returns {string} Escaped field
 */
export const escapeCSV = (field) => {
  if (field === null || field === undefined) {
    return '';
  }

  const str = String(field);
  
  // If field contains comma, quote, or newline, wrap in quotes and escape quotes
  if (str.includes(',') || str.includes('"') || str.includes('\n')) {
    return `"${str.replace(/"/g, '""')}"`;
  }
  
  return str;
};

/**
 * Convert tasks array to CSV string
 * @param {Array} tasks - Array of task objects
 * @returns {string} CSV string
 */
export const tasksToCSV = (tasks) => {
  // BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  
  // CSV header
  const header = 'Title,Description,Status,Due Date,Created At\n';
  
  // CSV rows
  const rows = tasks.map(task => {
    const title = escapeCSV(task.title);
    const description = escapeCSV(task.description);
    const status = escapeCSV(task.status);
    const dueDate = task.dueDate 
      ? escapeCSV(new Date(task.dueDate).toLocaleDateString('vi-VN'))
      : '';
    const createdAt = task.createdAt 
      ? escapeCSV(new Date(task.createdAt).toLocaleDateString('vi-VN'))
      : '';
    
    return `${title},${description},${status},${dueDate},${createdAt}`;
  }).join('\n');

  return BOM + header + rows;
};

/**
 * Get CSV filename
 * @param {string} status - Filter status
 * @returns {string} Filename
 */
export const getCSVFilename = (status = 'all') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const statusLabel = status === 'all' ? 'tat-ca' : status;
  return `tasks-${statusLabel}-${timestamp}.csv`;
};

/**
 * Get JSON filename
 * @param {string} status - Filter status
 * @returns {string} Filename
 */
export const getJSONFilename = (status = 'all') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const statusLabel = status === 'all' ? 'tat-ca' : status;
  return `tasks-${statusLabel}-${timestamp}.json`;
};

