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
      <div style="font-family: Arial, sans-serif; padding: 20px;">
        <h3>Welcome to Sandy's Sweet Nest! 🍰</h3>
        <p>Click the button below to verify your email and login:</p>
        <a href="${magicLink}" style="background: #f59e0b; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px; display: inline-block;">
          Login Now
        </a>
        <p style="margin-top: 20px; font-size: 12px; color: #666;">This link expires in 15 minutes.</p>
      </div>
    `;
    
    // Ensure MAIL_FROM is a verified sender in your Brevo dashboard
    sendSmtpEmail.sender = { 
      name: "Sandy's Sweet Nest", 
      email: process.env.MAIL_FROM 
    };
    
    sendSmtpEmail.to = [{ email: toEmail }];

    const result = await apiInstance.sendTransacEmail(sendSmtpEmail);
    console.log("✅ Magic link sent successfully:", result.messageId);

    return { success: true, result };
  } catch (error) {
    console.error("❌ Brevo email failed:", error.response ? error.response.text : error.message);
    throw error;
  }
};