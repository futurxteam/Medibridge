// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import "./styles/Dashboard.css";
import { useAuth } from "../context/AuthContext";
import { getJobs, getStudentProfile, updateStudentProfile, applyToJob } from "../api/api";
import SidebarLayout from "../components/sideBar";

const StudentDashboard = () => {
  const { user } = useAuth();

  // Modal + custom message
  const [showModal, setShowModal] = useState(false);
  const [currentJob, setCurrentJob] = useState(null);
  const [customMessage, setCustomMessage] = useState("");
  const [reminder, setReminder] = useState("");

  // Dashboard state
  const [activeTab, setActiveTab] = useState("jobs");
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [message, setMessage] = useState({ text: "", type: "" });
  const [showCvAlert, setShowCvAlert] = useState(false);

  const isProfileComplete =
    profile &&
    ["phone", "address", "age", "sex", "qualification", "university", "cvUrl"].every(
      (f) => profile[f] && profile[f] !== ""
    );

  useEffect(() => {
    const load = async () => {
      const p = await getStudentProfile();
      if (p.success) setProfile(p.data);

      const j = await getJobs();
      if (j.success) {
        setJobs(j.data);
        // backend should send hasApplied for each job
        setAppliedJobs(new Set(j.data.filter((job) => job.hasApplied).map((job) => job._id)));
      }

      setLoading(false);
    };

    load();
  }, []);

  // -------------------------------
  // OPEN MODAL (Instead of applying directly)
  // -------------------------------
  const handleApply = (job) => {
    if (!isProfileComplete) {
      setMessage({
        text: "Complete your profile before applying to jobs.",
        type: "error",
      });
      return;
    }

    setCurrentJob(job);

    setCustomMessage(
`Hello Recruiter,

I am interested in applying for the position of ${job.title}. Please find my profile details attached.

Regards,
${user.name}`
    );

    setShowModal(true);
  };

  // -------------------------------
  // FINAL APPLY (After user edits message)
  // -------------------------------
 const handleFinalApply = async () => {
  if (!isProfileComplete) {
    setMessage({
      text: "Complete your profile before applying.",
      type: "error",
    });
    return;
  }

  if (!currentJob) return;

  setApplyingTo(currentJob._id);

  // Only save application first time — skip backend if already applied
  if (!appliedJobs.has(currentJob._id)) {
    const res = await applyToJob(currentJob._id);

    if (!res.success) {
      setApplyingTo(null);
      setMessage({ text: res.error, type: "error" });
      return;
    }

    // mark applied
    setAppliedJobs(prev => new Set(prev).add(currentJob._id));
  }

  // ⭐ SHOW CV ALERT for 3 seconds BEFORE opening Gmail
  setReminder("⚠️ Don’t forget to attach your CV!");
  
  setTimeout(() => {
    // Open Gmail ONLY AFTER 3 SEC DELAY
    const gmailUrl =
      `https://mail.google.com/mail/?view=cm&fs=1` +
      `&to=${encodeURIComponent(currentJob.recruiterEmail)}` +
      `&su=${encodeURIComponent("Job Application Regarding " + currentJob.title)}` +
      `&body=${encodeURIComponent(customMessage)}`;

    window.open(gmailUrl, "_blank");

    // clear and close modal
    setReminder("");
    setShowModal(false);
    setApplyingTo(null);
  }, 3000);
};



  // -------------------------------
  // JOBS COMPONENT
  // -------------------------------
  const JobsComponent = () => (
    <div className="page">
      <h1 className="text-4xl font-bold mb-4">Job Opportunities</h1>

      {!isProfileComplete && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg">
          <strong>Your profile is incomplete.</strong>
          Please complete it before applying.
        </div>
      )}

      {message.text && (
        <div
          className={`mb-4 p-4 text-center text-white rounded-md ${
            message.type === "success" ? "bg-green-600" : "bg-red-600"
          }`}
        >
          {message.text}
        </div>
      )}

      {reminder && (
        <div className="mb-3 p-3 bg-blue-100 text-blue-800 rounded">
          {reminder}
        </div>
      )}
      {showCvAlert && (
  <div className="cv-alert-box">
    ⚠️ <strong>Don’t forget to attach your CV before sending the email!</strong>
  </div>
)}


      {loading ? (
        <p>Loading jobs...</p>
      ) : (
        <div className="job-grid">
          {jobs.map((job) => {
            const isApplied = appliedJobs.has(job._id);
            const isApplying = applyingTo === job._id;

            return (
              <div key={job._id} className="job-card-ui">
                <div className="job-header">
                  <h3 className="job-title-ui">{job.title}</h3>
                  {job.eligibility === "MEDIBRIDGE_ONLY" && (
                    <span className="job-badge">Exclusive</span>
                  )}
                </div>

                <p className="job-desc">{job.description}</p>
                <strong>Email:</strong>{" "} <p className="job-desc">{job.recruiterEmail}</p>
                <strong>Phone:</strong>{" "}   <p className="job-desc">{job.phone}</p>

                <div className="job-meta-ui">
                  <strong>Posted:</strong>{" "}
                  {new Date(job.createdAt).toLocaleDateString()}
                </div>

                <div className="job-footer">
                  {isApplied ? (
                    <button
                      className="job-btn"
                      onClick={() => handleApply(job)}
                    >
                      Marked as applied — click if you haven't sent the email
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
    </div>
  );

  // -------------------------------
  // PROFILE COMPONENT
  // -------------------------------
  const ProfileComponent = () => {
    const [form, setForm] = useState({
      phone: profile?.phone || "",
      address: profile?.address || "",
      age: profile?.age || "",
      sex: profile?.sex || "",
      qualification: profile?.qualification || "",
      university: profile?.university || "",
    });

    const [cvFile, setCvFile] = useState(null);
    const [saving, setSaving] = useState(false);
    const [localMsg, setLocalMsg] = useState("");

    const refreshProfile = async () => {
      const res = await getStudentProfile();
      if (res.success) setProfile(res.data);
    };

    const handleSave = async () => {
      setSaving(true);
      setLocalMsg("");

      const fd = new FormData();
      Object.keys(form).forEach((key) => fd.append(key, form[key]));
      if (cvFile) fd.append("cv", cvFile);

      const res = await updateStudentProfile(fd);

      if (res.success) {
        await refreshProfile();
        setLocalMsg("Profile updated successfully!");
        setMessage({ text: "Profile updated!", type: "success" });
      } else {
        setLocalMsg(res.error || "Update failed");
        setMessage({ text: res.error, type: "error" });
      }

      setSaving(false);
    };

    return (
      <div className="page">
        <h1 className="text-4xl font-bold mb-4">My Profile</h1>

        {localMsg && (
          <div
            className={`p-3 mb-3 rounded ${
              localMsg.includes("success")
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            }`}
          >
            {localMsg}
          </div>
        )}

        <div className="profile-card">
          <label>Phone</label>
          <input
            className="profile-input"
            value={form.phone}
            onChange={(e) => setForm({ ...form, phone: e.target.value })}
          />

          <label>Address</label>
          <input
            className="profile-input"
            value={form.address}
            onChange={(e) => setForm({ ...form, address: e.target.value })}
          />

          <label>Age</label>
          <input
            type="number"
            className="profile-input"
            value={form.age}
            onChange={(e) => setForm({ ...form, age: e.target.value })}
          />

          <label>Sex</label>
          <select
            className="profile-input"
            value={form.sex}
            onChange={(e) => setForm({ ...form, sex: e.target.value })}
          >
            <option value="">Select gender</option>
            <option>Male</option>
            <option>Female</option>
            <option>Other</option>
          </select>

          <label>Qualification</label>
          <input
            className="profile-input"
            value={form.qualification}
            onChange={(e) => setForm({ ...form, qualification: e.target.value })}
          />

          <label>University</label>
          <input
            className="profile-input"
            value={form.university}
            onChange={(e) =>
              setForm({ ...form, university: e.target.value })
            }
          />

          <label>Upload CV (PDF)</label>
          <input
            type="file"
            accept="application/pdf"
            onChange={(e) => setCvFile(e.target.files[0])}
          />

          {profile?.cvUrl && (
            <a
              href={profile.cvUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 text-blue-600 underline block"
            >
              View CV
            </a>
          )}

          <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
            {saving ? "Saving..." : "Save Profile"}
          </button>
        </div>
      </div>
    );
  };

  return (
    <>
      {/* Global Modal */}
      {showModal && (
        <div className="modal-overlay">
          <div className="modal-box">
            <h2 className="modal-title">Customize Your Message</h2>

            <textarea
              className="modal-textarea"
              value={customMessage}
              onChange={(e) => setCustomMessage(e.target.value)}
            />

            {reminder && (
              <p className="reminder-msg">{reminder}</p>
            )}

            <div className="modal-buttons">
              <button className="modal-cancel" onClick={() => setShowModal(false)}>
                Cancel
              </button>
              <button className="modal-apply" onClick={handleFinalApply}>
                Apply
              </button>
            </div>
          </div>
        </div>
      )}

      <SidebarLayout
        menu={[
          { label: "Job Opportunities", tab: "jobs", onClick: () => setActiveTab("jobs") },
          { label: "My Profile", tab: "profile", onClick: () => setActiveTab("profile") },
        ]}
      >
        {activeTab === "jobs" && <JobsComponent />}
        {activeTab === "profile" && <ProfileComponent />}
      </SidebarLayout>
    </>
  );
};

export default StudentDashboard;
