import { useState } from "react";
import { Eye, EyeOff } from "lucide-react"; // nếu chưa có lucide-react: npm i lucide-react

export default function PasswordInput({ value, onChange, placeholder, autoComplete }) {
  const [show, setShow] = useState(false);

  return (
    <div style={{ position: "relative", width: "100%" }}>
      <input
        type={show ? "text" : "password"}
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        autoComplete={autoComplete}
        className="input" // dùng class input từ CSS bạn đã có
        style={{ paddingRight: "40px" }} // chừa chỗ cho icon
      />

      <button
        type="button"
        onClick={() => setShow(!show)}
        style={{
          position: "absolute",
          right: "10px",
          top: "50%",
          transform: "translateY(-50%)",
          border: "none",
          background: "transparent",
          cursor: "pointer",
          padding: 0,
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
        tabIndex={-1} // không lấy focus khi tab
      >
        {show ? <EyeOff size={18} color="#6b7280" /> : <Eye size={18} color="#6b7280" />}
      </button>
    </div>
  );
}
