import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMagicLink } from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ message: "User already exists" });

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({ name, email, password: hashed, role: "user", profileCompleted: false });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const magicLink = `${process.env.CLIENT_URL}/magic-verify?token=${token}`;

    try {
      await sendMagicLink(email, magicLink);
      return res.status(201).json({ message: "Verification link sent to email" });
    } catch (mailErr) {
      // Cleanup: Delete user if email fails so they can retry signup
      await User.findByIdAndDelete(user._id);
      console.error("Signup Rollback: User deleted due to mail failure");
      return res.status(500).json({ message: "Failed to send email. Please check your address or try again later." });
    }
  } catch (err) {
    console.error("SIGNUP CRITICAL ERROR:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

export const verifyMagicLink = async (req, res) => {
  try {
    const { token } = req.query;
    if (!token) return res.status(400).json({ success: false, message: "Token missing" });

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) return res.status(404).json({ success: false, message: "User not found" });

    // Mark as verified
    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      message: "Verification complete. You can now log in."
    });
  } catch (err) {
    console.error("Verification Error:", err.message);
    res.status(400).json({ success: false, message: "Invalid or expired magic link" });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    // Check if user is verified
    if (!user.isVerified) {
      return res.status(403).json({ message: "Please verify your email first." });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ message: "Wrong password" });

    const token = jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "7d" });
    res.json({ 
      token, 
      role: user.role, 
      profileCompleted: user.profileCompleted,
      name: user.name // Return name to help frontend validation
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed" });
  }
};

/* =========================
   COMPLETE PROFILE
========================= */
export const completeProfile = async (req, res) => {
  const { name, phone, address } = req.body;

  try {
    const user = await User.findById(req.user.id);
    if (!user) return res.status(404).json({ message: "User not found" });

    // Validation: Name must match registration name
    if (user.name.toLowerCase() !== name.trim().toLowerCase()) {
      return res.status(400).json({ 
        message: "The name you entered does not match your registration name. Please enter the same name as used during signup." 
      });
    }

    user.phone = phone;
    user.address = address;
    user.profileCompleted = true;

    await user.save();

    res.json({ 
      success: true, 
      message: "Profile updated successfully!",
      profileCompleted: true 
    });
  } catch (err) {
    console.error("Complete Profile Error:", err);
    res.status(500).json({ message: "Failed to update profile" });
  }
};

export const sendMagicLinkForLogin = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) return res.status(404).json({ message: "User not found" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const magicLink = `${process.env.CLIENT_URL}/magic-verify?token=${token}`;
    await sendMagicLink(email, magicLink);
    res.json({ message: "Magic link sent" });
  } catch (err) {
    res.status(500).json({ message: "Failed to send magic link" });
  }
};

export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    res.status(500).json({ message: "Server error" });
  }
};