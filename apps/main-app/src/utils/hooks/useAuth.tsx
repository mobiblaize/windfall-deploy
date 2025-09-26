import { useNavigate, useLocation } from "react-router-dom";
import { useSessionStorage } from "./useStorage";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { clearUser } = useSessionStorage();

  const isAuthenticated = () => {
    const userInfo = localStorage.getItem("user");
    return !!userInfo;
  };

  const getUserInfo = () => {
    const userInfo = localStorage.getItem("user");
    return userInfo ? JSON.parse(userInfo) : null;
  };

  const getUserType = () => {
    const userType = localStorage.getItem("user_type");
    return userType;
  };

  const isAdmin = () => {
    return getUserType() === "admin";
  };

  const logout = () => {
    const isAdminUser = isAdmin();
    clearUser();
    navigate(isAdminUser ? "/admin/login" : "/login");
  };

  const storeRedirectInfo = () => {
    if (!isAuthenticated()) {
      // Store current page and details for redirect after login
      localStorage.setItem("redirectPage", location.pathname);

      // Store additional page details if available
      if (location.state) {
        localStorage.setItem("pageDetails", JSON.stringify(location.state));
      }
    }
  };

  const getStoredRedirect = (clearData = true) => {
    const redirectPage = localStorage.getItem("redirectPage");
    const pageDetails = localStorage.getItem("pageDetails");

    // Clear stored redirect info
    if (redirectPage && clearData) {
      localStorage.removeItem("redirectPage");
      localStorage.removeItem("pageDetails");
    }

    return {
      page: redirectPage,
      details: pageDetails ? JSON.parse(pageDetails) : null,
    };
  };

  const handleLoginRedirect = (defaultRedirect: string) => {
    const { page, details } = getStoredRedirect();

    // If a redirect page was stored, use it; otherwise use default
    navigate(page || defaultRedirect, {
      replace: true,
      state: details || undefined,
    });
  };

  return {
    isAuthenticated,
    getUserInfo,
    logout,
    storeRedirectInfo,
    getStoredRedirect,
    handleLoginRedirect,
    isAdmin,
  };
};
