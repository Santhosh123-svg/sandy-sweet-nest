import express from "express";
import {
  signup,
  verifyMagicLink,
  login,
  getMe,
  testMail,
  sendMagicLinkForLogin,
} from "../controllers/authController.js";

import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/verify", verifyMagicLink);
router.post("/login", login);
router.post("/magic/send-link", sendMagicLinkForLogin);
router.get("/me", verifyToken, getMe);

// ✅ TEST MAIL ROUTE
router.get("/test-mail", testMail);

export default router;
