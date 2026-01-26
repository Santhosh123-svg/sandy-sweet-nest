import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;

const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendMagicLink = async (toEmail, magicLink) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Your Magic Login Link";
    sendSmtpEmail.htmlContent = `
      <h3>Click below to login</h3>
      <a href="${magicLink}">Login Now</a>
    `;
    sendSmtpEmail.sender = { name: "Sandy's Sweet Nest", email: process.env.MAIL_USER };
    sendSmtpEmail.to = [{ email: toEmail }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Magic link sent:", result);

    return { success: true, result };
  } catch (error) {
    console.error("❌ Brevo email failed:", error);
    throw error;
  }
};
