import React, { useEffect, useState } from "react";
import { getStudentProfile, saveStudentProfile } from "../api/api";
import "./styles/Dashboard.css";

const StudentProfile = () => {
  const [form, setForm] = useState({});
  const [msg, setMsg] = useState("");

  useEffect(() => {
    load();
  }, []);

  const load = async () => {
    const p = await getStudentProfile();
    if (p) setForm(p);
  };

  const save = async () => {
    const res = await saveStudentProfile(form);
    setMsg("Profile saved");
  };

  return (
    <div className="page">
      <div className="bg-white p-8 rounded-xl shadow-lg" style={{ maxWidth: 600, margin: "0 auto" }}>
        <h2 className="text-2xl font-bold mb-6">Student Profile</h2>

        <input className="input" placeholder="Full Name"
          value={form.fullName || ""} onChange={(e) => setForm({ ...form, fullName: e.target.value })} />

        <input className="input" placeholder="Phone"
          value={form.phone || ""} onChange={(e) => setForm({ ...form, phone: e.target.value })} />

        <input className="input" placeholder="Age" type="number"
          value={form.age || ""} onChange={(e) => setForm({ ...form, age: e.target.value })} />

        <select className="input"
          value={form.sex || ""} onChange={(e) => setForm({ ...form, sex: e.target.value })}>
          <option>MALE</option>
          <option>FEMALE</option>
          <option>OTHER</option>
        </select>

        <input className="input" placeholder="Address"
          value={form.address || ""} onChange={(e) => setForm({ ...form, address: e.target.value })} />

        <input className="input" placeholder="Qualification"
          value={form.qualification || ""} onChange={(e) => setForm({ ...form, qualification: e.target.value })} />

        <input className="input" placeholder="University / Board"
          value={form.university || ""} onChange={(e) => setForm({ ...form, university: e.target.value })} />

        <input className="input" placeholder="CV Link (URL)"
          value={form.cvUrl || ""} onChange={(e) => setForm({ ...form, cvUrl: e.target.value })} />

        <button className="nav-logout-btn mt-4" onClick={save}>Save Profile</button>

        {msg && <p className="text-green-600 mt-3">{msg}</p>}
      </div>
    </div>
  );
};

export default StudentProfile;
