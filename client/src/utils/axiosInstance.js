import axios from "axios";

const axiosInstance = axios.create({
  baseURL: 'https://sandy-sweet-nest-2.onrender.com',
   withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  },
});

// Add interceptor to include Authorization header
axiosInstance.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default axiosInstance;
