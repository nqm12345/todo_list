import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import PasswordInput from "../components/PasswordInput";

// Dùng ảnh hero riêng cho Register
// Cách 1: new URL (ổn định với Vite)
const heroImg = new URL("../assets/taixuong.jpg", import.meta.url).href;
// Cách 2: nếu bạn có barrel export: import { AnhTest as heroImg } from "../assets";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm]   = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password) {
      setError("Vui lòng nhập đủ Tên, Email và Mật khẩu.");
      return;
    }
    if (password.length < 6) {
      setError("Mật khẩu tối thiểu 6 ký tự.");
      return;
    }
    if (confirm !== password) {
      setError("Xác nhận mật khẩu chưa khớp.");
      return;
    }

    try {
      setLoading(true);
      await register(email, password, username);
      nav("/login");
    } catch (err) {
      setError(err?.response?.data?.message || "Đăng ký thất bại. Vui lòng thử lại.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        {/* LEFT: hero */}
        <div className="login-hero" aria-hidden>
          <img src={heroImg} alt="Hero register" className="hero-image" />
          <div className="hero-overlay">
            <h2>Welcome aboard</h2>
            <p>Tạo tài khoản mới và bắt đầu quản lý công việc.</p>
          </div>
        </div>

        {/* RIGHT: form đăng ký */}
        <div className="login-form">
          <h1 className="title">Đăng ký</h1>

          <form onSubmit={onSubmit}>
            <label className="label">Tên người dùng</label>
            <input
              className="input"
              placeholder="Tên người dùng"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              autoComplete="username"
            />

            <label className="label">Email</label>
            <input
              className="input"
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              autoComplete="email"
            />

            <label className="label">Mật khẩu</label>
            <PasswordInput
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              autoComplete="new-password"
            />

            <label className="label">Xác nhận mật khẩu</label>
            <PasswordInput
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
            />

            {error && <p className="error">{error}</p>}

            <button className="btn" disabled={loading} style={{ marginTop: 12 }}>
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>

          <p className="signup">
            Đã có tài khoản? <Link className="link" to="/login">Đăng nhập</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
