import { useEffect, useState } from "react";
import axios from "axios";

const AdminDashboard = () => {
  const [stats, setStats] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem("token");

    axios.get("http://localhost:5000/api/admin/dashboard", {
      headers: {
        Authorization: `Bearer ${token}`
      }
    }).then(res => setStats(res.data));
  }, []);

  if (!stats) return <p>Loading...</p>;

  return (
    <div className="p-6">
      <h1 className="text-3xl font-bold mb-4">Admin Dashboard 🍰</h1>
      <p>Total Users: {stats.users}</p>
      <p>Total Admins: {stats.admins}</p>
    </div>
  );
};

export default AdminDashboard;
