import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import adminRoutes from "./routes/adminRoutes.js";
import authRoutes from "./routes/authRoutes.js";
import profileRoutes from "./routes/profileRoutes.js";
import productRoutes from "./routes/productRoutes.js";
import orderRoutes from "./routes/orderRoutes.js";
import testRoutes from "./routes/testRoutes.js";
import { verifyMagicLink } from "./controllers/authController.js";

dotenv.config();
const app = express();

// 🌐 API LOG
app.use((req, res, next) => {
  console.log("🌐 API HIT 👉", req.method, req.url);
  next();
});

// ✅ GLOBAL MIDDLEWARE
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// ✅ HEALTH CHECK (RENDER IMPORTANT)
app.get("/", (req, res) => {
  res.status(200).send("Sandy's Sweet Nest API: System Operational 🍰");
});

// ✅ ROUTES
app.get("/magic-verify", verifyMagicLink);

app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/test", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// ✅ DATABASE CONNECTION
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// ✅ SERVER START
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server successfully started on port ${PORT}`);
});

// ✅ ENV CHECK (UPDATED 🔥)
console.log("ENV CHECK 👉", {
  EMAIL_USER: process.env.EMAIL_USER ? "YES" : "NO",
  EMAIL_PASS: process.env.EMAIL_PASS ? "YES" : "NO"
});