import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

export default function ProtectedRoute({ children }) {
  const { user, loading } = useAuth();
  const location = useLocation();

  if (loading) return children ? children : <Outlet />;
  if (!user) return <Navigate to="/login" state={{ from: location }} replace />;

  return children ? children : <Outlet />;
}
