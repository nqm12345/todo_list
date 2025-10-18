import axios from "axios";
import { toast } from "react-hot-toast";

const api = axios.create({
  baseURL: import.meta.env.VITE_API_BASE || "http://localhost:3000/api",
});

// attach token from either storage
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// auto-logout on 401 (invalid/expired token) and handle other errors
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    const message = err?.response?.data?.message;
    
    // Handle different HTTP status codes
    if (status === 401) {
      // Unauthorized - clear tokens and redirect to login
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      toast.error(message || "Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      
      // Only redirect if not already on login/register page
      if (!window.location.pathname.includes("/login") && !window.location.pathname.includes("/register")) {
        setTimeout(() => {
          window.location.href = "/login";
        }, 1000);
      }
    } else if (status === 403) {
      // Forbidden - only toast if not handled by calling code
      if (!message) toast.error("Bạn không có quyền thực hiện thao tác này.");
    } else if (status === 404) {
      // Not Found - only toast if not handled by calling code
      if (!message) toast.error("Không tìm thấy tài nguyên yêu cầu.");
    } else if (status === 500) {
      // Server Error
      toast.error(message || "Lỗi server. Vui lòng thử lại sau.");
    } else if (err.code === "ECONNABORTED" || err.code === "ERR_NETWORK") {
      // Network Error
      toast.error("Không thể kết nối tới server. Vui lòng kiểm tra kết nối mạng.");
    }
    // ✅ Don't toast for 400-499 errors - let calling code handle them
    
    return Promise.reject(err);
  }
);

export default api;
