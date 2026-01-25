import express from "express";
import {
  signup,
  verifyMagicLink,
  login,
  getMe
} from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";

const router = express.Router();

router.post("/signup", signup);
router.get("/verify", verifyMagicLink);
router.post("/login", login);
router.get("/me", verifyToken, getMe);


router.get("/test-mail", testMail);

export default router;
