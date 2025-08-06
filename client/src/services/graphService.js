import axios from './axiosConfig.js';

const GRAMMAR_ERRORS_API = 'http://localhost:5000/api/grammar-errors';

export const graphService = {
  // Kullanıcının grammar hatalarını topic bazında getir
  getUserErrorsByTopics: async (period = 'week') => {
    try {
      const response = await axios.get(`${GRAMMAR_ERRORS_API}/user/errors/topics?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Grammar errors by topics fetch error:', error);
      throw error;
    }
  },

  

  // Kullanıcının radar scores verilerini getir
  getUserRadarScores: async (userId, period = 'week') => {
    try {
      const response = await axios.get(`/api/chats/user/${userId}/radar-scores?period=${period}`);
      return response.data;
    } catch (error) {
      console.error('Radar scores fetch error:', error);
      throw error;
    }
  },
};

export default graphService; 