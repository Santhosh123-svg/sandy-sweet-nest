import { motion } from "framer-motion";
import {
  FaInstagram,
  FaWhatsapp,
  FaFacebook,
  FaChevronLeft,
  FaChevronRight,
  FaMapMarkerAlt,
  FaClock,
  FaHeart,
  FaStore,
  FaBirthdayCake,
  FaBookOpen,
  FaArrowLeft,
} from "react-icons/fa";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const cakeImages = [
  "/images/98c95b0f-a75d-4c2f-8a16-1816dbd241b1.jpg",
  "/images/WhatsApp Image 2026-01-23 at 8.11.31 PM (1).jpeg",
  "/images/WhatsApp Image 2026-01-23 at 8.11.31 PM (2).jpeg",
  "/images/WhatsApp Image 2026-01-23 at 8.11.31 PM.jpeg",
  "/images/WhatsApp Image 2026-01-23 at 8.11.32 PM.jpeg",
];

const About = () => {
  const [index, setIndex] = useState(0);
  const navigate = useNavigate();

  const next = () =>
    setIndex((i) => (i + 1) % cakeImages.length);

  const prev = () =>
    setIndex((i) => (i - 1 + cakeImages.length) % cakeImages.length);

  /* 🔁 AUTO SLIDE EVERY 3 SEC */
  useEffect(() => {
    const interval = setInterval(() => {
      next();
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="bg-gradient-to-b from-amber-50 to-amber-100 text-gray-700 overflow-hidden relative">

      {/* 🔙 BACK BUTTON */}
      <motion.button
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        onClick={() => navigate("/welcome")}
        className="fixed top-5 left-5 z-50 bg-white shadow-xl rounded-full p-3 text-amber-600"
      >
        <FaArrowLeft size={20} />
      </motion.button>

      {/* HERO */}
      <section className="pt-20 pb-12 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="max-w-5xl mx-auto text-center"
        >
          <h1 className="text-5xl md:text-6xl font-extrabold text-amber-600">
            🍰 Welcome to Sandy's Sweet Nest
          </h1>

          <p className="mt-4 text-2xl font-semibold text-amber-500 flex items-center justify-center gap-2">
            <FaHeart className="text-pink-500" /> Every Cake Made With Love
          </p>

          <p className="mt-5 text-lg text-gray-600 leading-relaxed">
            Step into a world where every creation is crafted with love,
            passion, and the finest ingredients. From intimate celebrations
            to grand occasions, we turn your sweetest dreams into
            <span className="text-amber-600 font-semibold">
              {" "}delicious reality.
            </span>
          </p>
        </motion.div>
      </section>

      {/* CREATIONS */}
      <section className="pb-20 px-6">
        <h2 className="text-4xl font-bold text-center text-amber-600 mb-10 flex items-center justify-center gap-3">
          <FaBirthdayCake /> Our Delicious Creations
        </h2>

        <div className="relative max-w-lg mx-auto">
          <motion.img
            key={index}
            src={cakeImages[index]}
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="w-full h-72 md:h-80 object-cover rounded-[32px] shadow-2xl"
          />

          {/* PREV */}
          <button
            onClick={prev}
            className="absolute left-3 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition"
          >
            <FaChevronLeft />
          </button>

          {/* NEXT */}
          <button
            onClick={next}
            className="absolute right-3 top-1/2 -translate-y-1/2 bg-white/90 p-3 rounded-full shadow-lg hover:scale-110 transition"
          >
            <FaChevronRight />
          </button>
        </div>
      </section>

      {/* SHOPS */}
      <section className="pb-20 px-6">
        <h2 className="text-4xl font-bold text-center text-amber-600 mb-12 flex items-center justify-center gap-3">
          <FaStore /> Visit Our Shops
        </h2>

        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-10">
          {/* SHOP 1 */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="bg-white rounded-[32px] shadow-xl p-6"
          >
            <img
              src="/images/WhatsApp Image 2026-01-23 at 8.11.30 PM (1).jpeg"
              className="rounded-2xl w-full h-56 object-cover"
            />

            <h3 className="text-2xl font-bold mt-5 text-amber-600">
              Downtown Flagship
            </h3>

            <p className="flex items-center gap-2 mt-3">
              <FaMapMarkerAlt className="text-amber-500" />
              66/1 2nd Market Street, Ammapet, Salem
            </p>

            <p className="text-sm text-gray-500 ml-6">
              SKT Text Opposite
            </p>

            <p className="flex items-center gap-2 mt-2">
              <FaClock className="text-amber-500" />
              9 AM – 9 PM
            </p>
          </motion.div>

          {/* SHOP 2 */}
          <motion.div
            whileHover={{ scale: 1.04 }}
            className="bg-white rounded-[32px] shadow-xl p-6"
          >
            <img
              src="/images/WhatsApp Image 2026-01-23 at 8.11.30 PM.jpeg"
              className="rounded-2xl w-full h-56 object-cover"
            />

            <h3 className="text-2xl font-bold mt-5 text-amber-600">
              Suburb Branch
            </h3>

            <p className="flex items-center gap-2 mt-3">
              <FaMapMarkerAlt className="text-amber-500" />
              24B Alazhgapan Street, Ammapet, Salem
            </p>

            <p className="text-sm text-gray-500 ml-6">
              Kamarajar Statue Near
            </p>

            <p className="flex items-center gap-2 mt-2">
              <FaClock className="text-amber-500" />
              10 AM – 10 PM
            </p>
          </motion.div>
        </div>
      </section>

      {/* JOURNEY */}
      <section className="pb-20 px-6">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="max-w-4xl mx-auto bg-white/80 backdrop-blur-lg rounded-[32px] shadow-2xl p-10 text-center"
        >
          <h2 className="text-4xl font-bold text-amber-600 mb-6 flex items-center justify-center gap-3">
            <FaBookOpen /> Our Sweet Journey
          </h2>

          <p className="text-lg text-gray-600 leading-relaxed">
            Founded in 2020 with a dream to bring artisanal baking to our
            community, Sandy's Sweet Nest has become the heart of countless
            celebrations. We don’t just bake cakes —
            <span className="text-amber-600 font-semibold">
              {" "}we create memories that last a lifetime.
            </span>
          </p>
        </motion.div>
      </section>

      {/* FOOTER */}
      <footer className="py-8 bg-white border-t">
        <div className="flex flex-col items-center gap-4">
          <p className="text-sm text-gray-600">
            © 2025 Sandy's Sweet Nest. Made with 💝
          </p>

          <div className="flex gap-6 text-2xl text-amber-600">
            <a href="https://www.instagram.com/_jith__sandy_?igsh=ZzVteXU1N2Jjemdi" target="_blank"><FaInstagram /></a>
            <a href="https://www.facebook.com/profile.php?id=100088894746265" target="_blank"><FaFacebook /></a>
            <a href="https://wa.me/916374122294" target="_blank"><FaWhatsapp /></a>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default About;
