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
    const { 
      orderId, 
      productName, 
      category, 
      quantity, 
      totalAmount, 
      deliveryDate,
      deliveryTime,
      cakeInfo, 
      customer 
    } = req.body;

    if (!orderId || !productName) {
      return res.status(400).json({ message: "Missing required order data" });
    }

    const order = await Order.create({
      orderId,
      productName,
      category,
      quantity,
      totalAmount,
      deliveryDate,
      deliveryTime,
      cakeInfo,
      customer
    });

    res.status(201).json({ success: true, order });
  } catch (err) {
    console.error("ORDER SAVE ERROR 👉", err);
    res.status(500).json({ message: "Failed to save order" });
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
