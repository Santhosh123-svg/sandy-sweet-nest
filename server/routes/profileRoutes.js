import express from "express";
import { completeProfile } from "../controllers/profileController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/complete", verifyToken, completeProfile);

export default router;
