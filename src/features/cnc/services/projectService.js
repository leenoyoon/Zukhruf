import api from "../../../lib/axios";

export const projectService = {
  createProject: async (projectData) => {
    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("image", projectData.image);
    formData.append("dimension_x", projectData.dimension_x);
    formData.append("dimension_y", projectData.dimension_y);
    formData.append("dimension_z", projectData.dimension_z);

    const response = await api.post("projects/", formData);
    return response.data;
  },

  getMyProjects: async (page = 1) => {
    const response = await api.get(`projects/?page=${page}`);
    return response.data;
  },

  deleteProject: async (id) => {
    const response = await api.delete(`projects/${id}`);
    return response.data;
  },
  getProjectDetails: async (id) => {
    const response = await api.get(`projects/${id}`);
    return response.data;
  },
  updateProject: async (id, data) => {
    const response = await api.put(`projects/${id}`, data);
    return response.data;
  },
};
