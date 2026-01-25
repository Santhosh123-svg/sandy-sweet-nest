import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: process.env.MAIL_HOST,          // smtp-relay.brevo.com
  port: Number(process.env.MAIL_PORT),  // 587
  secure: false,
  auth: {
    user: process.env.MAIL_USER,        // a0cbaf001@smtp-brevo.com
    pass: process.env.MAIL_PASS,        // SMTP KEY
  },
  tls: {
    rejectUnauthorized: false,
  },
});

/* =========================
   SEND MAGIC LINK MAIL
========================= */
export const sendMagicLink = async (email, link, subject = "Verify your account") => {
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
};

export default transporter;
