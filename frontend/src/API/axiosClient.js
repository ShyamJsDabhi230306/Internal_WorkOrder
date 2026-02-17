// axiosClient.js
import axios from "axios";
import { API_URL } from "../config/constant";
import { toast } from "react-toastify";

// Base URL
const API = `${API_URL}`;

// Create an axios instance
const axiosClient = axios.create({
  baseURL: API,
  headers: {
    // "Authorization": `Bearer ${localStorage.getItem('token')}`, // ❌ REMOVED: Initializing with null causes 401 on login
    "Content-Type": "application/json",
  },
});

// ===============================
// ⭐ REQUEST INTERCEPTOR (KEEPING YOUR EXISTING CODE)
// ===============================
axiosClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers["Authorization"] = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// ===============================
// ⭐ RESPONSE INTERCEPTOR (Toastify + 401 Redirect)
// ===============================
axiosClient.interceptors.response.use(
  (response) => {
    // Show SUCCESS toast ONLY for POST, PUT, DELETE
    const method = response.config.method;

    if (["post", "put", "delete"].includes(method)) {
      toast.success("Operation completed successfully ✅");
    }

    return response;
  },

  (error) => {
    // ⛔ Session expired OR unauthorized
    if (error?.response?.status === 401) {
      // toast.error("Session expired. Please log in again.");

      // Clear all auth related local storage
      localStorage.removeItem("token");
      localStorage.removeItem("user");
      localStorage.removeItem("auth");

      // Redirect to login only if not already there
      if (!window.location.pathname.includes("/newlogin")) {
        window.location.href = "/newlogin";
      }
      return; // stop further processing
    }

    // GLOBAL ERROR HANDLER (your existing code)
    let message =
      error?.response?.data?.message ||
      error?.response?.data ||
      error.message ||
      "Something went wrong";

    toast.error(message);

    return Promise.reject(error);
  }
);

export default axiosClient;
