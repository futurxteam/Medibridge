// src/pages/FacultyDashboard.jsx
import React, { useEffect, useState } from "react";
import "./styles/Dashboard.css";
import { useAuth } from "../context/AuthContext";
import {
  getFacultyJobs,
  createJob,
  getApplicationsByJob,
  createStudentByFaculty,
  getAllRecords,
  createRecord,
  updateRecord,
  deleteRecord,
  getRecordById
} from "../api/api";
import { useNavigate } from "react-router-dom";
import SidebarLayout from "../components/sideBar";
const FacultyDashboard = () => {
  const [activeTab, setActiveTab] = useState("JOBS");

  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
const [records, setRecords] = useState([]);
const [recordName, setRecordName] = useState("");
const [admissionNo, setAdmissionNo] = useState("");

const [editingId, setEditingId] = useState(null);

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

useEffect(() => {
  if (activeTab === "STUDENT_RECORDS") {
    loadRecords();
  }
}, [activeTab]);

const loadRecords = async () => {
  const res = await getAcademyRecords();
setRecords(Array.isArray(res.data) ? res.data : []);

};


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
const handleAddRecord = async (e) => {
  e.preventDefault();
  const res = await createRecord({ admissionNo, name: recordName });

  if (res.success) {
    setAdmissionNo("");
    setRecordName("");
    loadRecords();
    setMsg("Record created successfully!");
  }
};
const startEdit = async (id) => {
  const res = await getRecordById(id);
  if (res.success) {
    setEditingId(id);
    setAdmissionNo(res.data.admissionNo);
    setRecordName(res.data.name);
  }
};
const handleUpdateRecord = async (e) => {
  e.preventDefault();
  const res = await updateRecord(editingId, {
    admissionNo,
    name: recordName
  });

  if (res.success) {
    setEditingId(null);
    setAdmissionNo("");
    setRecordName("");
    loadRecords();
    setMsg("Record updated!");
  }
};
const handleDeleteRecord = async (id) => {
  if (!window.confirm("Delete this record?")) return;

  const res = await deleteRecord(id);
  if (res.success) {
    loadRecords();
    setMsg("Record deleted successfully!");
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
  <SidebarLayout
    menu={[
      { label: "All Jobs", onClick: () => setActiveTab("JOBS") },
      { label: "Post New Job", onClick: () => setActiveTab("POST") },
      { label: "Create Student", onClick: () => setActiveTab("CREATE_STUDENT") },
          { label: "Academy Student Records", onClick: () => setActiveTab("STUDENT_RECORDS") },
    ]}
  >
    <div className="page">

      {msg && <div className="msg-banner">{msg}</div>}

      {/* =========================
          TAB 1 — ALL JOBS
      ========================== */}
      {activeTab === "JOBS" && (
        <main className="section">
          <h1 className="text-4xl font-bold mb-8">All Jobs</h1>

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
                      <p className="job-eligibility">{job.eligibility}</p>
                      <p className="job-desc">{job.description}</p>
                    </div>

                    <button
                      className="view-btn"
                      onClick={() => toggleApplicants(job._id)}
                    >
                      {selectedJob === job._id ? "Hide" : "View Applicants"}
                    </button>
                  </div>

                  {selectedJob === job._id && (
                    <div className="accordion">
                      <h4>Applicants</h4>

                      {loadingApplicants ? (
                        <p>Loading...</p>
                      ) : applications.length === 0 ? (
                        <p>No applicants.</p>
                      ) : (
                        <div className="applicant-list">
                          {applications.map((app) => (
                            <div key={app._id} className="applicant-card">
                              <strong>{app.user.name}</strong>
                              <p>{app.user.email}</p>
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
      )}

      {/* =========================
          TAB 2 — POST JOB
      ========================== */}
      {activeTab === "POST" && (
        <main className="section">
          <h1 className="text-3xl font-bold mb-6">Post New Job</h1>

          <div className="form-card">
            <form onSubmit={handleCreateJob} className="form-body">

              <label>Job Title</label>
              <input value={title} onChange={(e) => setTitle(e.target.value)} />

              <label>Description</label>
              <textarea
                rows="4"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
              />

              <label>Eligibility</label>
              <select value={eligibility} onChange={(e) => setEligibility(e.target.value)}>
                <option value="BOTH">Open to All</option>
                <option value="MEDIBRIDGE_ONLY">Medibridge Only</option>
                <option value="EXTERNAL_ONLY">External Only</option>
              </select>

              <button type="submit" className="save-btn">Post Job</button>
            </form>
          </div>
        </main>
      )}

      {/* =========================
          TAB 3 — CREATE STUDENT
      ========================== */}
      {activeTab === "CREATE_STUDENT" && (
        <main className="section">
          <h1 className="text-3xl font-bold mb-6">Create Student Account</h1>

          <div className="form-card">
            <form onSubmit={handleCreateStudent} className="form-body">

              <label>Student Name</label>
              <input
                type="text"
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
              />

              <label>Email</label>
              <input
                type="email"
                value={studentEmail}
                onChange={(e) => setStudentEmail(e.target.value)}
              />

              <label>Temporary Password</label>
              <input
                type="text"
                value={studentPassword}
                onChange={(e) => setStudentPassword(e.target.value)}
              />

              <button type="submit" className="save-btn purple">Create</button>
            </form>
          </div>
        </main>
      )}
{activeTab === "STUDENT_RECORDS" && (
  <main className="section">
    <h1 className="text-3xl font-bold mb-6">Academy Student Records</h1>

    {/* CREATE / EDIT FORM */}
    <div className="form-card">
      <form
        onSubmit={editingId ? handleUpdateRecord : handleAddRecord}
        className="form-body"
      >
        <label>Admission No</label>
        <input
          type="text"
          value={admissionNo}
          onChange={(e) => setAdmissionNo(e.target.value)}
          required
        />

        <label>Student Name</label>
        <input
          type="text"
          value={recordName}
          onChange={(e) => setRecordName(e.target.value)}
          required
        />

        <button type="submit" className="save-btn">
          {editingId ? "Update Record" : "Add Record"}
        </button>
      </form>
    </div>

    {/* RECORD LIST */}
    <div className="record-list">
      {records.length === 0 ? (
        <p>No records found.</p>
      ) : (
        records.map((rec) => (
          <div key={rec._id} className="job-card">
            <h3>{rec.name}</h3>
            <p className="job-desc">Admission No: {rec.admissionNo}</p>

            <div className="record-actions">
              <button className="view-btn" onClick={() => startEdit(rec._id)}>
                Edit
              </button>
              <button className="delete-btn" onClick={() => handleDeleteRecord(rec._id)}>
                Delete
              </button>
            </div>
          </div>
        ))
      )}
    </div>
  </main>
)}

    </div>
  </SidebarLayout>
);

};

export default FacultyDashboard;
