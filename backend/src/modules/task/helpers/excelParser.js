/**
 * Excel File Parser Helpers
 * Extracted from task.controller.js for better code organization
 */

import xlsx from 'xlsx';

// Column name mappings (Vietnamese and English)
const COLUMN_MAPPINGS = {
  title: ['title', 'tiêu đề', 'tên công việc', 'ten cong viec'],
  description: ['description', 'mô tả', 'nội dung', 'mo ta', 'noi dung'],
  status: ['status', 'trạng thái', 'trang thai'],
  dueDate: ['duedate', 'due_date', 'ngày hết hạn', 'hạn chót', 'ngay het han', 'han chot']
};

/**
 * Find matching column name
 * @param {string} header - Column header from file
 * @param {Array} possibleNames - Possible column names
 * @returns {boolean} True if matches
 */
const matchesColumn = (header, possibleNames) => {
  const normalized = header.toLowerCase().trim();
  return possibleNames.some(name => normalized === name);
};

/**
 * Map headers to standard field names
 * @param {Array} headers - Array of header strings
 * @returns {Object} Mapping of index to field name
 */
const mapHeaders = (headers) => {
  const mapping = {};

  headers.forEach((header, index) => {
    if (matchesColumn(header, COLUMN_MAPPINGS.title)) {
      mapping[index] = 'title';
    } else if (matchesColumn(header, COLUMN_MAPPINGS.description)) {
      mapping[index] = 'description';
    } else if (matchesColumn(header, COLUMN_MAPPINGS.status)) {
      mapping[index] = 'status';
    } else if (matchesColumn(header, COLUMN_MAPPINGS.dueDate)) {
      mapping[index] = 'dueDate';
    }
  });

  return mapping;
};

/**
 * Parse Excel file buffer to tasks array
 * @param {Buffer} fileBuffer - Excel file buffer
 * @returns {Array} Array of task objects
 */
export const parseExcelFile = (fileBuffer) => {
  const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
  const sheetName = workbook.SheetNames[0];
  const worksheet = workbook.Sheets[sheetName];
  const data = xlsx.utils.sheet_to_json(worksheet, { header: 1 });

  if (data.length < 2) {
    return [];
  }

  const headers = data[0];
  const headerMapping = mapHeaders(headers);
  const tasks = [];

  // Parse rows (skip header)
  for (let i = 1; i < data.length; i++) {
    const row = data[i];
    const task = {};

    // Map columns to fields
    Object.entries(headerMapping).forEach(([colIndex, fieldName]) => {
      const value = row[parseInt(colIndex)];
      if (value !== undefined && value !== null && value !== '') {
        task[fieldName] = String(value);
      }
    });

    // Only add task if it has a title
    if (task.title) {
      tasks.push(task);
    }
  }

  return tasks;
};

/**
 * Parse CSV file buffer to tasks array
 * @param {Buffer} fileBuffer - CSV file buffer
 * @returns {Array} Array of task objects
 */
export const parseCSVFile = (fileBuffer) => {
  const csvText = fileBuffer.toString('utf-8');
  const lines = csvText.split('\n').filter(line => line.trim());

  if (lines.length < 2) {
    return [];
  }

  // Parse header
  const headers = parseCSVLine(lines[0]);
  const headerMapping = mapHeaders(headers);
  const tasks = [];

  // Parse rows
  for (let i = 1; i < lines.length; i++) {
    const row = parseCSVLine(lines[i]);
    const task = {};

    Object.entries(headerMapping).forEach(([colIndex, fieldName]) => {
      const value = row[parseInt(colIndex)];
      if (value !== undefined && value !== null && value !== '') {
        task[fieldName] = value;
      }
    });

    if (task.title) {
      tasks.push(task);
    }
  }

  return tasks;
};

/**
 * Parse a single CSV line (handles quoted fields)
 * @param {string} line - CSV line
 * @returns {Array} Array of values
 */
const parseCSVLine = (line) => {
  const result = [];
  let current = '';
  let inQuotes = false;

  for (let i = 0; i < line.length; i++) {
    const char = line[i];
    const nextChar = line[i + 1];

    if (char === '"') {
      if (inQuotes && nextChar === '"') {
        current += '"';
        i++;
      } else {
        inQuotes = !inQuotes;
      }
    } else if (char === ',' && !inQuotes) {
      result.push(current.trim());
      current = '';
    } else {
      current += char;
    }
  }

  result.push(current.trim());
  return result;
};

