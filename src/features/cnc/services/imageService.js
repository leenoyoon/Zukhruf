import api from "../../../lib/axios";
import axios from "axios";

const BASE_URL = import.meta.env.VITE_API_BASE_URL;

export const imageService = {
  uploadImage: async (imageData) => {
    const formData = new FormData();
    formData.append("title", imageData.title);
    formData.append("description", imageData.description);
    formData.append("image_file", imageData.image_file);
    formData.append("is_pattern", imageData.is_pattern ? "1" : "0");

    const response = await api.post("images/", formData, {
      headers: {
        "Content-Type": "multipart/form-data",
      },
    });
    return response.data;
  },
  getMyImages: async (page = 1, isPattern = null) => {
    let url = `images/?page=${page}`;
    if (isPattern !== null) url += `&is_pattern=${isPattern}`;
    const response = await api.get(url);
    return response.data;
  },

  deleteImage: async (id) => {
    const response = await api.delete(`images/${id}`);
    return response.data;
  },

  getImageDetails: async (id) => {
    const response = await api.get(`images/${id}`);
    return response.data;
  },

  getAllPatterns: async (page = 1) => {
    const response = await axios.get(`${BASE_URL}patterns/?page=${page}`);
    return response.data;
  },

  visualizeAI: async (formData) => {
    const response = await api.post("ai-visualize/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },
};
