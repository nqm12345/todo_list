/**
 * Excel File Parser Helpers
 * Extracted from task.controller.js for better code organization
 */

import xlsx from 'xlsx';

// Column name mappings (Vietnamese and English)
const COLUMN_MAPPINGS = {
  title: ['title', 'tiêu đề', 'tên công việc', 'ten cong viec', 'tiêu đề công việc'],
  description: ['description', 'mô tả', 'nội dung', 'mo ta', 'noi dung', 'ghi chú', 'ghi chu', 'chi tiết', 'chi tiet'],
  status: ['status', 'trạng thái', 'trang thai', 'tình trạng', 'tinh trang'],
  dueDate: ['duedate', 'due_date', 'due date', 'ngày hết hạn', 'hạn chót', 'ngay het han', 'han chot', 'deadline', 'hạn hoàn thành', 'han hoan thanh', 'ngày hoàn thành', 'ngay hoan thanh']
};

// Required columns
const REQUIRED_COLUMNS = ['title'];

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
 * @returns {Object} Mapping of index to field name and validation info
 */
const mapHeaders = (headers) => {
  const mapping = {};
  const foundColumns = new Set();

  headers.forEach((header, index) => {
    if (!header || typeof header !== 'string') return;

    if (matchesColumn(header, COLUMN_MAPPINGS.title)) {
      mapping[index] = 'title';
      foundColumns.add('title');
    } else if (matchesColumn(header, COLUMN_MAPPINGS.description)) {
      mapping[index] = 'description';
      foundColumns.add('description');
    } else if (matchesColumn(header, COLUMN_MAPPINGS.status)) {
      mapping[index] = 'status';
      foundColumns.add('status');
    } else if (matchesColumn(header, COLUMN_MAPPINGS.dueDate)) {
      mapping[index] = 'dueDate';
      foundColumns.add('dueDate');
    }
  });

  return { mapping, foundColumns };
};

/**
 * Validate file structure
 * @param {Array} headers - Array of header strings
 * @returns {Object} { valid, errors, mapping }
 */
const validateFileStructure = (headers) => {
  const errors = [];

  // Check if headers exist
  if (!headers || headers.length === 0) {
    errors.push('File không có tiêu đề cột (header). Vui lòng thêm dòng đầu tiên với tên các cột.');
    return { valid: false, errors };
  }

  // Map headers
  const { mapping, foundColumns } = mapHeaders(headers);

  // Check for required columns
  REQUIRED_COLUMNS.forEach(requiredCol => {
    if (!foundColumns.has(requiredCol)) {
      const vietnameseNames = COLUMN_MAPPINGS[requiredCol].join('", "');
      errors.push(`Thiếu cột bắt buộc: "${requiredCol}". Tên cột phải là một trong: "${vietnameseNames}"`);
    }
  });

  // Check if at least one column was recognized
  if (Object.keys(mapping).length === 0) {
    errors.push(`Không nhận diện được cột nào. Các cột hợp lệ:\n` +
      `- Title: ${COLUMN_MAPPINGS.title.join(', ')}\n` +
      `- Description: ${COLUMN_MAPPINGS.description.join(', ')}\n` +
      `- Status: ${COLUMN_MAPPINGS.status.join(', ')}\n` +
      `- Due Date: ${COLUMN_MAPPINGS.dueDate.join(', ')}`);
  }

  return {
    valid: errors.length === 0,
    errors,
    mapping
  };
};

/**
 * Parse Excel file buffer to tasks array
 * @param {Buffer} fileBuffer - Excel file buffer
 * @returns {Object} { tasks, errors, warnings }
 */
