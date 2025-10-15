import { createContext, useContext, useState } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function generateClientToken() {
  // simple client token: random 24-char base62 string
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let out = '';
  for (let i = 0; i < 24; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

export default function AuthProvider({ children }) {
  // Read token from localStorage (always persisted)
  const stored = localStorage.getItem('token') || null;
  const [token, setToken] = useState(stored);

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
  // remember: boolean (true -> localStorage, false -> sessionStorage)
  const login = async (email, password, remember = false) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      // backend may or may not return a token
      const tok = res.data?.token || generateClientToken();
      // Always persist in localStorage so token survives browser sessions
      localStorage.setItem("token", tok);
      setToken(tok);
      toast.success(res.data?.message || "Đăng nhập thành công");
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại.";
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    setToken(null);
    toast("Đã đăng xuất");
  };

  return (
    <AuthContext.Provider value={{ token, isAuthenticated: !!token, login, register, logout, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}
