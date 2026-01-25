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
        // Resend magic link for unverified user
        const token = jwt.sign(
          { id: exists._id },
          process.env.JWT_SECRET,
          { expiresIn: "15m" }
        );

        const magicLink = `${process.env.CLIENT_URL}/verify?token=${token}`;

        // Respond immediately, send email asynchronously
        res.json({ message: "Verification link sent" });

        transporter.sendMail({
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
        }).then(() => {
          console.log(`Magic link resent to ${email}`);
        }).catch((err) => {
          console.error(`Failed to resend magic link to ${email}:`, err);
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

    // Respond immediately, send email asynchronously
    res.json({ message: "Verification link sent" });

    transporter.sendMail({
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
    }).then(() => {
      console.log(`Magic link email sent to ${email}`);
    }).catch((err) => {
      console.error(`Failed to send magic link to ${email}:`, err);
    });

  } catch (err) {
    console.error("Signup error:", err);
    res.status(500).json({ message: "Signup failed" });
  }
};

/* =========================
   MAGIC VERIFY (RETURN JSON)
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
  } catch (err) {
    res.status(400).json({ message: "Invalid or expired token" });
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
