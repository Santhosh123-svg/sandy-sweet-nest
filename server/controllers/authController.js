import User from "../models/User.js";
import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import { sendMagicLink, sendOtpEmail } from "../utils/sendEmail.js";
import { generateOTP } from "../utils/generateOTP.js";
import { setOtp, getOtp, deleteOtp } from "../utils/otpStore.js";

const generateAuthToken = (user) => {
  return jwt.sign(
    { id: user._id, role: user.role },
    process.env.JWT_SECRET,
    { expiresIn: "7d" }
  );
};

// -------------------- COMPLETE PROFILE (NON-AUTH - Mobile first-time) --------------------
export const completeProfile = async (req, res) => {
  try {
    const { name, phone, address } = req.body;

    if (!name || !phone || !address) {
      return res.status(400).json({
        success: false,
        message: "All fields required"
      });
    }

    // ✅ GET LOGGED-IN USER
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // ✅ UPDATE USER DATA
    user.name = name;
    user.phone = phone;
    user.address = address;
    user.profileCompleted = true;
    user.isVerified = true;

    await user.save();

    const token = generateAuthToken(user);

    res.json({
      success: true,
      message: "Profile completed successfully",
      user,
      token
    });

  } catch (err) {
    console.error("COMPLETE PROFILE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Failed to complete profile"
    });
  }
};
// -------------------- SIGNUP (WEB MAGIC-LINK SAFE KEEP) --------------------
export const signup = async (req, res) => {
  const { name, email, password } = req.body;
  const isMobile = req.headers["x-client-type"] === "mobile";

  try {
    const normalizedEmail = String(email || "").trim().toLowerCase();
    if (!name || !normalizedEmail || !password) {
      return res.status(400).json({ message: "Name, email and password are required" });
    }

    const exists = await User.findOne({ email: normalizedEmail });
    if (exists) {
      return res.status(400).json({ message: "User already exists" });
    }

    const hashed = await bcrypt.hash(password, 10);
    const user = await User.create({
      name,
      email: normalizedEmail,
      password: hashed,
      role: "user",
      profileCompleted: false,
      isVerified: false,
      authProvider: "magic"
    });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "15m"
    });

    const magicLink = isMobile
      ? `sandyapp://magic-verify?token=${token}`
      : `${process.env.CLIENT_URL}/magic-verify?token=${token}`;

    await sendMagicLink(normalizedEmail, magicLink);

    return res.status(201).json({
      success: true,
      message: "Verification link sent to email"
    });
  } catch (err) {
    console.error("SIGNUP ERROR:", err);
    return res.status(500).json({ message: "Signup failed" });
  }
};

// -------------------- VERIFY MAGIC LINK --------------------
export const verifyMagicLink = async (req, res) => {
  try {
    const { token } = req.query;

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.isVerified = true;
    await user.save();

    res.json({
      success: true,
      user: {
        _id: user._id,
        role: user.role,
        profileCompleted: user.profileCompleted
      }
    });

  } catch (err) {
    console.log("VERIFY ERROR 👉", err.message);
    res.status(400).json({ message: "Invalid or expired magic link" });
  }
};

