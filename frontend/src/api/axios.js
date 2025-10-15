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

// auto-logout on 401 (invalid/expired token)
api.interceptors.response.use(
  (res) => res,
  (err) => {
    const status = err?.response?.status;
    if (status === 401) {
      // clear stored tokens
      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
      toast.error("Phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      // redirect to login page
      try {
        // preserve current origin
        window.location.href = "/login";
      } catch (e) {
        // ignore in non-browser env
      }
    }
    return Promise.reject(err);
  }
);

export default api;
