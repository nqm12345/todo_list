import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "./Header.css";

export default function Header() {
  const { user, logout } = useAuth();
  const [showUserMenu, setShowUserMenu] = useState(false);

  return (
    <header className="simple-header">
      <div className="header-container">
        {/* Logo */}
        <div className="header-logo">
          <span className="logo-text">📝 Quản Lý Công Việc</span>
        </div>

        {/* User Menu */}
        <div className="header-right">
          <div className="header-user-menu">
            <button 
              className="user-avatar-btn"
              onClick={() => setShowUserMenu(!showUserMenu)}
            >
              <div className="user-avatar">
                {user?.username?.charAt(0).toUpperCase() || "U"}
              </div>
              <span className="user-name-display">{user?.username || "User"}</span>
              <span className="dropdown-arrow">▼</span>
            </button>

            {showUserMenu && (
              <div className="user-dropdown">
                <div className="user-dropdown-header">
                  <div className="user-avatar-large">
                    {user?.username?.charAt(0).toUpperCase() || "U"}
                  </div>
                  <div className="user-info">
                    <div className="user-name">{user?.username || "User"}</div>
                    <div className="user-email">{user?.email || "user@example.com"}</div>
                  </div>
                </div>
                <div className="user-dropdown-divider"></div>
                <button className="user-dropdown-item logout" onClick={logout}>
                  🚪 Đăng xuất
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
}

