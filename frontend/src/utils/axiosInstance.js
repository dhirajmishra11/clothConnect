import axios from "axios";

const axiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "/api", // Fallback to relative URL for development
});

export default axiosInstance;
