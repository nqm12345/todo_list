import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      await register(email, password, username);
      nav("/login");
    } catch (err) {
      setError("Đăng ký thất bại. Vui lòng thử lại.");
    }
  };

  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-4">Đăng ký</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input
          className="input"
          placeholder="Tên người dùng"
          value={username}
          onChange={(e) => setUsername(e.target.value)}
        /><br />

        <input
          className="input"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        /><br />

        <input
          className="input"
          type="password"
          placeholder="Mật khẩu"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        /><br />

        {error && <p className="text-red-500 text-sm">{error}</p>}

        <button className="btn">Tạo tài khoản</button>
      </form>

      <p className="mt-3 text-sm">
        Đã có tài khoản?{" "}
        <Link className="link" to="/login">
          Đăng nhập
        </Link>
      </p>
    </div>
  );
}
