import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useOrder } from "../../context/OrderContext";

const MoreItems = () => {
  const navigate = useNavigate();
  const { placeOrder } = useOrder();

  const [menuOpen, setMenuOpen] = useState(false);
  const [category, setCategory] = useState(null);
  const [loadingId, setLoadingId] = useState(null);

  const items = {
    cupcake: [
      { id: "CU1", name: "Red Velvet Cupcake", price: 120, image: "/more/cupcake1.jpeg" },
      { id: "CU2", name: "Chocolate Cupcake", price: 110, image: "/more/cupcake2.webp" },
      { id: "CU3", name: "Vanilla Cupcake", price: 100, image: "/more/cupcake3.webp" },
      { id: "CU4", name: "Strawberry Cupcake", price: 130, image: "/more/cupcake4.webp" },
      { id: "CU5", name: "Oreo Cupcake", price: 140, image: "/more/cupcake5.jpeg" },
      { id: "CU6", name: "Butterscotch Cupcake", price: 125, image: "/more/cupcake6.webp" },
    ],
    pastries: [
      { id: "PA1", name: "Chocolate Pastry", price: 150, image: "/more/pastry1.webp" },
      { id: "PA2", name: "Pineapple Pastry", price: 140, image: "/more/pastry2.jpeg" },
      { id: "PA3", name: "Black Forest Pastry", price: 160, image: "/more/pastry3.webp" },
      { id: "PA4", name: "Blueberry Pastry", price: 155, image: "/more/pastry4.webp" },
      { id: "PA5", name: "Mango Pastry", price: 150, image: "/more/pastry5.png" },
      { id: "PA6", name: "Cream Pastry", price: 145, image: "/more/pastry6.jpg" },
    ],
    beverages: [
      { id: "BE1", name: "Chocolate Shake", price: 120, image: "/more/shake1.webp" },
      { id: "BE2", name: "Vanilla Shake", price: 110, image: "/more/shake2.webp" },
      { id: "BE3", name: "Strawberry Shake", price: 130, image: "/more/shake3.webp" },
      { id: "BE4", name: "Cold Coffee", price: 140, image: "/more/shake4.jpeg" },
      { id: "BE5", name: "Mango Shake", price: 135, image: "/more/shake5.webp" },
      { id: "BE6", name: "Oreo Shake", price: 150, image: "/more/shake6.avif" },
    ],
  };

  const handleOrder = (item) => {
    setLoadingId(item.id);

    placeOrder({
      productName: item.name,
      price: item.price,
      image: item.image,  
      quantity: 1,
      category: category,
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
                <button onClick={() => navigate("/cookies")} className="py-3 rounded-xl bg-amber-50 font-semibold hover:bg-amber-100">
                  🍪 Cookies
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
        🧁 More Items
      </motion.h1>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-10">
        {[
          { key: "cupcake", label: "🧁 Cup Cake" },
          { key: "pastries", label: "🥐 Pastries" },
          { key: "beverages", label: "🥤 Beverages & Shakes" },
        ].map((c) => (
          <motion.button
            key={c.key}
            whileHover={{ scale: 1.08 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCategory(c.key)}
            className={`p-6 rounded-3xl font-bold shadow-xl ${
              category === c.key
                ? "bg-amber-600 text-white"
                : "bg-white text-amber-700 border"
            }`}
          >
            {c.label}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {category && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6"
          >
            {items[category].map((item) => (
              <motion.div
                key={item.id}
                whileHover={{ y: -10 }}
                className="bg-white rounded-3xl overflow-hidden shadow-xl"
              >
                <img src={item.image} alt={item.name} className="h-44 w-full object-cover" />

                <div className="p-4 text-center">
                  <h3 className="font-bold text-amber-700 text-lg">{item.name}</h3>

                  <div className="flex justify-between items-center mt-4">
                    <span className="font-extrabold text-amber-600">₹{item.price}</span>

                    <motion.button
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      disabled={loadingId === item.id}
                      onClick={() => handleOrder(item)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-sm"
                    >
                      {loadingId === item.id ? "Processing..." : "Order Now"}
                    </motion.button>
                  </div>
                </div>
              </motion.div>
            ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default MoreItems;
