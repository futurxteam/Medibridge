// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import "./styles/Home.css"; // reuse same dark theme + buttons
import { useAuth } from "../context/AuthContext";
import { apiRequest } from "../api/client";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  // Fetch student jobs
  useEffect(() => {
    let isMounted = true;

    const fetchJobs = async () => {
      try {
        const data = await apiRequest("/api/student/jobs");
        // Expecting an array of jobs
        if (isMounted) {
          setJobs(Array.isArray(data) ? data : data.jobs || []);
        }
      } catch (err) {
        console.error("Failed to fetch student jobs:", err);
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
      {/* Same header style */}
      <header className="nav">
        <div className="nav-left" onClick={() => navigate("/")}>
        <img src="/Medibridge.png" alt="Medibridge Logo" />
        </div>

        <nav className="nav-links">
          <span>Student Dashboard</span>
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
          <h2>Your job opportunities</h2>
          <p>
            Here are roles you can apply to as a Medibridge student. Medibridge-only
            jobs are highlighted.
          </p>
        </div>

        {loading ? (
          <p>Loading jobs...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs available right now. Please check back later.</p>
        ) : (
          <div className="section-cards">
            {jobs.map((job) => (
              <div key={job._id} className="mini-card">
                <h3>{job.title}</h3>
                <p style={{ marginBottom: "6px" }}>
                  <strong>Company:</strong> {job.company || job.companyName}
                </p>
                <p style={{ marginBottom: "6px" }}>{job.description}</p>
                <p style={{ fontSize: "0.8rem", color: "var(--text-muted)" }}>
                  Type:{" "}
                  {job.eligibility === "MEDIBRIDGE_ONLY"
                    ? "Medibridge only"
                    : "Open to all"}
                </p>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default StudentDashboard;
