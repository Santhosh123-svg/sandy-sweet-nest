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
  User,
  Phone,
  MapPin,
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

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
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

  const handleCustomerChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handlePurposeSelect = (value) => {
    setCakeDetails({ ...cakeDetails, purpose: value });
  };

  const handleNext = () => {
    const { deliveryDate, preferredTime, purpose, cakeText } = cakeDetails;
    const { name, phone, address } = customer;

    if (!deliveryDate || !preferredTime || !purpose || !cakeText) {
      alert("Please fill all cake details 🎂");
      return;
    }

    if (!name || !phone || !address) {
      alert("Please fill all customer details 🧑");
      return;
    }

    placeOrder({
      ...order,
      cakeInfo: cakeDetails,
      customerInfo: customer,
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

        {/* ====== NEW CUSTOMER DETAILS ====== */}
        <h2 className="text-xl font-extrabold text-center text-amber-600 mb-4">
          🧑 Customer Details
        </h2>

        {/* NAME */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <User size={18} /> Name *
          </label>
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleCustomerChange}
            placeholder="Enter your name"
            className="w-full p-3 rounded-2xl bg-white/70 border focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </motion.div>

        {/* PHONE */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="mb-4"
        >
          <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <Phone size={18} /> Phone *
          </label>
          <input
            type="text"
            name="phone"
            value={customer.phone}
            onChange={handleCustomerChange}
            placeholder="Enter phone number"
            className="w-full p-3 rounded-2xl bg-white/70 border focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </motion.div>

        {/* ADDRESS */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="mb-6"
        >
          <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <MapPin size={18} /> Address *
          </label>
          <textarea
            name="address"
            value={customer.address}
            onChange={handleCustomerChange}
            placeholder="Enter delivery address"
            rows={3}
            className="w-full p-3 rounded-2xl bg-white/70 border focus:ring-2 focus:ring-amber-400 outline-none"
          />
        </motion.div>

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
