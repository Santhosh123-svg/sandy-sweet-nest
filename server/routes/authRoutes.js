import express from "express";
import { 
  signup, 
  login, 
  verifyMagicLink, 
  getMe, 
  sendMagicLinkForLogin 
} from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

// Full path: /api/auth/signup
router.post("/signup", signup);

// Full path: /api/auth/login
router.post("/login", login);

// Full path: /api/auth/magic-verify
router.get("/magic-verify", verifyMagicLink);

// Full path: /api/auth/magic/send-link
router.post("/magic/send-link", sendMagicLinkForLogin);

// Full path: /api/auth/me
router.get("/me", verifyToken, getMe);

export default router;