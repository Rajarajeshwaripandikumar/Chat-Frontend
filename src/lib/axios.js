// src/lib/axios.js
import axios from "axios";
import toast from "react-hot-toast";

// BASE URL LOGIC
const apiHost =
  import.meta.env.VITE_API_URL ||
  (import.meta.env.DEV ? "http://localhost:5000" : "");
const normalizedHost = apiHost ? apiHost.replace(/\/$/, "") : "";
const baseURL = normalizedHost ? `${normalizedHost}/api` : "/api";

const isBrowser =
  typeof window !== "undefined" && typeof window.localStorage !== "undefined";

// AXIOS INSTANCE
export const axiosInstance = axios.create({
  baseURL,
  withCredentials: false, // using JWT in Authorization by default
});

// ✅ setAuthToken: ONLY header + localStorage. NO socket imports, NO socket calls.
export const setAuthToken = (token) => {
  try {
    if (isBrowser) {
      if (token) {
        try {
          localStorage.setItem("token", token);
        } catch {}
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${token}`;
      } else {
        try {
          localStorage.removeItem("token");
        } catch {}
        delete axiosInstance.defaults.headers.common["Authorization"];
      }
    } else {
      if (token)
        axiosInstance.defaults.headers.common["Authorization"] =
          `Bearer ${token}`;
      else delete axiosInstance.defaults.headers.common["Authorization"];
    }
  } catch {
    if (token)
      axiosInstance.defaults.headers.common["Authorization"] =
        `Bearer ${token}`;
    else delete axiosInstance.defaults.headers.common["Authorization"];
  }
};

// INITIALIZE TOKEN ON PAGE LOAD (restore auth after refresh)
try {
  if (isBrowser) {
    const savedToken = localStorage.getItem("token");
    if (savedToken) {
      setAuthToken(savedToken);
    }
  }
} catch {}

// SESSION EXPIRED HANDLER
function handleSessionExpired() {
  try {
    setAuthToken(null);

    if (isBrowser && typeof window.CustomEvent === "function") {
      window.dispatchEvent(new CustomEvent("auth:sessionExpired"));
    } else if (isBrowser) {
      window.location.replace("/login");
    }
  } catch {
    if (isBrowser) window.location.replace("/login");
  }
}

// GLOBAL RESPONSE INTERCEPTOR
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error?.response) {
      const status = error.response.status;

      if (status === 401) {
        toast.error("Session expired. Please log in again.");
        handleSessionExpired();
      } else if (status === 403) {
        toast.error("Forbidden");
      } else if (status >= 500) {
        toast.error("Server error");
      } else {
        const msg =
          error.response.data?.message ||
          error.response.data?.error ||
          error.response.statusText ||
          "Request failed";

        if (msg) toast.error(msg);
      }
    } else {
      toast.error("Network error. Please check your connection.");
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;
