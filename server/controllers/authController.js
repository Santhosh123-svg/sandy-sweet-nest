import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import dotenv from "dotenv";
import transporter, { sendMagicLink } from "../utils/sendEmail.js";

dotenv.config();

/* =========================
   SIGNUP (MAGIC LINK ONLY)
========================= */
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });

    // 🔁 User exists but not verified
    if (exists && !exists.profileCompleted) {
      const token = jwt.sign({ id: exists._id }, process.env.JWT_SECRET, {
        expiresIn: "15m",
      });

      const magicLink = `${process.env.CLIENT_URL}/magic-verify?token=${token}`;

      // Send email and handle errors
      try {
        await sendMagicLink(email, magicLink);
        console.log("✅ Signup magic link sent successfully");
      } catch (err) {
        console.error("❌ Signup email failed:", err.message);
        return res.status(500).json({ message: "Failed to send verification email" });
      }

      return res.json({ message: "Verification link sent" });
    }

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

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m",
    });

    const magicLink = `${process.env.CLIENT_URL}/magic-verify?token=${token}`;

    // Send email and handle errors
    try {
      await sendMagicLink(email, magicLink);
      console.log("✅ New user signup magic link sent successfully");
    } catch (err) {
      console.error("❌ New user signup email failed:", err.message);
      return res.status(500).json({ message: "Failed to send verification email" });
    }

    res.json({ message: "Verification link sent" });
  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* =========================
   MAGIC VERIFY
========================= */
export const verifyMagicLink = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user)
      return res.status(400).json({ message: "Invalid token" });

    user.profileCompleted = true;
    await user.save();

    const authToken = jwt.sign(
      { id: user._id, role: user.role },
      process.env.JWT_SECRET,
      { expiresIn: "7d" }
    );

    res.json({
      token: authToken,
      profileCompleted: user.profileCompleted,
      email: user.email,
    });
  } catch {
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
    if (!email)
      return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user)
      return res.status(404).json({ message: "User not found" });

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const magicLink = `${process.env.CLIENT_URL}/magic-verify?token=${token}`;

    // Send email and handle errors
    try {
      await sendMagicLink(email, magicLink);
      console.log("✅ Login magic link sent successfully");
    } catch (err) {
      console.error("❌ Login email failed:", err.message);
      return res.status(500).json({ message: "Failed to send magic link" });
    }

    res.json({ message: "Magic link sent to your email" });
  } catch (error) {
    console.error("Magic login error:", error);
    res.status(500).json({ message: "Failed to send magic link" });
  }
};

/* =========================
   GET USER PROFILE
========================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user)
      return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted,
    });
  } catch {
    res.status(500).json({ message: "Server error" });
  }
};

/* =========================
   TEST MAIL
========================= */
export const testMail = async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"Sandy's Sweet Nest 🍰" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER,
      subject: "Test Mail ✅",
      html: "<h1>Mail system working perfectly 🔥</h1>",
    });

    console.log("✅ Test mail sent");
    res.json({ success: true, message: "Mail sent successfully" });
  } catch (e) {
    console.error("❌ Test mail failed:", e);
    res.status(500).json({ success: false, message: "Mail failed", error: e.message });
  }
};
