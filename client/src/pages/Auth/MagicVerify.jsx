import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const MagicVerify = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axiosInstance.get(`/magic-verify${search}`);

        // save token
        localStorage.setItem("token", data.token);

        // since complete-profile page is removed
        // go to login page first
        navigate("/");
      } catch (err) {
        alert(err.response?.data?.message || "Invalid or expired link");
        navigate("/");
      }
    };

    verify();
  }, [navigate, search]);

  return (
    <div className="text-center mt-10 text-lg font-medium">
      Verifying magic link…
    </div>
  );
};

export default MagicVerify;
