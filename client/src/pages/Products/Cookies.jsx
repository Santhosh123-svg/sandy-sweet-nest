import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useOrder } from "../../context/OrderContext";

const cookiesData = [
  { id: "CO1", name: "Choco Chip Cookie", price: 80, image: "/cookies/cookie1.jpg" },
  { id: "CO2", name: "Oats Raisin Cookie", price: 90, image: "/cookies/cookie2.webp" },
  { id: "CO3", name: "Butter Cookie", price: 70, image: "/cookies/cookie3.webp" },
  { id: "CO4", name: "Almond Cookie", price: 100, image: "/cookies/cookie4.webp" },
  { id: "CO5", name: "Peanut Butter Cookie", price: 95, image: "/cookies/cookie5.jpg" },
  { id: "CO6", name: "Cinnamon Cookie", price: 85, image: "/cookies/cookie6.webp" },
  { id: "CO7", name: "Double Chocolate Cookie", price: 110, image: "/cookies/cookie7.jpg" },
  { id: "CO8", name: "Honey Oats Cookie", price: 95, image: "/cookies/cookie8.webp" },
  { id: "CO9", name: "Coconut Cookie", price: 90, image: "/cookies/cookie9.jpg" },
  { id: "CO10", name: "Cranberry Cookie", price: 100, image: "/cookies/cookie10.jpeg" },
];

const Cookies = () => {
  const navigate = useNavigate();
  const { placeOrder } = useOrder();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const handleOrder = (cookie) => {
    setLoadingId(cookie.id);

    placeOrder({
      productName: cookie.name,
      price: cookie.price,
      image: cookie.image,  
      quantity: 1,
      category: "Cookies",
    });

    navigate("/order-flow");
    setLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 px-4 py-6 relative">
      <div className="flex items-center justify-between mb-4 relative z-10">
        <button
          onClick={() => navigate("/welcome")}
          className="flex items-center gap-2 text-amber-700 font-semibold"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 rounded-xl bg-white shadow-md hover:bg-amber-50"
        >
          <Menu size={22} />
        </button>
      </div>

      <AnimatePresence>
        {menuOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black z-40"
              onClick={() => setMenuOpen(false)}
            />

            <motion.div
              initial={{ x: "100%" }}
              animate={{ x: 0 }}
              exit={{ x: "100%" }}
              transition={{ type: "spring", stiffness: 120 }}
              className="fixed top-0 right-0 w-64 h-full bg-white z-50 shadow-2xl p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-xl font-bold text-amber-600">Menu</h2>
                <button onClick={() => setMenuOpen(false)}>
                  <X size={22} />
                </button>
              </div>

              <div className="flex flex-col gap-4">
                <button onClick={() => navigate("/cakes")} className="py-3 rounded-xl bg-amber-50 font-semibold hover:bg-amber-100">
                  🎂 Cakes
                </button>
                <button onClick={() => navigate("/chocolates")} className="py-3 rounded-xl bg-amber-50 font-semibold hover:bg-amber-100">
                  🍫 Chocolates
                </button>
                <button onClick={() => navigate("/more-items")} className="py-3 rounded-xl bg-amber-50 font-semibold hover:bg-amber-100">
                  🧁 More Items
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.h1
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="text-center text-3xl md:text-4xl font-extrabold text-amber-600 mb-8"
      >
        🍪 Cookies Collection
      </motion.h1>

      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
        >
          {cookiesData.map((cookie) => (
            <motion.div
              key={cookie.id}
              whileHover={{ y: -10 }}
              className="bg-white rounded-3xl overflow-hidden shadow-xl"
            >
              <img
                src={cookie.image}
                alt={cookie.name}
                className="h-44 w-full object-cover"
              />

              <div className="p-4 text-center">
                <h3 className="font-bold text-amber-700 text-lg">
                  {cookie.name}
                </h3>

                <div className="flex justify-between items-center mt-4">
                  <span className="font-extrabold text-amber-600">
                    ₹{cookie.price}
                  </span>

                  <motion.button
                    whileHover={{ scale: 1.1 }}
                    whileTap={{ scale: 0.9 }}
                    disabled={loadingId === cookie.id}
                    onClick={() => handleOrder(cookie)}
                    className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-sm"
                  >
                    {loadingId === cookie.id ? "Processing..." : "Order Now"}
                  </motion.button>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default Cookies;
