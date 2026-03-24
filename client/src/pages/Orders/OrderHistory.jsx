import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { 
  ChevronLeft, 
  Package, 
  Calendar, 
  Clock, 
  XCircle, 
  CheckCircle2, 
  AlertCircle,
  Hash
} from "lucide-react";
import axiosInstance from "../../utils/axiosInstance";
import { PAYMENT_CONFIG } from "../../config/paymentConfig";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("/api/orders/my-orders");
      setOrders(res.data || []);
    } catch (err) {
      console.error("Fetch orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  const isPastDelivery = (deliveryDate, deliveryTime) => {
    if (!deliveryDate || !deliveryTime) return false;
    
    try {
      // Assuming deliveryDate is YYYY-MM-DD and deliveryTime is HH:mm
      const [year, month, day] = deliveryDate.split("-").map(Number);
      const [hours, minutes] = deliveryTime.split(":").map(Number);
      
      const deliveryDateTime = new Date(year, month - 1, day, hours, minutes);
      const now = new Date();
      
      return now > deliveryDateTime;
    } catch (e) {
      return false;
    }
  };

  const handleCancel = async (order) => {
    if (!window.confirm("Are you sure you want to cancel this order? 😢")) return;

    try {
      const res = await axiosInstance.put(`/api/orders/cancel/${order._id}`);
      if (res.data.success) {
        // Trigger WhatsApp Message
        const message = `🚨 Order Cancellation Alert

🧾 Order ID: ${order.orderId}
📦 Product: ${order.productName}
❌ Status: Cancelled by User

Please check the dashboard for details.`;

        const whatsappUrl = `https://wa.me/${PAYMENT_CONFIG.WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
        
        // Open WhatsApp
        window.open(whatsappUrl, "_blank");
        
        // Refresh orders
        fetchOrders();
      }
    } catch (err) {
      alert(err.response?.data?.message || "Failed to cancel order");
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-amber-50 to-orange-50 p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        {/* HEADER */}
        <div className="flex items-center gap-4 mb-8">
          <button
            onClick={() => navigate("/welcome")}
            className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition"
          >
            <ChevronLeft className="text-amber-600" />
          </button>
          <h1 className="text-3xl font-extrabold text-amber-800 tracking-tight">
            My Orders
          </h1>
        </div>

        {/* CONTENT */}
        {loading ? (
          <div className="flex justify-center py-20">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600"></div>
          </div>
        ) : orders.length === 0 ? (
          <div className="text-center py-20 bg-white rounded-3xl shadow-sm border border-amber-100">
            <Package className="mx-auto text-amber-200 mb-4" size={60} />
            <p className="text-xl text-gray-500 font-medium italic">No orders found yet 🍰</p>
            <button 
              onClick={() => navigate("/welcome")}
              className="mt-6 px-6 py-2 bg-amber-500 text-white rounded-xl font-bold shadow-md hover:bg-amber-600 transition"
            >
              Order Something Yummy
            </button>
          </div>
        ) : (
          <div className="space-y-6">
            <AnimatePresence>
              {orders.map((order, idx) => {
                const past = isPastDelivery(order.deliveryDate, order.deliveryTime);
                const isCancelled = order.status === "Cancelled by User" || order.status === "Cancelled";
                
                return (
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: idx * 0.1 }}
                    key={order._id}
                    className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden"
                  >
                    <div className="p-6">
                      <div className="flex flex-wrap justify-between items-start gap-4 mb-6">
                        <div className="flex items-center gap-2 px-3 py-1 bg-amber-100 rounded-full text-amber-800 text-xs font-black uppercase tracking-widest">
                          <Hash size={14} />
                          {order.orderId || "N/A"}
                        </div>
                        <div className="text-sm font-bold text-gray-400">
                          Ordered on {new Date(order.createdAt).toLocaleDateString()}
                        </div>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Package className="text-amber-500 shrink-0" size={20} />
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Product</p>
                              <p className="text-lg font-bold text-gray-800">{order.productName}</p>
                              <p className="text-sm text-gray-500">Quantity: {order.quantity} • Total: ₹{order.totalAmount}</p>
                            </div>
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-start gap-3">
                            <Calendar className="text-blue-500 shrink-0" size={20} />
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Delivery Date</p>
                              <p className="text-gray-800 font-bold">{order.deliveryDate || "N/A"}</p>
                            </div>
                          </div>
                          <div className="flex items-start gap-3">
                            <Clock className="text-purple-500 shrink-0" size={20} />
                            <div>
                              <p className="text-xs font-bold text-gray-400 uppercase tracking-tighter">Preferred Time</p>
                              <p className="text-gray-800 font-bold">{order.deliveryTime || "N/A"}</p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* STATUS & ACTIONS */}
                      <div className="mt-8 pt-6 border-t border-gray-100 flex flex-wrap items-center justify-between gap-4">
                        <div className="flex items-center gap-2">
                          {isCancelled ? (
                            <div className="flex items-center gap-2 text-red-500 font-black uppercase tracking-widest text-xs bg-red-50 px-4 py-2 rounded-xl">
                              <XCircle size={18} />
                              Cancelled
                            </div>
                          ) : past ? (
                            <div className="flex items-center gap-2 text-green-600 font-black uppercase tracking-widest text-xs bg-green-50 px-4 py-2 rounded-xl">
                              <CheckCircle2 size={18} />
                              Order Delivered
                            </div>
                          ) : (
                            <div className="flex items-center gap-2 text-blue-600 font-black uppercase tracking-widest text-xs bg-blue-50 px-4 py-2 rounded-xl">
                              <AlertCircle size={18} />
                              Processing
                            </div>
                          )}
                        </div>

                        {!isCancelled && !past && (
                          <button
                            onClick={() => handleCancel(order)}
                            className="bg-red-500 hover:bg-red-600 text-white font-bold px-6 py-2 rounded-xl transition shadow-md active:scale-95 flex items-center gap-2"
                          >
                            <XCircle size={18} />
                            Cancel Order
                          </button>
                        )}
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </AnimatePresence>
          </div>
        )}
      </div>
    </div>
  );
};

export default OrderHistory;