export const parseExcelFile = (fileBuffer) => {
  const errors = [];
  const warnings = [];

  try {
    const workbook = xlsx.read(fileBuffer, { type: 'buffer' });
    
    // Check if file has sheets
    if (!workbook.SheetNames || workbook.SheetNames.length === 0) {
      return {
        tasks: [],
        errors: ['File Excel không có sheet nào. Vui lòng kiểm tra lại file.'],
        warnings
      };
    }

    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    const data = xlsx.utils.sheet_to_json(worksheet, { header: 1, defval: null });

    // Check if file has data
    if (data.length === 0) {
      return {
        tasks: [],
        errors: ['File Excel trống. Vui lòng thêm dữ liệu.'],
        warnings
      };
    }

    if (data.length < 2) {
      return {
        tasks: [],
        errors: ['File Excel chỉ có header, không có dữ liệu. Vui lòng thêm ít nhất 1 dòng dữ liệu.'],
        warnings
      };
    }

    // Validate headers
    const headers = data[0];
    const structureValidation = validateFileStructure(headers);
    
    if (!structureValidation.valid) {
      return {
        tasks: [],
        errors: structureValidation.errors,
        warnings
      };
    }

    const headerMapping = structureValidation.mapping;
    const tasks = [];
    let emptyRowCount = 0;

    // Parse rows (skip header)
    for (let i = 1; i < data.length; i++) {
      const row = data[i];
      
      // Skip completely empty rows
      if (!row || row.every(cell => cell === null || cell === undefined || cell === '')) {
        emptyRowCount++;
        continue;
      }

      const task = {};

      // Map columns to fields
      Object.entries(headerMapping).forEach(([colIndex, fieldName]) => {
        const value = row[parseInt(colIndex)];
        if (value !== undefined && value !== null && value !== '') {
          // Convert to string and trim
          task[fieldName] = String(value).trim();
        }
      });

      // Only add task if it has a title
      if (task.title && task.title.trim() !== '') {
        tasks.push(task);
      } else {
        warnings.push(`Dòng ${i + 1}: Bỏ qua do thiếu tiêu đề`);
      }
    }

    // Add warning if there were empty rows
    if (emptyRowCount > 0) {
      warnings.push(`Đã bỏ qua ${emptyRowCount} dòng trống`);
    }

    // Check if we got any tasks
    if (tasks.length === 0) {
      errors.push('Không tìm thấy công việc hợp lệ nào trong file. Đảm bảo có ít nhất 1 dòng có tiêu đề.');
    }

    return { tasks, errors, warnings };
  } catch (error) {
    return {
      tasks: [],
      errors: [`Lỗi khi đọc file Excel: ${error.message}`],
      warnings
    };
  }
};

/**
 * Parse CSV file buffer to tasks array
 * @param {Buffer} fileBuffer - CSV file buffer
 * @returns {Object} { tasks, errors, warnings }
 */
export const parseCSVFile = (fileBuffer) => {
  const errors = [];
  const warnings = [];

  try {
    // Try different encodings
    let csvText;
    try {
      csvText = fileBuffer.toString('utf-8');
    } catch (e) {
      csvText = fileBuffer.toString('latin1');
    }

    // Remove BOM if present
    if (csvText.charCodeAt(0) === 0xFEFF) {
      csvText = csvText.slice(1);
    }

    const lines = csvText.split('\n').filter(line => line.trim());

    // Check if file has data
    if (lines.length === 0) {
      return {
        tasks: [],
        errors: ['File CSV trống. Vui lòng thêm dữ liệu.'],
        warnings
      };
    }

    if (lines.length < 2) {
      return {
        tasks: [],
        errors: ['File CSV chỉ có header, không có dữ liệu. Vui lòng thêm ít nhất 1 dòng dữ liệu.'],
        warnings
      };
    }

    // Parse header
    const headers = parseCSVLine(lines[0]);
    const structureValidation = validateFileStructure(headers);
    
    if (!structureValidation.valid) {
      return {
        tasks: [],
        errors: structureValidation.errors,
        warnings
      };
    }

    const headerMapping = structureValidation.mapping;
    const tasks = [];

    // Parse rows
    for (let i = 1; i < lines.length; i++) {
      const row = parseCSVLine(lines[i]);
      const task = {};

      Object.entries(headerMapping).forEach(([colIndex, fieldName]) => {
        const value = row[parseInt(colIndex)];
        if (value !== undefined && value !== null && value !== '') {
          task[fieldName] = value.trim();
        }
      });

      if (task.title && task.title.trim() !== '') {
        tasks.push(task);
      } else {
        warnings.push(`Dòng ${i + 1}: Bỏ qua do thiếu tiêu đề`);
      }
    }

    // Check if we got any tasks
    if (tasks.length === 0) {
      errors.push('Không tìm thấy công việc hợp lệ nào trong file. Đảm bảo có ít nhất 1 dòng có tiêu đề.');
    }

    return { tasks, errors, warnings };
  } catch (error) {
    return {
      tasks: [],
      errors: [`Lỗi khi đọc file CSV: ${error.message}`],
      warnings
    };
  }
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

