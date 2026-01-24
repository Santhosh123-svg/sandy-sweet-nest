import React, { useEffect, useState } from "react";
import axios from "axios";
import { motion } from "framer-motion";

const Shop = () => {
  const [products, setProducts] = useState([]);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    axios.get("http://localhost:5000/api/products")
      .then(res => setProducts(res.data));
  }, []);

  const addToCart = (product) => {
    setCart([...cart, { ...product, qty: 1 }]);
  };

  const placeOrder = async () => {
    const token = localStorage.getItem("token");
    const items = cart.map(c => ({ productId: c._id, qty: c.qty }));
    const total = cart.reduce((a, c) => a + c.price * c.qty, 0);

    await axios.post("http://localhost:5000/api/orders", { items, total }, {
      headers: { Authorization: `Bearer ${token}` },
    });

    alert("Order placed!");
    setCart([]);
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <h2 className="text-3xl font-bold text-amber-600 mb-4">Shop</h2>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <motion.div key={p._id} className="bg-white p-4 rounded-2xl shadow"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}>
            <h3 className="font-bold">{p.name}</h3>
            <p>{p.category}</p>
            <p>₹ {p.price}</p>
            <button onClick={() => addToCart(p)}
              className="mt-2 bg-amber-500 text-white py-1 px-3 rounded">
              Add to cart
            </button>
          </motion.div>
        ))}
      </div>

      {cart.length > 0 && (
        <div className="mt-6 bg-white p-4 rounded-2xl shadow">
          <h3 className="font-bold">Cart</h3>
          <p>Items: {cart.length}</p>
          <button onClick={placeOrder}
            className="mt-2 bg-amber-500 text-white py-2 rounded">
            Place Order
          </button>
        </div>
      )}
    </div>
  );
};

export default Shop;
