import nodemailer from "nodemailer";

export const sendMagicLink = async (email, link) => {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS
    }
  });

  await transporter.sendMail({
    from: "Sandy's Sweet Nest 🍰",
    to: email,
    subject: "Verify your account",
    html: `<p>Click below to verify:</p><a href="${link}">${link}</a>`
  });
};
