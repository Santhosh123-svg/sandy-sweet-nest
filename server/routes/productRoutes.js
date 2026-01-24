import express from "express";
import protect from "../middleware/authMiddleware.js";
import adminOnly from "../middleware/adminMiddleware.js";
import Product from "../models/Product.js";

const router = express.Router();

router.post("/", protect, adminOnly, async (req, res) => {
  const { name, category, price, image, description } = req.body;
  try {
    const product = await Product.create({ name, category, price, image, description });
    res.json(product);
  } catch (err) {
    res.status(500).json({ message: "Add product failed" });
  }
});

router.get("/", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

router.delete("/:id", protect, adminOnly, async (req, res) => {
  try {
    await Product.findByIdAndDelete(req.params.id);
    res.json({ message: "Product deleted" });
  } catch (err) {
    res.status(500).json({ message: "Delete failed" });
  }
});

export default router;
