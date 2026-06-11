import { useEffect } from "react";
import { useNavigate } from "react-router";
import { useToken } from "@/hooks/clientState/useToken";
import toast from "react-hot-toast";

const AuthCallback = () => {
  const navigate = useNavigate();
  const setToken = useToken((state) => state.setToken);

  useEffect(() => {
    const handleAuthCallback = () => {
      const urlParams = new URLSearchParams(window.location.search);
      const token = urlParams.get("access_token");

      if (token) {
        setToken(token);
        localStorage.setItem("token", token);
        // Remove the token from URL and redirect to home
        window.history.replaceState({}, document.title, window.location.pathname);
        navigate("/", { replace: true });
      } else {
        // No token - redirect to login or show error
        toast.error("Error logging in")
        navigate("/", { replace: true });
      }
    };

    handleAuthCallback();
  }, [navigate, setToken]);

  return null;
};

export default AuthCallback;