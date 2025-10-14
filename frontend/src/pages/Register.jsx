import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";

export default function Register() {
  const nav = useNavigate();
  const { register } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const onSubmit = async (e) => {
    e.preventDefault();
    try {
      await register(email, password);
      toast.success("Đăng ký thành công, hãy đăng nhập");
      nav("/login");
    } catch {
      toast.error("Đăng ký thất bại");
    }
  };

  return (
    <div className="card">
      <h1 className="text-xl font-semibold mb-4">Đăng ký</h1>
      <form className="space-y-3" onSubmit={onSubmit}>
        <input className="input" placeholder="Email"
               value={email} onChange={(e)=>setEmail(e.target.value)} /><br/>
        <input className="input" type="password" placeholder="Mật khẩu"
               value={password} onChange={(e)=>setPassword(e.target.value)} /><br/>
        <button className="btn">Tạo tài khoản</button>
      </form>
      <p className="mt-3 text-sm">
        Đã có tài khoản? <Link className="link" to="/login">Đăng nhập</Link>
      </p>
    </div>
  );
}
