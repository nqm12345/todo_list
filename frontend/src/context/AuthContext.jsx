import { createContext, useContext, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export default function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem("token"));

  // --- REGISTER ---
  const register = async (email, password, username) => {
    try {
      const res = await api.post("/auth/register", { email, password, username });
      toast.success(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng ký thất bại.";
      toast.error(msg);
      throw err;
    }
  };

  // --- LOGIN ---
  const login = async (email, password) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      localStorage.setItem("token", res.data.token);
      setToken(res.data.token);
      toast.success(res.data.message);
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại.";
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    toast("Đã đăng xuất");
  };

  return (
    <AuthContext.Provider value={{ token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}
