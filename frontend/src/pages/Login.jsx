import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import "./Login.css";
import PasswordInput from "../components/PasswordInput";
import { AnhTest as heroImg } from "../assets"; // hoặc dùng new URL giống Register

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail]       = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading]   = useState(false);
  const [error, setError]       = useState("");
  const [remember, setRemember] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      await login(email, password, remember);
      nav("/");
    } catch (err) {
      setError("Sai email hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      <div className="login-card">
        <div className="login-hero" aria-hidden>
          <img src={heroImg} alt="Hero" className="hero-image" />
          <div className="hero-overlay">
            <h2>Welcome back</h2>
            <p>Quản lý công việc, hoàn thành mục tiêu mỗi ngày.</p>
          </div>
        </div>

        <div className="login-form">
          <h1 className="title">Đăng nhập</h1>
          <form onSubmit={onSubmit}>
            <label className="label">Email</label>
            <input
              className="input"
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
              autoComplete="current-password"
            />

            {error && <p className="error">{error}</p>}

            <div style={{display:'flex',alignItems:'center',gap:8,marginTop:6}}>
              <input
                id="remember"
                type="checkbox"
                checked={remember}
                onChange={(e)=>setRemember(e.target.checked)}
              />
              <label htmlFor="remember" style={{fontSize:13,color:'#6b7280'}}>
                Ghi nhớ đăng nhập
              </label>
            </div>

            <button className="btn" disabled={loading} style={{marginTop:12}}>
              {loading ? "Đang đăng nhập..." : "Đăng nhập"}
            </button>
          </form>

          <p className="signup">
            Chưa có tài khoản? <Link className="link" to="/register">Đăng ký</Link>
          </p>
        </div>
      </div>
    </div>
  );
}
