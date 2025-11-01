import { useEffect } from "react";
import { Navigate } from "react-router-dom";
import { useAuth } from "../hooks/useAuth";

interface AdminProtectedRouteProps {
  children: React.ReactNode;
}

const AdminProtectedRoute: React.FC<AdminProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, isAdmin, storeRedirectInfo } = useAuth();

  useEffect(() => {
    if (!isAuthenticated() || !isAdmin()) {
      storeRedirectInfo();
    }
  }, [isAdmin, isAuthenticated, storeRedirectInfo]);

  if (!isAuthenticated() || !isAdmin()) {
    return <Navigate to="/admin/login" />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
