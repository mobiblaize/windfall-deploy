import { useEffect } from "react";
import { useAuth } from "../hooks/useAuth";
import RedirectWithLoading from "../../components/RedirectWithLoading";

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
    return <RedirectWithLoading to="/admin/login" />;
  }

  return <>{children}</>;
};

export default AdminProtectedRoute;
