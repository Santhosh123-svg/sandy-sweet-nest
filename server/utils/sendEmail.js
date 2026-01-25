import Brevo from "brevo";

const client = new Brevo({
  apiKey: process.env.BREVO_API_KEY,
});

export const sendMagicLink = async (email, link, subject = "Verify your account") => {
  try {
    await client.sendTransacEmail({
      sender: {
        name: "Sandy's Sweet Nest 🍰",
        email: process.env.MAIL_FROM,
      },
      to: [{ email }],
      subject,
      htmlContent: `
        <h3>Sandy's Sweet Nest 🍰</h3>
        <p>Click the link below:</p>
        <a href="${link}">${link}</a>
        <p>This link is valid for 10 minutes.</p>
      `,
    });

    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Email failed to ${email}:`, error.response?.body || error.message);
  }
};

export default client;
