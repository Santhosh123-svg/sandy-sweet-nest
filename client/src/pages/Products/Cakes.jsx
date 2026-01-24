import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, Menu, X } from "lucide-react";
import { useOrder } from "../../context/OrderContext";

const Cakes = () => {
  const navigate = useNavigate();
  const { placeOrder } = useOrder();

  const [eggType, setEggType] = useState(null);
  const [cakeType, setCakeType] = useState(null);
  const [loadingId, setLoadingId] = useState(null);
  const [menuOpen, setMenuOpen] = useState(false);

  const cakesData = [
     {
    id: "1",
    eggType: "with",
    cakeType: "ice",
    name: "Chocolate Ice Fantasy",
    price: 899,
    image: "/cakes/cake1.jpg",
  }, {
    id: "2",
    eggType: "with",
    cakeType: "ice",
    name: "Black Forest Ice Bliss",
    price: 949,
    image: "/cakes/cake2.jpg",
  }, {
    id: "3",
    eggType: "with",
    cakeType: "ice",
    name: "Oreo Ice Cream Cake",
    price: 999,
    image: "/cakes/cake3.avif",
  }, {
    id: "4",
    eggType: "with",
    cakeType: "ice",
    name: "KitKat Ice Cake",
    price: 1049,
    image: "/cakes/cake4.jpg",
  }, {
    id: "5",
    eggType: "with",
    cakeType: "ice",
    name: "Choco Lava Ice Cake",
    price: 1099,
    image: "/cakes/cake5.avif",
  }, {
    id: "6",
    eggType: "with",
    cakeType: "ice",
    name: "Belgian Chocolate Ice Cake",
    price: 1199,
    image: "/cakes/cake6.webp",
  }, {
    id: "7",
    eggType: "with",
    cakeType: "ice",
    name: "Red Velvet Ice Cake",
    price: 1149,
    image: "/cakes/cake7.webp",
  }, {
    id: "8",
    eggType: "with",
    cakeType: "ice",
    name: "Ferrero Rocher Ice Cake",
    price: 1299,
    image: "/cakes/cale7.webp",
  }, {
    id: "9",
    eggType: "with",
    cakeType: "ice",
    name: "Coffee Crunch Ice Cake",
    price: 1099,
    image: "/cakes/cake9.webp",
  }, {
    id: "10",
    eggType: "with",
    cakeType: "ice",
    name: "Triple Chocolate Ice Cake",
    price: 1249,
    image: "/cakes/cake10.webp",
  }, {
    id: "11",
    eggType: "with",
    cakeType: "normal",
    name: "Classic Chocolate Truffle",
    price: 699,
    image: "/cakes/cake11.jpg",
  }, {
    id: "12",
    eggType: "with",
    cakeType: "normal",
    name: "Black Forest Cake",
    price: 749,
    image: "/cakes/cake12.jpg",
  }, {
    id: "13",
    eggType: "with",
    cakeType: "normal",
    name: "Pineapple Delight Cake",
    price: 699,
    image: "/cakes/cake13.webp",
  }, {
    id: "14",
    eggType: "with",
    cakeType: "normal",
    name: "Chocolate Fudge Cake",
    price: 799,
    image: "/cakes/cake14.jpg",
  }, {
    id: "15",
    eggType: "with",
    cakeType: "normal",
    name: "Red Velvet Cream Cake",
    price: 849,
    image: "/cakes/cake15.avif",
  }, {
    id: "16",
    eggType: "with",
    cakeType: "normal",
    name: "Butterscotch Crunch Cake",
    price: 749,
    image: "/cakes/cake16.webp",
  }, {
    id: "17",
    eggType: "with",
    cakeType: "normal",
    name: "Coffee Mocha Cake",
    price: 799,
    image: "/cakes/cake17.webp",
  }, {
    id: "18",
    eggType: "with",
    cakeType: "normal",
    name: "Dark Chocolate Layer Cake",
    price: 899,
    image: "/cakes/cake18.avif",
  }, {
    id: "19",
    eggType: "with",
    cakeType: "normal",
    name: "Vanilla Almond Cake",
    price: 699,
    image: "/cakes/cake19.jpg",
  }, {
    id: "20",
    eggType: "with",
    cakeType: "normal",
    name: "Chocolate Caramel Cake",
    price: 849,
    image: "/cakes/cake20.jpg",
  }, {
    id: "21",
    eggType: "without",
    cakeType: "ice",
    name: "Veg Chocolate Ice Cake",
    price: 949,
    image: "/cakes/cake21.webp",
  }, {
    id: "22",
    eggType: "without",
    cakeType: "ice",
    name: "Veg Oreo Ice Cake",
    price: 999,
    image: "/cakes/cake22.jpg",
  }, {
    id: "23",
    eggType: "without",
    cakeType: "ice",
    name: "Veg Mango Ice Cake",
    price: 1049,
    image: "/cakes/cake23.jpg",
  }, {
    id: "24",
    eggType: "without",
    cakeType: "ice",
    name: "Veg Strawberry Ice Cake",
    price: 1049,
    image: "/cakes/cake24.jpg",
  }, {
    id: "25",
    eggType: "without",
    cakeType: "ice",
    name: "Veg Vanilla Ice Cream Cake",
    price: 899,
    image: "/cakes/cake25.webp",
  }, {
    id: "26",
    eggType: "without",
    cakeType: "ice",
    name: "Veg Belgian Ice Cake",
    price: 1199,
    image: "/cakes/cake26.jpg",
  }, {
    id: "27",
    eggType: "without",
    cakeType: "ice",
    name: "Veg Blueberry Ice Cake",
    price: 1099,
    image: "/cakes/cake27.jpeg",
  }, {
    id: "28",
    eggType: "without",
    cakeType: "ice",
    name: "Veg Chocolate Chips Ice Cake",
    price: 1049,
    image: "/cakes/cake28.png",
  }, {
    id: "29",
    eggType: "without",
    cakeType: "ice",
    name: "Veg Pista Ice Cake",
    price: 1099,
    image: "/cakes/cake29.webp",
  }, {
    id: "30",
    eggType: "without",
    cakeType: "ice",
    name: "Veg Rainbow Ice Cake",
    price: 1049,
    image: "/cakes/cake30.webp",
  }, {
    id: "31",
    eggType: "without",
    cakeType: "normal",
    name: "Eggless Chocolate Cake",
    price: 649,
    image: "/cakes/cake31.webp",
  }, {
    id: "32",
    eggType: "without",
    cakeType: "normal",
    name: "Eggless Vanilla Cake",
    price: 599,
    image: "/cakes/cake32.webp",
  }, {
    id: "33",
    eggType: "without",
    cakeType: "normal",
    name: "Eggless Black Forest Cake",
    price: 699,
    image: "/cakes/cake33.jpg",
  }, {
    id: "34",
    eggType: "without",
    cakeType: "normal",
    name: "Eggless Pineapple Cake",
    price: 649,
    image: "/cakes/cake34.webp",
  }, {
    id: "35",
    eggType: "without",
    cakeType: "normal",
    name: "Eggless Red Velvet Cake",
    price: 799,
    image: "/cakes/cake35.webp",
  }, {
    id: "36",
    eggType: "without",
    cakeType: "normal",
    name: "Eggless Butterscotch Cake",
    price: 699,
    image: "/cakes/cake36.jpg",
  }, {
    id: "37",
    eggType: "without",
    cakeType: "normal",
    name: "Eggless Chocolate Truffle",
    price: 799,
    image: "/cakes/cake37.jpg",
  }, {
    id: "38",
    eggType: "without",
    cakeType: "normal",
    name: "Eggless Almond Cake",
    price: 749,
    image: "/cakes/cake38.jpeg",
  }, {
    id: "39",
    eggType: "without",
    cakeType: "normal",
    name: "Eggless Strawberry Cake",
    price: 699,
    image: "/cakes/cake39.jpg",
  }, {
    id: "40",
    eggType: "without",
    cakeType: "normal",
    name: "Eggless Fruit Overload Cake",
    price: 749,
    image: "/cakes/cake40.webp",
  },
  ];

  const filteredCakes = cakesData.filter(
    (c) => c.eggType === eggType && c.cakeType === cakeType
  );

  const handleOrder = (cake) => {
    setLoadingId(cake.id);

    placeOrder({
      productName: cake.name,
      price: cake.price,
       image: cake.image,
      quantity: 1,
      category: "cake",
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
                <button onClick={() => navigate("/chocolates")} className="py-3 rounded-xl bg-amber-50 font-semibold">
                  🍫 Chocolates
                </button>
                <button onClick={() => navigate("/cookies")} className="py-3 rounded-xl bg-amber-50 font-semibold">
                  🍪 Cookies
                </button>
                <button onClick={() => navigate("/more-items")} className="py-3 rounded-xl bg-amber-50 font-semibold">
                  🧁 More Items
                </button>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      <motion.h1 className="text-center text-3xl md:text-4xl font-extrabold text-amber-600 mb-8">
        🎂 Cakes Collection
      </motion.h1>

      <div className="flex justify-center gap-4 mb-6">
        {["with", "without"].map((t) => (
          <motion.button
            key={t}
            onClick={() => {
              setEggType(t);
              setCakeType(null);
            }}
            className={`px-6 py-3 rounded-2xl font-bold shadow-lg ${
              eggType === t ? "bg-amber-500 text-white" : "bg-white text-amber-700 border"
            }`}
          >
            {t === "with" ? "With Egg 🥚" : "Without Egg 🚫🥚"}
          </motion.button>
        ))}
      </div>

      <AnimatePresence>
        {eggType && (
          <motion.div className="flex justify-center gap-4 mb-10">
            {["ice", "normal"].map((t) => (
              <motion.button
                key={t}
                onClick={() => setCakeType(t)}
                className={`px-6 py-3 rounded-2xl font-bold shadow-lg ${
                  cakeType === t ? "bg-amber-600 text-white" : "bg-white text-amber-700 border"
                }`}
              >
                {t === "ice" ? "Ice Cake ❄️" : "Normal Cake 🍰"}
              </motion.button>
            ))}
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {cakeType && (
          <motion.div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {filteredCakes.map((cake) => (
              <motion.div key={cake.id} className="bg-white rounded-3xl overflow-hidden shadow-xl">
                <img src={cake.image} alt={cake.name} className="h-44 w-full object-cover" />
                <div className="p-4">
                  <h3 className="font-bold text-amber-700 text-lg">{cake.name}</h3>
                  <div className="flex justify-between items-center mt-4">
                    <span className="font-extrabold text-amber-600">₹{cake.price}</span>
                    <motion.button
                      disabled={loadingId === cake.id}
                      onClick={() => handleOrder(cake)}
                      className="px-4 py-2 rounded-xl bg-amber-500 text-white font-bold text-sm"
                    >
                      {loadingId === cake.id ? "Loading..." : "Order Now"}
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

export default Cakes;
