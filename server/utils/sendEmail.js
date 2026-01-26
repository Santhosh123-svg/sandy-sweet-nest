import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 587,
  secure: false, // must be false for port 587
  auth: {
    user: process.env.MAIL_USER, // your gmail
    pass: process.env.MAIL_PASS, // app password
  },
  tls: {
    rejectUnauthorized: false, // important for cloud servers
  },
});

// Verify transporter (Render-friendly async)
(async () => {
  try {
    await transporter.verify();
    console.log("✅ Gmail transporter ready");
  } catch (err) {
    console.error("❌ Gmail transporter failed:", err.message);
  }
})();

export default transporter;

// Magic Link Email
export const sendMagicLink = async (toEmail, magicLink) => {
  try {
    const mailOptions = {
      from: `"Sandy's Sweet Nest" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: "Your Magic Login Link",
      html: `
        <h3>Welcome to Sandy's Sweet Nest 🍰</h3>
        <p>Click the button below to login:</p>
        <a 
          href="${magicLink}" 
          style="
            padding: 10px 15px;
            background: #ff9f43;
            color: white;
            text-decoration: none;
            border-radius: 5px;
          "
        >
          Login Now
        </a>
        <p>This link will expire soon.</p>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Magic link sent to:", toEmail);
    console.log("📩 Message ID:", info.messageId);

    return { success: true };
  } catch (error) {
    console.error("❌ Magic link send error:", error.message);
    throw error;
  }
};
