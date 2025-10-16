import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { toast } from "react-hot-toast";
import api from "../api/axios";
import TaskForm from "../components/TaskForm";
import TaskList from "../components/TaskList";
import "./Tasks.css";

export default function Tasks() {
  const { logout } = useAuth();
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingTask, setEditingTask] = useState(null);
  const [showForm, setShowForm] = useState(false);

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

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === "pending").length,
    inProgress: tasks.filter(t => t.status === "in-progress").length,
    completed: tasks.filter(t => t.status === "completed").length
  };

  return (
    <div className="tasks-page">
      <div className="tasks-container">
        <div className="tasks-header">
          <div>
            <h1 className="tasks-title">Quản lý công việc</h1>
            <p className="tasks-subtitle">Tổ chức và theo dõi công việc hiệu quả</p>
          </div>
          <button className="btn-logout" onClick={logout}>
            🚪 Đăng xuất
          </button>
        </div>

        <div className="stats-grid">
          <div className="stat-card">
            <div className="stat-value">{stats.total}</div>
            <div className="stat-label">Tổng số</div>
          </div>
          <div className="stat-card stat-pending">
            <div className="stat-value">{stats.pending}</div>
            <div className="stat-label">Chờ xử lý</div>
          </div>
          <div className="stat-card stat-progress">
            <div className="stat-value">{stats.inProgress}</div>
            <div className="stat-label">Đang làm</div>
          </div>
          <div className="stat-card stat-completed">
            <div className="stat-value">{stats.completed}</div>
            <div className="stat-label">Hoàn thành</div>
          </div>
        </div>

        <div className="tasks-content">
          {!showForm ? (
            <button
              className="btn-add-task"
              onClick={() => setShowForm(true)}
            >
              ➕ Thêm công việc mới
            </button>
          ) : (
            <TaskForm
              task={editingTask}
              onSuccess={handleSuccess}
              onCancel={handleCancel}
            />
          )}

          {loading ? (
            <div className="loading-state">
              <div className="spinner"></div>
              <p>Đang tải...</p>
            </div>
          ) : (
            <TaskList
              tasks={tasks}
              onEdit={handleEdit}
              onRefresh={fetchTasks}
            />
          )}
        </div>
      </div>
    </div>
  );
}
