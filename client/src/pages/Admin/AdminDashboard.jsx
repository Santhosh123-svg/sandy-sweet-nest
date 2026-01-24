import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

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
      const res = await axios.get(
        "/api/admin/orders",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setOrders(res.data || []);
    } catch (err) {
      console.error("FETCH ORDERS ERROR 👉", err);
      alert("Failed to load orders");
    }
  };

  const deleteOrder = async (id) => {
    if (!window.confirm("Delete this order?")) return;

    await axios.delete(
      `/api/admin/orders/${id}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    fetchOrders();
  };

  return (
    <div className="min-h-screen bg-amber-50 p-6">
      {/* HEADER */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => navigate("/welcome")}
          className="text-xl bg-white shadow px-3 py-1 rounded-full hover:scale-110 transition"
        >
          ⬅
        </button>

        <h1 className="text-3xl font-bold text-amber-700">
          Admin Dashboard
        </h1>
      </div>

      {/* CONTENT */}
      {orders.length === 0 ? (
        <p>No orders yet</p>
      ) : (
        <div className="space-y-4">
          {orders.map((order) => (
            <div
              key={order._id}
              className="bg-white p-4 rounded-xl shadow"
            >
              <p className="font-semibold">
                👤 {order.userName}
              </p>
              <p className="text-sm text-gray-600">
                📧 {order.userEmail}
              </p>

              <ul className="ml-5 list-disc mt-2">
                {order.items.map((item, i) => (
                  <li key={i}>
                    {item.name} × {item.quantity}
                  </li>
                ))}
              </ul>

              <p className="mt-2 font-bold">
                💰 ₹{order.totalAmount}
              </p>

              <button
                onClick={() => deleteOrder(order._id)}
                className="mt-3 bg-red-500 hover:bg-red-600 text-white px-4 py-1 rounded-lg"
              >
                Delete Order
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminDashboard;
