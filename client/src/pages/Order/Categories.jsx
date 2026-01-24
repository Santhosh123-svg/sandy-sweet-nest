import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

const Categories = () => {
  const categories = [
    {
      name: "Cakes",
      desc: "Birthday • Anniversary • Wedding",
      route: "/products/cakes",
    },
    {
      name: "Chocolates",
      desc: "Gift Boxes • Special",
      route: "/products/chocolates",
    },
    {
      name: "Cookies",
      desc: "Oats • Choco Chips",
      route: "/products/cookies",
    },
    {
      name: "More Items",
      desc: "Brownies • Pastries",
      route: "/products/more",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <motion.h2
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          className="text-4xl font-extrabold text-amber-600 text-center mb-6"
        >
          Choose Category
        </motion.h2>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.8 }}
          className="grid grid-cols-1 md:grid-cols-2 gap-6"
        >
          {categories.map((cat, idx) => (
            <Link key={idx} to={cat.route}>
              <motion.div
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.98 }}
                className="p-6 rounded-3xl bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl"
              >
                <h3 className="text-2xl font-bold text-amber-700">
                  {cat.name}
                </h3>
                <p className="text-gray-600 mt-2">{cat.desc}</p>
                <div className="mt-4">
                  <button className="px-5 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition">
                    Explore
                  </button>
                </div>
              </motion.div>
            </Link>
          ))}
        </motion.div>
      </div>
    </div>
  );
};

export default Categories;
