import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { useOrder } from "../context/OrderContext";
import {
  IceCream,
  Sparkles,
  Star,
  Heart,
  Square,
  Circle,
  Layout,
  ChevronLeft,
  Candy,
} from "lucide-react";

const OrderFlow = () => {
  const navigate = useNavigate();
  const { order, placeOrder } = useOrder();

  const [quantity, setQuantity] = useState(1);
  const [flavor, setFlavor] = useState("");
  const [toppings, setToppings] = useState([]);
  const [size, setSize] = useState("1kg");
  const [shape, setShape] = useState("circle");
  const [total, setTotal] = useState(0);

  useEffect(() => {
    if (!order) navigate("/welcome");
  }, [order, navigate]);

  const isCake =
    order?.category?.toLowerCase() === "cake" ||
    order?.category?.toLowerCase() === "cakes";

  /* ================= OPTIONS ================= */

  const flavorOptions = [
    { name: "Dark Chocolate", icon: <Candy size={18} /> },
    { name: "Vanilla", icon: <IceCream size={18} /> },
    { name: "Red Velvet", icon: <Heart size={18} /> },
  ];

  const toppingOptions = [
    { name: "Nuts", price: 50, icon: <Star size={18} /> },
    { name: "Choco Chips", price: 40, icon: <Sparkles size={18} /> },
    { name: "Strawberry", price: 60, icon: <Heart size={18} /> },
    { name: "Oreo", price: 70, icon: <IceCream size={18} /> },
  ];

  const sizeOptions = [
    { label: "½ kg", value: "0.5kg", extra: -150 },
    { label: "1 kg", value: "1kg", extra: 0 },
    { label: "1.5 kg", value: "1.5kg", extra: 200 },
    { label: "2 kg", value: "2kg", extra: 400 },
  ];

  const shapeOptions = [
    { label: "Circle", value: "circle", icon: <Circle /> },
    { label: "Square", value: "square", icon: <Square /> },
    { label: "Rectangle", value: "rectangle", icon: <Layout /> },
    { label: "Heart", value: "heart", icon: <Heart /> },
  ];

  /* ================= PRICE CALC ================= */

  useEffect(() => {
    if (!order) return;

    if (isCake) {
      const basePrice = order.price;
      const sizeExtra =
        sizeOptions.find((s) => s.value === size)?.extra || 0;
      const toppingTotal = toppings.reduce((a, b) => a + b.price, 0);

      setTotal((basePrice + sizeExtra + toppingTotal) * quantity);
    } else {
      // 🔥 OTHER PRODUCTS → ONLY QUANTITY
      setTotal(order.price * quantity);
    }
  }, [quantity, toppings, size, order, isCake]);

  const handleToppingChange = (t) => {
    setToppings((prev) =>
      prev.some((x) => x.name === t.name)
        ? prev.filter((x) => x.name !== t.name)
        : [...prev, t]
    );
  };

  const handleNext = () => {
    placeOrder({
      ...order,
      quantity,
      flavor: isCake ? flavor : null,
      toppings: isCake ? toppings : [],
      size: isCake ? size : null,
      shape: isCake ? shape : null,
      totalAmount: total,
    });
    navigate("/customer-details");
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-100 flex justify-center items-center px-4 py-6">
      <motion.div
        initial={{ y: 30, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-5 rounded-3xl shadow-2xl w-full max-w-md"
      >
        {/* HEADER */}
        <div className="flex justify-between items-center mb-4">
          <button
            onClick={() => navigate(-1)}
            className="flex items-center gap-2 text-amber-600 font-semibold"
          >
            <ChevronLeft size={20} /> Back
          </button>
          <span className="font-bold text-amber-700">
            {isCake ? "Cake Customization" : order.productName}
          </span>
        </div>

        {/* IMAGE */}
        <img
          src={order.image}
          alt={order.productName}
          className="w-full h-52 rounded-2xl object-cover mb-4"
        />

        {/* ================= CAKE OPTIONS ONLY ================= */}
        {isCake && (
          <>
            {/* FLAVOR */}
            <label className="font-semibold">Flavor</label>
            <div className="grid grid-cols-3 gap-2 my-3">
              {flavorOptions.map((f) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={f.name}
                  onClick={() => setFlavor(f.name)}
                  className={`border rounded-2xl p-3 flex flex-col items-center ${
                    flavor === f.name
                      ? "bg-amber-400 text-white"
                      : "bg-white"
                  }`}
                >
                  {f.icon}
                  <span className="text-sm">{f.name}</span>
                </motion.button>
              ))}
            </div>

            {/* TOPPINGS */}
            <label className="font-semibold">Toppings</label>
            <div className="grid grid-cols-2 gap-3 my-3">
              {toppingOptions.map((t) => (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  key={t.name}
                  onClick={() => handleToppingChange(t)}
                  className={`border rounded-2xl p-3 flex justify-between items-center ${
                    toppings.some((x) => x.name === t.name)
                      ? "bg-amber-200 border-amber-400"
                      : "bg-white"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    {t.icon} {t.name}
                  </span>
                  <span className="font-bold">+₹{t.price}</span>
                </motion.button>
              ))}
            </div>

            {/* SIZE */}
            <label className="font-semibold">Size</label>
            <div className="grid grid-cols-2 gap-3 my-3">
              {sizeOptions.map((s) => (
                <motion.button
                  whileTap={{ scale: 0.97 }}
                  key={s.value}
                  onClick={() => setSize(s.value)}
                  className={`border rounded-2xl p-3 flex justify-between ${
                    size === s.value
                      ? "bg-amber-200 border-amber-400"
                      : "bg-white"
                  }`}
                >
                  <span>{s.label}</span>
                  <span className="font-bold">
                    {s.extra >= 0 ? `+₹${s.extra}` : `₹${s.extra}`}
                  </span>
                </motion.button>
              ))}
            </div>

            {/* SHAPE */}
            <label className="font-semibold">Shape</label>
            <div className="grid grid-cols-4 gap-2 my-3">
              {shapeOptions.map((s) => (
                <motion.button
                  whileTap={{ scale: 0.95 }}
                  key={s.value}
                  onClick={() => setShape(s.value)}
                  className={`border rounded-2xl p-3 flex flex-col items-center ${
                    shape === s.value
                      ? "bg-amber-200 border-amber-400"
                      : "bg-white"
                  }`}
                >
                  {s.icon}
                  <span className="text-xs">{s.label}</span>
                </motion.button>
              ))}
            </div>
          </>
        )}

        {/* QUANTITY (COMMON FOR ALL) */}
        <div className="flex justify-between items-center my-4">
          <button
            className="w-10 h-10 rounded-xl bg-amber-100 text-xl"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
          >
            -
          </button>
          <span className="text-xl font-bold">{quantity}</span>
          <button
            className="w-10 h-10 rounded-xl bg-amber-100 text-xl"
            onClick={() => setQuantity((q) => q + 1)}
          >
            +
          </button>
        </div>

        {/* TOTAL */}
        <div className="flex justify-between mb-4">
          <span className="font-semibold">Total</span>
          <span className="text-xl font-bold text-amber-600">
            ₹{total}
          </span>
        </div>

        <button
          onClick={handleNext}
          className="w-full bg-gradient-to-r from-amber-500 to-orange-500 text-white py-3 rounded-2xl font-bold shadow-xl"
        >
          PAY NOW
        </button>
      </motion.div>
    </div>
  );
};

export default OrderFlow;
