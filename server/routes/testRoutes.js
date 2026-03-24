import express from "express";
import Order from "../models/Order.js";

const router = express.Router();

/**
 * TEST ORDER CREATE (Thunder Client)
 * NO auth – only for testing
 */
router.post("/create-order", async (req, res) => {
  try {
    const { items, totalAmount } = req.body;

    const order = new Order({
      userName: "Unknown User",
      userEmail: "No email",
      items,
      totalAmount,
    });

    await order.save();

    res.status(201).json(order);
  } catch (error) {
    res.status(500).json({ message: "Failed to create test order" });
  }
});

export default router;
