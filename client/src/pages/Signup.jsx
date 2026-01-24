import React, { useState } from "react";
import axiosInstance from "../utils/axiosInstance";

const Signup = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSignup = async () => {
    try {
      await axiosInstance.post("/auth/signup", { email, password });
      alert("Signup success! Now login.");
    } catch (error) {
      alert(error.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream">
      <div className="p-6 rounded-2xl shadow-lg bg-white w-96">
        <h2 className="text-2xl font-bold mb-4">Signup</h2>

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
          onClick={handleSignup}
        >
          Signup
        </button>
      </div>
    </div>
  );
};

export default Signup;
