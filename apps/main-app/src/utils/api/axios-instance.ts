import axios, {
  AxiosError,
  type AxiosInstance,
  type AxiosResponse,
  type InternalAxiosRequestConfig,
} from "axios";
import { clearUser } from "../hooks/useStorage";

const viteEnv = typeof import.meta !== "undefined" ? import.meta.env : undefined;
const nodeEnv = typeof process !== "undefined" ? process.env : undefined;

const runtimeBaseUrl =
  viteEnv?.VITE_API_BASE_URL ??
  nodeEnv?.VITE_API_BASE_URL ??
  nodeEnv?.REACT_APP_API_BASE_URL;

const envMode = viteEnv?.MODE ?? nodeEnv?.NODE_ENV ?? "production";

export const baseUrl =
  runtimeBaseUrl ||
  (envMode === "production"
    ? "https://api.homewindfall.com/api/v1/"
    : "https://api.windfall.sbscuk.co.uk/public/api/v1/");

const axiosInstance: AxiosInstance = axios.create({
  baseURL: baseUrl,
  headers: {
    "Content-Type": "application/json",
  },
});

const attachToken = (
  config: InternalAxiosRequestConfig
): InternalAxiosRequestConfig => {
  const token = localStorage.getItem("access_token");
  if (token) {
    config.headers.set("Authorization", `Bearer ${token}`);
  }
  return config;
};

let isShowingError = false;
const errorResetTimeout = 5000;

const handleError = async (error: AxiosError): Promise<never> => {
  if (!error.response) {
    return Promise.reject({
      error: true,
      message: "Network error or server is unreachable.",
      status: 0,
      data: null,
    });
  }

  const { status, data } = error.response;
  const originalRequest = error.config;

  // Handle 401 → logout and redirect
  if (status === 401) {
    if (originalRequest?.url && !originalRequest.url.includes("login")) {
      const userType = localStorage.getItem("user_type");
      clearUser();
      if (userType === "admin") {
        window.location.replace("/admin/login");
      } else {
        window.location.replace("/login");
      }
    }
    return Promise.reject({
      error: true,
      message: "Unauthorized: Please log in again.",
      status,
      data: data ?? null,
    });
  }

  const messages: Record<number, string> = {
    400: "Bad Request: Please check your input.",
    401: "Unauthorized: Please log in again.",
    403: "Forbidden: You do not have access to this resource.",
    404: "Not Found: The resource was not found.",
    500: "Internal Server Error: Please try again later.",
  };

  const errorMessage =
    (data as { message?: string })?.message ||
    messages[status as keyof typeof messages] ||
    "An unexpected error occurred.";

  if (!isShowingError) {
    isShowingError = true;
    console.error(errorMessage);
    setTimeout(() => {
      isShowingError = false;
    }, errorResetTimeout);
  }

  // Reject with structured object
  return Promise.reject({
    error: true,
    message: errorMessage,
    status,
    data: (data as { data: unknown })?.data ?? null,
  });
};

axiosInstance.interceptors.request.use(attachToken, Promise.reject);
axiosInstance.interceptors.response.use(
  (res: AxiosResponse) => res,
  handleError
);

export { axiosInstance };
