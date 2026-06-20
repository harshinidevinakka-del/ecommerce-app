import { Navigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

// adminOnly: if true, only allows users with role "admin"
const ProtectedRoute = ({ children, adminOnly = false }) => {
  const { user, loading } = useAuth();

  if (loading) return null; // wait until auth state is loaded from localStorage

  if (!user) {
    return <Navigate to="/login" replace />;
  }

  if (adminOnly && user.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return children;
};

export default ProtectedRoute;