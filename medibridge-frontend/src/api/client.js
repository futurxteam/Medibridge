// src/api/client.js
const API_BASE = "http://localhost:5000";

export async function apiRequest(path, options = {}) {
  const token = localStorage.getItem("token");

  const headers = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const res = await fetch(`${API_BASE}${path}`, {
    ...options,
    headers,
  });

  let data = {};
  try {
    data = await res.json();
  } catch (e) {
    // ignore parse errors for empty responses
  }

  if (!res.ok) {
    throw new Error(data.message || "Request failed");
  }

  return data;
}
