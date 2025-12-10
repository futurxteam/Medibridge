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
  try {
    const res = await fetch(`${API_BASE}/api/auth/register`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    });

    const data = await res.json();

    // Extract proper message
    const errorMessage =
      data?.message ||
      data?.error ||
      "Something went wrong. Please try again.";

    return {
      success: res.ok,
      data: res.ok ? data : null,
      error: res.ok ? null : errorMessage
    };

  } catch (err) {
    return { success: false, error: "Network error" };
  }
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
export const updateStudentProfile = async (formData) => {
  const res = await fetch(`${API_BASE}/api/student/profile`, {
    method: "PUT",
    headers: {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
      // ❌ DO NOT SET CONTENT-TYPE → browser will set multipart boundary
    },
    body: formData,
  });

  const data = await res.json();
  return { success: res.ok, data, error: res.ok ? null : data.message };
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

  const json = await res.json(); // parse ONCE

  return {
    success: res.ok,
    data: res.ok ? json : null,
    error: res.ok ? null : json.message || "Something went wrong",
  };
};

// FACULTY
export const createJob = async (jobData) => {
  const res = await fetch(`${API_BASE}/api/faculty/jobs`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(jobData),
  });

  const json = await res.json(); // parse ONCE

  return {
    success: res.ok,
    data: res.ok ? json : null,
    error: res.ok ? null : json.message
  };
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

  const json = await res.json();

  return {
    success: res.ok,
    data: res.ok ? json : null,
    error: res.ok ? null : json.message
  };
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

/* -------------------------------
   SEND OTP
-------------------------------- */
export const sendOtp = async (email) => {
  try {
    const res = await fetch(`${API_BASE}/api/otp/send`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    const data = await res.json();
    return { success: res.ok, data, error: res.ok ? null : data.message };
  } catch (err) {
    return { success: false, error: err.message };
  }
};


/* -------------------------------
   VERIFY OTP
-------------------------------- */
export const verifyOtp = async (email, code) => {
  try {
    const res = await fetch(`${API_BASE}/api/otp/verify`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email, code }),
    });

    const data = await res.json();
    return { success: res.ok, data, error: res.ok ? null : data.message };
  } catch (err) {
    return { success: false, error: err.message };
  }
};


/* -----------------------------
   ACADEMIC RECORD CRUD (FACULTY)
------------------------------ */
export const getAllRecords = async () => {
  const res = await fetch(`${API_BASE}/api/faculty/getrecord`, {
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return { success: res.ok, data };
};
export const getRecordById = async (id) => {
  const res = await fetch(`${API_BASE}/api/faculty/getrecord/${id}`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  return { success: res.ok, data };
};

export const createRecord = async (record) => {
  const res = await fetch(`${API_BASE}/api/faculty/addrecord`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify(record),
  });
  const data = await res.json();
  return { success: res.ok, data };
};

export const updateRecord = async (id, updates) => {
  const res = await fetch(`${API_BASE}/api/faculty/updaterecord/${id}`, {
    method: "PUT",
    headers: getAuthHeaders(),
    body: JSON.stringify(updates),
  });
  const data = await res.json();
  return { success: res.ok, data };
};

export const deleteRecord = async (id) => {
  const res = await fetch(`${API_BASE}/api/faculty/delete/${id}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });
  const data = await res.json();
  return { success: res.ok, data };
};
/* -------------------------------
   FORGOT PASSWORD FLOW
-------------------------------- */

// 1. Send OTP
export const forgotPasswordSendOtp = async (email) => {
  const res = await fetch(`${API_BASE}/api/auth/forgot-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email }),
  });

  const data = await res.json();
  return { success: res.ok, data, error: !res.ok ? data.message : null };
};

// 2. Verify OTP
export const forgotPasswordVerifyOtp = async (email, code) => {
  const res = await fetch(`${API_BASE}/api/auth/forgot-password/verify`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, code }),
  });

  const data = await res.json();
  return { success: res.ok, data, error: !res.ok ? data.message : null };
};

// 3. Reset Password
export const resetPassword = async (email, newPassword) => {
  const res = await fetch(`${API_BASE}/api/auth/reset-password`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ email, newPassword }),
  });

  const data = await res.json();
  return { success: res.ok, data, error: !res.ok ? data.message : null };
};

/* -------------------------------
   REFERRAL CODE MANAGEMENT
-------------------------------- */

export const addReferralCodesAPI = async (codes) => {
  const res = await fetch(`${API_BASE}/api/faculty/referral/add`, {
    method: "POST",
    headers: getAuthHeaders(),
    body: JSON.stringify({ codes }),
  });

  const data = await res.json();
  return { success: res.ok, data, error: data.message };
};

export const getReferralList = async () => {
  const res = await fetch(`${API_BASE}/api/faculty/referral/all`, {
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  return { success: res.ok, data };
};

export const deleteReferral = async (code) => {
  const res = await fetch(`${API_BASE}/api/faculty/referral/${code}`, {
    method: "DELETE",
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  return { success: res.ok, data, error: data.message };
};

export const toggleReferral = async (code) => {
  const res = await fetch(`${API_BASE}/api/faculty/referral/${code}/toggle`, {
    method: "PATCH",
    headers: getAuthHeaders(),
  });

  const data = await res.json();
  return { success: res.ok, data, error: data.message };
};
// BULK JOB POST
export const bulkCreateJobs = async (jobs) => {
  try {
    const res = await fetch(`${API_BASE}/faculty/jobs/bulk`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${localStorage.getItem("token")}`
      },
      body: JSON.stringify({ jobs })
    });

    const data = await res.json();

    if (!res.ok) {
      return { success: false, error: data.message };
    }

    return { success: true, data: data.results };

  } catch (err) {
    return { success: false, error: err.message };
  }
};
