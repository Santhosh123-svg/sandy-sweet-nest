import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const MagicLink = () => {
  const [email, setEmail] = useState("");

  const sendLink = async () => {
    try {
      await axiosInstance.post("/auth/magic/send-link", { email });
      alert("Magic link sent to your email");
    } catch (err) {
      alert(err.response.data.message);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-xl bg-white/80 backdrop-blur-lg border border-white/30">
        <h2 className="text-3xl font-bold text-amber-500 mb-4 text-center">
          Magic Login
        </h2>

        <input
          className="w-full p-3 rounded-xl border border-amber-200 mb-5 focus:outline-none focus:ring-2 focus:ring-amber-300"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className="w-full p-3 rounded-xl bg-amber-300 hover:bg-amber-400 transition"
          onClick={sendLink}
        >
          Send Magic Link
        </button>
      </div>
    </div>
  );
};

export default MagicLink;
