// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css";
import { register } from "../api/api"; // Clean import

const Signup = () => {
  const navigate = useNavigate();
  const [roleUi, setRoleUi] = useState("student");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const role = roleUi === "student" ? "STUDENT" :
                   roleUi === "external" ? "EXTERNAL" : "FACULTY";

      const { success, data, error } = await register({
        name,
        email,
        password,
        role,
      });

      if (!success) {
        setErrorMsg(error || "Signup failed");
        return;
      }

      // Auto login
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      navigate("/");
    } catch (err) {
      setErrorMsg("Network error. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <h2 className="auth-title">Create Your Account</h2>
        <p className="auth-sub">Join Medibridge today</p>

        <form onSubmit={handleSubmit}>
          

          <div className="auth-group">
            <label className="auth-label">Full Name</label>
            <input
              className="auth-input"
              type="text"
              placeholder="John Doe"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>

          <div className="auth-group">
            <label className="auth-label">Email Address</label>
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
              placeholder="Create a strong password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              minLength="6"
            />
          </div>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating Account..." : "Sign Up"}
          </button>
        </form>

        <p className="auth-footer">
          Already have an account?{" "}
          <span className="auth-link" onClick={() => navigate("/login")}>
            Log in here
          </span>
        </p>
      </div>
    </div>
  );
};

export default Signup;