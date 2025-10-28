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
 * Convert status from English to Vietnamese
 * @param {string} status - Status in English
 * @returns {string} Status in Vietnamese
 */
const statusToVietnamese = (status) => {
  const mapping = {
    'pending': 'Chờ xử lý',
    'in-progress': 'Đang làm',
    'completed': 'Hoàn thành'
  };
  return mapping[status] || status;
};

/**
 * Format date to YYYY-MM-DD (ISO format for Excel compatibility)
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
const formatDateForExcel = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Convert tasks array to CSV string
 * @param {Array} tasks - Array of task objects
 * @returns {string} CSV string
 */
export const tasksToCSV = (tasks) => {
  // BOM for Excel UTF-8 support
  const BOM = '\uFEFF';
  
  // CSV header (Tiếng Việt)
  const header = 'Tiêu đề,Mô tả,Trạng thái,Ngày hết hạn,Ngày tạo\n';
  
  // CSV rows
  const rows = tasks.map(task => {
    const title = escapeCSV(task.title);
    const description = escapeCSV(task.description || '');
    const status = escapeCSV(statusToVietnamese(task.status));
    const dueDate = escapeCSV(formatDateForExcel(task.dueDate));
    const createdAt = escapeCSV(formatDateForExcel(task.createdAt));
    
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

