const OTP_TTL_MS = 5 * 60 * 1000;
const RESEND_COOLDOWN_MS = 60 * 1000;

const otpStore = new Map();

export const setOtp = (email, payload) => {
  const normalizedEmail = String(email).trim().toLowerCase();

  console.log("🔧 OTP STORE SET:", {
    normalizedEmail,
    rawPayload: payload,
    wasOverwritten: otpStore.has(normalizedEmail)
  });

  const otpValue =
    typeof payload === "string"
      ? payload
      : String(payload?.otp || "");

  const metadata = typeof payload === "string" ? {} : payload || {};
  const now = Date.now();

  const cleanedOtp = String(otpValue).replace(/\D/g, "").trim();

  const otpData = {
    otp: cleanedOtp,
    name: metadata.name || "",
    password: metadata.password || "",
    purpose: metadata.purpose || "unknown",
    expiresAt: metadata.expiresAt || now + OTP_TTL_MS,
    resendAvailableAt:
      metadata.resendAvailableAt || now + RESEND_COOLDOWN_MS,
    attempts: Number(metadata.attempts) || 0
  };

  if (otpData.otp.length !== 6) {
    console.warn("⚠️ OTP LENGTH ISSUE BUT SAVING:", otpData.otp);
  }

  otpStore.set(normalizedEmail, otpData);

  console.log("✅ OTP STORED:", {
    normalizedEmail,
    otp: otpData.otp,
    expiresAt: new Date(otpData.expiresAt).toISOString()
  });
};

export const getOtp = (email) => {
  const normalizedEmail = String(email).trim().toLowerCase();

  const stored = otpStore.get(normalizedEmail);

  console.log("🔍 OTP STORE GET:", {
    normalizedEmail,
    hasOtp: !!stored,
    storedOtp: stored?.otp,
    purpose: stored?.purpose,
    expiresSoon: stored
      ? Date.now() > stored.expiresAt - 30000
      : false
  });

  return stored;
};

export const deleteOtp = (email) => {
  const normalizedEmail = String(email).trim().toLowerCase();
  const existed = otpStore.has(normalizedEmail);

  otpStore.delete(normalizedEmail);

  console.log("🗑️ OTP DELETED:", {
    normalizedEmail,
    existedBefore: existed
  });
};