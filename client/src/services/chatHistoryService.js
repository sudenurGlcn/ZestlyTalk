
import axios from 'axios';

// Axios instance oluştur
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor - token ekle
api.interceptors.request.use(
  (config) => {
    const authState = localStorage.getItem('authState');
    if (authState) {
      const { accessToken } = JSON.parse(authState);
      if (accessToken) {
        config.headers.Authorization = `Bearer ${accessToken}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export const chatHistoryService = {
  // Kullanıcının aktif ve tamamlanmış sohbetlerini getir
  getChatHistory: async (userId) => {
    try {
     
      const response = await api.get(`/api/chats/user/${userId}/active-completed`);
   
      return response.data;
    } catch (error) {
      console.error('Sohbet geçmişi alınamadı:', error);
      throw error;
    }
  },

  // Belirli bir sohbetin mesajlarını getir
  getChatMessages: async (chatId) => {
    try {
      const response = await api.get(`/api/chat-messages/chat/${chatId}`);
      return response.data;
    } catch (error) {
      console.error('Sohbet mesajları alınamadı:', error);
      throw error;
    }
  },
};