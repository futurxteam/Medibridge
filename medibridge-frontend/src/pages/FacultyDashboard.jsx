// src/pages/FacultyDashboard.jsx
import React, { useEffect, useState } from "react";
import "./styles/Dashboard.css";
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";
import { useNavigate } from "react-router-dom";

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        const data = await apiRequest("/api/faculty/jobs");
        if (isMounted) {
          setJobs(Array.isArray(data) ? data : data.jobs || []);
        }
      } catch (err) {
        console.error("Failed to fetch faculty jobs:", err);
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    fetchJobs();
    return () => {
      isMounted = false;
    };
  }, []);

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="page">
      <header className="nav">
        <div className="nav-left" onClick={() => navigate("/")}>
        <img
          src="/Medibridge.png"
          alt="Medibridge Logo"
          className="nav-logo"
        />

        </div>

        <nav className="nav-links">
          <span>Faculty Dashboard</span>
        </nav>

        <div className="nav-right">
          {user && (
            <div className="nav-user-chip">
              <div className="nav-user-text">
                <span>
                  Hello, <span className="nav-user-name">{user.name}</span>{" "}
                  <span className="nav-user-role">({user.role})</span>
                </span>
              </div>
              <button className="nav-logout-btn" onClick={handleLogout}>
                Logout
              </button>
            </div>
          )}
        </div>
      </header>

      <main className="section">
        <div className="section-text" style={{ marginBottom: "16px" }}>
          <h2>Your posted jobs</h2>
          <p>
            Manage and review all job postings created through your faculty or
            admin account.
          </p>
        </div>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs posted yet.</p>
        ) : (
          <div className="section-cards">
            {jobs.map((job) => (
              <div key={job._id} className="mini-card">
                <h3>{job.title}</h3>
                <p style={{ marginBottom: "6px" }}>
                  <strong>Visibility:</strong>{" "}
                  {job.eligibility === "MEDIBRIDGE_ONLY"
                    ? "Medibridge only"
                    : "Open to all"}
                </p>
                <p style={{ marginBottom: "6px" }}>{job.description}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Created on:{" "}
                  {job.createdAt
                    ? new Date(job.createdAt).toLocaleDateString()
                    : "—"}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;
