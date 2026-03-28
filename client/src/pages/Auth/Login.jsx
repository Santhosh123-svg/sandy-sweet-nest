import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    if (params.get("verified") === "true") {
      alert("Email verified successfully! Please login.");
    }
  }, [location.search]);

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);
      const res = await axiosInstance.post("/api/auth/login", { email, password });

      // Save token & user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("profileCompleted", res.data.profileCompleted);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("signupName", res.data.user?.name || "");

      // ✅ Redirect based on role & profile completion
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        if (!res.data.user.isVerified) {
          alert("Your email is not verified. Check your email for magic link.");
        } else if (!res.data.profileCompleted) {
          navigate("/complete-profile");
        } else {
          navigate("/welcome");
        }
      }
    } catch (err) {
      alert(err.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-amber-100 to-amber-200">
      <div className="bg-white p-8 rounded-2xl shadow-xl w-80 animate-fadeIn">
        <h2 className="text-3xl font-extrabold text-center text-amber-600 mb-6">
          Welcome Back 🍰
        </h2>

        <div className="space-y-4">
          <input
            type="email"
            placeholder="Email address"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Password"
            className="w-full border border-gray-300 p-3 rounded-lg focus:outline-none focus:ring-2 focus:ring-amber-400"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold text-white transition ${
              loading ? "bg-amber-300 cursor-not-allowed" : "bg-amber-500 hover:bg-amber-600"
            }`}
          >
            {loading ? "Logging in..." : "Login"}
          </button>

          <div className="text-center mt-4">
            <Link to="/signup" className="text-amber-600 font-semibold hover:underline">
              New user? Register here
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;