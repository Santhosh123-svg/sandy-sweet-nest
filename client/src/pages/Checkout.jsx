import React, { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { CheckCircle } from "lucide-react";
import { useOrder } from "../context/OrderContext";

const Checkout = () => {
  const navigate = useNavigate();
  const { order } = useOrder();

  useEffect(() => {
    if (!order) navigate("/welcome");
  }, [order, navigate]);

  if (!order) return null;

  return (
    <div className="min-h-screen flex items-center justify-center bg-green-50">
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-8 rounded-3xl shadow-2xl text-center max-w-md w-full"
      >
        <CheckCircle size={72} className="mx-auto text-green-500 mb-4" />

        <h1 className="text-2xl font-extrabold text-green-600">
          Payment Successful 🎉
        </h1>

        <p className="mt-3 text-gray-600">
          Click below to confirm via WhatsApp
        </p>

        <button
          onClick={() => navigate("/whatsapp-confirm")}
          className="mt-6 w-full py-3 bg-green-500 text-white font-bold rounded-xl"
        >
          SEND DETAILS TO WHATSAPP
        </button>
      </motion.div>
    </div>
  );
};

export default Checkout;
