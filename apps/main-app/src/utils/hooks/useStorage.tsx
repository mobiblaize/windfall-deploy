import { notifications } from "@mantine/notifications";
import { atom, useAtom } from "jotai";
import { useCallback, useEffect, useRef } from "react";
import { useLocation, useNavigate } from "react-router-dom";

export interface User {
  uuid: string;
  uniqueID: string;
  email: string;
  phone_number: string;
  avatar: string;
  firstname: string;
  lastname: string;
  date_of_birth: string;
  gender: string;
  lga: string;
  area: string;
  spend_limit_status: string;
  referral_code: string;
  referral_link: string;
  referral_balance: string;
  exclusion_type: string;
  exclude_till: string;
  notification_setting: NotificationSetting;
  id: string;
  name: string;
  roles: {
    uuid: string;
    name: string;
    display_name: string;
    enforce_password_change: boolean;
  }[];
  permissions: string[]
  permissions_by_module: PermissionsByModule
}

export interface PermissionsByModule {
  Dashboard: string[]
  "Game Management": string[]
  "Draw Management": string[]
  "Result Management": string[]
  "Customer Management": string[]
  "Transaction Management": string[]
  "Prize Management": string[]
  Notification: string[]
  "Customer Support": string[]
  "Referral Management": string[]
  "Promo Code Management": string[]
  "User Management": string[]
  "Content Management": string[]
  "Report Management": string[]
  Profile: string[]
  "Workflow Management": string[]
  "Merchant Management": string[]
  "Broadcast Management": string[]
  "Marketing Management": string[]
}

export interface NotificationSetting {
  uuid: string;
  user_id: string;
  push_notification: string;
  email_notification: string;
  game_draw: string;
  game_result_winners: string;
  game_suggestions: string;
  new_games: string;
  payment_transactions: string;
  promotional: string;
  account_security: string;
  created_at: string;
  updated_at: string;
}

export type AuthPayload = {
  user: User;
  access_token: string;
  expires_in?: number;
  refresh_token?: string;
  user_type?: "user" | "admin";
};

const loadUserFromStorage = (): User | null => {
  if (typeof window !== "undefined") {
    const user = window.localStorage.getItem("user");
    if (user && user !== "undefined") {
      try {
        return JSON.parse(user) as User;
      } catch (error) {
        console.error("Error parsing user data from sessionStorage", error);
        return null;
      }
    }
  }
  return null;
};

export const userAtom = atom<User | null>(loadUserFromStorage());

// Module-level flag to prevent duplicate timeout notifications
let timeoutNotificationShown = false;

export const clearUser = () => {
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem("user_type");
  window.localStorage.removeItem("token_expiry");
  // Don't reset flag here - it should only reset on new login to prevent race conditions
};

export const useSessionStorage = () => {
  const [user, setUser] = useAtom(userAtom);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  const updateUser = (value: AuthPayload | null) => {
    if (typeof window !== "undefined") {
      if (value) {
        const now = Date.now();
        const expiresInMs = value.expires_in
          ? value.expires_in * 1000
          : 3600 * 1000;
        const expiryTimestamp = now + expiresInMs;

        window.localStorage.setItem("user", JSON.stringify(value.user));
        window.localStorage.setItem("access_token", value.access_token);
        window.localStorage.setItem("token_expiry", expiryTimestamp.toString());
        window.localStorage.setItem(
          "user_type",
          value.user_type === "admin" ? "admin" : "user"
        );
        if (value.user_type === "admin")
          window.localStorage.setItem("username", value?.user?.name);
        if (value.refresh_token) {
          window.localStorage.setItem("refresh_token", value.refresh_token);
        }
      } else {
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("refresh_token");
        window.localStorage.removeItem("user_type");
        window.localStorage.removeItem("token_expiry");
      }
    }
    setUser(value ? value.user : null);
  };

  const clearUser = useCallback(() => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("refresh_token");
      window.localStorage.removeItem("user_type");
      window.localStorage.removeItem("token_expiry");
    }
    setUser(null);
  }, [setUser]);

  useEffect(() => {
    if (typeof window === "undefined") return;

    const expiryStr = localStorage.getItem("token_expiry");
    if (expiryStr) {
      const expiry = parseInt(expiryStr, 10);
      const now = Date.now();

      const isAdminPage = location.pathname.startsWith("/admin");
      
      // Check if user still exists to prevent duplicate notifications
      const userStillExists = !!localStorage.getItem("user");
      
      if (now >= expiry && userStillExists && !timeoutNotificationShown) {
        timeoutNotificationShown = true;
        clearUser();
        navigate(isAdminPage ? "/admin/login" : "/login");
        notifications.show({
          title: "Session Timed Out",
          message: "Please login again",
          color: "red",
        });
      } else if (now < expiry) {
        const timeout = expiry - now;

        // clear any old timer before setting new one
        if (timerRef.current) {
          clearTimeout(timerRef.current);
        }

        timerRef.current = setTimeout(() => {
          // Check if user still exists and notification hasn't been shown
          const userStillExists = !!localStorage.getItem("user");
          if (userStillExists && !timeoutNotificationShown) {
            timeoutNotificationShown = true;
            clearUser();
            navigate(isAdminPage ? "/admin/login" : "/login");
            notifications.show({
              title: "Session Timed Out",
              message: "Please login again",
              color: "red",
            });
          }
        }, timeout);
      }
    }

    return () => {
      if (timerRef.current) {
        clearTimeout(timerRef.current);
        timerRef.current = null;
      }
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [navigate, location.pathname]);

  return { user, setUser, updateUser, clearUser };
};

export const useLoggedOut = () => {
  const router = useNavigate();
  const { clearUser } = useSessionStorage();

  const logout = () => {
    clearUser();
    router("/login");
  };

  return logout;
};
