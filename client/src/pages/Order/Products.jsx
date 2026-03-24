import React from "react";
import { Link, useParams } from "react-router-dom";
import { motion } from "framer-motion";

const Products = () => {
  const { category } = useParams();

  // Sample product data (you can change later)
  const products = [
    {
      name: "Classic Chocolate Cake",
      price: 850,
      img: "https://images.unsplash.com/photo-1542828132-92c3a5b6c6a4?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Strawberry Cream Cake",
      price: 900,
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    },
    {
      name: "Vanilla Cookies",
      price: 250,
      img: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-amber-100">
      <div className="max-w-6xl mx-auto px-6 py-10">
        <h2 className="text-3xl font-extrabold text-amber-600 mb-6">
          {category.toUpperCase()}
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {products.map((p, idx) => (
            <motion.div
              key={idx}
              whileHover={{ scale: 1.03 }}
              className="bg-white rounded-3xl shadow-2xl border border-white/40 overflow-hidden"
            >
              <img src={p.img} className="w-full h-48 object-cover" alt="" />
              <div className="p-5">
                <h3 className="font-bold text-amber-700">{p.name}</h3>
                <p className="text-gray-600 mt-2">₹{p.price}</p>
                <Link to="/login">
                  <button className="mt-4 px-5 py-2 rounded-xl bg-amber-500 text-white font-bold hover:bg-amber-600 transition">
                    Order Now
                  </button>
                </Link>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Products;
