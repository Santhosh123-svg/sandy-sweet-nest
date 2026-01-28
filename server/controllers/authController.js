import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMagicLink } from "../utils/sendEmail.js";

export const signup = async (req, res) => {
  const { name, email, password } = req.body;

  try {
    // 1. Validation
    if (!name || !email || !password) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // 2. Check existence
    const exists = await User.findOne({ email });
    if (exists) {
      return res.status(409).json({ success: false, message: "Email already registered. Please login." });
    }

    // 3. Create user (But handle potential email failure)
    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email,
      password: hashed,
      role: "user",
      profileCompleted: false,
    });

    // 4. Generate Magic Link
    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "15m" });
    const magicLink = `${process.env.CLIENT_URL}/magic-verify?token=${token}`;

    // 5. Attempt Email Sending
    try {
      await sendMagicLink(email, magicLink);
      return res.status(201).json({ 
        success: true, 
        message: "Registration successful. Magic link sent to your email!" 
      });
    } catch (emailErr) {
      // If email fails, the user is still in DB but unverified. 
      // We return 500 but with a specific message so frontend knows user was created.
      return res.status(500).json({ 
        success: false, 
        message: "Account created, but failed to send verification email. Please try logging in to resend.",
        error: emailErr.message 
      });
    }

  } catch (err) {
    console.error("SIGNUP CRITICAL ERROR:", err);
    return res.status(500).json({ success: false, message: "Internal server error during signup" });
  }
};