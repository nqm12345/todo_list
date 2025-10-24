import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import Header from "../components/Header";
import TaskForm from "../components/TaskForm";
import TaskCard from "../components/TaskCard";
import ImportExport from "../components/ImportExport";
import "./Tasks.css";

export default function Tasks() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  const fetchTasks = async () => {
    try {
      setLoading(true);
      const { data } = await api.get("/tasks");
      setTasks(data.data || []);
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể tải danh sách công việc";
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTasks();
  }, []);

  const handleEdit = (task) => {
    setEditingTask(task);
    setShowForm(true);
  };

  const handleSuccess = () => {
    setShowForm(false);
    setEditingTask(null);
    fetchTasks();
  };

  const handleCancel = () => {
    setShowForm(false);
    setEditingTask(null);
  };

  // ✅ Lọc tasks theo search và status
  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         (task.description && task.description.toLowerCase().includes(searchQuery.toLowerCase()));
    const matchesStatus = filterStatus === "all" || task.status === filterStatus;
    return matchesSearch && matchesStatus;
  });

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length
  };

  const tasksByStatus = {
    'all': stats.total,
    'pending': stats.pending,
    'in-progress': stats.inProgress,
    'completed': stats.completed
  };

  return (
    <div className="simple-layout">
      {/* Header */}
      <Header />

      {/* Main Content */}
      <div className="simple-main">
        <div className="simple-container">
          {/* Page Header */}
          <div className="page-header">
            <h1 className="page-title">
              Danh sách công việc <span className="page-count">({stats.total})</span>
            </h1>

            <div className="page-actions">
              {/* Import/Export */}
              <ImportExport 
                onImportSuccess={fetchTasks} 
                tasksCount={stats.total}
                tasksByStatus={tasksByStatus}
              />

              {/* Add Task Button */}
              <button 
                className="btn-add-task"
                onClick={() => setShowForm(!showForm)}
              >
                ➕ Thêm công việc
              </button>
            </div>
          </div>

          {/* Task Form (Modal style) */}
          {showForm && (
            <div className="task-form-modal">
              <div className="task-form-overlay" onClick={handleCancel}></div>
              <div className="task-form-container">
                <TaskForm
                  task={editingTask}
                  onSuccess={handleSuccess}
                  onCancel={handleCancel}
                />
              </div>
            </div>
          )}

          {/* Loading State */}
          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Đang tải...</p>
            </div>
          ) : (
            <>
              {/* Search & Filter Bar */}
              {tasks.length > 0 && (
                <div className="search-filter-bar">
                  <div className="search-box">
                    <input
                      type="text"
                      placeholder="🔍 Tìm kiếm theo tên công việc..."
                      value={searchQuery}
                      onChange={(e) => setSearchQuery(e.target.value)}
                    />
                    {searchQuery && (
                      <button 
                        className="clear-search-btn"
                        onClick={() => setSearchQuery("")}
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  <div className="filter-box">
                    <label htmlFor="status-filter">Trạng thái:</label>
                    <select
                      id="status-filter"
                      value={filterStatus}
                      onChange={(e) => setFilterStatus(e.target.value)}
                    >
                      <option value="all">Tất cả</option>
                      <option value="pending">Chờ xử lý</option>
                      <option value="in-progress">Đang làm</option>
                      <option value="completed">Hoàn thành</option>
                    </select>
                  </div>
                </div>
              )}

              {/* Empty State */}
              {tasks.length === 0 && (
                <div className="empty-state">
                  <div className="empty-icon">📂</div>
                  <h3>Chưa có công việc nào</h3>
                  <p>Nhấn "➕ Thêm công việc" để tạo công việc đầu tiên</p>
                </div>
              )}

              {/* No Search Results */}
              {filteredTasks.length === 0 && searchQuery && tasks.length > 0 && (
                <div className="no-results">
                  <div className="empty-icon">🔍</div>
                  <h3>Không tìm thấy kết quả</h3>
                  <p>Không có công việc nào phù hợp với "{searchQuery}"</p>
                </div>
              )}

              {/* Tasks Grid */}
              {filteredTasks.length > 0 && (
                <div className="tasks-grid">
                  {filteredTasks.map(task => (
                    <TaskCard
                      key={task._id}
                      task={task}
                      onEdit={handleEdit}
                      onRefresh={fetchTasks}
                    />
                  ))}
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </div>
  );
}
