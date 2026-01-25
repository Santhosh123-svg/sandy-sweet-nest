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

  console.log("SIGNUP HIT");

  try {
    const exists = await User.findOne({ email });

    if (exists) {
      if (exists.profileCompleted) {
        return res.status(400).json({ message: "User already exists" });
      } else {
        const token = jwt.sign(
          { id: exists._id },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );

        const magicLink = `${process.env.CLIENT_URL}/magic-verify?token=${token}`;

        res.json({ message: "Verification link sent" });

        transporter.sendMail({
          from: `"Sandy's Sweet Nest 🍰" <${process.env.MAIL_USER}>`,
          to: email,
          subject: "Verify your account",
          html: `<p>Click below to verify:</p><a href="${magicLink}">${magicLink}</a>`,
        });

        return;
      }
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

    res.json({ message: "Verification link sent" });

    transporter.sendMail({
      from: `"Sandy's Sweet Nest 🍰" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Verify your account",
      html: `<p>Click below to verify:</p><a href="${magicLink}">${magicLink}</a>`,
    });

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

    if (!user) {
      return res.status(400).json({ message: "Invalid token" });
    }

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
   MAGIC LINK LOGIN (SEND ONLY)
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

    await transporter.sendMail({
      from: `"Sandy's Sweet Nest 🍰" <${process.env.MAIL_USER}>`,
      to: email,
      subject: "Login to Sandy's Sweet Nest",
      html: `<p>Click below to login:</p><a href="${magicLink}">${magicLink}</a>`,
    });

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
    if (!user) return res.status(404).json({ message: "User not found" });

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













export const testMail = async (req, res) => {
  try {
    await transporter.sendMail({
      from: `"Test Mail" <${process.env.MAIL_USER}>`,
      to: process.env.MAIL_USER, // same gmail for test
      subject: "Test Mail from Sandy's Sweet Nest",
      html: "<h1>Mail working ✅</h1>",
    });

    console.log("✅ Test mail sent");
    res.send("Mail sent");
  } catch (e) {
    console.error("❌ Test mail failed:", e);
    res.status(500).send("Mail failed");
  }
};
