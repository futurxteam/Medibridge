// src/pages/FacultyLogin.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/api"; // using your clean api.jsx

const FacultyLogin = () => {
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
        role: "FACULTY", // forced — this page only allows faculty
      });

      if (!result.success) {
        setErrorMsg(result.error || "Invalid credentials");
        setLoading(false);
        return;
      }

      // Save auth state
      setAuth(result.data.user, result.data.token);

      // Redirect to faculty dashboard
      navigate("/faculty/dashboard", { replace: true });
    } catch (err) {
      console.error("Faculty login error:", err);
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card" style={{ maxWidth: "420px" }}>
        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-gray-800">Faculty Portal</h1>
          <p className="text-sm text-gray-600 mt-2">
            Medibridge / FutureAce Staff Only
          </p>
        </div>

        <h2 className="auth-title">Faculty Login</h2>
        <p className="auth-sub">
          Restricted access • Faculty accounts are created by admin only
        </p>

        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label className="auth-label">Email</label>
            <input
              className="auth-input"
              type="email"
              placeholder="faculty@medibridge.com"
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

          {errorMsg && <p className="auth-error">{errorMsg}</p>}

          <button
            className="auth-btn"
            type="submit"
            disabled={loading}
            style={{ backgroundColor: "#1e40af" }} // slightly darker blue for authority
          >
            {loading ? "Authenticating..." : "Login as Faculty"}
          </button>
        </form>

        {/* No signup link — accounts are admin-created only */}
        <div className="mt-8 text-center">
          <p className="text-xs text-gray-500">
            Faculty accounts are created by the Medibridge administration.<br />
            Contact <strong>admin@medibridge.com</strong> if you need access.
          </p>
        </div>

       =
      </div>
    </div>
  );
};

export default FacultyLogin;