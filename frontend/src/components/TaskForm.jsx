import { useState, useEffect } from "react";
import { toast } from "react-hot-toast";
import api from "../api/axios";

export default function TaskForm({ task, onSuccess, onCancel }) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [status, setStatus] = useState("pending");
  const [dueDate, setDueDate] = useState("");
  const [loading, setLoading] = useState(false);

  // Populate form when editing
  useEffect(() => {
    if (task) {
      setTitle(task.title || "");
      setDescription(task.description || "");
      setStatus(task.status || "pending");
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split('T')[0] : "");
    }
  }, [task]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!title.trim()) {
      toast.error("Vui lòng nhập tiêu đề công việc");
      return;
    }

    setLoading(true);

    try {
      const payload = {
        title: title.trim(),
        description: description.trim(),
        status,
        dueDate: dueDate || undefined
      };

      if (task) {
        // Update existing task
        await api.put(`/tasks/${task._id}`, payload);
        toast.success("Cập nhật công việc thành công!");
      } else {
        // Create new task
        await api.post("/tasks", payload);
        toast.success("Tạo công việc mới thành công!");
      }

      // Reset form
      setTitle("");
      setDescription("");
      setStatus("pending");
      setDueDate("");

      if (onSuccess) onSuccess();
    } catch (err) {
      const msg = err.response?.data?.message || (task ? "Cập nhật thất bại" : "Tạo công việc thất bại");
      toast.error(msg);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-form-container">
      <h2 className="task-form-title">{task ? "Sửa công việc" : "Thêm công việc mới"}</h2>
      <form onSubmit={handleSubmit} className="task-form">
        <div className="form-group">
          <label htmlFor="title" className="form-label">
            Tiêu đề <span className="required">*</span>
          </label>
          <input
            id="title"
            type="text"
            className="form-input"
            placeholder="Nhập tiêu đề công việc"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div className="form-group">
          <label htmlFor="description" className="form-label">Mô tả</label>
          <textarea
            id="description"
            className="form-textarea"
            placeholder="Nhập mô tả chi tiết (tùy chọn)"
            value={description}
            onChange={(e) => setDescription(e.target.value)}
            rows={3}
          />
        </div>

        <div className="form-row">
          <div className="form-group">
            <label htmlFor="status" className="form-label">Trạng thái</label>
            <select
              id="status"
              className="form-select"
              value={status}
              onChange={(e) => setStatus(e.target.value)}
            >
              <option value="pending">Chờ xử lý</option>
              <option value="in-progress">Đang thực hiện</option>
              <option value="completed">Hoàn thành</option>
            </select>
          </div>

          <div className="form-group">
            <label htmlFor="dueDate" className="form-label">Hạn hoàn thành</label>
            <input
              id="dueDate"
              type="date"
              className="form-input"
              value={dueDate}
              onChange={(e) => setDueDate(e.target.value)}
            />
          </div>
        </div>

        <div className="form-actions">
          {onCancel && (
            <button
              type="button"
              className="btn-secondary"
              onClick={onCancel}
              disabled={loading}
            >
              Hủy
            </button>
          )}
          <button type="submit" className="btn-primary" disabled={loading}>
            {loading ? "Đang xử lý..." : task ? "Cập nhật" : "Tạo mới"}
          </button>
        </div>
      </form>
    </div>
  );
}
