// src/pages/StudentDashboard.jsx
import React, { useEffect, useState } from "react";
import "./styles/Dashboard.css";
import { useAuth } from "../context/AuthContext";
import { getJobs, getStudentProfile, updateStudentProfile, applyToJob } from "../api/api";
import SidebarLayout from "../components/sideBar";

const StudentDashboard = () => {
  const { user, logout } = useAuth();

  const [activeTab, setActiveTab] = useState("jobs"); // ← controls visible page
  const [jobs, setJobs] = useState([]);
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [applyingTo, setApplyingTo] = useState(null);
  const [appliedJobs, setAppliedJobs] = useState(new Set());
  const [message, setMessage] = useState({ text: "", type: "" });

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
        setAppliedJobs(
          new Set(j.data.filter((job) => job.hasApplied).map((job) => job._id))
        );
      }

      setLoading(false);
    };

    load();
  }, []);

const handleApply = async (job) => {
  if (!isProfileComplete) {
    setMessage({
      text: "Complete your profile before applying to jobs.",
      type: "error",
    });
    return;
  }

  setApplyingTo(job._id);

  // 1️⃣ Record application in backend
  const res = await applyToJob(job._id);

  if (!res.success) {
    setApplyingTo(null);
    setMessage({ text: res.error, type: "error" });
    return;
  }

  // 2️⃣ Update UI (mark as applied)
  setAppliedJobs((prev) => new Set(prev).add(job._id));

  setMessage({ text: "Application submitted!", type: "success" });

  // 3️⃣ Open Gmail draft (same as before)
  const email = "hr@company.com";
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

  const gmailUrl = `https://mail.google.com/mail/?view=cm&fs=1&to=${encodeURIComponent(
    email
  )}&su=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;

  window.open(gmailUrl, "_blank");

  setApplyingTo(null);
};


  const JobsComponent = () => (
    <div className="page">
      <h1 className="text-4xl font-bold mb-4">Job Opportunities</h1>

      {!isProfileComplete && (
        <div className="mb-6 p-4 bg-yellow-100 border border-yellow-400 text-yellow-800 rounded-lg">
          <strong>Your profile is incomplete.</strong>
          You must complete it to apply for jobs.
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

                <div className="job-meta-ui">
                  <div>
                    <strong>Posted:</strong>{" "}
                    {new Date(job.createdAt).toLocaleDateString()}
                  </div>
                
                </div>

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
    </div>
  );

 /* ----------------------------------------------------
   STUDENT PROFILE COMPONENT — FIXED
---------------------------------------------------- */
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

  // Refresh profile after update
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
        {/* PHONE */}
        <label>Phone</label>
        <input
          className="profile-input"
          value={form.phone}
          onChange={(e) => setForm({ ...form, phone: e.target.value })}
          placeholder="Enter phone number"
        />

        {/* ADDRESS */}
        <label>Address</label>
        <input
          className="profile-input"
          value={form.address}
          onChange={(e) => setForm({ ...form, address: e.target.value })}
          placeholder="Enter address"
        />

        {/* AGE */}
        <label>Age</label>
        <input
          type="number"
          className="profile-input"
          value={form.age}
          onChange={(e) => setForm({ ...form, age: e.target.value })}
          placeholder="Enter age"
        />

        {/* SEX */}
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

        {/* QUALIFICATION */}
        <label>Qualification</label>
        <input
          className="profile-input"
          value={form.qualification}
          onChange={(e) => setForm({ ...form, qualification: e.target.value })}
          placeholder="BSc Nursing, Diploma etc."
        />

        {/* UNIVERSITY */}
        <label>University</label>
        <input
          className="profile-input"
          value={form.university}
          onChange={(e) => setForm({ ...form, university: e.target.value })}
          placeholder="Enter university"
        />

        {/* CV UPLOAD */}
        <label>Upload CV (PDF)</label>
        <input
          type="file"
          accept="application/pdf"
          onChange={(e) => setCvFile(e.target.files[0])}
          className="profile-input-file"
        />

        {profile?.cvUrl && (
          <p className="mt-2 text-blue-600 underline">
            <a 
  href={profile.cvUrl} 
  target="_blank" 
  rel="noopener noreferrer"
>
  View CV
</a>

          </p>
        )}

        <button className="profile-save-btn" onClick={handleSave} disabled={saving}>
          {saving ? "Saving..." : "Save Profile"}
        </button>
      </div>
    </div>
  );
};



  return (
    <SidebarLayout
      menu={[
        { label: "Job Opportunities", tab: "jobs", onClick: () => setActiveTab("jobs") },
        { label: "My Profile", tab: "profile", onClick: () => setActiveTab("profile") },
      ]}
    >
      {activeTab === "jobs" && <JobsComponent />}
      {activeTab === "profile" && <ProfileComponent />}
    </SidebarLayout>
  );
};

export default StudentDashboard;
