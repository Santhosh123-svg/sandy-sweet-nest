import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { FiLogOut, FiUser, FiShoppingBag, FiInfo, FiGrid } from "react-icons/fi";
import { FaInstagram, FaWhatsapp, FaFacebook } from "react-icons/fa";

const Welcome = () => {
  const [showCategories, setShowCategories] = useState(false);
  const [showMobileMenu, setShowMobileMenu] = useState(false);
  const [showIntro, setShowIntro] = useState(true);
  const navigate = useNavigate();

  const role = localStorage.getItem("role");

  // ✅ 2-SECOND CAKE LOADER ANIMATION
  useEffect(() => {
    const timer = setTimeout(() => {
      setShowIntro(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("role");
    navigate("/login");
  };

  const handleCategoryClick = (name) => {
    if (name === "Cakes") navigate("/cakes");
    if (name === "Chocolates") navigate("/chocolates");
    if (name === "Cookies") navigate("/cookies");
    if (name === "More Items") navigate("/more-items");
  };

  const categories = [
    { name: "Cakes", desc: "Birthday • Wedding • Special" },
    { name: "Chocolates", desc: "Gift boxes • Special" },
    { name: "Cookies", desc: "Choco chips • Oats" },
    { name: "More Items", desc: "Brownies • Pastries" },
  ];

  // 🔥 INTRO SCREEN
  if (showIntro) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-amber-50">
        <motion.div
          initial={{ scale: 0, rotate: -180 }}
          animate={{ scale: 1, rotate: 0 }}
          transition={{ duration: 1 }}
          className="text-7xl"
        >
          🍰
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-gradient-to-b from-amber-50 to-amber-100">
      {/* NAVBAR */}
      <nav className="relative isolate z-50 w-full px-6 py-4 flex items-center justify-between bg-white/70 backdrop-blur-md border-b border-white/40 shadow-sm">
        {/* LEFT */}
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-2xl bg-amber-200 flex items-center justify-center shadow-md">
            <span className="text-xl">🍰</span>
          </div>
          <div>
            <h1 className="font-extrabold text-amber-600 text-lg">
              Sandy’s Sweet Nest
            </h1>
            <p className="text-xs text-gray-500">Bright • Creamy • Yummy</p>
          </div>
        </div>

        {/* RIGHT */}
        <div className="relative z-50">
          <button
            className="p-2 rounded-lg bg-white border border-amber-100 shadow-sm hover:bg-amber-50 transition z-50 relative"
            onClick={() => setShowMobileMenu(!showMobileMenu)}
          >
            ☰
          </button>

          {showMobileMenu && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.2 }}
              className="absolute right-0 mt-2 w-44 bg-white rounded-xl shadow-xl border border-gray-200 p-3 z-60"
            >
              {role === "admin" && (
                <button
                  onClick={() => navigate("/admin")}
                  className="flex items-center gap-2 w-full text-left px-2 py-2 font-semibold text-amber-700 hover:bg-amber-50 rounded-lg"
                >
                  <FiGrid className="text-xl" />
                  Dashboard
                </button>
              )}

              {role === "user" && (
                <button
                  onClick={() => navigate("/my-orders")}
                  className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:bg-amber-50 rounded-lg"
                >
                  <FiShoppingBag className="text-xl text-amber-600" />
                  <span className="font-medium">My Orders</span>
                </button>
              )}

              <button
                onClick={() => navigate("/about")}
                className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:bg-amber-50 rounded-lg"
              >
                <FiInfo className="text-xl text-amber-600" />
                <span className="font-medium">About</span>
              </button>

              {role === "user" && (
                <button
                  onClick={() => navigate("/complete-profile?edit=true")}
                  className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:bg-amber-50 rounded-lg"
                >
                  <FiUser className="text-xl" />
                  Edit Profile
                </button>
              )}

              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-2 py-2 text-gray-700 hover:bg-amber-50 rounded-lg"
              >
                <FiLogOut className="text-xl" />
                Logout
              </button>
            </motion.div>
          )}
        </div>
      </nav>

      {/* MAIN */}
      <div className="flex-1 flex items-center justify-center">
        <div className="w-full max-w-6xl px-6 py-12">
          <motion.div
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="grid grid-cols-1 md:grid-cols-2 gap-8"
          >
            {/* LEFT */}
            <div className="rounded-[30px] bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl p-8">
              <h2 className="text-5xl font-extrabold text-amber-600 mb-4">
                Welcome to <br /> Sandy’s Sweet Nest
              </h2>

              <p className="text-gray-600 text-lg">
                Order fresh cakes, chocolates, cookies and more.
                <br />
                <span className="text-amber-500 font-semibold">
                  Fast delivery • Fresh taste • Easy checkout
                </span>
              </p>

              <div className="mt-8 flex flex-wrap gap-3">
                <button
                  onClick={() => setShowCategories(true)}
                  className="px-6 py-3 rounded-xl bg-amber-500 text-white font-bold shadow-md hover:bg-amber-600 transition"
                >
                  Order Now
                </button>

                <Link to="/about">
                  <button className="px-6 py-3 rounded-xl bg-white text-amber-700 font-bold border border-amber-200 shadow-sm hover:bg-amber-50 transition">
                    About Us
                  </button>
                </Link>
              </div>
            </div>

            {/* RIGHT */}
            {showCategories && (
              <div className="rounded-[30px] bg-white/80 backdrop-blur-lg border border-white/40 shadow-2xl p-6">
                <h3 className="text-2xl font-bold text-amber-600 mb-4">
                  Choose your category
                </h3>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {categories.map((cat, idx) => (
                    <div
                      key={idx}
                      onClick={() => handleCategoryClick(cat.name)}
                      className="p-5 rounded-2xl bg-amber-50 border border-amber-100 shadow-inner cursor-pointer hover:scale-105 transition"
                    >
                      <h4 className="font-bold text-amber-700 text-lg">
                        {cat.name}
                      </h4>
                      <p className="text-gray-600 mt-2">{cat.desc}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </motion.div>
        </div>
      </div>

      {/* FOOTER */}
      <footer className="w-full px-6 py-4 bg-white/60 backdrop-blur-md border-t border-white/30">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row justify-between items-center gap-4">
          <div className="text-gray-600 text-sm">
            © 2026 Sandy’s Sweet Nest • All Rights Reserved
          </div>
<div className="flex gap-6 text-2xl text-amber-600">
  <a
    href="https://www.instagram.com/_jith__sandy_?igsh=ZzVteXU1N2Jjemdi"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaInstagram className="hover:text-amber-600 hover:scale-110 transition" />
  </a>

  <a
    href="https://wa.me/916374122294"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaWhatsapp className="hover:text-green-500 hover:scale-110 transition" />
  </a>

  <a
    href="https://www.facebook.com/profile.php?id=100088894746265"
    target="_blank"
    rel="noopener noreferrer"
  >
    <FaFacebook className="hover:text-blue-600 hover:scale-110 transition" />
  </a>
</div>

        </div>
      </footer>
    </div>
  );
};

export default Welcome;
