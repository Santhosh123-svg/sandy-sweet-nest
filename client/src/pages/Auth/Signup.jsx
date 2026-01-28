import { useState } from "react";
import { Link } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";
const Signup = () => {
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  
  const handleSignup = async () => {
  if (!name || !email || !password) {
    alert("Please fill all fields");
    return;
  }

  try {
    setLoading(true);
    // Explicit full path matches backend mounting (/api/auth/signup)
    const res = await axiosInstance.post("/api/auth/signup", { name, email, password });
    
    if (res.data.success) {
      alert(res.data.message);
    }
  } catch (err) {
    console.error("Signup process failed:", err.response?.data || err.message);
    
    // Display the specific error message from the backend (400, 409, or 500)
    const errorMessage = err.response?.data?.message || "Connection error. Please try again.";
    alert(errorMessage);
  } finally {
    setLoading(false);
  }
};

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white p-6 rounded-2xl shadow-lg w-80">
        <h2 className="text-2xl font-bold text-center text-amber-600 mb-4">Register</h2>
        <input type="text" placeholder="Name" className="w-full border p-2 rounded mb-3" value={name} onChange={(e) => setName(e.target.value)} />
        <input type="email" placeholder="Email" className="w-full border p-2 rounded mb-3" value={email} onChange={(e) => setEmail(e.target.value)} />
        <input type="password" placeholder="Password" className="w-full border p-2 rounded mb-4" value={password} onChange={(e) => setPassword(e.target.value)} />
        <button onClick={handleSignup} disabled={loading} className={`w-full bg-amber-500 text-white py-2 rounded font-semibold ${loading ? "opacity-70 cursor-not-allowed" : "hover:bg-amber-600 transition"}`}>
          {loading ? "Registering..." : "Register & Get Magic Link"}
        </button>
        <p className="text-sm text-center mt-4 text-gray-600">Already have an account? <Link to="/login" className="text-amber-600 font-semibold hover:underline">Login here</Link></p>
      </div>
    </div>
  );
};
export default Signup;