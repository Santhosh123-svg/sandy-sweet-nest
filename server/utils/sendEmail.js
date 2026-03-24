import sgMail from "@sendgrid/mail";

// ✅ USE ENV VARIABLE (SAFE)
sgMail.setApiKey(process.env.SENDGRID_API_KEY);

const senderEmail = "valarmathisanthosh33@gmail.com";

/**
 * Send OTP via SendGrid
 * @param {string} toEmail - Recipient email
 * @param {string} otp - One time password
 */
export const sendOtpEmail = async (toEmail, otp) => {
  try {
    console.log("Sending email to:", toEmail);
    const finalToEmail = String(toEmail).trim();

    const msg = {
      to: finalToEmail,
      from: senderEmail,
      subject: "Your OTP Code",
      html: `
           <div style="font-family: Arial; padding:20px;">
             <h2 style="color:#f59e0b;">Sandy's Sweet Nest 🍰</h2>
             <p>Your OTP is:</p>
             <h1 style="letter-spacing: 4px;">${otp}</h1>
             <p>This OTP is valid for 5 minutes</p>
           </div>
         `,
    };

    const response = await sgMail.send(msg);

    console.log("✅ EMAIL SENT via SENDGRID", response[0].statusCode);

  } catch (error) {
    console.error(
      "❌ SENDGRID ERROR 👉",
      error?.response?.body || error?.message || error
    );
    throw new Error("Email send failed");
  }
};

/**
 * Keep magic link sender for web routes compatibility.
 * @param {string} toEmail
 * @param {string} magicLink
 */
export const sendMagicLink = async (toEmail, magicLink) => {
  try {
    const finalToEmail = String(toEmail).trim();
    const msg = {
      to: finalToEmail,
      from: senderEmail,
      subject: "Your Magic Login Link",
      html: `
           <div style="font-family: Arial; padding:20px;">
             <h2 style="color:#f59e0b;">Sandy's Sweet Nest 🍰</h2>
             <p>Click below to login:</p>
             <a href="${magicLink}"
                style="background:#f59e0b;color:white;padding:10px 20px;border-radius:5px;">
               Login
             </a>
           </div>
         `,
    };

    await sgMail.send(msg);
  } catch (error) {
    console.error(
      "❌ SENDGRID ERROR 👉",
      error?.response?.body || error?.message || error
    );
    throw new Error("Email send failed");
  }
};