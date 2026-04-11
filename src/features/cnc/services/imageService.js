import api from "../../../lib/axios";

export const imageService = {
  getMyImages: async (page = 1, isPattern = null) => {
    let url = `images/?page=${page}`;
    if (isPattern !== null) {
      url += `&is_pattern=${isPattern}`;
    }
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
    const response = await api.get(`patterns/?page=${page}`);
    return response.data;
  },
};
