import { atom, useAtom } from "jotai";
import { useNavigate } from "react-router-dom";

export type User = {
  id: string;
  name: string;
  firstname: string;
  lastname: string;
  email: string;
  avatar: string;
  uniqueID: string;
  roles: {
    uuid: string;
    name: string;
    display_name: string;
    enforce_password_change: boolean;
  }[];  
};

export type AuthPayload = {
  user: User;
  access_token: string;
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

export const clearUser = () => {
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
  window.localStorage.removeItem("is_admin");
};

export const useSessionStorage = () => {
  const [user, setUser] = useAtom(userAtom);

  const updateUser = (value: AuthPayload | null) => {
    if (typeof window !== "undefined") {
      if (value) {
        window.localStorage.setItem("user", JSON.stringify(value.user));
        window.localStorage.setItem("access_token", value.access_token);
        window.localStorage.setItem(
          "user_type",
          value.user_type === "admin" ? "admin" : "user"
        );
        if (value.user_type === "admin") window.localStorage.setItem('username', value?.user?.name);
        if (value.refresh_token) {
          window.localStorage.setItem("refresh_token", value.refresh_token);
        }
      } else {
        window.localStorage.removeItem("user");
        window.localStorage.removeItem("access_token");
        window.localStorage.removeItem("refresh_token");
        window.localStorage.removeItem("user_type");
      }
    }
    setUser(value ? value.user : null);
  };

  const clearUser = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("refresh_token");
      window.localStorage.removeItem("user_type");
    }
    setUser(null);
  };

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
