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
      <div style="font-family: Arial, sans-serif; padding: 20px; border: 1px solid #eee; border-radius: 8px;">
        <h2 style="color: #f59e0b;">Sandy's Sweet Nest 🍰</h2>
        <p>Click the button below to verify your email and login:</p>
        <a href="${magicLink}" style="background: #f59e0b; color: white; padding: 12px 25px; text-decoration: none; border-radius: 5px; display: inline-block; font-weight: bold;">
          Login Now
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 15 minutes.</p>
      </div>
    `;
    
    // Ensure MAIL_FROM matches a VERIFIED SENDER in Brevo Dashboard
    sendSmtpEmail.sender = { 
      name: "Sandy's Sweet Nest", 
      email: process.env.MAIL_FROM 
    };
    
    sendSmtpEmail.to = [{ email: toEmail }];

    console.log("⏳ Attempting to send email via Brevo...");
    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Brevo API Response:", JSON.stringify(result, null, 2));

    return { success: true, messageId: result.messageId };
  } catch (error) {
    const errorDetail = error.response ? error.response.text : error.message;
    console.error("❌ BREVO FAILURE REASON:", errorDetail);
    throw new Error(`Email delivery failed: ${errorDetail}`);
  }
};