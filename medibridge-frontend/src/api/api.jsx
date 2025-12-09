// src/api/api.jsx
const API_BASE = "http://localhost:5000";

const getAuthHeaders = () => {
  const token = localStorage.getItem("token");
  return {
    "Content-Type": "application/json",
    ...(token && { Authorization: `Bearer ${token}` }),
  };
};



const handleResponse = async (res) => {
  const data = await res.json();
  if (!res.ok) throw new Error(data.message || "Request failed");
  return data;
};

// AUTH
export const register = async (body) => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return { success: res.ok, data: await handleResponse(res).catch(() => null), error: res.ok ? null : (await res.json()).message };
};

export const login = async (body) => {
  const res = await fetch(`${API_BASE}/api/auth/login`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  const data = res.ok ? await handleResponse(res) : null;
  return { success: res.ok, data, error: res.ok ? null : (await res.json()).message };
};

export const getProfile = async () => {
  const res = await fetch(`${API_BASE}/api/auth/profile`, { headers: getAuthHeaders() });
  return { success: res.ok, data: res.ok ? await handleResponse(res) : null };
};

/* -----------------------------
   STUDENT PROFILE CRUD
------------------------------ */

// GET profile
export const getStudentProfile = async () => {
  const res = await fetch(`${API_BASE}/api/student/profile`, {
    headers: getAuthHeaders(),
  });
  return { success: res.ok, data: res.ok ? await handleResponse(res) : null };
};

// UPDATE/CREATE profile
export const updateStudentProfile = async (profile) => {
  const res = await fetch(`${API_BASE}/api/student/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(profile),
  });
  return {
    success: res.ok,
    data: res.ok ? await handleResponse(res) : null,
    error: res.ok ? null : (await res.json()).message,
  };
};


// STUDENT / EXTERNAL
export const getJobs = async () => {
  const res = await fetch(`${API_BASE}/api/student/jobs`, { headers: getAuthHeaders() });
  const data = res.ok ? await handleResponse(res) : null;
  return { success: res.ok, data };
};

export const applyToJob = async (jobId) => {
  const res = await fetch(`${API_BASE}/api/student/apply/${jobId}`, {
    method: "POST",
    headers: getAuthHeaders(),
  });
  const data = res.ok ? await handleResponse(res) : null;
  return { success: res.ok, data, error: res.ok ? null : (await res.json()).message };
};

// FACULTY
export const createJob = async (jobData) => {
  const res = await fetch(`${API_BASE}/api/faculty/jobs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData),
  });
  const data = res.ok ? await handleResponse(res) : null;
  return { success: res.ok, data, error: res.ok ? null : (await res.json()).message };
};

export const getFacultyJobs = async () => {
  const res = await fetch(`${API_BASE}/api/faculty/jobs`, { headers: getAuthHeaders() });
  const data = res.ok ? await handleResponse(res) : null;
  return { success: res.ok, data };
};

export const getApplicationsByJob = async (jobId) => {
  const res = await fetch(`${API_BASE}/api/faculty/jobs/${jobId}/applications`, {
    headers: getAuthHeaders(),
  });
  const data = res.ok ? await handleResponse(res) : null;
  return { success: res.ok, data };
};

export const createStudentByFaculty = async (studentData) => {
  const res = await fetch(`${API_BASE}/api/auth/register`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(studentData),
  });
  const data = res.ok ? await handleResponse(res) : null;
  return { success: res.ok, data, error: res.ok ? null : (await res.json()).message };
};
// src/api/api.jsx — add these
export const updateJob = async (jobId, updates) => {
  const res = await fetch(`${API_BASE}/api/faculty/jobs/${jobId}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  return handleResponse(res);
};

export const deleteJob = async (jobId) => {
  const res = await fetch(`${API_BASE}/api/faculty/jobs/${jobId}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  return handleResponse(res);
};



export const updateApplicationStatus = async (appId, status) => {
  const res = await fetch(`${API_BASE}/api/faculty/applications/${appId}/status`, {
    method: "PATCH",
    headers: getAuthHeaders(),
    body: JSON.stringify({ status }),
  });
  return handleResponse(res);
};



export const saveStudentProfile = async (body) => {
  const res = await fetch(`${API_BASE}/api/student/profile`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(body),
  });
  return await handleResponse(res);
};