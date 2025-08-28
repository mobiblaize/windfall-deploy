import { atom, useAtom } from "jotai";

import { useNavigate } from "react-router-dom";

type User = {
  id: string;
  name: string;
  email: string;
  role: string;
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

export const userAtom = atom<any>(loadUserFromStorage());

export const clearUser = () => {
  window.localStorage.removeItem("user");
  window.localStorage.removeItem("access_token");
  window.localStorage.removeItem("refresh_token");
};

export const useSessionStorage = () => {
  const [user, setUser] = useAtom(userAtom);

  const updateUser = (value: any) => {
    if (typeof window !== "undefined") {
      if (value) {
        window.localStorage.setItem("user", JSON.stringify(value));
      } else {
        window.localStorage.removeItem("user");
      }
    }
    setUser(value);
    localStorage.setItem("user", JSON.stringify(value.user));
    localStorage.setItem("access_token", value.access_token);
    // localStorage.setItem("refresh_token", value.refresh_token);
  };

  const clearUser = () => {
    if (typeof window !== "undefined") {
      window.localStorage.removeItem("user");
      window.localStorage.removeItem("access_token");
      window.localStorage.removeItem("refresh_token");
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
