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
      from: `"Sandy's Sweet Nest 🍰" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Welcome to Sandy's Sweet Nest - Verify Your Account",
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #f9f9f9;">
          <h2 style="color: #d97706;">Welcome to Sandy's Sweet Nest! 🍰</h2>
          <p>Thank you for registering with us. We're excited to have you join our community of sweet lovers!</p>
          <p>To complete your registration and start ordering delicious cakes, chocolates, and more, please verify your email address by clicking the button below:</p>
          <a href="${magicLink}" style="display: inline-block; padding: 10px 20px; background-color: #d97706; color: white; text-decoration: none; border-radius: 5px; margin: 20px 0;">Verify My Account</a>
          <p>If the button doesn't work, you can copy and paste this link into your browser:</p>
          <p style="word-break: break-all; background-color: #fff; padding: 10px; border: 1px solid #ddd;">${magicLink}</p>
          <p>This link will expire in 15 minutes for security reasons.</p>
          <p>If you didn't create an account, please ignore this email.</p>
          <p>Best regards,<br>The Sandy's Sweet Nest Team</p>
        </div>
      `,
    });

    console.log(`Magic link email sent to ${email}`);

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
