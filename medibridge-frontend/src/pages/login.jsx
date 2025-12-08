// src/pages/login.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";

const API_BASE = "http://localhost:5000";

const Login = () => {
  const navigate = useNavigate();

  const [roleUi, setRoleUi] = useState("student"); // "student" | "external"
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  // Map UI role to backend role
  const mapRoleToBackend = (uiRole) => {
    if (uiRole === "student") return "STUDENT";
    if (uiRole === "external") return "EXTERNAL";
    return "STUDENT";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const backendRole = mapRoleToBackend(roleUi);

      const res = await fetch(`${API_BASE}/api/auth/login`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          password,
          role: backendRole,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Login failed");
        setLoading(false);
        return;
      }

      // Save auth data
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // For now, send everyone to home. Later we can route based on role.
      navigate("/");
    } catch (err) {
      console.error(err);
      setErrorMsg("Something went wrong. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Login to Medibridge</h2>
        <p className="auth-sub">Choose how you want to log in.</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label className="auth-label">I am a:</label>
            <select
              className="auth-input"
              value={roleUi}
              onChange={(e) => setRoleUi(e.target.value)}
            >
              <option value="student">FutureAce / Medibridge Student</option>
              <option value="external">External Candidate</option>
            </select>
          </div>

          <div className="auth-group">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="you@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">Password</label>
            <input
              className="auth-input"
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

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
