import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

export default function TaskList({ tasks, onEdit, onRefresh }) {
  const [deleting, setDeleting] = useState(null);

  const handleDelete = async (taskId) => {
    if (!window.confirm("Bạn có chắc muốn xóa công việc này?")) return;

    setDeleting(taskId);
    try {
      await api.delete(`/tasks/${taskId}`);
      toast.success("Xóa công việc thành công!");
      if (onRefresh) onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Xóa công việc thất bại";
      toast.error(msg);
    } finally {
      setDeleting(null);
    }
  };

  const handleToggleStatus = async (task) => {
    try {
      const newStatus = task.status === "completed" ? "pending" : "completed";
      await api.put(`/tasks/${task._id}`, { ...task, status: newStatus });
      toast.success("Cập nhật trạng thái thành công!");
      if (onRefresh) onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Cập nhật thất bại";
      toast.error(msg);
    }
  };

  const getStatusBadge = (status) => {
    const badges = {
      pending: { text: "Chờ xử lý", className: "status-pending" },
      "in-progress": { text: "Đang thực hiện", className: "status-progress" },
      completed: { text: "Hoàn thành", className: "status-completed" }
    };
    const badge = badges[status] || badges.pending;
    return <span className={`status-badge ${badge.className}`}>{badge.text}</span>;
  };

  const formatDate = (dateString) => {
    if (!dateString) return null;
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN");
  };

  if (!tasks || tasks.length === 0) {
    return (
      <div className="empty-state">
        <svg className="empty-icon" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        <p className="empty-text">Chưa có công việc nào</p>
        <p className="empty-subtext">Hãy tạo công việc mới để bắt đầu!</p>
      </div>
    );
  }

  return (
    <div className="task-list">
      {tasks.map((task) => (
        <div key={task._id} className="task-item">
          <div className="task-header">
            <div className="task-checkbox">
              <input
                type="checkbox"
                checked={task.status === "completed"}
                onChange={() => handleToggleStatus(task)}
                id={`task-${task._id}`}
              />
              <label htmlFor={`task-${task._id}`} className="task-title">
                {task.title}
              </label>
            </div>
            {getStatusBadge(task.status)}
          </div>

          {task.description && (
            <p className="task-description">{task.description}</p>
          )}

          <div className="task-footer">
            <div className="task-meta">
              {task.dueDate && (
                <span className="task-date">
                  📅 {formatDate(task.dueDate)}
                </span>
              )}
              <span className="task-created">
                Tạo: {formatDate(task.createdAt)}
              </span>
            </div>

            <div className="task-actions">
              <button
                onClick={() => onEdit(task)}
                className="btn-edit"
                title="Sửa"
              >
                ✏️ Sửa
              </button>
              <button
                onClick={() => handleDelete(task._id)}
                className="btn-delete"
                disabled={deleting === task._id}
                title="Xóa"
              >
                {deleting === task._id ? "⏳" : "🗑️"} Xóa
              </button>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
