// src/components/SidebarLayout.jsx
import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "./Sidebar.css";

const SidebarLayout = ({ children, menu }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  const toggleSidebar = () => setIsSidebarOpen(!isSidebarOpen);
  const closeSidebar = () => setIsSidebarOpen(false);

  return (
    <>
      {/* Mobile Hamburger Button */}
      <button
        className="mobile-menu-btn"
        onClick={toggleSidebar}
        aria-label="Toggle menu"
      >
        <span></span>
        <span></span>
        <span></span>
      </button>

      {/* Overlay (click to close on mobile) */}
      {isSidebarOpen && (
        <div
          className="sidebar-overlay"
          onClick={closeSidebar}
        ></div>
      )}

      <div className="layout-container">
        {/* LEFT SIDEBAR */}
        <aside className={`sidebar ${isSidebarOpen ? "active" : ""}`}>
          <div className="sidebar-header">
            <img src="/Medibridge.png" alt="Logo" className="sidebar-logo" />
            <h3 className="sidebar-name">{user?.name || "User"}</h3>
            <p className="sidebar-email">{user?.email || "user@example.com"}</p>
          </div>

          <nav className="sidebar-menu">
            {menu.map((item) => (
              <button
                key={item.label}
                className="sidebar-btn"
                onClick={() => {
                  if (item.onClick) item.onClick();
                  else if (item.path) {
                    navigate(item.path);
                    closeSidebar(); // Close sidebar on mobile after navigation
                  }
                }}
              >
                {item.icon && <span className="menu-icon">{item.icon}</span>}
                {item.label}
              </button>
            ))}

            <button
              className="sidebar-btn logout"
              onClick={() => {
                logout();
                navigate("/");
                closeSidebar();
              }}
            >
              Logout
            </button>
          </nav>
        </aside>

        {/* MAIN CONTENT */}
        <main className="main-content">
          {children}
        </main>
      </div>
    </>
  );
};

export default SidebarLayout;