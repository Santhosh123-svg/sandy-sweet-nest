import { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const MagicVerify = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const [error, setError] = useState("");

  useEffect(() => {
    const verifyToken = async () => {
      if (!search) {
        setError("Missing token in URL.");
        return;
      }

      try {
        const { data } = await axiosInstance.get(`/api/auth/magic-verify${search}`);

        if (data.success && data.token) {
          localStorage.setItem("token", data.token);
          localStorage.setItem("role", data.role || "user");
          
          // Success -> Go to welcome or dashboard
          navigate("/welcome", { replace: true });
        }
      } catch (err) {
        console.error("Verification failed:", err);
        setError(err.response?.data?.message || "Invalid or expired magic link.");
        
        setTimeout(() => navigate("/login"), 3000);
      }
    };

    verifyToken();
  }, [navigate, search]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-amber-50">
      <div className="bg-white p-8 rounded-2xl shadow-xl text-center">
        {!error ? (
          <>
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-amber-600 mx-auto mb-4"></div>
            <h2 className="text-xl font-semibold text-amber-800">Verifying Magic Link...</h2>
            <p className="text-gray-500 mt-2">Please wait while we secure your session.</p>
          </>
        ) : (
          <>
            <div className="text-red-500 text-5xl mb-4">⚠️</div>
            <h2 className="text-xl font-bold text-red-600">Verification Failed</h2>
            <p className="text-gray-600 mt-2">{error}</p>
            <button 
              onClick={() => navigate("/login")}
              className="mt-6 bg-amber-500 text-white px-6 py-2 rounded-lg hover:bg-amber-600 transition"
            >
              Back to Login
            </button>
          </>
        )}
      </div>
    </div>
  );
};

export default MagicVerify;