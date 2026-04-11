import api from "../../../lib/axios";

export const authService = {
  logout: async () => {
    try {
      await api.post("auth/logout/");
    } catch {
      console.error("Server logout failed, clearing local data anyway...");
    } finally {
      localStorage.removeItem("token");
      localStorage.removeItem("username");
    }
  },

  changePassword: async (oldPassword, newPassword) => {
    const response = await api.post("auth/change-password/", {
      old_password: oldPassword,
      new_password: newPassword,
    });
    return response.data;
  },

  getProfile: async () => {
    try {
      const response = await api.get("auth/profile/");

      return response.data;
    } catch (error) {
      console.error("API Error in getProfile:", error);
      throw error;
    }
  },
};
