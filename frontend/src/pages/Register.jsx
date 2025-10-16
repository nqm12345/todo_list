import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import PasswordInput from "../components/PasswordInput";

import { RegisterBg as heroImg } from "../assets";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [strength, setStrength] = useState({ level: "", color: "" });

  // ✅ Kiểm tra độ mạnh mật khẩu realtime
  useEffect(() => {
    if (!password) return setStrength({ level: "", color: "" });
    setStrength(checkPasswordStrength(password));
  }, [password]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!username || !email || !password || !confirm) {
      setError("Vui lòng nhập đủ Tên, Email, Mật khẩu và Xác nhận.");
      return;
    }

    if (confirm !== password) {
      setError("Xác nhận mật khẩu chưa khớp.");
      return;
    }

    try {
      setLoading(true);
      // ✅ Gọi đúng format theo AuthContext (email, password, confirm, username)
      await register(email, password, confirm, username);
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

        {/* RIGHT: form */}
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

            {/* ✅ Hiển thị độ mạnh mật khẩu */}
            {strength.level && (
              <p className="password-strength" style={{ color: strength.color }}>
                Độ mạnh: {strength.level}
              </p>
            )}

            <label className="label">Xác nhận mật khẩu</label>
            <PasswordInput
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              placeholder="Nhập lại mật khẩu"
              autoComplete="new-password"
            />

            {error && <p className="error">{error}</p>}

            <button className="btn" disabled={loading}>
              {loading ? "Đang tạo tài khoản..." : "Tạo tài khoản"}
            </button>
          </form>

          <p className="signup">
            Đã có tài khoản?{" "}
            <Link className="link" to="/login">
              Đăng nhập
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

/* --- ✅ Hàm kiểm tra độ mạnh mật khẩu frontend --- */
function checkPasswordStrength(password) {
  const hasUpper = /[A-Z]/.test(password);
  const hasLower = /[a-z]/.test(password);
  const hasNumber = /[0-9]/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  const isLong = password.length >= 8;

  let score = 0;
  if (hasUpper) score++;
  if (hasLower) score++;
  if (hasNumber) score++;
  if (hasSpecial) score++;
  if (isLong) score++;

  if (score <= 2) return { level: "Yếu", color: "red" };
  if (score === 3 || score === 4) return { level: "Trung bình", color: "orange" };
  return { level: "Mạnh", color: "green" };
}
