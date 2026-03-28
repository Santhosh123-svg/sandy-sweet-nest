import { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  // Detect if user comes from OTP verification page
  const isFromVerify = location.search.includes("fromVerify=true");

  const handleLogin = async () => {
    if (!email || !password) {
      alert("Please fill all fields");
      return;
    }

    try {
      setLoading(true);

      // API call to login
      const res = await axiosInstance.post("/api/auth/login", { email, password });

      // Save token and user info
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("profileCompleted", res.data.profileCompleted);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      localStorage.setItem("signupName", res.data.user?.name || "");

      // ✅ Redirect based on role and profile completion
      if (res.data.role === "admin") {
        navigate("/admin");
      } else {
        if (!res.data.user.isVerified) {
          alert("Your email is not verified. Please verify OTP first.");
          navigate("/otp", { state: { email, flow: "login" } });
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

          {!isFromVerify && (
            <div className="text-center">
              <button
                onClick={async () => {
                  const emailPrompt = prompt("Please enter your email to reset your account.");
                  if (!emailPrompt) return alert("Please enter your email to reset your account.");
                  try {
                    const res = await axiosInstance.post("/api/auth/forget-account", { email: emailPrompt });
                    alert(res.data.message || "Your account has been reset. Please register again.");
                    navigate("/signup");
                  } catch (err) {
                    alert(err.response?.data?.message || "Account reset failed.");
                  }
                }}
                className="text-sm text-amber-600 hover:underline font-medium"
              >
                Forget Password?
              </button>
            </div>
          )}
        </div>

        {!isFromVerify && (
          <p className="text-sm text-center mt-6 text-gray-600">
            New user?{" "}
            <Link to="/signup" className="text-amber-600 font-semibold hover:underline">
              Register here
            </Link>
          </p>
        )}
      </div>
    </div>
  );
};

export default Login;