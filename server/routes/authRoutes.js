import express from "express";
import { signup, verifyMagicLink, login } from "../controllers/authController.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/verify", verifyMagicLink);
router.post("/login", login);

export default router;
