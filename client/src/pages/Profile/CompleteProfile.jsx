import { useState, useEffect } from "react";
import axiosInstance from "../../utils/axiosInstance";
import { useNavigate } from "react-router-dom";
import { useOrder } from "../../context/OrderContext";

const CompleteProfile = () => {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [address, setAddress] = useState("");

  const navigate = useNavigate();
  const { setOrder } = useOrder();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/login");
    }
  }, [navigate]);

  const handleSave = async () => {
    // 🔴 VALIDATION
    if (!name || !phone || !address) {
      alert("All fields are required");
      return;
    }

    try {
      const res = await axiosInstance.post("/profile/complete", {
        name,
        phone,
        address,
      });

      // ✅ SAVE USER LOCALLY
      localStorage.setItem(
        "user",
        JSON.stringify({
          name,
          phone,
          address,
          profileCompleted: true,
        })
      );

      // ✅ SAVE CUSTOMER IN ORDER CONTEXT
      setOrder((prev) => ({
        ...prev,
        customer: { name, phone, address },
      }));

      alert("Profile saved successfully!");
      navigate("/welcome");
    } catch (err) {
      console.error(err);
      alert(err.response?.data?.message || "Profile save failed");
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
          value={name}
          onChange={(e) => setName(e.target.value)}
        />

        <input
          type="text"
          placeholder="Phone"
          className="w-full border p-2 rounded mb-3"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
        />

        <input
          type="text"
          placeholder="Address"
          className="w-full border p-2 rounded mb-3"
          value={address}
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
