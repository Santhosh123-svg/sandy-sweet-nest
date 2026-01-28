import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axiosInstance from "../../utils/axiosInstance";

const MagicVerify = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axiosInstance.get(
          `/auth/magic/verify${search}`,
          {
            headers: { Authorization: "" },
          }
        );

        localStorage.setItem("token", data.token);

        // ✅ AFTER VERIFY → LOGIN PAGE
        navigate("/login");
      } catch (err) {
        navigate("/login");
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
