import { useState } from "react";
import { toast } from "react-hot-toast";
import { useAuth } from "../context/AuthContext";
import api from "../api/axios";
import "./TaskCard.css";

export default function TaskCard({ task, onEdit, onRefresh }) {
  const { user } = useAuth();
  const [showMenu, setShowMenu] = useState(false);
  const [showStatusMenu, setShowStatusMenu] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdating, setIsUpdating] = useState(false);

  // Generate task ID from MongoDB _id (short version for display)
  const taskId = task._id ? `#${task._id.slice(-8).toUpperCase()}` : "#00000000";

  // Get status info
  const getStatusInfo = (status) => {
    if (status === "completed") return { 
      label: "Hoàn thành", 
      color: "completed", 
      emoji: "✅",
      dotColor: "#10b981"
    };
    if (status === "in-progress") return { 
      label: "Đang làm", 
      color: "in-progress", 
      emoji: "⚡",
      dotColor: "#f59e0b"
    };
    return { 
      label: "Chờ xử lý", 
      color: "pending", 
      emoji: "⏳",
      dotColor: "#ef4444"
    };
  };

  const statusInfo = getStatusInfo(task.status);

  // Format date
  const formatDate = (dateString) => {
    if (!dateString) return "Chưa có hạn";
    const date = new Date(dateString);
    return date.toLocaleDateString("vi-VN", { 
      day: "2-digit", 
      month: "2-digit", 
      year: "numeric" 
    });
  };

  // Get task owner info (from populated userId)
  const getTaskOwnerInitials = () => {
    if (task.userId?.username) {
      return task.userId.username.charAt(0).toUpperCase();
    }
    return "U";
  };

  const getTaskOwnerName = () => {
    return task.userId?.username || "Unknown User";
  };

  // Check if current user can edit/delete this task
  const canModify = () => {
    if (!user) return false;
    // Owner can always modify
    if (task.userId?._id === user.id || task.userId === user.id) return true;
    // Admin can modify any task
    if (user.role === 'admin') return true;
    return false;
  };

  // Delete task
  const handleDelete = async () => {
    if (!window.confirm("Bạn có chắc muốn xóa công việc này?")) {
      return;
    }

    setIsDeleting(true);
    try {
      await api.delete(`/tasks/${task._id}`);
      toast.success("Đã xóa công việc!");
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể xóa công việc";
      toast.error(msg);
    } finally {
      setIsDeleting(false);
      setShowMenu(false);
    }
  };

  // Change status
  const handleChangeStatus = async (newStatus) => {
    if (newStatus === task.status) {
      setShowStatusMenu(false);
      return;
    }

    setIsUpdating(true);
    try {
      await api.put(`/tasks/${task._id}`, { ...task, status: newStatus });
      toast.success("Đã cập nhật trạng thái!");
      onRefresh();
    } catch (err) {
      const msg = err.response?.data?.message || "Không thể cập nhật";
      toast.error(msg);
    } finally {
      setIsUpdating(false);
      setShowStatusMenu(false);
      setShowMenu(false);
    }
  };

  return (
    <div className={`task-card ${isDeleting || isUpdating ? 'deleting' : ''}`}>
      {/* Header: Priority Badge + Task ID + Menu */}
      <div className="task-card-header">
        <div className="task-priority-badge" style={{ borderLeft: `3px solid ${statusInfo.dotColor}` }}>
          <span className="priority-dot" style={{ backgroundColor: statusInfo.dotColor }}></span>
          <span className="priority-label">{statusInfo.label}</span>
        </div>
        <span className="task-id">{taskId}</span>
        <div className="task-menu-wrapper">
          <button 
            className="task-menu-btn"
            onClick={() => setShowMenu(!showMenu)}
            aria-label="Menu"
          >
            ⋮
          </button>
          {showMenu && (
            <div className="task-menu-dropdown">
              <button 
                onClick={() => { onEdit(task); setShowMenu(false); }}
                disabled={!canModify()}
                title={!canModify() ? "Chỉ chủ sở hữu hoặc admin mới có thể sửa" : "Sửa công việc"}
              >
                ✏️ Sửa
              </button>
              <div className="menu-item-with-submenu">
                <button 
                  onClick={() => setShowStatusMenu(!showStatusMenu)}
                  className="status-menu-trigger"
                  disabled={!canModify()}
                  title={!canModify() ? "Chỉ chủ sở hữu hoặc admin mới có thể đổi trạng thái" : "Đổi trạng thái"}
                >
                  🔄 Đổi trạng thái
                </button>
                {showStatusMenu && canModify() && (
                  <div className="status-submenu">
                    <button 
                      onClick={() => handleChangeStatus("pending")}
                      className={task.status === "pending" ? "active" : ""}
                      disabled={isUpdating}
                    >
                      ⏳ Chờ xử lý
                    </button>
                    <button 
                      onClick={() => handleChangeStatus("in-progress")}
                      className={task.status === "in-progress" ? "active" : ""}
                      disabled={isUpdating}
                    >
                      ⚡ Đang làm
                    </button>
                    <button 
                      onClick={() => handleChangeStatus("completed")}
                      className={task.status === "completed" ? "active" : ""}
                      disabled={isUpdating}
                    >
                      ✅ Hoàn thành
                    </button>
                  </div>
                )}
              </div>
              <button 
                onClick={handleDelete} 
                className="delete-btn"
                disabled={!canModify()}
                title={!canModify() ? "Chỉ chủ sở hữu hoặc admin mới có thể xóa" : "Xóa công việc"}
              >
                🗑️ Xóa
              </button>
            </div>
          )}
        </div>
      </div>

      {/* Title */}
      <h3 className="task-card-title" onClick={() => onEdit(task)}>
        {task.title}
      </h3>

      {/* Description (if exists) */}
      {task.description && (
        <p className="task-card-description">
          {task.description.length > 120 
            ? task.description.substring(0, 120) + "..." 
            : task.description}
        </p>
      )}

      {/* Footer: Task Owner Info + Due Date */}
      <div className="task-card-footer">
        <div className="task-user-info">
          <div className="user-avatar-small">
            {getTaskOwnerInitials()}
          </div>
          <div className="user-name">
            {getTaskOwnerName()}
            {user?.role === 'admin' && task.userId?._id !== user.id && task.userId !== user.id && (
              <span className="admin-badge" title="Bạn là admin, có thể sửa/xóa task này">👑</span>
            )}
          </div>
        </div>
        <div className="task-due-date">
          <span className="date-icon">📅</span>
          <span className="date-text">{formatDate(task.dueDate)}</span>
        </div>
      </div>
    </div>
  );
}

