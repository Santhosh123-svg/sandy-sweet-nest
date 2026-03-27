import nodemailer from "nodemailer";

/**
 * Send OTP via Gmail
 * @param {string} toEmail
 * @param {string} otp
 */
export const sendOtpEmail = async (toEmail, otp) => {
  try {
    // 🔥 FROM ENV
    const userEmail = process.env.EMAIL_USER;
    const appPassword = process.env.EMAIL_PASS;

    console.log("📧 Sending OTP to:", toEmail);
    console.log("👤 Sender Email:", userEmail);

    if (!userEmail || !appPassword) {
      throw new Error("Email or App Password missing");
    }

    // 🔥 TRANSPORT
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: appPassword,
      },
    });

    const msg = {
      from: userEmail,
      to: String(toEmail).trim(),
      subject: "Your OTP Code",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:#f59e0b;">Sandy's Sweet Nest 🍰</h2>
          <p>Your OTP is:</p>
          <h1 style="letter-spacing: 4px;">${otp}</h1>
          <p>This OTP is valid for 5 minutes</p>
        </div>
      `,
    };

    await transporter.sendMail(msg);

    console.log("✅ OTP EMAIL SENT via GMAIL");

  } catch (error) {
    console.error("❌ GMAIL ERROR 👉", error?.message || error);
    throw new Error("Email send failed");
  }
};

/**
 * Send Magic Link Email
 */
export const sendMagicLink = async (toEmail, magicLink) => {
  try {
    const userEmail = process.env.EMAIL_USER;
    const appPassword = process.env.EMAIL_PASS;

    console.log("🔗 Sending Magic Link to:", toEmail);

    if (!userEmail || !appPassword) {
      throw new Error("Email or App Password missing");
    }

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: userEmail,
        pass: appPassword,
      },
    });

    const msg = {
      from: userEmail,
      to: String(toEmail).trim(),
      subject: "Your Magic Login Link",
      html: `
        <div style="font-family: Arial; padding:20px;">
          <h2 style="color:#f59e0b;">Sandy's Sweet Nest 🍰</h2>
          <p>Click below to login:</p>
          <a href="${magicLink}"
             style="background:#f59e0b;color:white;padding:10px 20px;border-radius:5px;">
            Login
          </a>
        </div>
      `,
    };

    await transporter.sendMail(msg);

    console.log("✅ MAGIC LINK SENT via GMAIL");

  } catch (error) {
    console.error("❌ GMAIL ERROR 👉", error?.message || error);
    throw new Error("Email send failed");
  }
};