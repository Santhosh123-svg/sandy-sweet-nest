import express from "express";
import { completeProfile } from "../controllers/profileController.js";
import protect from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/complete", protect, completeProfile);

export default router;
