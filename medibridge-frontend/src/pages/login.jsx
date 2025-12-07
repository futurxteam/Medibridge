// src/pages/login.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

const Login = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login to Medibridge</h2>
        <p className="auth-sub">Select your role and continue</p>

        <div className="auth-group">
          <label className="auth-label">I am a:</label>
          <select className="auth-input">
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="auth-group">
          <label className="auth-label">Email</label>
          <input
            className="auth-input"
            type="email"
            placeholder="you@example.com"
          />
        </div>

        <div className="auth-group">
          <label className="auth-label">Password</label>
          <input
            className="auth-input"
            type="password"
            placeholder="••••••••"
          />
        </div>

        <button className="auth-btn" onClick={() => alert("Login clicked")}>
          Login
        </button>

        <p className="auth-footer">
          Don’t have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/signup")}>
            Sign up
          </span>
        </p>
      </div>
    </div>
  );
};

export default Login;
