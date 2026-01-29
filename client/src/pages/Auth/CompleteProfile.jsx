import { useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
import { User, Phone, MapPin, CheckCircle } from "lucide-react";

const CompleteProfile = () => {
  const [formData, setFormData] = useState({
    name: "",
    phone: "",
    address: "",
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const location = useLocation();

  const isEditMode = location.search.includes("edit=true");
  const signupName = localStorage.getItem("signupName") || "";

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axiosInstance.get("/api/auth/me");
        if (res.data) {
          setFormData({
            name: res.data.name || "",
            phone: res.data.phone || "",
            address: res.data.address || "",
          });

          // If not in edit mode and profile already completed, redirect to welcome
          if (!isEditMode && res.data.profileCompleted) {
            navigate("/welcome");
          }
        }
      } catch (err) {
        console.error("Fetch profile error:", err);
      }
    };

    fetchData();
  }, [navigate, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.phone || !formData.address) {
      setError("All fields are mandatory.");
      return;
    }

    // Validation: Name must match registration name (only on first submission)
    if (!isEditMode && formData.name.toLowerCase() !== signupName.toLowerCase()) {
      setError("The name you entered does not match your registration name. Please enter the same name as used during signup.");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.put("/api/auth/complete-profile", formData);
      
      if (res.data.success) {
        localStorage.setItem("profileCompleted", "true");
        if (res.data.user) {
          localStorage.setItem("user", JSON.stringify(res.data.user));
          localStorage.setItem("signupName", res.data.user.name);
        }
        alert(res.data.message || "Profile updated successfully!");
        navigate("/welcome");
      }
    } catch (err) {
      console.error("Complete profile error:", err);
      setError(err.response?.data?.message || "Failed to complete profile. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-50 to-orange-100 p-6">
      <div className="bg-white w-full max-w-md rounded-3xl shadow-2xl p-8 transform transition-all duration-500 hover:scale-[1.01]">
        <div className="text-center mb-8">
          <div className="bg-amber-100 w-16 h-16 rounded-2xl flex items-center justify-center mx-auto mb-4 animate-bounce">
            <User className="text-amber-600 w-8 h-8" />
          </div>
          <h2 className="text-3xl font-extrabold text-gray-800">
            {isEditMode ? "Edit Profile" : "Complete Profile"}
          </h2>
          <p className="text-gray-500 mt-2">
            {isEditMode ? "Update your personal information" : "Just a few more details to get you started!"}
          </p>
        </div>

        {error && (
          <div className="bg-red-50 text-red-600 p-4 rounded-xl mb-6 text-sm font-medium border border-red-100 animate-shake">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-5">
          <div className="relative">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Name</label>
            <div className="flex items-center mt-1 group">
              <User className="absolute left-3 text-gray-400 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
              <input
                type="text"
                name="name"
                placeholder="Must match registration name"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
                value={formData.name}
                onChange={handleChange}
              />
            </div>
          </div>

        <div className="relative">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Phone Number</label>
            <div className="flex items-center mt-1 group">
              <Phone className="absolute left-3 text-gray-400 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
              <input
                type="number"
                name="phone"
                placeholder="Your contact number"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all"
                value={formData.phone}
                onChange={handleChange}
              />
            </div>
        </div> 

          <div className="relative">
            <label className="text-xs font-bold text-gray-400 uppercase tracking-wider ml-1">Full Address</label>
            <div className="flex items-center mt-1 group">
              <MapPin className="absolute left-3 text-gray-400 group-focus-within:text-amber-500 transition-colors w-5 h-5" />
              <textarea
                name="address"
                placeholder="Where should we deliver?"
                className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-transparent rounded-xl focus:bg-white focus:border-amber-400 focus:ring-4 focus:ring-amber-100 outline-none transition-all min-h-[100px]"
                value={formData.address}
                onChange={handleChange}
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className={`w-full py-4 rounded-xl font-bold text-white shadow-lg transition-all transform active:scale-95 flex items-center justify-center space-x-2 ${
              loading 
                ? "bg-amber-300 cursor-not-allowed" 
                : "bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600"
            }`}
          >
            {loading ? (
              <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
            ) : (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>{isEditMode ? "Update Profile" : "Finish Setup"}</span>
              </>
            )}
          </button>
        </form>
      </div>
    </div>
  );
};

export default CompleteProfile;
