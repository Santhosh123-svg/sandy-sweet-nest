import SibApiV3Sdk from "sib-api-v3-sdk";

const defaultClient = SibApiV3Sdk.ApiClient.instance;
const apiKey = defaultClient.authentications["api-key"];
apiKey.apiKey = process.env.BREVO_API_KEY;

const apiInstance = new SibApiV3Sdk.TransactionalEmailsApi();

export const sendMagicLink = async (toEmail, magicLink) => {
  try {
    const sendSmtpEmail = new SibApiV3Sdk.SendSmtpEmail();

    sendSmtpEmail.subject = "Verify your account - Sandy's Sweet Nest";
    sendSmtpEmail.htmlContent = `
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 10px;">
        <h2 style="color: #f59e0b;">Welcome! 🍰</h2>
        <p>Click the button below to verify your email and complete your registration:</p>
        <a href="${magicLink}" style="background: #f59e0b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Verify & Login Now
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 15 minutes.</p>
      </div>
    `;
    
    // CRITICAL: process.env.MAIL_FROM MUST be a verified sender in your Brevo Dashboard
    sendSmtpEmail.sender = { 
      name: "Sandy's Sweet Nest", 
      email: process.env.MAIL_FROM 
    };
    
    sendSmtpEmail.to = [{ email: toEmail }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Email sent via Brevo:", result.messageId);
    return result;
  } catch (error) {
    // Log the specific error from Brevo API to the server console
    console.error("❌ Brevo API Error:", error.response ? error.response.text : error.message);
    throw new Error("Failed to send verification email. Please check sender settings.");
  }
};