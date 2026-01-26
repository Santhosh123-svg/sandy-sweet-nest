import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrder } from "../context/OrderContext";
import { User, Phone, MapPin, ChevronLeft } from "lucide-react";

const CustomerDetails = () => {
  const navigate = useNavigate();
  const { order, placeOrder } = useOrder();

  /* ================= PROTECTION ================= */
  useEffect(() => {
    if (!order) {
      navigate("/welcome");
      return;
    }
  }, [order, navigate]);

  const [customer, setCustomer] = useState({
    name: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setCustomer({
      ...customer,
      [e.target.name]: e.target.value,
    });
  };

  const handleNext = () => {
    const { name, phone, address } = customer;

    if (!name || !phone || !address) {
      alert("Please fill all customer details");
      return;
    }

    placeOrder({
      ...order,
      customerInfo: customer,
    });

    navigate("/payment");
  };

  if (!order) return null;

  /* ================= UI ================= */
  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-100 via-orange-100 to-pink-100 flex items-center justify-center px-4 py-8">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
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
            Customer Details
          </span>
        </div>

        <h2 className="text-2xl font-extrabold text-center text-amber-600 mb-6">
          🧁 Customer Information
        </h2>

        {/* NAME */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4"
        >
          <label className="font-semibold text-gray-700 flex items-center gap-2 mb-2">
            <User size={18} /> Customer Name *
          </label>
          <input
            type="text"
            name="name"
            value={customer.name}
            onChange={handleChange}
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
            <Phone size={18} /> Phone Number *
          </label>
          <input
            type="text"
            name="phone"
            value={customer.phone}
            onChange={handleChange}
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
            onChange={handleChange}
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
