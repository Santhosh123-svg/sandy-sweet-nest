import React, { useState, useMemo } from "react";
import { motion } from "framer-motion";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../context/OrderContext";

const CAKE_CONFIG = {
  toppings: [
    { name: "Gold Leaf", price: 200 },
    { name: "Chocolate Balls", price: 100 },
    { name: "Truffle Pieces", price: 150 },
  ],
  sizes: [
    { label: "500g", price: 999 },
    { label: "1kg", price: 1799 },
    { label: "2kg", price: 3299 },
  ],
  flavors: ["Dark Chocolate", "Milk Chocolate", "Butterscotch"],
  shapes: ["⚪", "⬜", "❤"],
};

const CakeOrderFlow = ({ product }) => {
  const navigate = useNavigate();
  const { setOrder } = useOrder();

  const [size, setSize] = useState(null);
  const [flavor, setFlavor] = useState("");
  const [shape, setShape] = useState("");
  const [quantity, setQuantity] = useState(1);
  const [toppings, setToppings] = useState([]);

  const totalAmount = useMemo(() => {
    if (!size) return 0;
    const toppingsTotal = toppings.reduce((s, t) => s + t.price, 0);
    return (size.price + toppingsTotal) * quantity;
  }, [size, toppings, quantity]);

  const toggleTopping = (topping) => {
    setToppings((prev) =>
      prev.find((t) => t.name === topping.name)
        ? prev.filter((t) => t.name !== topping.name)
        : [...prev, topping]
    );
  };

  const proceed = () => {
    if (!size || !flavor) {
      alert("Please select Size & Flavor");
      return;
    }

    setOrder({
      productName: product.name,
      category: "cake",
      image: product.image,
      size: size.label,
      flavor,
      shape,
      toppings,
      quantity,
      price: totalAmount,
    });

    navigate("/payment");
  };

  return (
    <div className="min-h-screen bg-amber-50 flex justify-center p-4">
      <motion.div
        initial={{ opacity: 0, y: 40 }}
        animate={{ opacity: 1, y: 0 }}
        className="bg-white p-6 rounded-3xl shadow-xl max-w-md w-full"
      >
        {/* IMAGE */}
        <motion.img
          src={product.image}
          alt={product.name}
          className="w-full h-52 object-cover rounded-2xl mb-4"
          initial={{ scale: 0.9 }}
          animate={{ scale: 1 }}
        />

        <h2 className="text-xl font-bold text-center mb-4">
          {product.name}
        </h2>

        {/* TOPPINGS */}
        <h3 className="font-semibold mb-2">Toppings (Optional)</h3>
        {CAKE_CONFIG.toppings.map((t) => (
          <label key={t.name} className="flex justify-between mb-1">
            <input
              type="checkbox"
              onChange={() => toggleTopping(t)}
            />
            {t.name}
            <span>+₹{t.price}</span>
          </label>
        ))}

        {/* SIZE */}
        <h3 className="font-semibold mt-4 mb-2">Size & Weight *</h3>
        {CAKE_CONFIG.sizes.map((s) => (
          <label key={s.label} className="flex justify-between mb-1">
            <input
              type="radio"
              name="size"
              onChange={() => setSize(s)}
            />
            {s.label}
            <span>₹{s.price}</span>
          </label>
        ))}

        {/* FLAVOR */}
        <h3 className="font-semibold mt-4 mb-2">Flavor *</h3>
        {CAKE_CONFIG.flavors.map((f) => (
          <label key={f} className="block mb-1">
            <input
              type="radio"
              name="flavor"
              onChange={() => setFlavor(f)}
            />{" "}
            {f}
          </label>
        ))}

        {/* SHAPE */}
        <h3 className="font-semibold mt-4 mb-2">Cake Shape</h3>
        <div className="flex gap-4 text-xl">
          {CAKE_CONFIG.shapes.map((s) => (
            <button
              key={s}
              onClick={() => setShape(s)}
              className={`p-2 rounded ${
                shape === s ? "bg-amber-300" : "bg-gray-100"
              }`}
            >
              {s}
            </button>
          ))}
        </div>

        {/* QUANTITY */}
        <h3 className="font-semibold mt-4 mb-2">Quantity</h3>
        <div className="flex items-center gap-4">
          <button onClick={() => setQuantity(Math.max(1, quantity - 1))}>-</button>
          <span>{quantity}</span>
          <button onClick={() => setQuantity(quantity + 1)}>+</button>
        </div>

        {/* TOTAL */}
        <h3 className="font-bold mt-6 text-lg">
          Total Amount: ₹{totalAmount}
        </h3>

        <button
          onClick={proceed}
          className="mt-6 w-full py-3 bg-amber-500 text-white font-bold rounded-xl"
        >
          Proceed to Payment
        </button>
      </motion.div>
    </div>
  );
};

export default CakeOrderFlow;
