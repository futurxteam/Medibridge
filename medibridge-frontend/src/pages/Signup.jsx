// src/pages/Signup.jsx
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/Login.css"; // or "./styles/Login.css" if you're reusing

const API_BASE = "http://localhost:5000";

const Signup = () => {
  const navigate = useNavigate();

  const [roleUi, setRoleUi] = useState("student"); // "student" | "external" | "faculty"
  const [isMedibridgeStudentUi, setIsMedibridgeStudentUi] = useState("yes");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errorMsg, setErrorMsg] = useState("");
  const [loading, setLoading] = useState(false);

  const mapRoleToBackend = (uiRole) => {
    if (uiRole === "student") return "STUDENT";
    if (uiRole === "external") return "EXTERNAL";
    if (uiRole === "faculty") return "FACULTY";
    return "STUDENT";
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMsg("");
    setLoading(true);

    try {
      const backendRole = mapRoleToBackend(roleUi);
      const isMedibridgeStudent =
        backendRole === "STUDENT" ? isMedibridgeStudentUi === "yes" : false;

      const res = await fetch(`${API_BASE}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name,
          email,
          password,
          role: backendRole,
          isMedibridgeStudent,
        }),
      });

      const data = await res.json();

      if (!res.ok) {
        setErrorMsg(data.message || "Signup failed");
        setLoading(false);
        return;
      }

      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));

      // After signup, send them home (later: send based on role)
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
        <h2 className="auth-title">Create an account</h2>
        <p className="auth-sub">Sign up as a student, external candidate, or faculty.</p>

        <form onSubmit={handleSubmit}>
          <div className="auth-group">
            <label className="auth-label">Register as:</label>
            <select
              className="auth-input"
              value={roleUi}
              onChange={(e) => setRoleUi(e.target.value)}
            >
              <option value="student">FutureAce / Medibridge Student</option>
              <option value="external">External Candidate</option>
              <option value="faculty">Faculty</option>
            </select>
          </div>

          {roleUi === "student" && (
            <div className="auth-group">
              <label className="auth-label">
                Are you a Medibridge / FutureAce student?
              </label>
              <select
                className="auth-input"
                value={isMedibridgeStudentUi}
                onChange={(e) => setIsMedibridgeStudentUi(e.target.value)}
              >
                <option value="yes">Yes</option>
                <option value="no">No</option>
              </select>
            </div>
          )}

          <div className="auth-group">
            <label className="auth-label">Full name</label>
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
              placeholder="Create password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          {errorMsg && <p className="auth-error">{errorMsg}</p>}

          <button className="auth-btn" type="submit" disabled={loading}>
            {loading ? "Creating account..." : "Create account"}
          </button>
        </form>

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
