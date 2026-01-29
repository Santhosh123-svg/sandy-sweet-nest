import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const AdminDashboard = () => {
  const [orders, setOrders] = useState([]);
  const navigate = useNavigate();

  const token = localStorage.getItem("token");
  const role = localStorage.getItem("role");

  useEffect(() => {
    if (!token || role !== "admin") {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      const res = await axiosInstance.get("/api/admin/orders");
      setOrders(res.data.orders || []);
    } catch (err) {
      console.error("FETCH ORDERS ERROR 👉", err);
      setOrders([]);
      if (err.response?.status === 403) {
        alert("Access Denied: Admin Only");
      } else {
        alert("Failed to load orders");
      }
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    try {
      await axiosInstance.delete(`/api/admin/orders/${id}`);
      setOrders((prev) => prev.filter((o) => o._id !== id));
    } catch (err) {
      console.error("DELETE ERROR 👉", err);
      alert("Failed to delete order");
    }
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      {/* HEADER */}
      <div className="flex items-center justify-between mb-8">
        <div className="flex items-center gap-4">
          <button
            onClick={() => navigate("/welcome")}
            className="p-2 bg-white rounded-full shadow-md hover:bg-amber-100 transition"
          >
            ⬅
          </button>
          <h1 className="text-3xl font-extrabold text-amber-800 tracking-tight">
            Orders Dashboard
          </h1>
        </div>
        <div className="bg-amber-200 text-amber-900 px-4 py-1 rounded-full text-sm font-bold shadow-sm">
          Admin Mode
        </div>
      </div>

      {/* CONTENT */}
      {!Array.isArray(orders) || orders.length === 0 ? (
        <div className="text-center py-20 bg-white rounded-3xl shadow-sm">
          <p className="text-xl text-gray-500 font-medium italic">No orders found yet 🍰</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white rounded-3xl shadow-lg border border-amber-100 overflow-hidden flex flex-col"
            >
              {/* ORDER HEADER */}
              <div className="bg-gradient-to-r from-amber-500 to-orange-500 p-4 text-white">
                <div className="flex justify-between items-start">
                  <div>
                    <p className="text-xs font-bold uppercase tracking-widest opacity-80">Order ID</p>
                    <p className="text-lg font-black">{order.orderId || "N/A"}</p>
                  </div>
                  <div className="bg-white/20 px-2 py-1 rounded text-xs font-bold">
                    {new Date(order.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              <div className="p-5 flex-grow space-y-4">
                {/* CUSTOMER INFO */}
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest">Customer Details</h3>
                  <div className="bg-amber-50 p-3 rounded-2xl space-y-1">
                    <p className="font-bold text-gray-800">👤 {order.customer?.name || order.userName}</p>
                    <p className="text-sm text-gray-600">📧 {order.customer?.email || order.userEmail}</p>
                    <p className="text-sm text-gray-600">📞 {order.customer?.phone || "N/A"}</p>
                    <p className="text-sm text-gray-600 italic">📍 {order.customer?.address || "N/A"}</p>
                  </div>
                </div>

                {/* PRODUCT INFO */}
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-amber-600 uppercase tracking-widest">Order Info</h3>
                  <div className="bg-gray-50 p-3 rounded-2xl">
                    <div className="flex justify-between items-center mb-1">
                      <p className="font-bold text-lg text-gray-800">{order.productName}</p>
                      <p className="bg-amber-200 text-amber-800 text-[10px] font-black px-2 py-0.5 rounded-full uppercase">
                        {order.category}
                      </p>
                    </div>
                    <p className="text-sm font-medium text-gray-600">Quantity: {order.quantity}</p>
                    <p className="text-xl font-black text-amber-600 mt-2">₹{order.totalAmount}</p>
                  </div>
                </div>

                {/* CAKE DETAILS */}
                {order.category?.toLowerCase().includes("cake") && (
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-pink-500 uppercase tracking-widest">Cake Customization</h3>
                    <div className="bg-pink-50/50 p-3 rounded-2xl text-sm space-y-1 border border-pink-100">
                      <p>🎂 <span className="font-bold">Purpose:</span> {order.cakeInfo?.purpose || "N/A"}</p>
                      <p>✍️ <span className="font-bold">Text:</span> "{order.cakeInfo?.cakeText || "N/A"}"</p>
                      <p>🍭 <span className="font-bold">Flavor:</span> {order.cakeInfo?.flavor || "N/A"}</p>
                      <p>⚖️ <span className="font-bold">Size:</span> {order.cakeInfo?.size || "N/A"}</p>
                      <p>🎨 <span className="font-bold">Shape:</span> {order.cakeInfo?.shape || "N/A"}</p>
                      <p>🍫 <span className="font-bold">Toppings:</span> {order.cakeInfo?.toppings?.join(", ") || "None"}</p>
                    </div>
                  </div>
                )}

                {/* DELIVERY INFO */}
                <div className="space-y-1">
                  <h3 className="text-xs font-black text-blue-500 uppercase tracking-widest">Delivery Info</h3>
                  <div className="bg-blue-50/50 p-3 rounded-2xl text-sm border border-blue-100">
                    <p>📅 <span className="font-bold text-blue-700">{order.deliveryDate || order.cakeInfo?.deliveryDate || "N/A"}</span></p>
                    <p>⏰ <span className="font-bold text-blue-700">{order.deliveryTime || order.cakeInfo?.preferredTime || "N/A"}</span></p>
                  </div>
                </div>
              </div>

              {/* ACTION BUTTON */}
              <div className="p-4 bg-gray-50 border-t border-gray-100">
                <button
                  onClick={() => deleteOrder(order._id)}
                  className="w-full bg-red-500 hover:bg-red-600 text-white font-bold py-3 rounded-2xl transition shadow-md hover:shadow-lg active:scale-95 flex items-center justify-center gap-2"
                >
                  🗑️ DELETE ORDER
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
