import axios from "axios";

const axiosInstance = axios.create({
  // Point to the BACKEND URL (sandy-sweet-nest-2)
  baseURL: "https://sandy-sweet-nest-2.onrender.com", 
  withCredentials: true,
});

export default axiosInstance;