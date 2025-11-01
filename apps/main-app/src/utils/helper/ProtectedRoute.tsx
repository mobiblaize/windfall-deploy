import { useEffect } from "react";

import { useAuth } from "../hooks/useAuth";
import { Navigate } from "react-router-dom";

interface ProtectedRouteProps {
  children: React.ReactNode;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ children }) => {
  const { isAuthenticated, storeRedirectInfo } = useAuth();

  useEffect(() => {
    if (!isAuthenticated()) {
      storeRedirectInfo();
    }
  }, [isAuthenticated, storeRedirectInfo]);

  if (!isAuthenticated()) {
    return <Navigate to="/login" />;
  }

  return <>{children}</>;
};

export default ProtectedRoute;
