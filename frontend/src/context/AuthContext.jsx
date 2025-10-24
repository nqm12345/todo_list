import { createContext, useContext, useState, useEffect, useRef } from "react";
import api from "../api/axios";
import { toast } from "react-hot-toast";

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

function generateClientToken() {
  const chars = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
  let out = "";
  for (let i = 0; i < 24; i++) out += chars.charAt(Math.floor(Math.random() * chars.length));
  return out;
}

export default function AuthProvider({ children }) {
  const stored = localStorage.getItem("token") || null;
  const storedUser = localStorage.getItem("user") ? JSON.parse(localStorage.getItem("user")) : null;
  
  const [token, setToken] = useState(stored);
  const [user, setUser] = useState(storedUser);
  
  const inactivityTimerRef = useRef(null); // 🔥 Timer cho idle timeout
  const INACTIVITY_TIMEOUT = 60 * 60 * 1000; // ⏱️ 1 giờ (3600 giây) không hoạt động

  /* --- REGISTER --- */
  const register = async (email, password, confirm, username) => {
    if (password !== confirm) {
      toast.error("Mật khẩu xác nhận không khớp!");
      return;
    }

    try {
      const res = await api.post("/auth/register", {
        email,
        password,
        confirm,
        username,
      });
      
      // 💾 Lưu user info sau khi đăng ký thành công (nếu backend trả về)
      const userData = res.data?.user;
      if (userData) {
        console.log("✅ Đăng ký thành công!");
        console.log("👤 Thông tin người dùng mới:", {
          username: userData.username,
          email: userData.email,
          id: userData.id
        });
      }
      
      toast.success(res.data.message || "Đăng ký thành công");
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng ký thất bại.";
      toast.error(msg);
      throw err;
    }
  };

  /* --- LOGIN --- */
  const login = async (email, password, remember = false) => {
    try {
      const res = await api.post("/auth/login", { email, password });
      const tok = res.data?.token || generateClientToken();
      const userData = res.data?.user;
      
      // 💾 Lưu token và user info vào localStorage
      localStorage.setItem("token", tok);
      setToken(tok);
      
      if (userData) {
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        
        // 📝 Log thông tin user ra console để bạn thấy
        console.log("✅ Đăng nhập thành công!");
        console.log("👤 Thông tin người dùng:", {
          username: userData.username,
          email: userData.email,
          id: userData.id
        });
        console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      }
      
      // 🔥 Bắt đầu theo dõi inactivity sau khi login
      startInactivityTimer();
      
      toast.success(res.data?.message || "Đăng nhập thành công");
      return res;
    } catch (err) {
      const msg = err.response?.data?.message || "Đăng nhập thất bại.";
      toast.error(msg);
      throw err;
    }
  };

  const logout = () => {
    // 🔥 Clear timer khi logout
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
      inactivityTimerRef.current = null;
    }
    
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    localStorage.removeItem("lastActivity");
    sessionStorage.removeItem("token");
    setToken(null);
    setUser(null);
    
    console.log("🚪 Đã đăng xuất");
    toast("Đã đăng xuất");
  };

  // 🔥 Hàm reset inactivity timer (gọi khi user có hoạt động)
  const resetInactivityTimer = () => {
    // Clear timer cũ
    if (inactivityTimerRef.current) {
      clearTimeout(inactivityTimerRef.current);
    }

    // Cập nhật thời gian hoạt động cuối
    const now = Date.now();
    localStorage.setItem("lastActivity", now.toString());

    // Set timer mới
    inactivityTimerRef.current = setTimeout(() => {
      // ⏰ Hết thời gian idle - hiển thị alert và logout
      alert("⏰ Bạn đã không hoạt động trong 1 giờ!\n\nPhiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại.");
      logout();
      window.location.href = "/login";
    }, INACTIVITY_TIMEOUT);
    
    console.log(`⏱️ Inactivity timer reset - sẽ logout sau 1 giờ nếu không có hoạt động`);
  };

  // 🔥 Hàm bắt đầu inactivity timer
  const startInactivityTimer = () => {
    if (!token) return;
    
    resetInactivityTimer();
    
    // 🔥 Lắng nghe các sự kiện user activity
    const events = [
      'mousedown',   // Click chuột
      'mousemove',   // Di chuyển chuột
      'keypress',    // Gõ phím
      'scroll',      // Scroll
      'touchstart',  // Touch trên mobile
      'click'        // Click
    ];

    const handleActivity = () => {
      if (token) {
        resetInactivityTimer();
      }
    };

    // Thêm listeners
    events.forEach(event => {
      document.addEventListener(event, handleActivity);
    });

    // Lưu cleanup function
    return () => {
      events.forEach(event => {
        document.removeEventListener(event, handleActivity);
      });
    };
  };

  // 🔥 Kiểm tra token và setup inactivity timer khi component mount
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    
    if (storedToken) {
      // Token tồn tại - bắt đầu theo dõi inactivity
      const cleanup = startInactivityTimer();
      
      return () => {
        if (cleanup) cleanup();
        if (inactivityTimerRef.current) {
          clearTimeout(inactivityTimerRef.current);
        }
      };
    }
  }, [token]); // Re-run khi token thay đổi

  // 🔥 Log user info khi component mount (để bạn thấy trong console)
  useEffect(() => {
    if (user) {
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
      console.log("📌 User hiện tại đang đăng nhập:");
      console.log("👤 Username:", user.username);
      console.log("📧 Email:", user.email);
      console.log("🆔 ID:", user.id);
      console.log("━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━");
    }
  }, [user]);

  return (
    <AuthContext.Provider
      value={{
        token,
        user, // 🔥 Export user để TaskCard và các components khác có thể dùng
        isAuthenticated: !!token,
        login,
        register,
        logout,
        setToken,
        setUser, // 🔥 Export setUser
        resetInactivityTimer, // 🔥 Export để các component khác có thể reset timer
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}
