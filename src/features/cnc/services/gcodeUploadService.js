import api from "../../../lib/axios";

export const gcodeUploadService = {
  uploadGcode: async ({ gcode_file, title, x, y }) => {
    const formData = new FormData();
    formData.append("gcode_file", gcode_file);
    formData.append("title", title);
    formData.append("x", String(x));
    formData.append("y", String(y));

    const response = await api.post("gcode-uploads/upload/", formData, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return response.data;
  },

  getMyUploads: async (page = 1) => {
    const response = await api.get(`gcode-uploads/?page=${page}`);
    return response.data;
  },

  // بدون slash أخير — متل Postman
  getUploadDetails: async (id) => {
    const response = await api.get(`gcode-uploads/${id}`);
    return response.data;
  },

  // بدون slash أخير — متل Postman
  deleteUpload: async (id) => {
    const response = await api.delete(`gcode-uploads/${id}`);
    return response.data;
  },
};