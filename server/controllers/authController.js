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

    const magicLink = `${process.env.CLIENT_URL}/verify?token=${token}`;

    await transporter.sendMail({
      from: `"Sandy’s Sweet Nest 🍰" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify your account",
      html: `<a href="${magicLink}">${magicLink}</a>`,
    });

    res.json({ message: "Verification link sent" });
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
