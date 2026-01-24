import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { useOrder } from "../context/OrderContext";
import { PAYMENT_CONFIG } from "../config/paymentConfig";

const WhatsAppConfirm = () => {
  const { order } = useOrder();
  const navigate = useNavigate();
  const sent = useRef(false);

  const sendWhatsApp = async () => {
    if (sent.current) return;
    sent.current = true;

    const token = localStorage.getItem("token");

    if (!token) {
      alert("Login required! Please login first.");
      navigate("/login");
      return;
    }

    try {
      // ✅ Save order to backend
      await axios.post(
        "http://localhost:5000/api/orders",
        order,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // 🔥 CUSTOMER MESSAGE
      const customerMsg = `
🎂 ORDER CONFIRMED – Sandy Sweet Nest

Product: ${order.productName}
Flavor: ${order.flavor || "-"}
Quantity: ${order.quantity}
Amount: ₹${order.totalAmount}

Delivery Date: ${order.cakeInfo?.deliveryDate || "-"}
Preferred Time: ${order.cakeInfo?.preferredTime || "-"}

👤 Your Details
Name: ${order.customer?.name}
Phone: ${order.customer?.phone}
Address: ${order.customer?.address}

Thank you for ordering with us ❤️
`;

      // 🚨 ADMIN MESSAGE
      const adminMsg = `
🚨 NEW CAKE ORDER

Product: ${order.productName}
Flavor: ${order.flavor || "-"}
Qty: ${order.quantity}
Amount: ₹${order.totalAmount}

Delivery Date: ${order.cakeInfo?.deliveryDate || "-"}
Preferred Time: ${order.cakeInfo?.preferredTime || "-"}

👤 CUSTOMER DETAILS
Name: ${order.customer?.name}
Phone: ${order.customer?.phone}
Address: ${order.customer?.address}
`;

      // ✅ FIRST navigate to success page
      navigate("/order-success");

      // ✅ THEN open WhatsApp (mobile-friendly approach)
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        // On mobile, use direct location change for better WhatsApp app opening
        setTimeout(() => {
          window.location.href = `https://wa.me/${PAYMENT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(adminMsg)}`;
        }, 1000);
      } else {
        // On desktop, use window.open
        window.open(
          `https://wa.me/${order.customer?.phone}?text=${encodeURIComponent(customerMsg)}`,
          "_blank"
        );
        window.open(
          `https://wa.me/${PAYMENT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(adminMsg)}`,
          "_blank"
        );
      }

    } catch (error) {
      console.log(error);
      alert("Order failed! Please try again.");
      sent.current = false;
    }
  };

  if (!order) return null;

  return (
    <div className="min-h-screen bg-green-50 flex items-center justify-center px-4">
      <motion.div
        initial={{ scale: 0.9, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="bg-white p-6 rounded-3xl shadow-xl max-w-md w-full text-center"
      >
        <CheckCircle className="mx-auto text-green-500" size={50} />
        <h2 className="text-xl font-extrabold mt-3">
          Payment Successful
        </h2>

        <p className="text-gray-600 mt-2 mb-5">
          Send WhatsApp to complete order
        </p>

        <button
          onClick={sendWhatsApp}
          className="w-full bg-green-500 text-white py-3 rounded-2xl font-bold flex items-center justify-center gap-2"
        >
          <Send /> SEND WHATSAPP
        </button>

        <p className="text-xs text-red-600 mt-3">
          WhatsApp mandatory to exit
        </p>
      </motion.div>
    </div>
  );
};

export default WhatsAppConfirm;
