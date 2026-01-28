import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://sandy-sweet-nest-3.onrender.com",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

// Add token for all requests except magic endpoints
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (!config.url.includes("/auth/magic") && token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
