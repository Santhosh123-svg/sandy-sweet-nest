import React, { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate, useLocation } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

const OtpScreenWeb = () => {
  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(60);
  const [resending, setResending] = useState(false);
  const [shake, setShake] = useState(false);

  const navigate = useNavigate();
  const location = useLocation();
  const params = location.state || {};
  const email = params.email;
  const flow = params.flow || "signup"; // "signup" or "login"

  // Countdown timer
  useEffect(() => {
    if (timer <= 0) return;

    const interval = setInterval(() => {
      setTimer((prev) => {
        if (prev <= 1) {
          clearInterval(interval);
          return 0;
        }
        return prev - 1;
      });
    }, 1000);

    return () => clearInterval(interval);
  }, [timer]);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 300);
  };

  const handleVerifyOtp = async () => {
    if (otp.length !== 6) {
      triggerShake();
      alert("Please enter a valid 6-digit OTP");
      return;
    }

    try {
      setLoading(true);

      let res;
      if (flow === "signup") {
        res = await axiosInstance.post("/api/auth/register/verify-otp", { email, otp });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("profileCompleted", res.data.profileCompleted);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("OTP verified successfully");

        if (!res.data.profileCompleted) {
          navigate("/complete-profile");
        } else {
          navigate("/welcome");
        }
      } else if (flow === "login") {
        res = await axiosInstance.post("/api/auth/login/verify-otp", { email, otp });
        localStorage.setItem("token", res.data.token);
        localStorage.setItem("role", res.data.role);
        localStorage.setItem("profileCompleted", res.data.profileCompleted);
        localStorage.setItem("user", JSON.stringify(res.data.user));

        alert("OTP verified successfully");
        if (!res.data.profileCompleted) {
          navigate("/complete-profile");
        } else {
          navigate("/welcome");
        }
      }
    } catch (err) {
      const statusCode = err?.response?.status;
      const message = err.response?.data?.message || "OTP verification failed";
      alert(`${statusCode === 429 ? "Wait Before Retry" : "Invalid OTP"}: ${message}`);
      triggerShake();
    } finally {
      setLoading(false);
    }
  };

  const handleResendOtp = async () => {
    if (timer > 0 || !email || resending) return;

    try {
      setResending(true);

      if (flow === "signup") {
        await axiosInstance.post("/api/auth/register/send-otp", { email });
      } else if (flow === "login") {
        await axiosInstance.post("/api/auth/login/send-otp", { email });
      }

      setTimer(60);
      alert("OTP sent again");
    } catch (err) {
      const statusCode = err?.response?.status;
      alert(statusCode === 429 ? "Please wait before retrying" : "Failed to resend OTP");
    } finally {
      setResending(false);
    }
  };

  return (
    <div style={styles.container}>
      <AnimatePresence>
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0 }}
          style={styles.card}
        >
          <h2 style={styles.title}>Verify OTP 🔐</h2>
          <p style={styles.subText}>OTP sent to {email}</p>

          <motion.div
            animate={shake ? { x: [0, -10, 10, -6, 6, 0] } : { x: 0 }}
            transition={{ duration: 0.3 }}
          >
            <input
              type="text"
              placeholder="Enter 6-digit OTP"
              style={styles.input}
              value={otp}
              onChange={(e) => setOtp(e.target.value.replace(/\D/g, ""))}
              maxLength={6}
            />
          </motion.div>

          <motion.button
            whileTap={{ scale: 0.95 }}
            style={{ ...styles.button, ...(loading ? styles.disabled : {}) }}
            onClick={handleVerifyOtp}
            disabled={loading}
          >
            {loading ? "Loading..." : "Verify OTP"}
          </motion.button>

          {timer > 0 ? (
            <p style={styles.link}>Resend OTP in {timer}s</p>
          ) : (
            <button
              onClick={handleResendOtp}
              disabled={resending}
              style={{ ...styles.linkBtn, ...(resending ? styles.linkDisabled : {}) }}
            >
              {resending ? "Resending..." : "Resend OTP"}
            </button>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OtpScreenWeb;

const styles = {
  container: {
    minHeight: "100vh",
    backgroundColor: "#fde68a",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  card: {
    width: 320,
    backgroundColor: "#fff",
    padding: 22,
    borderRadius: 25,
    boxShadow: "0 10px 20px rgba(0,0,0,0.15)",
    textAlign: "center",
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    color: "#d97706",
    marginBottom: 10,
  },
  subText: {
    marginBottom: 18,
    color: "#555",
  },
  input: {
    width: "100%",
    padding: 16,
    borderRadius: 14,
    marginBottom: 14,
    textAlign: "center",
    fontSize: 20,
    letterSpacing: 8,
    border: "1px solid #eee",
    outline: "none",
  },
  button: {
    backgroundColor: "#f59e0b",
    padding: 15,
    borderRadius: 14,
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
    border: "none",
    cursor: "pointer",
    marginBottom: 10,
  },
  disabled: {
    backgroundColor: "#fcd34d",
    cursor: "not-allowed",
  },
  link: {
    color: "#d97706",
    marginTop: 14,
  },
  linkBtn: {
    background: "none",
    border: "none",
    color: "#d97706",
    cursor: "pointer",
    marginTop: 14,
    fontSize: 14,
  },
  linkDisabled: {
    color: "#9ca3af",
    cursor: "not-allowed",
  },
};