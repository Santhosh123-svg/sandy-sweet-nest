import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

/* =========================
   PLACE ORDER (USER)
========================= */
router.post("/", protect, async (req, res) => {
  try {
    const { productName, price, quantity, clientOrderId } = req.body;

    if (!productName || !price) {
      return res.status(400).json({ message: "Missing order data" });
    }

    // 🔐 DUPLICATE CHECK (NEW)
    if (clientOrderId) {
      const exists = await Order.findOne({ clientOrderId });
      if (exists) {
        return res.status(200).json({
          message: "Order already saved",
          order: exists,
        });
      }
    }

    const order = await Order.create({
      clientOrderId, // 👈 NEW (optional)

      userName:
        req.user?.name ||
        req.user?.username ||
        req.user?.fullName ||
        "Unknown User",

      userEmail: req.user?.email || "No Email",

      items: [
        {
          name: productName,
          quantity: quantity || 1,
          price: price,
        },
      ],

      totalAmount: price * (quantity || 1),
    });

    res.status(201).json(order);
  } catch (err) {
    console.error("ORDER ERROR:", err);
    res.status(500).json({ message: "Order failed" });
  }
});

/* =========================
   USER ORDERS
========================= */
router.get("/my-orders", protect, async (req, res) => {
  const orders = await Order.find({
    userEmail: req.user.email,
  });
  res.json(orders);
});

/* =========================
   ADMIN ORDERS
========================= */
router.get("/", protect, adminOnly, async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

export default router;
