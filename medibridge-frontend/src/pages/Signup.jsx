// src/pages/Signup.jsx
import React from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css"; // reuse same styling

const Signup = () => {
  const navigate = useNavigate();

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create an account</h2>
        <p className="auth-sub">Sign up as a student or admin</p>

        <div className="auth-group">
          <label className="auth-label">Register as:</label>
          <select className="auth-input">
            <option value="student">Student</option>
            <option value="admin">Admin</option>
          </select>
        </div>

        <div className="auth-group">
          <label className="auth-label">Full Name</label>
          <input className="auth-input" type="text" placeholder="John Doe" />
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
            placeholder="Create password"
          />
        </div>

        <button className="auth-btn" onClick={() => alert("Account created!")}>
          Create account
        </button>

        <p className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Login
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;
