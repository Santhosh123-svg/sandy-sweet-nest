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

dotenv.config();
const app = express();

app.use(cors({ origin: true }));
app.use(express.json());

// API routes
app.use("/auth", authRoutes);
app.use("/profile", profileRoutes);
app.use("/admin", adminRoutes);
app.use("/test", testRoutes);
app.use("/products", productRoutes);
app.use("/orders", orderRoutes);

// ❌ Remove these lines if backend is separate
// app.use(express.static(path.join(__dirname, "../client/dist")));
// app.use((req, res) => {
//   res.sendFile(path.join(__dirname, "../client/dist/index.html"));
// });

mongoose.connect(process.env.MONGO_URI)
  .then(() => console.log("MongoDB connected"));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
