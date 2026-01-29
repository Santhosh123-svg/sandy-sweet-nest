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
      orderId: orderId,
      productName: productName,
      category: category,
      quantity: quantity,
      totalAmount: totalAmount,
      deliveryDate: deliveryDate,
      deliveryTime: deliveryTime,
      cakeInfo: cakeInfo,
      customer: {
        name: customer?.name,
        email: customer?.email,
        phone: customer?.phone,
        address: customer?.address,
      }
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
  try {
    const orders = await Order.find({
      "customer.email": req.user.email,
    }).sort({ createdAt: -1 });
    res.json(orders);
  } catch (err) {
    console.error("MY ORDERS ERROR 👉", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

/* =========================
   CANCEL ORDER (USER)
========================= */
router.put("/cancel/:id", protect, async (req, res) => {
  try {
    const order = await Order.findOne({
      _id: req.params.id,
      "customer.email": req.user.email,
    });

    if (!order) return res.status(404).json({ message: "Order not found" });

    // Status check
    if (order.status === "Cancelled by User") {
      return res.status(400).json({ message: "Order already cancelled" });
    }

    order.status = "Cancelled by User";
    await order.save();

    res.json({ success: true, message: "Order cancelled successfully", order });
  } catch (err) {
    console.error("CANCEL ORDER ERROR 👉", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

/* =========================
   ADMIN ORDERS
========================= */
router.get("/", protect, adminOnly, async (req, res) => {
  const orders = await Order.find();
  res.json(orders);
});

export default router;