// -------------------- LOGIN --------------------
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !password) {
      return res.status(400).json({
        success: false,
        message: "Email and password are required"
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const passwordMatches = await bcrypt.compare(password, user.password || "");
    if (!passwordMatches) {
      return res.status(400).json({
        success: false,
        message: "Invalid email or password"
      });
    }

    const token = generateAuthToken(user);
    return res.json({
      success: true,
      token,
      user
    });
  } catch (err) {
    console.error("LOGIN ERROR 👉", err);
    return res.status(500).json({ message: "Login failed" });
  }
};

const validateOtpForEmail = (email, otp) => {
  const normalizedEmail = String(email || "").trim().toLowerCase();
  const stored = getOtp(normalizedEmail);

  console.log("🔍 OTP DEBUG - VALIDATE:", {
    normalizedEmail,
    hasStored: !!stored,
    storedOtp: stored?.otp,
    enteredOtpRaw: otp,
    enteredOtpTrim: String(otp).trim(),
    storedPurpose: stored?.purpose
  });

  if (!stored) {
    return { ok: false, status: 400, message: "OTP not found" };
  }

  if (Date.now() > stored.expiresAt) {
    deleteOtp(normalizedEmail);
    return { ok: false, status: 400, message: "OTP expired" };
  }

  // ✅ CLEAN BOTH SIDES STRICTLY
  const enteredOtpClean = String(otp).replace(/\D/g, "").trim();
  const storedOtpClean = String(stored.otp).replace(/\D/g, "").trim();

  const isMatch = storedOtpClean === enteredOtpClean;

  console.log("🔍 OTP MATCH DEBUG:", {
    storedOtpClean,
    enteredOtpClean,
    match: isMatch
  });

  if (!isMatch) {
    stored.attempts += 1;
    return { ok: false, status: 400, message: "Invalid OTP" };
  }

  return { ok: true, stored };
};

// -------------------- REGISTER SEND OTP --------------------
export const registerSendOtp = async (req, res) => {
  try {
    const { name, email, password } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();
    const existingOtpData = getOtp(normalizedEmail);

    console.log("🔍 SEND OTP DEBUG:", {
      normalizedEmail,
      hasExistingOtp: !!existingOtpData,
      name: name?.trim(),
      hasPassword: !!password
    });

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    if (
      existingOtpData &&
      Date.now() < Number(existingOtpData.resendAvailableAt || 0)
    ) {
      const secondsLeft = Math.ceil(
        (existingOtpData.resendAvailableAt - Date.now()) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before requesting a new OTP`
      });
    }

    // ✅ FIXED: Allow if !isVerified
    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists && userExists.isVerified) {
      return res.status(400).json({
        success: false,
        message: "User already verified. Please login."
      });
    }

    const finalName = String(name || existingOtpData?.name || "").trim();
    const finalPassword = String(password || existingOtpData?.password || "");
    if (!finalName || !finalPassword) {
      return res.status(400).json({
        success: false,
        message: "Name, email and password are required"
      });
    }

    const otp = generateOTP();
    console.log("🔍 GENERATED OTP:", otp, "for email:", normalizedEmail);

    setOtp(normalizedEmail, {
      otp,
      name: finalName,
      password: finalPassword,
      purpose: "register"
    });
    
    console.log("🔍 STORED OTP for", normalizedEmail, getOtp(normalizedEmail)?.otp);

    await sendOtpEmail(normalizedEmail, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (err) {
    console.error("REGISTER SEND OTP ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  }
};

// -------------------- REGISTER VERIFY OTP --------------------
// -------------------- REGISTER VERIFY OTP --------------------
export const registerVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    console.log("🔍 VERIFY START:", { normalizedEmail, otp });

    if (!normalizedEmail || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const verification = validateOtpForEmail(normalizedEmail, otp);
    if (!verification.ok) {
      return res.status(verification.status).json({
        success: false,
        message: verification.message
      });
    }

    const { stored } = verification;

    if (stored.purpose !== "register" || !stored.name || !stored.password) {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP purpose"
      });
    }

    const userExists = await User.findOne({ email: normalizedEmail });
    if (userExists) {
      deleteOtp(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "User already exists"
      });
    }

    const hashedPassword = await bcrypt.hash(stored.password, 10);

    const user = await User.create({
      name: stored.name,
      email: normalizedEmail,
      password: hashedPassword,
      profileCompleted: false,
      role: "user",
      authProvider: "otp",
      isVerified: true
    });

    console.log("✅ USER CREATED:", user._id);

    // 🔥🔥🔥 MAIN FIX HERE
    const token = generateAuthToken(user);

    deleteOtp(normalizedEmail);

    return res.json({
      success: true,
      message: "Registration completed successfully",
      token,   // ✅ ADDED
      user     // ✅ ADDED
    });

  } catch (err) {
    console.error("REGISTER VERIFY OTP ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });
  }
};

// -------------------- FORGOT PASSWORD SEND OTP --------------------
export const forgotPasswordSendOtp = async (req, res) => {
  try {
    const { email } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail) {
      return res.status(400).json({
        success: false,
        message: "Email is required"
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const existingOtpData = getOtp(normalizedEmail);
    if (
      existingOtpData &&
      Date.now() < Number(existingOtpData.resendAvailableAt || 0)
    ) {
      const secondsLeft = Math.ceil(
        (existingOtpData.resendAvailableAt - Date.now()) / 1000
      );
      return res.status(429).json({
        success: false,
        message: `Please wait ${secondsLeft}s before requesting a new OTP`
      });
    }

    const otp = generateOTP();
    setOtp(normalizedEmail, {
      otp,
      purpose: "forgot-password"
    });
    await sendOtpEmail(normalizedEmail, otp);

    return res.json({
      success: true,
      message: "OTP sent successfully"
    });
  } catch (err) {
    console.error("FORGOT PASSWORD SEND OTP ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: "Failed to send OTP"
    });
  }
};

// -------------------- FORGOT PASSWORD VERIFY OTP --------------------
export const forgotPasswordVerifyOtp = async (req, res) => {
  try {
    const { email, otp } = req.body;

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        message: "Email and OTP are required"
      });
    }

    const verification = validateOtpForEmail(email, otp);
    if (!verification.ok) {
      return res.status(verification.status).json({
        success: false,
        message: verification.message
      });
    }

    const normalizedEmail = String(email || "").trim().toLowerCase();
    const { stored } = verification;
    if (stored.purpose !== "forgot-password") {
      return res.status(400).json({
        success: false,
        message: "Invalid OTP purpose"
      });
    }

    setOtp(normalizedEmail, {
      otp: "verified",
      purpose: "forgot-password-verified",
      expiresAt: Date.now() + 5 * 60 * 1000,
      resendAvailableAt: Date.now(),
      attempts: 0
    });

    return res.json({
      success: true,
      message: "OTP verified successfully"
    });
  } catch (err) {
    console.error("FORGOT PASSWORD VERIFY OTP ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: "OTP verification failed"
    });
  }
};

// -------------------- RESET PASSWORD --------------------
export const resetPassword = async (req, res) => {
  try {
    const { email, newPassword } = req.body;
    const normalizedEmail = String(email || "").trim().toLowerCase();

    if (!normalizedEmail || !newPassword) {
      return res.status(400).json({
        success: false,
        message: "Email and new password are required"
      });
    }

    const otpData = getOtp(normalizedEmail);
    if (!otpData || otpData.purpose !== "forgot-password-verified") {
      return res.status(400).json({
        success: false,
        message: "Password reset is not authorized. Verify OTP first."
      });
    }

    if (Date.now() > otpData.expiresAt) {
      deleteOtp(normalizedEmail);
      return res.status(400).json({
        success: false,
        message: "Password reset session expired. Verify OTP again."
      });
    }

    const user = await User.findOne({ email: normalizedEmail });
    if (!user) {
      deleteOtp(normalizedEmail);
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    const hashedPassword = await bcrypt.hash(String(newPassword), 10);
    user.password = hashedPassword;
    user.authProvider = "otp";
    await user.save();

    deleteOtp(normalizedEmail);
    return res.json({
      success: true,
      message: "Password reset successful"
    });
  } catch (err) {
    console.error("RESET PASSWORD ERROR 👉", err);
    return res.status(500).json({
      success: false,
      message: "Failed to reset password"
    });
  }
};

// -------------------- MAGIC LINK LOGIN --------------------
export const sendMagicLinkForLogin = async (req, res) => {
  const isMobile = req.headers["x-client-type"] === "mobile";

  try {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );

    const magicLink = isMobile
      ? `sandyapp://magic-verify?token=${token}`
      : `${process.env.CLIENT_URL}/magic-verify?token=${token}`;

    await sendMagicLink(email, magicLink);

    res.json({ message: "Magic link sent" });

  } catch (err) {
    console.error("MAGIC LOGIN ERROR 👉", err);
    res.status(500).json({ message: "Failed to send magic link" });
  }
};

// -------------------- GET ME --------------------
export const getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select("-password");

    res.json({
      success: true,
      user
    });

  } catch (err) {
    console.error("GET ME ERROR 👉", err);
    res.status(500).json({ message: "Failed to fetch user" });
  }
};
