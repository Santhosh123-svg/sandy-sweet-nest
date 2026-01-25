import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate, useLocation } from "react-router-dom";
import { useOrder } from "../../context/OrderContext.jsx";

const CompleteProfile = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();
  const location = useLocation();
  const { setOrder } = useOrder(); // ✅ NEW

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const urlToken = params.get("token");

    if (urlToken) {
      localStorage.setItem("token", urlToken);
    }

    const savedToken = localStorage.getItem("token");
    if (!savedToken) {
      navigate("/login");
    }
  }, [location, navigate]);

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");

      const res = await axios.post(
        "http://localhost:5000/api/profile/complete",
        { name, phone, address },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      // ✅ Save user locally
      localStorage.setItem("user", JSON.stringify(res.data.user));

      // ✅ 🔥 MAIN FIX — inject customer into order context
      setOrder((prev) => ({
        ...prev,
        customer: {
          name,
          phone,
          address,
        },
      }));

      alert("Profile saved successfully!");
      navigate("/welcome");
    } catch (err) {
      alert(err.response?.data?.message || "Save failed");
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center text-amber-600 mb-4">
          Complete Profile
        </h2>

        <input
          type="text"
          placeholder="Name"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          className="w-full border p-2 rounded mb-3"
          onChange={(e) => setAddress(e.target.value)}
        />

        <button
          onClick={handleSave}
          className="w-full bg-amber-500 text-white py-2 rounded font-semibold"
        >
          Save Profile
        </button>
      </div>
    </div>
  );
};

export default CompleteProfile;
