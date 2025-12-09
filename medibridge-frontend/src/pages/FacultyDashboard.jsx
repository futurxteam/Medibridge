// src/pages/FacultyDashboard.jsx
import React, { useEffect, useState } from "react";
import "./styles/Dashboard.css";
import { useAuth } from "../context/AuthContext";
import {
  getFacultyJobs,
  createJob,
  getApplicationsByJob,
  createStudentByFaculty,
} from "../api/api";
import { useNavigate } from "react-router-dom";

const FacultyDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);

  const [showCreateJob, setShowCreateJob] = useState(false);
  const [showCreateStudent, setShowCreateStudent] = useState(false);

  const [selectedJob, setSelectedJob] = useState(null); // expanded card
  const [applications, setApplications] = useState([]);
  const [loadingApplicants, setLoadingApplicants] = useState(false);

  const [filter, setFilter] = useState("ALL");

  // Job form state
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [eligibility, setEligibility] = useState("BOTH");

  // Student form state
  const [studentName, setStudentName] = useState("");
  const [studentEmail, setStudentEmail] = useState("");
  const [studentPassword, setStudentPassword] = useState("");

  const [msg, setMsg] = useState("");

  // Load all jobs
  useEffect(() => {
    const fetchJobs = async () => {
      const res = await getFacultyJobs();
      if (res.success) setJobs(res.data);
      setLoading(false);
    };
    fetchJobs();
  }, []);

  // Toggle job accordion + fetch applicants
  const toggleApplicants = async (jobId) => {
    if (selectedJob === jobId) {
      setSelectedJob(null);
      setApplications([]);
      return;
    }

    setSelectedJob(jobId);
    setLoadingApplicants(true);
    setApplications([]);

    const res = await getApplicationsByJob(jobId);

    if (res.success) {
      setApplications(res.data);
    } else {
      setApplications([]);
      setMsg("Failed to load applicants");
    }

    setLoadingApplicants(false);
  };

  // Create job
  const handleCreateJob = async (e) => {
    e.preventDefault();
    const result = await createJob({ title, description, eligibility });

    if (result.success) {
      setJobs([result.data, ...jobs]);
      setTitle("");
      setDescription("");
      setEligibility("BOTH");
      setShowCreateJob(false);
      setMsg("Job posted successfully!");
    }
  };

  // Create student
  const handleCreateStudent = async (e) => {
    e.preventDefault();
    const result = await createStudentByFaculty({
      name: studentName,
      email: studentEmail,
      password: studentPassword,
      role: "STUDENT"
    });

    if (result.success) {
      setStudentName("");
      setStudentEmail("");
      setStudentPassword("");
      setShowCreateStudent(false);
      setMsg("Student account created!");
    }
  };

  const filteredApps = applications.filter((app) => {
    if (filter === "ALL") return true;
    return app.user.role === filter;
  });

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <div className="page">

      {/* NAVBAR */}
      <header className="nav">
        <div className="nav-left" onClick={() => navigate("/")}>
          <img src="/Medibridge.png" alt="Logo" className="nav-logo" />
        </div>

        <div className="nav-links">
          <strong>Faculty Portal</strong>
        </div>

        <div className="nav-right">
          <span>Hello, <strong>{user?.name}</strong></span>
          <button onClick={handleLogout} className="nav-logout-btn">Logout</button>
        </div>
      </header>

      <main className="section" style={{ maxWidth: "1200px", margin: "0 auto", padding: "2rem" }}>

        <h1 className="text-4xl font-bold mb-8">Faculty Job & Student Management</h1>

        {msg && (
          <div className="msg-banner">
            {msg}
          </div>
        )}

        {/* ACTION BUTTONS */}
        <div className="action-buttons">
          <button
            onClick={() => setShowCreateJob(!showCreateJob)}
            className="action-btn blue"
          >
            Post New Job
          </button>

          <button
            onClick={() => setShowCreateStudent(!showCreateStudent)}
            className="action-btn purple"
          >
            Create Student Account
          </button>
        </div>

        {/* CREATE JOB FORM */}
        {showCreateJob && (
          <div className="form-card">
            <h2 className="form-title">Post New Job</h2>

            <form onSubmit={handleCreateJob} className="form-body">

              <label>Job Title</label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                required
              />

              <label>Description</label>
              <textarea
                rows={4}
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                required
              />

              <label>Eligibility</label>
              <select
                value={eligibility}
                onChange={(e) => setEligibility(e.target.value)}
              >
                <option value="BOTH">Open to All</option>
                <option value="MEDIBRIDGE_ONLY">Medibridge Students Only</option>
                <option value="EXTERNAL_ONLY">External Only</option>
              </select>

              <div className="form-actions">
                <button type="submit" className="save-btn">Post Job</button>
                <button type="button" className="cancel-btn" onClick={() => setShowCreateJob(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* CREATE STUDENT */}
        {showCreateStudent && (
          <div className="form-card">
            <h2 className="form-title">Create Medibridge Student</h2>

            <form onSubmit={handleCreateStudent} className="form-body">

              <label>Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
              />

              <label>Email</label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
                required
              />

              <label>Temporary Password</label>
              <input
                type="text"
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
                required
              />

              <div className="form-actions">
                <button type="submit" className="save-btn purple">Create</button>
                <button type="button" className="cancel-btn" onClick={() => setShowCreateStudent(false)}>Cancel</button>
              </div>
            </form>
          </div>
        )}

        {/* JOB LIST */}
        <h2 className="section-title">All Jobs</h2>

        {loading ? (
          <p>Loading...</p>
        ) : jobs.length === 0 ? (
          <p>No jobs posted.</p>
        ) : (
          <div className="job-list">
            {jobs.map((job) => (
              <div key={job._id} className="job-card">

                <div className="job-header">
                  <div>
                    <h3 className="job-title">{job.title}</h3>
                    <p className="job-eligibility">{job.eligibility.replace("_", " ")}</p>
                    <p className="job-desc">{job.description}</p>
                  </div>

                  <button
                    className="view-btn"
                    onClick={() => toggleApplicants(job._id)}
                  >
                    {selectedJob === job._id ? "Hide" : "View Applicants"}
                  </button>
                </div>

                <p className="job-date">Posted: {new Date(job.createdAt).toLocaleDateString()}</p>

                {/* ACCORDION - APPLICANTS INSIDE CARD */}
                {selectedJob === job._id && (
                  <div className="accordion">
                    <div className="accordion-header">
                      <h4>Applicants</h4>

                      <select
                        value={filter}
                        onChange={(e) => setFilter(e.target.value)}
                        className="filter-select"
                      >
                        <option value="ALL">All</option>
                        <option value="STUDENT">Medibridge Students</option>
                        <option value="EXTERNAL">External</option>
                      </select>
                    </div>

                    {loadingApplicants ? (
                      <p>Loading...</p>
                    ) : filteredApps.length === 0 ? (
                      <p>No applicants.</p>
                    ) : (
                      <div className="applicant-list">
                        {filteredApps.map((app) => (
                          <div key={app._id} className="applicant-card">
                            <strong>{app.user.name}</strong>
                            <span className="role-tag">
                              {app.user.role === "STUDENT"
                                ? "Medibridge Student"
                                : "External Candidate"}
                            </span>
                            <p>Email: {app.user.email}</p>
                            <p className="date-small">
                              Applied: {new Date(app.appliedAt).toLocaleDateString()}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}

              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
};

export default FacultyDashboard;
