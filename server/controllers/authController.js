import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

/* =========================
   MAIL SETUP
========================= */
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

/* =========================
   SIGNUP (MAGIC LINK ONLY HERE)
========================= */
export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    const exists = await User.findOne({ email });
    if (exists)
      return res.status(400).json({ message: "User already registered" });

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

    // For testing purposes, skip email and directly verify the user
    user.profileCompleted = true;
    await user.save();

    res.json({
      message: "User registered successfully",
      token: token,
      role: user.role,
      profileCompleted: user.profileCompleted,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed" });
  }
};

/* =========================
   MAGIC VERIFY (ONLY REDIRECT)
========================= */
export const verifyMagicLink = async (req, res) => {
  try {
    const { token } = req.query;
    jwt.verify(token, process.env.JWT_SECRET);

    // ONLY redirect, no login here
    res.redirect(`${process.env.CLIENT_URL}/login`);
  } catch {
    res.redirect(`${process.env.CLIENT_URL}/login`);
  }
};

/* =========================
   LOGIN (PASSWORD ONLY)
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
   GET USER PROFILE (/me)
========================= */
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });

    res.json({
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      profileCompleted: user.profileCompleted,
    });
  } catch (error) {
    res.status(500).json({ message: "Server error" });
  }
};
