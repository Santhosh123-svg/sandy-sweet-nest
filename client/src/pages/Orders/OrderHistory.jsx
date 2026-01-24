import React, { useEffect, useState } from "react";
import axios from "axios";

const OrderHistory = () => {
  const [orders, setOrders] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    axios.get("http://localhost:5000/api/orders/my-orders", {
      headers: { Authorization: `Bearer ${token}` },
    }).then(res => setOrders(res.data));
  }, []);

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      <h2 className="text-3xl font-bold text-amber-600 mb-4">My Orders</h2>

      <div className="space-y-4">
        {orders.map((o) => (
          <div key={o._id} className="bg-white p-4 rounded-2xl shadow">
            <p>Order ID: {o._id}</p>
            <p>Status: {o.status}</p>
            <p>Total: ₹ {o.total}</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderHistory;
