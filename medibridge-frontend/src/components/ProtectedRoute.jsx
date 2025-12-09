// src/components/ProtectedRoute.jsx
import React from "react";
import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const ProtectedRoute = ({ children, allowedRoles }) => {
  const { user, token } = useAuth();
  const location = useLocation();

  // Not logged in at all → go to login
  if (!token || !user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // If allowedRoles is passed, check role
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    // You’re logged in but not allowed here → send home (or 403 page)
    return <Navigate to="/" replace />;
  }

  // All good
  return children;
};

export default ProtectedRoute;
