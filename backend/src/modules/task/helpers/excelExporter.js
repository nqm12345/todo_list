/**
 * Excel Export Helper
 * Create beautiful Excel files with proper column widths and formatting
 */

import ExcelJS from 'exceljs';

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
 * Format date to YYYY-MM-DD
 * @param {Date|string} date - Date to format
 * @returns {string} Formatted date
 */
const formatDate = (date) => {
  if (!date) return '';
  
  const d = new Date(date);
  if (isNaN(d.getTime())) return '';
  
  const year = d.getFullYear();
  const month = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  
  return `${year}-${month}-${day}`;
};

/**
 * Create Excel file from tasks with proper formatting and column widths
 * @param {Array} tasks - Array of task objects
 * @returns {Promise<Buffer>} Excel file buffer
 */
export const createExcelFile = async (tasks) => {
  // Create a new workbook
  const workbook = new ExcelJS.Workbook();
  const worksheet = workbook.addWorksheet('Danh sách công việc', {
    properties: { defaultColWidth: 15 }
  });

  // Define columns with proper widths
  worksheet.columns = [
    { 
      header: 'Tiêu đề', 
      key: 'title', 
      width: 30  // Rộng hơn cho title
    },
    { 
      header: 'Mô tả', 
      key: 'description', 
      width: 40  // Rộng nhất cho description
    },
    { 
      header: 'Trạng thái', 
      key: 'status', 
      width: 15 
    },
    { 
      header: 'Ngày hết hạn', 
      key: 'dueDate', 
      width: 18  // Đủ rộng cho YYYY-MM-DD
    },
    { 
      header: 'Ngày tạo', 
      key: 'createdAt', 
      width: 18  // Đủ rộng cho YYYY-MM-DD
    }
  ];

  // Style header row
  const headerRow = worksheet.getRow(1);
  headerRow.font = { 
    bold: true, 
    size: 12,
    color: { argb: 'FFFFFFFF' }  // White text
  };
  headerRow.fill = {
    type: 'pattern',
    pattern: 'solid',
    fgColor: { argb: 'FF4472C4' }  // Blue background
  };
  headerRow.alignment = { 
    vertical: 'middle', 
    horizontal: 'center' 
  };
  headerRow.height = 25;

  // Add borders to header
  headerRow.eachCell((cell) => {
    cell.border = {
      top: { style: 'thin' },
      left: { style: 'thin' },
      bottom: { style: 'thin' },
      right: { style: 'thin' }
    };
  });

  // Add data rows
  tasks.forEach((task, index) => {
    const row = worksheet.addRow({
      title: task.title || '',
      description: task.description || '',
      status: statusToVietnamese(task.status),
      dueDate: formatDate(task.dueDate),
      createdAt: formatDate(task.createdAt)
    });

    // Alternate row colors for better readability
    if (index % 2 === 0) {
      row.fill = {
        type: 'pattern',
        pattern: 'solid',
        fgColor: { argb: 'FFF2F2F2' }  // Light gray
      };
    }

    // Add borders to all cells
    row.eachCell((cell) => {
      cell.border = {
        top: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        left: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        bottom: { style: 'thin', color: { argb: 'FFD3D3D3' } },
        right: { style: 'thin', color: { argb: 'FFD3D3D3' } }
      };
      cell.alignment = { vertical: 'middle', wrapText: true };
    });

    // Center align for status and dates
    row.getCell(3).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(4).alignment = { vertical: 'middle', horizontal: 'center' };
    row.getCell(5).alignment = { vertical: 'middle', horizontal: 'center' };

    // Color code status
    const statusCell = row.getCell(3);
    if (task.status === 'completed') {
      statusCell.font = { color: { argb: 'FF008000' }, bold: true }; // Green
    } else if (task.status === 'in-progress') {
      statusCell.font = { color: { argb: 'FFFF8C00' }, bold: true }; // Orange
    } else {
      statusCell.font = { color: { argb: 'FF808080' }, bold: true }; // Gray
    }
  });

  // Add auto-filter
  worksheet.autoFilter = {
    from: 'A1',
    to: `E${tasks.length + 1}`
  };

  // Freeze header row
  worksheet.views = [
    { state: 'frozen', xSplit: 0, ySplit: 1 }
  ];

  // Generate buffer
  const buffer = await workbook.xlsx.writeBuffer();
  return buffer;
};

/**
 * Get Excel filename
 * @param {string} status - Filter status
 * @returns {string} Filename
 */
export const getExcelFilename = (status = 'all') => {
  const timestamp = new Date().toISOString().split('T')[0];
  const statusLabel = status === 'all' ? 'tat-ca' : status;
  return `danh-sach-cong-viec-${statusLabel}-${timestamp}.xlsx`;
};

