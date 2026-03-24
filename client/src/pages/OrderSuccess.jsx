import React from "react";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useNavigate } from "react-router-dom";

const OrderSuccess = () => {
  const navigate = useNavigate();

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-3xl shadow-xl text-center max-w-md w-full"
      >
        <CheckCircle size={70} className="mx-auto text-green-500 mb-4" />

        <h2 className="text-2xl font-bold mb-2">
          Order Successful 🎉
        </h2>

        <p className="text-gray-600 mb-6">
          Thank you for ordering from Sandy’s Sweet Nest 💖
        </p>

        <button
          onClick={() => navigate("/welcome")}
          className="w-full bg-green-500 text-white py-3 rounded-xl font-bold"
        >
          Back to Home
        </button>
      </motion.div>
    </div>
  );
};

export default OrderSuccess;
