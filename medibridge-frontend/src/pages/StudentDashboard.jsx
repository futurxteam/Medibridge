// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import "./styles/Dashboard.css";
import { useAuth } from "../context/AuthContext";
import { getJobs, applyToJob, getStudentProfile } from "../api/api";
import { useNavigate } from "react-router-dom";

const StudentDashboard = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [message, setMessage] = useState({ text: "", type: "" });

  // Profile must include all fields
  const isProfileComplete =
    profile &&
    ["phone", "address", "age", "sex", "qualification", "university", "cvUrl"].every(
      (f) => profile[f] && profile[f] !== ""
    );

  // Load jobs + profile
  useEffect(() => {
    const load = async () => {
      const p = await getStudentProfile();
      if (p.success) setProfile(p.data);

      const j = await getJobs();
      if (j.success) {
        setJobs(j.data);
        setAppliedJobs(
          new Set(j.data.filter((job) => job.hasApplied).map((job) => job._id))
        );
      }

      setLoading(false);
    };

    load();
  }, []);

  // const handleApply = async (jobId) => {
  //   if (!isProfileComplete) {
  //     setMessage({
  //       text: "Complete your profile before applying to jobs.",
  //       type: "error",
  //     });
  //     return;
  //   }

  //   setApplyingTo(jobId);

  //   const result = await applyToJob(jobId);
  //   if (result.success) {
  //     setAppliedJobs((prev) => new Set(prev).add(jobId));
  //     setMessage({ text: "Applied successfully!", type: "success" });
  //   } else {
  //     setMessage({ text: result.error, type: "error" });
  //   }

  //   setTimeout(() => setMessage({ text: "", type: "" }), 3000);
  //   setApplyingTo(null);
  // };

const handleApply = (job) => {
  if (!isProfileComplete) {
    setMessage({
      text: "Complete your profile before applying to jobs.",
      type: "error",
    });
    return;
  }

  const email = "hr@company.com"; // change to your HR email

  const subject = `Application for ${job.title}`;

  const body = `
Hello,

I would like to apply for the role: ${job.title}.

--- JOB DETAILS ---
Title: ${job.title}
Description: ${job.description}

--- MY PROFILE ---
Name: ${user.name}
Email: ${user.email}
Phone: ${profile.phone}
Age: ${profile.age}
Sex: ${profile.sex}
Qualification: ${profile.qualification}
University: ${profile.university}
CV Link: ${profile.cvUrl}

Regards,
${user.name}
  `;

  // Encode
  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  // Open Gmail in new tab
  window.open(gmailUrl, "_blank");
};

  const handleLogout = () => {
    logout();
    navigate("/", { replace: true });
  };

  return (
    <div className="page">

      {/* HEADER */}
      <header className="nav">
        <div className="nav-left" onClick={() => navigate("/")}>
          <img src="/Medibridge.png" alt="Logo" className="nav-logo" />
        </div>

        <div className="nav-links">Job Portal</div>

        <div className="nav-right">
          <div className="nav-user-chip">
            Hello, <strong>{user?.name}</strong>
            <button className="nav-logout-btn" onClick={handleLogout}>
              Logout
            </button>
          </div>
        </div>
      </header>

      <main className="section" style={{ maxWidth: 1200, margin: "0 auto", padding: "1rem" }}>
        <h1 className="text-4xl font-bold mb-2">Job Opportunities</h1>

        {/* PROFILE WARNING */}
        {!isProfileComplete && (
          <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg">
            <strong>Your profile is incomplete.</strong>  
            You must complete it to apply for jobs.
            <button
              onClick={() => navigate("/student/profile")}
              className="ml-4 px-4 py-2 bg-yellow-500 text-white rounded-md"
            >
              Complete Profile
            </button>
          </div>
        )}

        {/* TOAST MESSAGE */}
        {message.text && (
          <div
            className={`mb-4 p-4 text-center text-white rounded-md ${
              message.type === "success" ? "bg-green-600" : "bg-red-600"
            }`}
          >
            {message.text}
          </div>
        )}

        {/* JOB LIST */}
        
{loading ? (
  <p className="text-gray-500 text-center">Loading jobs...</p>
) : (
  <div className="job-grid">
    {jobs.map((job) => {
      const isApplied = appliedJobs.has(job._id);
      const isApplying = applyingTo === job._id;

      return (
        <div key={job._id} className="job-card-ui">
          
          {/* TOP SECTION */}
          <div className="job-header">
            <h3 className="job-title-ui">{job.title}</h3>

            {job.eligibility === "MEDIBRIDGE_ONLY" && (
              <span className="job-badge">Exclusive</span>
            )}
          </div>

          {/* DESCRIPTION */}
          <p className="job-desc">{job.description}</p>

          {/* META */}
          <div className="job-meta-ui">
            <div>
              <strong>Posted:</strong>{" "}
              {new Date(job.createdAt).toLocaleDateString()}
            </div>
            <div>
              <strong>By:</strong> {job.postedBy?.name || "Faculty"}
            </div>
          </div>

          {/* BUTTON */}
          <div className="job-footer">
            {isApplied ? (
              <button className="job-btn-disabled" disabled>
                Already Applied
              </button>
            ) : (
              <button
                onClick={() => handleApply(job)}
                disabled={isApplying || !isProfileComplete}
                className={
                  !isProfileComplete
                    ? "job-btn-disabled"
                    : isApplying
                    ? "job-btn-loading"
                    : "job-btn"
                }
              >
                {isApplying ? "Processing..." : "Apply Now"}
              </button>
            )}
          </div>

        </div>
      );
    })}
  </div>
)}


      </main>
    </div>
  );
};

export default StudentDashboard;
