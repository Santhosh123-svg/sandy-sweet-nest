import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrder } from "../context/OrderContext";

const flavours = [
  "Vanilla",
  "Chocolate",
  "Butterscotch",
  "Red Velvet",
  "Strawberry",
];

const CheckoutDetails = () => {
  const navigate = useNavigate();
  const { placeOrder } = useOrder();

  const [form, setForm] = useState({
    flavour: "",
    quantity: 1,
    customerName: "",
    phone: "",
    address: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const submitHandler = () => {
    if (
      !form.flavour ||
      !form.customerName ||
      !form.phone ||
      !form.address
    ) {
      alert("Please fill all details");
      return;
    }

    placeOrder(form); // store in context
    navigate("/checkout"); // success page
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-pink-50">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-8 rounded-3xl shadow-xl w-full max-w-lg"
      >
        <h2 className="text-2xl font-extrabold text-pink-600 mb-6 text-center">
          Order Details 🍰
        </h2>

        {/* Flavour */}
        <select
          name="flavour"
          value={form.flavour}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-xl"
        >
          <option value="">Select Flavour</option>
          {flavours.map((f) => (
            <option key={f} value={f}>
              {f}
            </option>
          ))}
        </select>

        {/* Quantity */}
        <input
          type="number"
          name="quantity"
          min="1"
          value={form.quantity}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-xl"
        />

        {/* Customer Name */}
        <input
          type="text"
          name="customerName"
          placeholder="Customer Name"
          value={form.customerName}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-xl"
        />

        {/* Phone */}
        <input
          type="tel"
          name="phone"
          placeholder="Phone Number"
          value={form.phone}
          onChange={handleChange}
          className="w-full p-3 mb-4 border rounded-xl"
        />

        {/* Address */}
        <textarea
          name="address"
          placeholder="Delivery Address"
          value={form.address}
          onChange={handleChange}
          className="w-full p-3 mb-6 border rounded-xl"
        />

        <button
          onClick={submitHandler}
          className="w-full py-3 bg-pink-500 text-white font-bold rounded-xl hover:bg-pink-600"
        >
          Continue to Checkout →
        </button>
      </motion.div>
    </div>
  );
};

export default CheckoutDetails;
