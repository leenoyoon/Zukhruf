import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import api from "../../../lib/axios";

export const useRegister = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

const handleRegister = async (e) => {
  e.preventDefault();

  if (formData.password !== formData.confirmPassword) {
    toast.error("Passwords do not match!");
    return;
  }

  setLoading(true);
  try {
    const response = await api.post("auth/register/", {
      username: formData.username,
      email: formData.email,
      password: formData.password,
    });

    if (response.data.status === 1 || response.status === 201) {
      toast.success(
        response.data.message || "Account created successfully",
      );
      navigate("/login");
    }
  } catch (err) {
  const data = err.response?.data;
  const errors = data?.errors;

  if (errors && typeof errors === "object") {
    Object.values(errors).forEach((msgs) => {
      const list = Array.isArray(msgs) ? msgs : [msgs];
      list.forEach((msg) => {
        if (msg) toast.error(String(msg));
      });
    });
  } else if (data?.message) {
    toast.error(data.message);
  } else {
    toast.error("Registration failed");
  }

  console.error("Registration failed", err);
}
  return {
    formData,
    loading,
    handleChange,
    handleRegister,
  };
};