import axios from "axios";

const axiosInstance = axios.create({
  // Point to domain only to avoid /api/api duplication
  baseURL: "https://sandy-sweet-nest-2.onrender.com", 
  withCredentials: true,
  headers: { "Content-Type": "application/json" }
});

export default axiosInstance;