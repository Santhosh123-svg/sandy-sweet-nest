import { useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const useProfileGuard = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const check = async () => {
      const token = localStorage.getItem("token");
      if (!token) return navigate("/login");

      const res = await axios.get(
        "http://localhost:5000/api/auth/me",
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (!res.data.profileCompleted) navigate("/profile");
    };

    check();
  }, []);
};

export default useProfileGuard;
