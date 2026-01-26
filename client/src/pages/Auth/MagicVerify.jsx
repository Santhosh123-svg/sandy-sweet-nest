import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const MagicVerify = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axiosInstance.get(`api/auth/magic-verify${search}`);

        localStorage.setItem("token", data.token);

        if (!data.profileCompleted) {
          navigate("/complete-profile");
        } else {
          navigate("/welcome");
        }
      } catch (err) {
        alert(err.response?.data?.message || "Invalid or expired link");
        navigate("/login");
      }
    };

    verify();
  }, [navigate, search]);

  return <div className="text-center mt-10">Verifying magic link…</div>;
};

export default MagicVerify;
