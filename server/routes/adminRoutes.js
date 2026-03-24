import express from "express";
import verifyToken from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import Order from "../models/Order.js";

const router = express.Router();

/* =========================
   GET ALL ORDERS (ADMIN)
========================= */
router.get("/orders", verifyToken, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });
    res.json({
      success: true,
      orders: Array.isArray(orders) ? orders : []
    });
  } catch (err) {
    console.error("ADMIN ORDERS ERROR 👉", err);
    res.status(500).json({ success: false, message: "Failed to load orders", orders: [] });
  }
});

/* =========================
   DELETE ORDER (ADMIN)
========================= */
router.delete("/orders/:id", verifyToken, adminOnly, async (req, res) => {
  try {
    await Order.findByIdAndDelete(req.params.id);
    res.json({ message: "Order deleted" });
  } catch (err) {
    console.error("DELETE ORDER ERROR 👉", err);
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
