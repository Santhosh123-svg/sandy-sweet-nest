import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail", // change if not Gmail
  auth: {
    user: process.env.MAIL_USER,
    pass: process.env.MAIL_PASS,
  },
});

export default transporter;

// Magic Link Function
export const sendMagicLink = async (toEmail, magicLink) => {
  try {
    const mailOptions = {
      from: `"Sandy's Sweet Nest" <${process.env.MAIL_USER}>`,
      to: toEmail,
      subject: "Your Magic Login Link",
      html: `
        <h3>Click below to login</h3>
        <a href="${magicLink}">Login Now</a>
      `,
    };

    const info = await transporter.sendMail(mailOptions);
    console.log("Magic link sent: ", info.response);
  } catch (error) {
    console.log("Magic link error: ", error);
  }
};
