import nodemailer from "nodemailer";

// Brevo SMTP transporter with Render-compatible timeouts
const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,          // smtp-relay.brevo.com
  port: Number(process.env.MAIL_PORT),  // 587
  secure: false,                        // TLS required, not SSL
  auth: {
    user: process.env.MAIL_USER,        // a0cbaf001@smtp-brevo.com
    pass: process.env.MAIL_PASS,        // SMTP KEY
  },
  tls: {
    rejectUnauthorized: false,          // Allow self-signed certs
    ciphers: 'HIGH:!aNULL:!eNULL:!EXPORT:!DES:!RC4:!MD5:!PSK:!SRP:!CAMELLIA', // Secure ciphers
  },
  connectionTimeout: 10000,             // 10s connection timeout
  greetingTimeout: 10000,               // 10s greeting timeout
  socketTimeout: 30000,                 // 30s socket timeout
});

/* =========================
   SEND MAGIC LINK MAIL (ASYNC, FIRE-AND-FORGET)
========================= */
export const sendMagicLink = async (email, link, subject = "Verify your account") => {
  try {
    await transporter.sendMail({
      from: `"Sandy's Sweet Nest 🍰" <${process.env.MAIL_FROM}>`,
      to: email,
      subject,
      html: `
        <h3>Sandy's Sweet Nest 🍰</h3>
        <p>Click the link below:</p>
        <a href="${link}">${link}</a>
        <p>This link is valid for 10 minutes.</p>
      `,
    });
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Email failed to ${email}:`, error.message);
    // Don't throw - email failure shouldn't break the flow
  }
};

export default transporter;
