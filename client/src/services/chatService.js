
import api from './axiosConfig.js';

export const chatService = {
  // Senaryo başlatma
  startScenario: async (scenarioId, userId) => {
    try {
      const response = await api.post('/api/chats', {
        scenarioId,
        userId,
      });
      
    
      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Serbest sohbet başlatma
  createFreeTalkChat: async (user_id) => {
    try {
      // Authorization header'ını kontrol et
      const authState = localStorage.getItem('authState');
      const response = await api.post('/api/free-talk-chat/create', {
        user_id: user_id, // Backend'in beklediği parametre adı
      });
      return response.data;
    } catch (error) {
      console.error('❌ Serbest sohbet başlatma hatası:', error.response?.data || error.message);
      throw error;
    }
  },

  // Mesaj gönderme
  sendMessage: async (userMessage, userId, chatId) => {
    try {
      const currentTime = new Date().toISOString();
      const response = await api.post('/api/coordinator/message', {
        userMessage,
        userId, 
        chatId
      });

      return response.data;
    } catch (error) {
      throw error;
    }
  },

  // Serbest sohbet mesajı gönderme
  sendFreeTalkMessage: async (userMessage, userId, chatId) => {
    try {
      const currentTime = new Date().toISOString();
      const requestData = {
        userMessage,
        userId,
        chatId
      };     
      const response = await api.post('/api/coordinator/free-talk', requestData);
      return response.data;
    } catch (error) {
      console.error('Serbest sohbet mesaj hatası:', {
        error: error.message,
        status: error.response?.status,
        statusText: error.response?.statusText,
        responseData: error.response?.data,
        requestConfig: {
          url: error.config?.url,
          method: error.config?.method,
          data: JSON.parse(error.config?.data || '{}')
        },
        requestData: {
          message,
          user_id,
          chat_id
        }
      });
      throw error;
    }
  },

  // Sohbet geçmişi alma
  getChatHistory: async (userId) => {
    try {
      const response = await api.get(`/chat/history/${userId}`);
      return response;
    } catch (error) {
      throw error;
    }
  },

  // Sohbet analizi alma
  getChatAnalysis: async (chatId) => {
    try {
      const response = await api.get(`/chat/analysis/${chatId}`);
      return response;
    } catch (error) {
      throw error;
    }
  }
}; 