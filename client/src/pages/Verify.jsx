import { useEffect } from "react";
import axios from "axios";
import { useNavigate, useSearchParams } from "react-router-dom";

const Verify = () => {
  const [searchParams] = useSearchParams();
  const navigate = useNavigate();

  useEffect(() => {
    const token = searchParams.get("token");

    if (!token) {
      alert("Token missing");
      navigate("/login");
      return;
    }

    axios
      .get(`http://localhost:5000/api/auth/verify?token=${token}`)
      .then((res) => {
        localStorage.setItem("magicToken",token);
        navigate("/login");
      })
      .catch(() => {
        alert("Token invalid");
        navigate("/login");
      });
  }, [searchParams]);

  return <div>Verifying...</div>;
};

export default Verify;
