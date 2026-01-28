import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const MagicVerify = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axiosInstance.get(`/auth/magic/verify${search}`, {
          headers: { Authorization: "" }, // no token
        });

        localStorage.setItem("token", data.token);
        navigate("/login", { replace: true });
      } catch {
        navigate("/login", { replace: true });
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
