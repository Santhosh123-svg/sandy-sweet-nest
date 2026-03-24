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

    const order = await Order.create({
      orderId,
      productName,
      category,
      quantity,
      totalAmount,
      deliveryDate,
      deliveryTime,
      cakeInfo,
      customer: {
        name: customer?.name,
        email: customer?.email || null,
        phone: customer?.phone,
        address: customer?.address,
      },
      status: "Pending"
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
    let query = {};

    if (req.user.email) {
      query["customer.email"] = req.user.email;
    } else if (req.user.phone) {
      query["customer.phone"] = req.user.phone;
    }

    const orders = await Order.find(query).sort({ createdAt: -1 });

    res.json(orders);
  } catch (err) {
    console.error("MY ORDERS ERROR 👉", err);
    res.status(500).json({ message: "Failed to load orders" });
  }
});

/* =========================
   CANCEL ORDER
========================= */
router.put("/cancel/:id", protect, async (req, res) => {
  try {
    let query = { _id: req.params.id };

    if (req.user.email) {
      query["customer.email"] = req.user.email;
    } else if (req.user.phone) {
      query["customer.phone"] = req.user.phone;
    }

    const order = await Order.findOne(query);

    if (!order) return res.status(404).json({ message: "Order not found" });

    order.status = "Cancelled by User";
    await order.save();

    res.json({ success: true, order });
  } catch (err) {
    console.error("CANCEL ORDER ERROR 👉", err);
    res.status(500).json({ message: "Failed to cancel order" });
  }
});

/* =========================
   ADMIN ORDERS (🔥 FIXED ROUTE)
========================= */
router.get("/admin/orders", protect, adminOnly, async (req, res) => {
  try {
    const orders = await Order.find().sort({ createdAt: -1 });

    res.json({ success: true, orders });
  } catch (err) {
    console.error("ADMIN FETCH ERROR 👉", err);
    res.status(500).json({ message: "Failed to fetch orders" });
  }
});

export default router;