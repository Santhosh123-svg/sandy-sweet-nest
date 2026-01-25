import nodemailer from "nodemailer";

export const sendMagicLink = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.MAIL_USER,
      pass: process.env.MAIL_PASS,
    },
  });

  await transporter.sendMail({
    from: `"Sandy's Sweet Nest 🍰" <${process.env.MAIL_USER}>`,
    to: email,
    subject: "Verify your account",
    html: `
      <p>Click below to verify:</p>
      <a href="${link}">${link}</a>
      <p>Link valid for 10 minutes</p>
    `,
  });
};
