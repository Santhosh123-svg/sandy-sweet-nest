import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useOrder } from "../../context/OrderContext";

const chocolatesData = [
  { id: "C1", name: "Dark Chocolate Truffle", price: 250, image: "/chocolates/choco1.jpg" },
  { id: "C2", name: "Milk Chocolate Bar", price: 180, image: "/chocolates/choco2.avif" },
  { id: "C3", name: "White Chocolate Delight", price: 220, image: "/chocolates/choco3.jpg" },
  { id: "C4", name: "Hazelnut Chocolate", price: 300, image: "/chocolates/choco4.jpg" },
  { id: "C5", name: "Almond Crunch", price: 280, image: "/chocolates/choco5.avif" },
  { id: "C6", name: "Caramel Filled Chocolate", price: 260, image: "/chocolates/choco6.webp" },
  { id: "C7", name: "Fruit & Nut Chocolate", price: 320, image: "/chocolates/choco7.webp" },
  { id: "C8", name: "Belgian Dark Chocolate", price: 350, image: "/chocolates/choco8.webp" },
  { id: "C9", name: "Chocolate Fudge Square", price: 200, image: "/chocolates/choco9.webp" },
  { id: "C10", name: "Coffee Infused Chocolate", price: 290, image: "/chocolates/choco10.webp" },
  { id: "C11", name: "Orange Zest Chocolate", price: 270, image: "/chocolates/choco11.jpg" },
  { id: "C12", name: "Premium Assorted Box", price: 550, image: "/chocolates/choco12.webp" },
];

const Chocolates = () => {
  const navigate = useNavigate();
  const { placeOrder } = useOrder();
  const [menuOpen, setMenuOpen] = useState(false);
  const [loadingId, setLoadingId] = useState(null);

  const handleOrder = (choco) => {
    setLoadingId(choco.id);

    placeOrder({
      productName: choco.name,
      price: choco.price,
      image: choco.image,  
      quantity: 1,
      category: "Chocolates",
    });

    navigate("/order-flow");
    setLoadingId(null);
  };

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100 px-4 py-6 relative">
      <div className="flex items-center justify-between mb-6 relative z-20">
        <button
          onClick={() => navigate("/welcome")}
          className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow"
        >
          <ArrowLeft size={18} /> Back
        </button>

        <h1 className="text-3xl font-extrabold text-amber-700">
          🍫 Chocolates Collection
        </h1>

        <button
          onClick={() => setMenuOpen(true)}
          className="p-2 bg-white rounded-xl shadow"
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
                <button
                  onClick={() => navigate("/cakes")}
                  className="py-3 rounded-xl bg-amber-50 font-semibold hover:bg-amber-100"
                >
                  🎂 Cakes
                </button>
                <button
                  onClick={() => navigate("/cookies")}
                  className="py-3 rounded-xl bg-amber-50 font-semibold hover:bg-amber-100"
                >
                  🍪 Cookies
                </button>
                <button
                  onClick={() => navigate("/more-items")}
                  className="py-3 rounded-xl bg-amber-50 font-semibold hover:bg-amber-100"
                >
                  🧁 More Items
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 relative z-10">
        {chocolatesData.map((choco) => (
          <motion.div
            key={choco.id}
            whileHover={{ scale: 1.05 }}
            className="bg-white rounded-3xl shadow-xl overflow-hidden"
          >
            <img
              src={choco.image}
              alt={choco.name}
              className="w-full h-48 object-cover"
            />

            <div className="p-4 text-center">
              <h3 className="font-bold">{choco.name}</h3>
              <p className="text-amber-600 font-semibold mt-2">
                ₹ {choco.price}
              </p>

              <motion.button
                whileHover={{ scale: 1.08 }}
                disabled={loadingId === choco.id}
                onClick={() => handleOrder(choco)}
                className="mt-4 w-full py-3 bg-amber-500 text-white rounded-xl font-bold"
              >
                {loadingId === choco.id ? "Processing..." : "Order Now"}
              </motion.button>
            </div>
          </motion.div>
        ))}
      </motion.div>
    </div>
  );
};

export default Chocolates;
