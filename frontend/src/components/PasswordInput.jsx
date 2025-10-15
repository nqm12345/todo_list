// src/components/PasswordInput.jsx
import { useState } from "react";

/**
 * PasswordInput – ô mật khẩu có nút “mắt” NẰM TRONG input.
 * Chế độ: CLICK để bật/tắt xem mật khẩu (toggle).
 */
export default function PasswordInput({
  value,
  onChange,
  placeholder = "Mật khẩu",
  autoComplete = "new-password",
  id,
  name,
  className = "",
  inputClassName = "",
  "aria-label": ariaLabel = "Mật khẩu",
  disabled = false
}) {
  const [show, setShow] = useState(false);

  const toggle = () => {
    if (!disabled) setShow((s) => !s);
  };

  // Cho phép dùng phím Space/Enter để toggle (accessibility)
  const onKeyDown = (e) => {
    if (disabled) return;
    if (e.key === " " || e.key === "Enter") {
      e.preventDefault();
      setShow((s) => !s);
    }
  };

  return (
    <div className={`field ${className}`} style={{ position: "relative" }}>
      <input
        id={id}
        name={name}
        className={`input input-with-eye ${inputClassName}`}
        type={show ? "text" : "password"}
        placeholder={placeholder}
        value={value}
        onChange={onChange}
        autoComplete={autoComplete}
        aria-label={ariaLabel}
        disabled={disabled}
        style={{ paddingRight: 40 }}  // chừa chỗ cho icon bên phải
      />

      <button
        type="button"
        className="eye-toggle"
        aria-label={show ? "Ấn để ẩn mật khẩu" : "Ấn để xem mật khẩu"}
        aria-pressed={show}
        onClick={toggle}
        onKeyDown={onKeyDown}
        disabled={disabled}
      >
        {/* Đổi icon theo trạng thái show */}
        {show ? (
          // Mắt mở (đang hiển thị text)
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M12 5c-5 0-9 4.5-10 7 1 2.5 5 7 10 7s9-4.5 10-7c-1-2.5-5-7-10-7zm0 12a5 5 0 110-10 5 5 0 010 10z"/>
          </svg>
        ) : (
          // Mắt có gạch chéo (đang ẩn text)
          <svg viewBox="0 0 24 24" width="18" height="18" fill="currentColor" aria-hidden="true">
            <path d="M3 3l18 18-1.41 1.41-2.49-2.49C15.49 21 13.83 21 12 21 7 21 3 16.5 2 14c.46-1.14 1.6-2.98 3.42-4.73L1.59 4.41 3 3zm9-1c5 0 9 4.5 10 7-.34.85-1.17 2.29-2.54 3.77l-2.15-2.15A5 5 0 0012 7c-.53 0-1.04.09-1.52.25L8.3 5.07C9.37 3.99 10.63 2 12 2z"/>
          </svg>
        )}
      </button>
    </div>
  );
}
