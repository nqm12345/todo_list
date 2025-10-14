import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Login() {
  const nav = useNavigate();
  const { login } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await login(email, password);
      toast.success("Đăng nhập thành công");
      nav("/");
    } catch {
      toast.error("Sai email hoặc mật khẩu");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-4">Đăng nhập</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="input" placeholder="Email"
               value={email} onChange={(e)=>setEmail(e.target.value)} /> <br/>

        <input className="input" type="password" placeholder="Mật khẩu"
               value={password} onChange={(e)=>setPassword(e.target.value)} /><br/>
        <button className="btn" disabled={loading}>
          {loading ? "Đang đăng nhập..." : "Đăng nhập"}
        </button>
      </form>
      <p className="mt-3 text-sm">
        Chưa có tài khoản? <Link className="link" to="/register">Đăng ký</Link>
      </p>
    </div>
  );
}
