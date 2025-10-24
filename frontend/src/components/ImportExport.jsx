import { useState, useRef, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import "./ImportExport.css";

export default function ImportExport({ onImportSuccess, tasksCount = 0, tasksByStatus = {} }) {
  const [isOpen, setIsOpen] = useState(false);
  const [importing, setImporting] = useState(false);
  const [exporting, setExporting] = useState(false);
  const [showPasteDialog, setShowPasteDialog] = useState(false);
  const [pasteText, setPasteText] = useState('');
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

  // Export tasks
  const handleExport = async (status, format = 'json') => {
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
      if (format) params.append('format', format);

      const response = await api.get(`/tasks/export?${params.toString()}`, {
        responseType: format === 'csv' ? 'blob' : 'json'
      });

      if (format === 'csv') {
        // Download CSV file
        const blob = new Blob([response.data], { type: 'text/csv;charset=utf-8;' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `tasks_${status || 'all'}_${Date.now()}.csv`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success(`Xuất ${response.data.length > 0 ? 'thành công' : ''} file CSV`);
      } else {
        // Download JSON file
        const blob = new Blob([JSON.stringify(response.data, null, 2)], { 
          type: 'application/json' 
        });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(blob);
        link.download = `tasks_${status || 'all'}_${Date.now()}.json`;
        link.click();
        URL.revokeObjectURL(link.href);
        toast.success(`Xuất thành công ${response.data.totalTasks || 0} công việc`);
      }
      
      // Close dropdown after export
      setTimeout(() => setIsOpen(false), 500);
    } catch (err) {
      const msg = err.response?.data?.message || "Xuất danh sách thất bại";
      toast.error(msg);
    } finally {
      setExporting(false);
    }
  };

  // Import tasks từ file (JSON, Excel, CSV)
  const handleImport = async (event) => {
    const file = event.target.files?.[0];
    if (!file) return;

    const fileName = file.name.toLowerCase();
    const isJSON = fileName.endsWith('.json');
    const isExcel = fileName.endsWith('.xlsx') || fileName.endsWith('.xls');
    const isCSV = fileName.endsWith('.csv');

    if (!isJSON && !isExcel && !isCSV) {
      toast.error('Chỉ hỗ trợ file JSON, Excel (.xlsx) hoặc CSV');
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      toast.error('File quá lớn. Tối đa 5MB');
      return;
    }

    setImporting(true);

    try {
      if (isJSON) {
        await importJSON(file);
      } else if (isExcel) {
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
      toast.error(msg);
      
      if (err.response?.data?.errors) {
        console.error('Import errors:', err.response.data.errors);
      }
    } finally {
      setImporting(false);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  // Import JSON
  const importJSON = async (file) => {
    const fileContent = await file.text();
    let parsedData;

    try {
      parsedData = JSON.parse(fileContent);
    } catch (parseError) {
      toast.error('File JSON không hợp lệ');
      throw parseError;
    }

    let tasksToImport = [];

    if (Array.isArray(parsedData)) {
      tasksToImport = parsedData;
    } else if (parsedData.tasks && Array.isArray(parsedData.tasks)) {
      tasksToImport = parsedData.tasks;
    } else if (parsedData.data && Array.isArray(parsedData.data)) {
      tasksToImport = parsedData.data;
    } else {
      toast.error('Định dạng JSON không đúng');
      throw new Error('Invalid JSON format');
    }

    if (tasksToImport.length === 0) {
      toast.error('File không chứa task nào');
      throw new Error('No tasks');
    }

    const response = await api.post('/tasks/import', { tasks: tasksToImport });
    const { importedCount, totalSubmitted, errors } = response.data;
    
    if (errors && errors.length > 0) {
      toast.success(`Import thành công ${importedCount}/${totalSubmitted} công việc từ JSON`);
      console.warn('Import errors:', errors);
    } else {
      toast.success(`Import thành công ${importedCount} công việc từ JSON!`);
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
          
          const { importedCount, totalSubmitted, errors } = response.data;
          
          if (errors && errors.length > 0) {
            toast.success(`Import thành công ${importedCount}/${totalSubmitted} công việc từ Excel`);
            console.warn('Import errors:', errors);
          } else {
            toast.success(`Import thành công ${importedCount} công việc từ Excel!`);
          }
          
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
    const { importedCount, totalSubmitted, errors } = response.data;
    
    if (errors && errors.length > 0) {
      toast.success(`Import thành công ${importedCount}/${totalSubmitted} công việc từ CSV`);
      console.warn('Import errors:', errors);
    } else {
      toast.success(`Import thành công ${importedCount} công việc từ CSV!`);
    }
  };

  // Import từ paste text
  const handlePasteImport = async () => {
    if (!pasteText.trim()) {
      toast.error('Vui lòng paste danh sách công việc');
      return;
    }

    setImporting(true);

    try {
      const lines = pasteText.trim().split('\n');
      const tasks = [];

      lines.forEach(line => {
        const trimmed = line.trim();
        if (!trimmed) return;

        // Remove bullet points and numbers
        let title = trimmed.replace(/^[-*•]\s*/, '').replace(/^\d+\.\s*/, '');
        
        if (title) {
          tasks.push({
            title: title,
            description: '',
            status: 'pending'
          });
        }
      });

      if (tasks.length === 0) {
        toast.error('Không tìm thấy task nào trong text');
        setImporting(false);
        return;
      }

      const response = await api.post('/tasks/import', { tasks });
      const { importedCount } = response.data;
      
      toast.success(`Import thành công ${importedCount} công việc từ text!`);
      
      setPasteText('');
      setShowPasteDialog(false);
      
      if (onImportSuccess) {
        onImportSuccess();
      }
    } catch (err) {
      const msg = err.response?.data?.message || "Import thất bại";
      toast.error(msg);
    } finally {
      setImporting(false);
    }
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
              {importing ? '⏳ Đang import...' : '📂 Chọn file (JSON/Excel/CSV)'}
            </label>
            <input
              id="file-upload"
              ref={fileInputRef}
              type="file"
              accept=".json,.xlsx,.xls,.csv"
              onChange={handleImport}
              disabled={importing}
              style={{ display: 'none' }}
            />
            <button 
              className="btn-import-paste"
              onClick={() => setShowPasteDialog(true)}
              disabled={importing}
            >
              📋 Paste danh sách
            </button>
            <p className="hint">Hỗ trợ: JSON, Excel (.xlsx), CSV, Text paste (max 5MB, 100 tasks)</p>
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
                    onClick={() => handleExport('all', 'json')}
                    disabled={exporting || tasksCount === 0}
                  >
                    📋 Tất cả ({tasksByStatus['all'] || 0})
                  </button>
                  
                  <button 
                    className="btn-export"
                    onClick={() => handleExport('completed', 'json')}
                    disabled={exporting || tasksByStatus['completed'] === 0}
                  >
                    ✅ Hoàn thành ({tasksByStatus['completed'] || 0})
                  </button>
                  
                  <button 
                    className="btn-export"
                    onClick={() => handleExport('in-progress', 'json')}
                    disabled={exporting || tasksByStatus['in-progress'] === 0}
                  >
                    🔄 Đang làm ({tasksByStatus['in-progress'] || 0})
                  </button>

                  <button 
                    className="btn-export"
                    onClick={() => handleExport('pending', 'json')}
                    disabled={exporting || tasksByStatus['pending'] === 0}
                  >
                    ⏳ Chờ xử lý ({tasksByStatus['pending'] || 0})
                  </button>
                </div>

                <div className="export-buttons" style={{ marginTop: '8px' }}>
                  <button 
                    className="btn-export btn-csv"
                    onClick={() => handleExport('all', 'csv')}
                    disabled={exporting || tasksCount === 0}
                  >
                    📊 Tất cả CSV ({tasksByStatus['all'] || 0})
                  </button>
                  
                  <button 
                    className="btn-export btn-csv"
                    onClick={() => handleExport('completed', 'csv')}
                    disabled={exporting || tasksByStatus['completed'] === 0}
                  >
                    ✅ Hoàn thành CSV ({tasksByStatus['completed'] || 0})
                  </button>
                </div>

                <p className="hint">CSV để mở bằng Excel</p>
              </>
            )}
          </div>
        </div>
      )}

      {/* Paste Dialog */}
      {showPasteDialog && (
        <div className="paste-dialog-overlay" onClick={() => setShowPasteDialog(false)}>
          <div className="paste-dialog" onClick={(e) => e.stopPropagation()}>
            <h3>📋 Paste danh sách công việc</h3>
            <p className="paste-hint">
              Paste danh sách công việc (mỗi dòng là 1 task). Hỗ trợ:
              <br />• Danh sách có dấu đầu dòng (-,  *, •)
              <br />• Danh sách có số thứ tự (1., 2., 3.)
              <br />• Hoặc chỉ đơn giản là mỗi dòng 1 task
            </p>
            <textarea
              className="paste-textarea"
              value={pasteText}
              onChange={(e) => setPasteText(e.target.value)}
              placeholder={`Ví dụ:\n- Hoàn thành báo cáo\n- Gọi điện cho khách hàng\n- Review code\n\nHoặc:\n1. Task đầu tiên\n2. Task thứ hai`}
              rows={10}
            />
            <div className="paste-actions">
              <button 
                className="btn-cancel"
                onClick={() => {
                  setShowPasteDialog(false);
                  setPasteText('');
                }}
                disabled={importing}
              >
                ❌ Hủy
              </button>
              <button 
                className="btn-confirm"
                onClick={handlePasteImport}
                disabled={importing || !pasteText.trim()}
              >
                {importing ? '⏳ Đang import...' : '✅ Import'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

