
import api from './axiosConfig.js';

export const userService = {
  updateUserLevel: async (userId, level) => {
    try {
      const response = await api.put(`/api/users/${userId}/level`, { level });
      return response.data;
    } catch (error) {
    
      throw error;
    }
  },

  updateUserProfile: async (userId, userData) => {
    try {
      const response = await api.put(`/api/users/${userId}`, userData);
      return response.data;
    } catch (error) {

      throw error;
    }
  },

  updatePassword: async (userId, currentPassword, newPassword) => {
    try {
      const response = await api.put(`/api/users/${userId}/update-password`, {
        currentPassword,
        newPassword
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  updateEmail: async (userId, newEmail) => {
    try {
      const response = await api.put(`/api/users/${userId}/update-email`, {
        newEmail
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  getUserPerformanceStats: async (userId) => {
    try {
      const response = await api.get(`/api/performance-stats/user/${userId}`);
      return response.data;
    } catch (error) {
    
      throw error;
    }
  },

  setLevelFromTest: async (userId, testResult) => {
    try {
      // Mevcut updateUser endpoint'ini kullanarak seviyeyi güncelle
      const response = await api.put(`/api/users/${userId}`, {
        level: testResult.level
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Test sonucuna göre seviye güncelleme (90+ skor için)
  updateLevelFromTestScore: async (userId, score, newLevel) => {
    try {
      // Mevcut updateUser endpoint'ini kullanarak seviyeyi güncelle
      const response = await api.put(`/api/users/${userId}`, {
        level: newLevel
      });
      return response.data;
    } catch (error) {
      throw error;
    }
  },
};


export default userService;