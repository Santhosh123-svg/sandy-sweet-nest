import axios from "axios";

const axiosInstance = axios.create({
  // Use domain only to avoid /api/api duplication in requests
  baseURL: "https://sandy-sweet-nest-2.onrender.com", 
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
  }
});

export default axiosInstance;