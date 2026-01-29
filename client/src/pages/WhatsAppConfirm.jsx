import React, { useRef } from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Send, CheckCircle } from "lucide-react";
import { useOrder } from "../context/OrderContext";
import { PAYMENT_CONFIG } from "../config/paymentConfig";

const WhatsAppConfirm = () => {
  const { order } = useOrder();
  const navigate = useNavigate();
  const sent = useRef(false);

  const sendWhatsApp = () => {
    if (sent.current) return;
    sent.current = true;

    const isCake =
      order?.category?.toLowerCase() === "cake" ||
      order?.category?.toLowerCase() === "cakes";

    const message = `🧁 New Order Received

👤 Name: ${order.customer?.name || "-"}
📞 Phone: ${order.customer?.phone || "-"}
📍 Address: ${order.customer?.address || "-"}

📦 Item: ${order.productName}
🔢 Quantity: ${order.quantity}
💰 Total: ₹${order.totalAmount}
${isCake ? `
🍰 Flavor: ${order.flavor || "-"}
⚖️ Size: ${order.size || "-"}
🎨 Shape: ${order.shape || "-"}
🍫 Toppings: ${order.toppings?.length ? order.toppings.map((t) => t.name).join(", ") : "-"}
🎂 Purpose: ${order.cakeInfo?.purpose || "-"}
✍️ Text on Cake: ${order.cakeInfo?.cakeText || "-"}
` : ""}
📅 Delivery Date: ${order.cakeInfo?.deliveryDate || "-"}
⏰ Preferred Time: ${order.cakeInfo?.preferredTime || "-"}
`;

    const whatsappUrl = `https://wa.me/${PAYMENT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;

    window.open(whatsappUrl, "_blank");
    navigate("/order-success");
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
