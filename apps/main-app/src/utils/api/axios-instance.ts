import axios from "axios";
import { clearUser } from "../hooks/useStorage";

export const baseUrl = "https://api.windfall.sbscuk.co.uk/public/api/v1/";

const axiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const attachToken = (config: any) => {
  const token = localStorage.getItem("access_token");
  if (token) config.headers.Authorization = `Bearer ${token}`;

  return config;
};

let isShowingError = false;
const errorResetTimeout = 5000;

const handleError = async (error: any) => {
  if (!error.response) {
    console.log("Network error or server is unreachable.");
    return Promise.reject(new Error("Network error or server is unreachable."));
  }

  const { status, data } = error.response;
  const originalRequest = error.config;

  // Handle 401 errors with token refresh
  if (status === 401) {
    if (!originalRequest.url.includes("auth/login")) {
      clearUser();
      window.location.replace("/login");
      window.location.reload();
    }
    return Promise.reject(error);
  }

  const messages: Record<number, string> = {
    400: "Bad Request: Please check your input.",
    401: "Unauthorized: Please log in again.",
    403: "Forbidden: You do not have access to this resource.",
    404: "Not Found: The resource was not found.",
    500: "Internal Server Error: Please try again later.",
  };

  const errorMessage =
    data?.message ||
    messages[status as keyof typeof messages] ||
    "An unexpected error occurred.";

  if (!isShowingError) {
    isShowingError = true;

    console.log(errorMessage);

    // Reset the flag after timeout
    setTimeout(() => {
      isShowingError = false;
    }, errorResetTimeout);
  }

  return Promise.reject(new Error(errorMessage));
};

axiosInstance.interceptors.request.use(attachToken, Promise.reject);
axiosInstance.interceptors.response.use((res) => res, handleError);

export { axiosInstance };
