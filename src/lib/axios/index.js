import axios from "axios";
import { toast } from "react-toastify";

const api = axios.create({
  baseURL: "https://anfalgh.pythonanywhere.com/api/",
  headers: { "Content-Type": "application/json" },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Token ${token}`;
  return config;
});

api.interceptors.response.use(
  (response) => {
    if (response.status === 201 || response.status === 204) {
      toast.success(response.data.message || "Operation successful!");
    }
    return response;
  },
  (error) => {
    const message =
      error.response?.data?.message || "An unexpected error occurred";
    toast.error(message);
    return Promise.reject(error);
  },
);

export default api;
