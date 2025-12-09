// src/components/SidebarLayout.jsx
import React from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const SidebarLayout = ({ children, menu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  return (
    <div className="layout-container">
      {/* LEFT SIDEBAR */}
      <aside className="sidebar">
        <div className="sidebar-header">
          <img src="/Medibridge.png" alt="Logo" className="sidebar-logo" />
          <h3 className="sidebar-name">{user?.name}</h3>
          <p className="sidebar-email">{user?.email}</p>
        </div>

        <nav className="sidebar-menu">
          {menu.map((item) => (
           <button
  key={item.label}
  className="sidebar-btn"
  onClick={() => {
    if (item.onClick) item.onClick();
    else if (item.path) navigate(item.path);
  }}
>
  {item.label}
</button>

          ))}

          <button
            className="sidebar-btn logout"
            onClick={() => {
              logout();
              navigate("/");
            }}
          >
            Logout
          </button>
        </nav>
      </aside>

      {/* MAIN CONTENT */}
      <main className="main-content">{children}</main>
    </div>
  );
};

export default SidebarLayout;
