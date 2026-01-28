import express from "express";
import { signup, login, verifyMagicLink, getMe, sendMagicLinkForLogin } from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Mount point in server.js is /api/auth
// Final path: POST /api/auth/signup
router.post("/signup", signup);

router.post("/login", login);
router.get("/magic-verify", verifyMagicLink);
router.post("/magic/send-link", sendMagicLinkForLogin);
router.get("/me", verifyToken, getMe);

export default router;