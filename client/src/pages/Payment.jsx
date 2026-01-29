import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { QrCode, Smartphone, ArrowLeft, Loader2, X } from "lucide-react";
import { useOrder } from "../context/OrderContext";

const Payment = () => {
  const navigate = useNavigate();
  const { order, placeOrder } = useOrder();

  const [mode, setMode] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [orderId, setOrderId] = useState("");

  useEffect(() => {
    if (!order) navigate("/welcome");
    else setOrderId(order.orderId || "");
  }, [order, navigate]);

  if (!order) return null;

  const totalAmount = order.totalAmount;

  // REAL SBI UPI ID
  const UPI_ID = "srinivasanst29@oksbi";
  const SHOP_NAME = "Sandy Sweet Nest";
  const NOTE = "Cake Order Payment";

  // UPI LINK
  const upiLink = `upi://pay?pa=${UPI_ID}&pn=${encodeURIComponent(
    SHOP_NAME
  )}&am=${totalAmount}&cu=INR&tn=${encodeURIComponent(NOTE)}&mode=02`;

  // QR
  const qrImage = `https://api.qrserver.com/v1/create-qr-code/?size=300x300&data=${encodeURIComponent(
    upiLink
  )}`;

  const handlePaid = () => {
    if (!orderId.trim()) {
      alert("Please enter your Order ID / Transaction ID to proceed 💳");
      return;
    }

    setVerifying(true);

    // Save orderId inside order context
    placeOrder({
      ...order,
      orderId: orderId,
    });

    setTimeout(() => {
      navigate("/whatsapp-confirm");
    }, 4000);
  };

  return (
    <div className="min-h-screen bg-amber-100 flex items-center justify-center px-4">
      <motion.div
        initial={{ y: 40, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="bg-white p-6 rounded-3xl shadow-xl w-full max-w-md"
      >
        {/* HEADER */}
        <div className="flex items-center gap-3 mb-4">
          <ArrowLeft onClick={() => navigate(-1)} className="cursor-pointer" />
          <h2 className="text-xl font-extrabold text-amber-600">Payment</h2>
        </div>

        {/* SUMMARY */}
        {!mode && (
          <div className="bg-amber-50 rounded-2xl p-4 mb-5">
            <p className="font-bold">{order.productName}</p>
            <p className="text-sm">Qty: {order.quantity}</p>
            <p className="font-extrabold mt-2">₹{totalAmount}</p>
            <p className="text-xs text-red-600">
              Amount locked – cannot edit
            </p>
          </div>
        )}

        {/* OPTIONS */}
        {!mode && (
          <div className="grid grid-cols-2 gap-4 mb-6">
            <button
              onClick={() => setMode("scan")}
              className="bg-amber-500 text-white p-4 rounded-2xl font-bold flex flex-col items-center gap-2"
            >
              <QrCode /> Scan & Pay
            </button>

            <button
              onClick={() => setMode("upi")}
              className="bg-green-500 text-white p-4 rounded-2xl font-bold flex flex-col items-center gap-2"
            >
              <Smartphone /> UPI App
            </button>
          </div>
        )}

        {/* QR */}
        {mode === "scan" && (
          <div className="relative text-center">
            <button onClick={() => setMode(null)} className="absolute right-0">
              <X />
            </button>
            <img src={qrImage} alt="UPI QR" className="w-64 mx-auto" />
            <p className="text-sm mt-3 font-semibold">
              Scan using GPay / PhonePe
            </p>
          </div>
        )}

        {/* UPI APP */}
        {mode === "upi" && (
          <div className="relative flex flex-col gap-3">
            <button onClick={() => setMode(null)} className="absolute right-0">
              <X />
            </button>

            <a
              href={upiLink}
              className="bg-black text-white py-3 rounded-xl text-center font-bold"
            >
              Pay with Google Pay
            </a>

            <a
              href={upiLink}
              className="bg-purple-600 text-white py-3 rounded-xl text-center font-bold"
            >
              Pay with PhonePe
            </a>
          </div>
        )}

        {/* ORDER ID INPUT */}
        <div className="mt-4">
          <p className="text-sm font-semibold">
            Enter Order ID (for verification)
          </p>
          <input
            value={orderId}
            onChange={(e) => setOrderId(e.target.value)}
            className="w-full border p-3 rounded-xl mt-2"
            placeholder="e.g., ORD1234"
          />
        </div>

        {/* I HAVE PAID */}
        {(mode || verifying) && (
          <button
            onClick={handlePaid}
            className="w-full mt-5 bg-amber-600 text-white py-3 rounded-2xl font-bold"
          >
            I HAVE PAID
          </button>
        )}

        <AnimatePresence>
          {verifying && (
            <motion.div className="mt-4 flex items-center justify-center gap-2 text-green-600 font-semibold">
              <Loader2 className="animate-spin" />
              Verifying payment…
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>
    </div>
  );
};

export default Payment;
