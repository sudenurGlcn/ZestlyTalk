
    import api from './axiosConfig.js';

const scenariosService = {
    getAllScenarios: async () => {
        const response = await api.get('http://localhost:5000/api/scenarios');
    
        return response.data;
    },
    getScenarioByCategory: async (category) => {
        const response = await api.get(`/api/scenarios/${category}`);
        return response.data;
    },
    getUserActiveScenarios: async (userId) => {
        const response = await api.get(`/api/chats/user/${userId}/active`);
  
        return response.data;
    },
    getUserCompletedScenarios: async (userId) => {
        const response = await api.get(`/api/chats/user/${userId}/active-completed`);
   
        return response.data;
    },
    endConversation: async (userId, chatId) => {
        const response = await api.post('/api/coordinator/end-conversation', {
            userId,
            chatId
        });
 
        return response.data;
    },
    getMentorTips: async (userId) => {
        const response = await api.post('/api/coordinator/mentor-tips', {
            userId
        });
        return response.data;
    },
    getHints: async (chatId) => {
        const response = await api.post('/api/coordinator/hints', {
            chatId
        });
        return response.data;
    },
    
    getScenarioById: async (scenarioId) => {
        const response = await api.get(`/api/scenarios/${scenarioId}`);
        return response.data;
    },

}

export default scenariosService;