import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../utils/axiosInstance";
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
      await axiosInstance.post("/orders", order);

      // 🔥 CUSTOMER MESSAGE
      const customerMsg = `
🎂 ORDER CONFIRMED – Sandy Sweet Nest

Product: ${order.productName}
Quantity: ${order.quantity}
Amount: ₹${order.totalAmount}

Flavor: ${order.flavor || "-"}
Size: ${order.size || "-"}
Shape: ${order.shape || "-"}
Toppings: ${order.toppings?.length ? order.toppings.map(t => t.name).join(", ") : "-"}

📌 Delivery:
Date: ${order.cakeInfo?.deliveryDate || "-"}
Time: ${order.cakeInfo?.preferredTime || "-"}

🎁 Purpose: ${order.cakeInfo?.purpose || "-"}
✍ Text on Cake: ${order.cakeInfo?.cakeText || "-"}

👤 Customer Details
Name: ${order.customerInfo?.name || "-"}
Phone: ${order.customerInfo?.phone || "-"}
Address: ${order.customerInfo?.address || "-"}

Thank you for ordering with us ❤️
`;

      // 🚨 ADMIN MESSAGE
      const adminMsg = `
🚨 NEW ORDER

Product: ${order.productName}
Quantity: ${order.quantity}
Amount: ₹${order.totalAmount}

Flavor: ${order.flavor || "-"}
Size: ${order.size || "-"}
Shape: ${order.shape || "-"}
Toppings: ${order.toppings?.length ? order.toppings.map(t => t.name).join(", ") : "-"}

📌 Delivery:
Date: ${order.cakeInfo?.deliveryDate || "-"}
Time: ${order.cakeInfo?.preferredTime || "-"}

🎁 Purpose: ${order.cakeInfo?.purpose || "-"}
✍ Text on Cake: ${order.cakeInfo?.cakeText || "-"}

👤 Customer Details
Name: ${order.customerInfo?.name || "-"}
Phone: ${order.customerInfo?.phone || "-"}
Address: ${order.customerInfo?.address || "-"}
`;

      // ✅ Open WhatsApp BEFORE navigating to success page
      const isMobile = /Android|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);

      if (isMobile) {
        const whatsappWindow = window.open(
          `https://wa.me/${PAYMENT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(adminMsg)}`,
          "_blank"
        );
        if (!whatsappWindow) {
          window.location.href = `https://wa.me/${PAYMENT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(adminMsg)}`;
        }
      } else {
        window.open(
          `https://wa.me/${order.customerInfo?.phone}?text=${encodeURIComponent(customerMsg)}`,
          "_blank"
        );
        window.open(
          `https://wa.me/${PAYMENT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(adminMsg)}`,
          "_blank"
        );
      }

      navigate("/order-success");
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
