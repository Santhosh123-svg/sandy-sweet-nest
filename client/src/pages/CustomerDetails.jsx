import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { useOrder } from "../context/OrderContext";
import {
  Calendar,
  Clock,
  Gift,
  Cake,
  PartyPopper,
  Heart,
  Sparkles,
  ChevronLeft,
} from "lucide-react";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { order, placeOrder } = useOrder();

  const isCake =
    order?.category?.toLowerCase() === "cake" ||
    order?.category?.toLowerCase() === "cakes";

  const [cakeDetails, setCakeDetails] = useState({
    deliveryDate: "",
    preferredTime: "",
    purpose: "",
    cakeText: "",
  });

  /* ================= PROTECTION ================= */
  useEffect(() => {
    if (!order) {
      navigate("/welcome");
      return;
    }

    if (!isCake) {
      navigate("/payment");
    }
  }, [order, isCake, navigate]);

  const handleChange = (e) => {
    setCakeDetails({
      ...cakeDetails,
      [e.target.name]: e.target.value,
    });
  };

  const handlePurposeSelect = (value) => {
    setCakeDetails({ ...cakeDetails, purpose: value });
  };

  const handleNext = () => {
    const { deliveryDate, preferredTime, purpose, cakeText } = cakeDetails;

    if (!deliveryDate || !preferredTime || !purpose || !cakeText) {
      alert("Please fill all cake details 🎂");
      return;
    }

    placeOrder({
      ...order,
      cakeInfo: cakeDetails,
    });

    navigate("/payment");
  };

  if (!order || !isCake) return null;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="backdrop-blur-xl bg-white/80 p-6 rounded-3xl shadow-2xl w-full max-w-md border border-white/40"
      >
        {/* HEADER */}
        <div className="flex items-center justify-between mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-600 font-semibold"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <span className="text-sm font-bold text-amber-700">
            Cake Details
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-center text-amber-600 mb-6">
          🎂 Customize Your Cake
        </h2>

        {/* DELIVERY DATE */}
        <div className="mb-4">
          <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <Calendar size={18} /> Delivery Date *
          </label>
          <input
            type="date"
            name="deliveryDate"
            value={cakeDetails.deliveryDate}
            onChange={handleChange}
            className="w-full p-3 rounded-2xl bg-white/70 border focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>

        {/* TIME */}
        <div className="mb-4">
          <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <Clock size={18} /> Preferred Time *
          </label>
          <input
            type="time"
            name="preferredTime"
            value={cakeDetails.preferredTime}
            onChange={handleChange}
            className="w-full p-3 rounded-2xl bg-white/70 border focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>

        {/* PURPOSE BUTTONS */}
        <div className="mb-4">
          <label className="font-semibold text-gray-700 flex items-center gap-2 mb-3">
            <Gift size={18} /> Purpose of Cake *
          </label>

          <div className="grid grid-cols-2 gap-3">
            {[
              { label: "Birthday", icon: <PartyPopper />, value: "Birthday" },
              { label: "Anniversary", icon: <Heart />, value: "Anniversary" },
              { label: "Wedding", icon: <Cake />, value: "Wedding" },
              { label: "Surprise", icon: <Sparkles />, value: "Surprise" },
            ].map((p) => (
              <motion.button
                key={p.value}
                whileTap={{ scale: 0.95 }}
                onClick={() => handlePurposeSelect(p.value)}
                className={`flex items-center gap-2 justify-center p-3 rounded-2xl border font-semibold transition-all ${
                  cakeDetails.purpose === p.value
                    ? "bg-amber-300 border-amber-500"
                    : "bg-white/70 hover:bg-amber-100"
                }`}
              >
                {p.icon}
                {p.label}
              </motion.button>
            ))}
          </div>
        </div>

        {/* CAKE TEXT */}
        <div className="mb-4">
          <label className="font-semibold text-gray-700 mb-2 block">
            ✍ Text on Cake *
          </label>
          <input
            type="text"
            name="cakeText"
            placeholder="Happy Birthday Arun 🎉"
            value={cakeDetails.cakeText}
            onChange={handleChange}
            className="w-full p-3 rounded-2xl bg-white/70 border focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </div>

        {/* LIVE PREVIEW */}
        <AnimatePresence>
          {cakeDetails.cakeText && (
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0 }}
              className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-amber-200 to-pink-200 text-center shadow-inner"
            >
              <p className="text-sm font-semibold text-gray-700">
                Cake Preview 🎂
              </p>
              <p className="text-lg font-extrabold text-amber-800 mt-1">
                “{cakeDetails.cakeText}”
              </p>
            </motion.div>
          )}
        </AnimatePresence>

        {/* CTA */}
        <motion.button
          whileHover={{ scale: 1.04 }}
          whileTap={{ scale: 0.96 }}
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-bold shadow-xl"
        >
          CONTINUE TO PAYMENT 💳
        </motion.button>
      </motion.div>
    </div>
  );
};

export default CustomerDetails;
