import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import { sendMagicLink } from "../utils/sendEmail.js";

dotenv.config();

/* =========================
   SIGNUP (MAGIC LINK ONLY)
========================= */
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });

    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);

    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
      profileCompleted: false,
    });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const magicLink = `${process.env.CLIENT_URL}/magic-verify?token=${token}`;

    await sendMagicLink(email, magicLink);

    res.json({ message: "Verification link sent" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* =========================
   MAGIC VERIFY (❗ DO NOT COMPLETE PROFILE HERE)
========================= */
export const verifyMagicLink = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

    // 🔥 IMPORTANT: profileCompleted = false ONLY
    const authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: authToken,
      profileCompleted: user.profileCompleted, // false → go to complete-profile
      email: user.email,
    });
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
  }
};

/* =========================
   LOGIN (PASSWORD)
========================= */
export const login = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "User not found" });

    const match = await bcrypt.compare(password, user.password);
    if (!match)
      return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token,
      role: user.role,
      profileCompleted: user.profileCompleted,
    });
  } catch {
    res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   MAGIC LINK LOGIN (SEND)
========================= */
export const sendMagicLinkForLogin = async (req, res) => {
  try {
    const { email } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const magicLink = `${process.env.CLIENT_URL}/magic-verify?token=${token}`;
    await sendMagicLink(email, magicLink);

    res.json({ message: "Magic link sent" });
  } catch {
    res.status(500).json({ message: "Failed to send magic link" });
  }
};

/* =========================
   GET USER PROFILE
========================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};
