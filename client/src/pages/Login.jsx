import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const { data } = await axiosInstance.post("/auth/login", { email, password });
      localStorage.setItem("token", data.token);
      alert("Login Successful");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="p-6 rounded-2xl shadow-lg bg-white w-96">
        <h2 className="text-2xl font-bold mb-4">Login</h2>

        <input
          className="w-full p-3 rounded-lg border mb-3"
          placeholder="Email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="w-full p-3 rounded-lg border mb-3"
          placeholder="Password"
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="w-full p-3 bg-amber-300 rounded-lg font-bold"
          onClick={handleLogin}
        >
          Login
        </button>
      </div>
    </div>
  );
};

export default Login;
