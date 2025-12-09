// src/pages/Login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/api";

const Login = () => {
  const navigate = useNavigate();
  const { login: setAuth } = useAuth();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
  e.preventDefault();
  setErrorMsg("");
  setLoading(true);

  try {
    const result = await login({
      email,
      password,
      role: "STUDENT",
    });

    if (!result.success) {
      setErrorMsg(result.error || "Invalid email or password");
      setLoading(false);
      return;
    }

    // ❌ Block faculty accidentally logging in here
    if (result.data.user.role === "FACULTY") {
      setErrorMsg("Faculty must use the Faculty Login page.");
      setLoading(false);
      return;
    }

    // ✔ Allow student/external login
    setAuth(result.data.user, result.data.token);
    navigate("/student/jobs", { replace: true });

  } catch (err) {
    setErrorMsg("Network error. Please try again later.");
    console.error(err);
  } finally {
    setLoading(false);
  }
};


  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Student Login</h2>
        <p className="auth-sub">
          Welcome back
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@medibridge.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              autoFocus
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="Enter your password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

        {errorMsg && (
  <div
    style={{
      background: "#ffdddd",
      color: "#b30000",
      padding: "10px 12px",
      borderRadius: "6px",
      marginTop: "10px",
      marginBottom: "10px",
      fontSize: "14px",
      border: "1px solid #ffb3b3",
      fontWeight: "500"
    }}
  >
    {errorMsg}
  </div>
)}

          <button
            className="auth-btn"
            type="submit"
            disabled={loading}
          >
            {loading ? "Logging in..." : "Log In"}
          </button>
        </form>

        <p className="auth-footer">
          New here?{" "}
          <span className="auth-link" onClick={() => navigate("/signup")}>
            Create an account
          </span>
        </p>

        
      </div>
    </div>
  );
};

export default Login;