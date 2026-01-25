import SibApiV3Sdk from "brevo";

const client = SibApiV3Sdk.ApiClient.instance;
client.authentications["api-key"].apiKey = process.env.BREVO_API_KEY;

/* =========================
   SEND MAGIC LINK MAIL (ASYNC, FIRE-AND-FORGET)
========================= */
export const sendMagicLink = async (email, link, subject = "Verify your account") => {
  try {
    const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail({
      sender: { name: "Sandy's Sweet Nest", email: process.env.MAIL_FROM },
      to: [{ email }],
      subject,
      htmlContent: `
        <h3>Sandy's Sweet Nest 🍰</h3>
        <p>Click the link below:</p>
        <a href="${link}">${link}</a>
        <p>This link is valid for 10 minutes.</p>
      `,
    });

    await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log(`✅ Email sent to ${email}`);
  } catch (error) {
    console.error(`❌ Email failed to ${email}:`, error);
  }
};

export default null;
