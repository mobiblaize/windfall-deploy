import { useNavigate, useLocation } from "react-router-dom";

export const useAuth = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const isAuthenticated = () => {
    const userInfo = localStorage.getItem("user");
    return !!userInfo;
  };

  const getUserInfo = () => {
    const userInfo = localStorage.getItem("user");
    return userInfo ? JSON.parse(userInfo) : null;
  };

  const logout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("access_token");
    navigate("/login");
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

  const getStoredRedirect = () => {
    const redirectPage = localStorage.getItem("redirectPage");
    const pageDetails = localStorage.getItem("pageDetails");

    // Clear stored redirect info
    if (redirectPage) {
      localStorage.removeItem("redirectPage");
      localStorage.removeItem("pageDetails");
    }

    return {
      page: redirectPage,
      details: pageDetails ? JSON.parse(pageDetails) : null,
    };
  };

  return {
    isAuthenticated,
    getUserInfo,
    logout,
    storeRedirectInfo,
    getStoredRedirect,
  };
};
