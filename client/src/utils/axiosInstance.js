import axios from "axios";

const axiosInstance = axios.create({
  baseURL: "https://sandy-sweet-nest-3.onrender.com",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add token only for APIs except magic verify/send
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");

    // ❌ Don't send token for magic verify/send-link
    if (!config.url.includes("/auth/magic")) {
      if (token) config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
  },
  (error) => Promise.reject(error)
);

export default axiosInstance;
