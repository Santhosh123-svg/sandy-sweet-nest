import React, { useState } from "react";
import axiosInstance from "../../utils/axiosInstance";

const MagicLink = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const sendLink = async () => {
    if (!email) {
      alert("Enter your email first");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/auth/magic/send-link", { email });
      alert(res.data.message || "Magic link sent to your email");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to send link");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="w-full max-w-md p-8 rounded-3xl shadow-xl bg-white/80">
        <h2 className="text-3xl font-bold text-amber-500 mb-4 text-center">
          Magic Login
        </h2>

        <input
          className="w-full p-3 rounded-xl border mb-5"
          placeholder="Enter your email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />

        <button
          className={`w-full p-3 rounded-xl bg-amber-300 ${
            loading ? "cursor-not-allowed opacity-70" : ""
          }`}
          onClick={sendLink}
          disabled={loading}
        >
          {loading ? "Sending..." : "Send Magic Link"}
        </button>
      </div>
    </div>
  );
};

export default MagicLink;
