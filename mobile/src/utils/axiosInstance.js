import axios from "axios";
import AsyncStorage from "@react-native-async-storage/async-storage";

// 🔥 IMPORTANT: Replace this IP if your network changes
// Make sure mobile & laptop are in SAME WIFI
const API_BASE_URL = "http://10.183.54.63:5000";

const axiosInstance = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000, // 🔥 increased timeout (15s)
  headers: {
    "Content-Type": "application/json",
    "x-client-type": "mobile"
  }
});

// 🔐 Attach token automatically
axiosInstance.interceptors.request.use(
  async (config) => {
    try {
      const token = await AsyncStorage.getItem("token");

      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }

      // 🔍 DEBUG LOG (optional)
      console.log("API REQUEST 👉", config.url);

      return config;
    } catch (error) {
      console.log("TOKEN ERROR 👉", error.message);
      return config;
    }
  },
  (error) => Promise.reject(error)
);

// 🔥 RESPONSE + ERROR HANDLING
axiosInstance.interceptors.response.use(
  (response) => {
    console.log("API RESPONSE ✅", response.config.url);
    return response;
  },
  async (error) => {
    if (error.response) {
      // 🔴 Backend responded with error
      console.log("API ERROR 👉", {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data
      });
    } else if (error.request) {
      // 🔴 Request sent but no response (NETWORK ISSUE)
      console.log("NETWORK ERROR 👉 Server not reachable");
    } else {
      // 🔴 Other errors
      console.log("AXIOS ERROR 👉", error.message);
    }

    return Promise.reject(error);
  }
);

export default axiosInstance;