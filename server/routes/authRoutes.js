import express from "express";
import {
  signup,
  verifyMagicLink,
  login,
  getMe,
  sendMagicLinkForLogin,
  completeProfile,
  registerSendOtp,
  registerVerifyOtp,
  forgotPasswordSendOtp,
  forgotPasswordVerifyOtp,
  resetPassword
} from "../controllers/authController.js";
import verifyToken from "../middleware/authMiddleware.js";
import User from "../models/User.js";

const router = express.Router();

// -------------------- CHECK NUMBER (OLD - SAFE KEEP) --------------------
router.post("/check-number", async (req, res) => {
  try {
    const { phoneNumber } = req.body;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: "Phone number required"
      });
    }

    const user = await User.findOne({ phone: phoneNumber });

    if (!user) {
      return res.json({
        success: true,
        exists: false,
        profileComplete: false
      });
    }

    return res.json({
      success: true,
      exists: true,
      profileComplete: user.profileCompleted
    });

  } catch (error) {
    console.error("CHECK NUMBER ERROR 👉", error);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

// -------------------- COMPLETE PROFILE --------------------
router.put("/complete-profile", verifyToken, completeProfile);

// -------------------- AUTH ROUTES --------------------

// 🆕 SIGNUP (email + password + magic link)
router.post("/signup", signup);

// 🔗 VERIFY MAGIC LINK
router.get("/magic-verify", verifyMagicLink);

// 🔐 LOGIN (email + password)
router.post("/login", login);

// 🆕 REGISTER WITH OTP
router.post("/register/send-otp", registerSendOtp);
router.post("/register/verify-otp", registerVerifyOtp);

// 🔁 FORGOT PASSWORD WITH OTP
router.post("/forgot-password/send-otp", forgotPasswordSendOtp);
router.post("/forgot-password/verify-otp", forgotPasswordVerifyOtp);
router.post("/reset-password", resetPassword);

// ✉️ SEND MAGIC LINK FOR LOGIN
router.post("/magic/send-link", sendMagicLinkForLogin);

// 👤 GET CURRENT USER
router.get("/me", verifyToken, getMe);

export default router;