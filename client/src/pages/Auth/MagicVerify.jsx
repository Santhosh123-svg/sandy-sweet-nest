import { useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import axios from "axios";

const MagicVerify = () => {
  const navigate = useNavigate();
  const { search } = useLocation();

  useEffect(() => {
    const verify = async () => {
      try {
        const { data } = await axios.get(
          `/api/auth/verify${search}`
        );

        // SAVE token
        localStorage.setItem("magicToken", data.token);

        // go to login
        navigate("/login");
      } catch (err) {
        alert(err.response?.data?.message || "Invalid link");
        navigate("/login");
      }
    };

    verify();
  }, []);

  return <div>Verifying...</div>;
};

export default MagicVerify;
