import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

export default function ProtectedRoute({ children, role }) {
  const { user, loading } = useAuth();

  if (loading) return null; // or loader spinner

  if (!user) return <Navigate to="/" replace />;

  if (role && user.role !== role) return <Navigate to="/" replace />;

  return children;
}
