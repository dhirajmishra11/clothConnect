import axios from "axios";
import { store } from "../store/store";
import { logout } from "../store/slices/authSlice";

const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api",
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
});

// Request interceptor for adding auth token
axiosInstance.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth?.token;

    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for handling errors
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle specific error cases
      switch (error.response.status) {
        case 401:
          // Token expired or invalid
          store.dispatch(logout());
          break;
        case 403:
          // Unauthorized action
          console.error("Unauthorized action:", error.response.data.message);
          break;
        case 404:
          // Resource not found
          console.error("Resource not found:", error.response.data.message);
          break;
        default:
          // Other error cases
          console.error("API Error:", error.response.data.message);
      }
    } else if (error.request) {
      // Network error
      console.error("Network Error:", error.message);
    } else {
      // Other errors
      console.error("Error:", error.message);
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
