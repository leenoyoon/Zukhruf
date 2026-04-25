import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../../../lib/axios";
import { useAuth } from "../context/AuthContext";

export const useLogin = () => {
  const navigate = useNavigate();
  const { login } = useAuth();
  const [formData, setFormData] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const response = await api.post("auth/login/", {
        username: formData.username,
        password: formData.password,
      });

      const token = response.data.data.token;
      const user = response.data.data.user;

      if (token) {
        login(token, user.username);
        navigate("/home");
      }
    } catch (err) {
      console.error("Login failed", err);
    } finally {
      setLoading(false);
    }
  };

  return { formData, loading, handleChange, handleLogin };
};
