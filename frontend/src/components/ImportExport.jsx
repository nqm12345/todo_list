import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import "./ImportExport.css";

export default function ImportExport({ onImportSuccess, tasksCount = 0, tasksByStatus = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const fileInputRef = useRef(null);
  const dropdownRef = useRef(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
    }

    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, [isOpen]);

  // Export tasks (Excel with auto-width columns)
  const handleExport = async (status) => {
    // Kiểm tra xem có tasks không
    const totalTasks = tasksCount;
    const statusTasks = tasksByStatus[status] || 0;
    
    if (totalTasks === 0) {
      toast.error("Không có công việc nào để xuất. Hãy tạo tasks trước!");
      return;
    }
    
    if (status !== 'all' && statusTasks === 0) {
      const statusName = status === 'completed' ? 'hoàn thành' : 
                        status === 'in-progress' ? 'đang làm' : 'chờ xử lý';
      toast.error(`Không có công việc nào đang ${statusName}`);
      return;
    }
    
    setExporting(true);
    try {
      const params = new URLSearchParams();
      if (status) params.append('status', status);
      params.append('format', 'xlsx');  // Export Excel format

      const response = await api.get(`/tasks/export?${params.toString()}`, {
        responseType: 'blob'
      });

      // Download Excel file
      const blob = new Blob([response.data], { 
        type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' 
      });
      const link = document.createElement('a');
      link.href = URL.createObjectURL(blob);
      link.download = `danh-sach-cong-viec_${status || 'all'}_${Date.now()}.xlsx`;
      link.click();
      URL.revokeObjectURL(link.href);
      toast.success(`Xuất thành công file Excel (.xlsx) với ${tasksByStatus[status] || tasksCount} công việc!`);
      
      // Close dropdown after export
      setTimeout(() => setIsOpen(false), 500);
    } catch (err) {
      const msg = err.response?.data?.message || "Xuất danh sách thất bại";
      toast.error(msg);
    } finally {
      setExporting(false);
    }
  };

  // Import tasks từ file (Excel, CSV)
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');

    if (!isExcel && !isCSV) {
      toast.error('Chỉ hỗ trợ file Excel (.xlsx) hoặc CSV');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File quá lớn. Tối đa 5MB');
      return;
    }

    setImporting(true);

    try {
      if (isExcel) {
        await importExcel(file);
      } else if (isCSV) {
        await importCSV(file);
      }

      if (onImportSuccess) {
        onImportSuccess();
      }
      
      // Close dropdown after import
      setTimeout(() => setIsOpen(false), 500);
    } catch (err) {
      const msg = err.response?.data?.message || "Import thất bại";
      const errors = err.response?.data?.errors;
      
      if (errors && errors.length > 0) {
        // Log all errors to console for debugging
        console.error('❌ Import bị từ chối - Chi tiết lỗi:', {
          message: msg,
          totalTasks: err.response?.data?.totalTasks,
          validTasks: err.response?.data?.validTasks,
          invalidTasks: err.response?.data?.invalidTasks,
          errors: errors,
          hint: err.response?.data?.hint
        });
        
        // Show summary in toast
        const invalidCount = err.response?.data?.invalidTasks || errors.length;
        toast.error(
          `❌ ${msg}\n\n${errors.slice(0, 3).join('\n')}${errors.length > 3 ? `\n... và ${errors.length - 3} lỗi khác` : ''}`,
          { duration: 8000 }
        );
        
        // Show hint to check console
        setTimeout(() => {
          toast.error(
            `🔍 Có ${invalidCount} lỗi cần sửa. Mở Console (F12) để xem TẤT CẢ chi tiết.`,
            { duration: 6000 }
          );
        }, 800);
      } else {
        toast.error(msg);
      }
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Import Excel
  const importExcel = async (file) => {
    const reader = new FileReader();
    
    return new Promise((resolve, reject) => {
      reader.onload = async (e) => {
        try {
          const base64 = e.target.result.split(',')[1];
          const response = await api.post('/tasks/import-excel', { excelData: base64 });
          
          const { importedCount, message } = response.data;
          
          toast.success(message || `Import thành công TẤT CẢ ${importedCount} công việc từ Excel!`, { 
            duration: 4000 
          });
          
          resolve();
        } catch (err) {
          reject(err);
        }
      };
      
      reader.onerror = reject;
      reader.readAsDataURL(file);
    });
  };

  // Import CSV
  const importCSV = async (file) => {
    const csvText = await file.text();
    
    const response = await api.post('/tasks/import-csv', { csvText });
    const { importedCount, message } = response.data;
    
    toast.success(message || `Import thành công TẤT CẢ ${importedCount} công việc từ CSV!`, { 
      duration: 4000 
    });
  };


  return (
    <div className="import-export-container" ref={dropdownRef}>
      <button 
        className="btn-import-export"
        onClick={() => setIsOpen(!isOpen)}
        title="Import/Export"
      >
        📂 Import/Export
      </button>

      {isOpen && (
        <div className="import-export-dropdown">
          <div className="dropdown-section">
            <h4>📥 Import</h4>
            <label htmlFor="file-upload" className="btn-import">
              {importing ? '⏳ Đang import...' : '📂 Chọn file Excel hoặc CSV'}
            </label>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".xlsx,.xls,.csv"
              onChange={handleImport}
              disabled={importing}
              style={{ display: 'none' }}
            />
            <p className="hint">Hỗ trợ: Excel (.xlsx) và CSV (max 5MB, 100 tasks)<br/>
            ⚠️ <strong>CHẾ ĐỘ STRICT:</strong> TẤT CẢ công việc phải hợp lệ mới import được<br/>
            📋 File phải có header và cột "Title" (3-200 ký tự) là bắt buộc</p>
          </div>

          <div className="dropdown-divider"></div>

          <div className="dropdown-section">
            <h4>📤 Export {tasksCount > 0 && `(${tasksCount} tasks)`}</h4>
            
            {tasksCount === 0 ? (
              <p className="no-tasks-hint">⚠️ Chưa có công việc nào. Hãy tạo tasks trước!</p>
            ) : (
              <>
                <div className="export-buttons">
                  <button 
                    className="btn-export"
                    onClick={() => handleExport('all')}
                    disabled={exporting || tasksCount === 0}
                  >
                    📊 Tất cả ({tasksByStatus['all'] || 0})
                  </button>
                  
                  <button 
                    className="btn-export"
                    onClick={() => handleExport('completed')}
                    disabled={exporting || tasksByStatus['completed'] === 0}
                  >
                    ✅ Hoàn thành ({tasksByStatus['completed'] || 0})
                  </button>
                  
                  <button 
                    className="btn-export"
                    onClick={() => handleExport('in-progress')}
                    disabled={exporting || tasksByStatus['in-progress'] === 0}
                  >
                    🔄 Đang làm ({tasksByStatus['in-progress'] || 0})
                  </button>

                  <button 
                    className="btn-export"
                    onClick={() => handleExport('pending')}
                    disabled={exporting || tasksByStatus['pending'] === 0}
                  >
                    ⏳ Chờ xử lý ({tasksByStatus['pending'] || 0})
                  </button>
                </div>

                <p className="hint">📥 Xuất file Excel (.xlsx) với định dạng đẹp, cột tự động rộng!</p>
              </>
            )}
          </div>
        </div>
      )}

    </div>
  );
}

