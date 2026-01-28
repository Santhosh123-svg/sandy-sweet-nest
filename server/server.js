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

// 1. GLOBAL MIDDLEWARE
// Enable CORS and JSON parsing immediately to handle incoming requests
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// 2. HEALTH CHECK ROUTE (CRITICAL FOR RENDER)
// This must be defined BEFORE long-running operations or complex middleware.
// Render expects a 200 OK response at the root path to confirm the service is live.
app.get("/", (req, res) => {
  res.status(200).send("Sandy's Sweet Nest API: System Operational 🍰");
});

// 3. API ROUTES
// Direct route for magic link verification (Legacy compatibility)
app.get("/magic-verify", verifyMagicLink);

// Mounted API endpoints
app.use("/api/auth", authRoutes);
app.use("/api/profile", profileRoutes);
app.use("/api/admin", adminRoutes);
app.use("/api/test", testRoutes);
app.use("/api/products", productRoutes);
app.use("/api/orders", orderRoutes);

// 4. DATABASE CONNECTION
// Connecting asynchronously so the server can start listening for Render's health check immediately.
mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("✅ MongoDB connected successfully"))
  .catch((err) => console.error("❌ MongoDB connection failed:", err));

// 5. PORT & SERVER INITIALIZATION
// Render dynamically assigns a port via process.env.PORT.
// Binding to '0.0.0.0' ensures the app is reachable from outside the container.
const PORT = process.env.PORT || 10000;
app.listen(PORT, "0.0.0.0", () => {
  console.log(`🚀 Server successfully started on port ${PORT}`);
});