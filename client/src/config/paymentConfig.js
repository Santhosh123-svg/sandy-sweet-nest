// client/src/config/paymentConfig.js

export const PAYMENT_CONFIG = {
  // =========================
  // UPI PAYMENT DETAILS
  // =========================
  UPI_ID: "",   // 🔴 UN UPI ID inga podu
  MERCHANT_NAME: "Sandy’s Sweet Nest",
  CURRENCY: "INR",

  // =========================
  // QR CODE IMAGE
  // =========================
  // This image should be inside: public/payment/upi-qr.png
  QR_IMAGE: "/payment/san1.jpeg",

  // =========================
  // OWNER WHATSAPP NUMBER
  // =========================
  // Country code mandatory (India = 91)
  WHATSAPP_NUMBER: "916374122294",

  // =========================
  // PAYMENT NOTE (OPTIONAL)
  // =========================
  PAYMENT_NOTE: "Sweet Nest Order Payment",
};
