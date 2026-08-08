import api from "../../../lib/axios";

export const projectService = {
  createProject: async (projectData) => {
    const formData = new FormData();
    formData.append("title", projectData.title);
    formData.append("image", projectData.image);
    formData.append("dimension_x", projectData.dimension_x);
    formData.append("dimension_y", projectData.dimension_y);
    formData.append("dimension_z", projectData.dimension_z);
    // cutting_settings (e.g. {tool_dia_mm, step_over_ratio, feed_rate...}) is a
    // JSONField on the backend. multipart/form-data can't carry a real nested
    // object, so it's sent as a JSON string -- the backend's
    // _coerce_settings_dict() (services.py) parses it back into a dict.
    if (projectData.cutting_settings) {
      formData.append(
        "cutting_settings",
        JSON.stringify(projectData.cutting_settings),
      );
    }

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
  generateGcode: async (projectId, title) => {
    const formData = new FormData();
    formData.append("project_id", projectId);
    formData.append("title", title);
    const response = await api.post("generate-gcode/", formData);
    return response.data;
  },
};
