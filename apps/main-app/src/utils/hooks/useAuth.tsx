import { useNavigate, useLocation } from "react-router-dom";
import { useSessionStorage } from "./useStorage";

interface redirectInfo {
  redirectPage: string | null;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  pageDetails?: any;
  userType?: 'admin' | 'user' | null;
}

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
    navigate(isAdminUser ? "/admin/login" : "/login");
    clearUser();
    setTimeout(() => {
      clearStoredRedirect();
    }, 100);
  };

  const storeRedirectInfo = (redirectInfo?: redirectInfo) => {
    if (redirectInfo) {
      if (redirectInfo.redirectPage) {
        localStorage.setItem("redirectPage", redirectInfo.redirectPage);
      }
      if (redirectInfo.userType) {
        localStorage.setItem("redirectUser", redirectInfo.userType);
      }
      if (redirectInfo.pageDetails) {
        localStorage.setItem("pageDetails", JSON.stringify(redirectInfo.pageDetails));
      }
      return;
    }
    if (!isAuthenticated()) {
      // Store current page and details for redirect after login
      localStorage.setItem("redirectPage", location.pathname);

      const userType = getUserType();
      if (userType) localStorage.setItem("redirectUser", userType);

      // Store additional page details if available
      if (location.state) localStorage.setItem("pageDetails", JSON.stringify(location.state));
    }
  };

  const getStoredRedirect = (clearData = true) => {
    const redirectPage = localStorage.getItem("redirectPage");
    const pageDetails = localStorage.getItem("pageDetails");
    const userType = localStorage.getItem("redirectUser");

    // Clear stored redirect info
    if (redirectPage || clearData || userType) {
      localStorage.removeItem("redirectPage");
      localStorage.removeItem("pageDetails");
      localStorage.removeItem("redirectUser");
    }

    return {
      page: redirectPage,
      details: pageDetails ? JSON.parse(pageDetails) : null,
      userType: userType
    };
  };

  const clearStoredRedirect = () => {
    localStorage.removeItem("redirectPage");
    localStorage.removeItem("pageDetails");
    localStorage.removeItem("redirectUser");
  }

  const handleLoginRedirect = (defaultRedirect: string) => {
    const { page, details, userType } = getStoredRedirect();
    
    // If a redirect page was stored, use it; otherwise use default
    let redirectPage = page;
    if (userType === 'admin' && !redirectPage?.toLowerCase()?.startsWith('/admin')) {
      redirectPage = null;
    }

    navigate(redirectPage || defaultRedirect, {
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
