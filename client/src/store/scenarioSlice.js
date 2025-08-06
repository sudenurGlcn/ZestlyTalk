import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatService } from '../services/chatService.js';
import scenariosService from '../services/scenariosService.js';

// LocalStorage'dan state'i yükle
const loadStateFromStorage = () => {
  try {
    const serializedState = localStorage.getItem('scenarioState');
    if (serializedState === null) {
      return undefined;
    }
    return JSON.parse(serializedState);
  } catch (err) {
    return undefined;
  }
};

// State'i localStorage'a kaydet
const saveStateToStorage = (state) => {
  try {
    const serializedState = JSON.stringify(state);
    localStorage.setItem('scenarioState', serializedState);
  } catch (err) {
    // Hata durumunda sessizce devam et
  }
};

// Async thunk for starting a scenario
export const startScenario = createAsyncThunk(
  'scenario/startScenario',
  async ({ scenarioId, userId}, { rejectWithValue }) => {
    try {
   
      const response = await chatService.startScenario(scenarioId, userId);
     
      return response;
    } catch (error) {
      console.error('startScenario thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'Senaryo başlatılamadı');
    }
  }
);

// Async thunk for starting free talk chat
export const startFreeTalkChat = createAsyncThunk(
  'scenario/startFreeTalkChat',
  async ({ user_id }, { rejectWithValue }) => {
    try {
      const response = await chatService.createFreeTalkChat(user_id);
      return response;
    } catch (error) {
      console.error('startFreeTalkChat thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'Serbest sohbet başlatılamadı');
    }
  }
);

// Async thunk for sending message
export const sendMessage = createAsyncThunk(
  'scenario/sendMessage',
  async ({ userMessage, userId, chatId }, { rejectWithValue }) => {
    try {
    
      const response = await chatService.sendMessage(userMessage, userId, chatId);

      return response;
    } catch (error) {
      console.error('sendMessage thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'Mesaj gönderilemedi');
    }
  }
);

// Async thunk for sending free talk message
export const sendFreeTalkMessage = createAsyncThunk(
  'scenario/sendFreeTalkMessage',
  async ({ userMessage, userId, chatId }, { rejectWithValue }) => {
    try {
      const response = await chatService.sendFreeTalkMessage(userMessage, userId, chatId);
      return response;
    } catch (error) {
      console.error('sendFreeTalkMessage thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'Serbest sohbet mesajı gönderilemedi');
    }
  }
);

export const getAllScenarios = createAsyncThunk(
  'scenario/getAllScenarios',
  async (_, { rejectWithValue }) => {
    try {
      const response = await scenariosService.getAllScenarios();
      return response;
    } catch (error) {
      console.error('getAllScenarios thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'Senaryolar alınamadı');
    }
  }
);

export const getScenarioByCategory = createAsyncThunk(
  'scenario/getScenarioByCategory',
  async (category, { rejectWithValue }) => {
    try {
      const response = await scenariosService.getScenarioByCategory(category);
      return response;
    } catch (error) {
      console.error('getScenarioByCategory thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'Senaryo bulunamadı');
    }
  }
);

export const getUserActiveScenarios = createAsyncThunk(
  'scenario/getUserActiveScenarios',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await scenariosService.getUserActiveScenarios(userId);
      return response;
    } catch (error) {
      console.error('getUserActiveScenarios thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'Aktif senaryolar alınamadı');
    }
  }
);

export const getUserCompletedScenarios = createAsyncThunk(
  'scenario/getUserCompletedScenarios',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await scenariosService.getUserCompletedScenarios(userId);
      return response;
    } catch (error) {
      console.error('getUserCompletedScenarios thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'Tamamlanan senaryolar alınamadı');
    }
  }
);

export const endConversation = createAsyncThunk(
  'scenario/endConversation',
  async ({ userId, chatId }, { rejectWithValue }) => {
    try {
      const response = await scenariosService.endConversation(userId, chatId);
      return response;
    } catch (error) {
      console.error('endConversation thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'Sohbet analizi yapılamadı');
    }
  }
);

export const getMentorTips = createAsyncThunk(
  'scenario/getMentorTips',
  async (userId, { rejectWithValue }) => {
    try {
      const response = await scenariosService.getMentorTips(userId);
      return response;
    } catch (error) {
      console.error('getMentorTips thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'Mentor önerileri alınamadı');
    }
  }
);

export const getHints = createAsyncThunk(
  'scenario/getHints',
  async (chatId, { rejectWithValue }) => {
    try {
      const response = await scenariosService.getHints(chatId);
      return response;
    } catch (error) {
      console.error('getHints thunk hatası:', error);
      return rejectWithValue(error.response?.data || 'İpucu alınamadı');
    }
  }
);

const initialState = {
  selectedScenario: null,
  scenarios: [],
  scenarioByCategory: [],
  userActiveScenarios: [],
  userCompletedScenarios: [],
  messages: [],
  isLoading: false,
  error: null,
  chatId: null,
  conversationSummary: null,
  mentorTips: null,
  hints: null,
  scenarioData: {
    id: null,
    title: '',
    level: '',
    category: '',
    description: ''
  },
  ...loadStateFromStorage() // Sadece gerekli state'leri yükle
};

const scenarioSlice = createSlice({
  name: 'scenario',
  initialState,
  reducers: {
    setSelectedScenario: (state, action) => {
      // Her zaman senaryo bilgilerini güncelle
      const { forceUpdate, ...scenarioData } = action.payload;
      state.selectedScenario = scenarioData;
      
      // scenarioData state'ini güncelle
      state.scenarioData = {
        id: scenarioData.id,
        title: scenarioData.title,
        level: scenarioData.level || scenarioData.difficulty_level,
        category: scenarioData.category,
        description: scenarioData.description || scenarioData.scenario_info,
        milestones: scenarioData.milestones || scenarioData.milestones_tr
      };
      
      saveStateToStorage(state);
    },
    setChatId: (state, action) => {
      state.chatId = action.payload;
      saveStateToStorage(state);
    },
    addMessage: (state, action) => {
      // Eğer action.payload bir string ise, onu message objesine çevir
      const message = typeof action.payload === 'string' 
        ? { from: 'user', text: action.payload, timestamp: new Date().toISOString() }
        : action.payload;
      
      state.messages.push(message);
      saveStateToStorage(state);
    },
    clearMessages: (state) => {
      state.messages = [];
      saveStateToStorage(state);
    },
    clearError: (state) => {
      state.error = null;
      saveStateToStorage(state);
    },
    resetScenario: (state) => {
      state.selectedScenario = null;
      state.messages = [];
      state.chatId = null;
      state.scenarioData = {
        id: null,
        title: '',
        level: '',
        category: '',
        description: ''
      };
      // LocalStorage'dan da temizle
      localStorage.removeItem('scenarioState');
      saveStateToStorage(state);
    }
  },
  extraReducers: (builder) => {
    builder
      // Start Scenario
      .addCase(startScenario.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveStateToStorage(state);
      })
        .addCase(startScenario.fulfilled, (state, action) => {
         state.isLoading = false;         
         // Backend'den gelen response'u kontrol et
         if (action.payload) {
           // Chat bilgilerini kaydet
           if (action.payload.chat) {
             state.chatId = action.payload.chat.id;
             
             // Senaryo verilerini al
             const scenarioInfo = action.payload.chat.scenario || {};
             state.scenarioData = {
               id: action.payload.chat.scenario_id,
               title: scenarioInfo.title,
               level: scenarioInfo.difficulty_level,
               category: '',
               description: scenarioInfo.scenario_info,
               milestones: scenarioInfo.milestones_tr
             };
           }

            // Mesajları yükle (farklı senaryo seçildiğinde zaten temizlenmiş olacak)
            if (action.payload.messages && Array.isArray(action.payload.messages)) {
              if (action.payload.messages && Array.isArray(action.payload.messages)) {
                // Backend'den gelen mesajları Redux formatına çevir ve sırala
                const sortedMessages = action.payload.messages
                  .map(msg => ({
                    from: msg.sender === 'agent' ? 'bot' : 'user',
                    text: msg.message,
                    timestamp: msg.timestamp,
                    analysis: null // Backend'den gelen mesajlarda analysis yok
                  }))
                  .sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp)); // Zaman damgasına göre sırala
                
                state.messages = sortedMessages;
              } else if (action.payload.response && action.payload.isNew) {
                // Yeni senaryo başlatıldığında ilk bot mesajını ekle
                state.messages = [{
                  from: "bot",
                  text: action.payload.response,
                  timestamp: new Date().toISOString(),
                  analysis: action.payload.analysis || null
                }];
              } else if (action.payload.response && !action.payload.isNew) {
                // Mevcut chat'te mesaj yoksa ilk bot mesajını ekle
                state.messages = [{
                  from: "bot",
                  text: action.payload.response,
                  timestamp: new Date().toISOString(),
                  analysis: action.payload.analysis || null
                }];
              }
            } else if (action.payload.response && action.payload.isNew) {
              // Yeni senaryo başlatıldığında ilk bot mesajını ekle
              state.messages = [{
                from: "bot",
                text: action.payload.response,
                timestamp: new Date().toISOString(),
                analysis: action.payload.analysis || null
              }];
            } else if (action.payload.response && !action.payload.isNew) {
              // Mevcut chat'te mesaj yoksa ilk bot mesajını ekle
              state.messages = [{
                from: "bot",
                text: action.payload.response,
                timestamp: new Date().toISOString(),
                analysis: action.payload.analysis || null
              }];
            }
         }
         
         saveStateToStorage(state);
       })
      .addCase(startScenario.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveStateToStorage(state);
      })
      // Send Message
      .addCase(sendMessage.pending, (state) => {
        state.isLoading = true;
        saveStateToStorage(state);
      })
             .addCase(sendMessage.fulfilled, (state, action) => {
         state.isLoading = false;

                     // API'den gelen bot yanıtını messages array'ine ekle
            if (action.payload && action.payload.response) {
              const newMessage = {
                from: "bot",
                text: action.payload.response,
                timestamp: new Date().toISOString(),
                analysis: action.payload.analysis || null
              };
              state.messages.push(newMessage);
          
              // Kullanıcı mesajına analysis ekle - API'den gelen analysis kullanıcı mesajına ait
              if (action.payload.analysis && state.messages.length > 1) {
                const lastUserMessageIndex = state.messages.length - 2; // Son kullanıcı mesajı
                if (state.messages[lastUserMessageIndex] && state.messages[lastUserMessageIndex].from === "user") {
                  state.messages[lastUserMessageIndex].analysis = action.payload.analysis;
                }
              }
              
              // Mesajları zaman damgasına göre sırala
              state.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
         } else if (action.payload && action.payload.botMessage) {
           const newMessage = {
             from: "bot",
             text: action.payload.botMessage,
             timestamp: new Date().toISOString(),
             analysis: action.payload.analysis || null
           };
           state.messages.push(newMessage);
           
           // Mesajları zaman damgasına göre sırala
           state.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
         } else if (action.payload && typeof action.payload === 'string') {
           // Eğer payload direkt string ise
           const newMessage = {
             from: "bot",
             text: action.payload,
             timestamp: new Date().toISOString()
           };
           state.messages.push(newMessage);
           
           // Mesajları zaman damgasına göre sırala
           state.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
         } else if (action.payload && action.payload.message) {
           // Eğer payload.message varsa
           const newMessage = {
             from: "bot",
             text: action.payload.message,
             timestamp: new Date().toISOString(),
             analysis: action.payload.analysis || null
           };
           state.messages.push(newMessage);
           
           // Mesajları zaman damgasına göre sırala
           state.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
         } else if (action.payload && action.payload.reply) {
           // Eğer payload.reply varsa (eski API formatı)
           const newMessage = {
             from: "bot",
             text: action.payload.response,
             timestamp: new Date().toISOString(),
             analysis: action.payload.analysis || null
           };
           state.messages.push(newMessage);
           
           // Mesajları zaman damgasına göre sırala
           state.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
         }
        
      
        saveStateToStorage(state);
      })
      .addCase(sendMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveStateToStorage(state);
      })
      // Start Free Talk Chat
      .addCase(startFreeTalkChat.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveStateToStorage(state);
      })
      .addCase(startFreeTalkChat.fulfilled, (state, action) => {
        state.isLoading = false;
        
        // Yeni serbest sohbet başlatıldığında mesajları temizle
        state.messages = [];
        
        // Backend'den gelen response'u kontrol et
        if (action.payload) {
          // Chat bilgilerini kaydet
          if (action.payload.chat) {
            state.chatId = action.payload.chat.id;
            state.scenarioData = {
              id: null,
              title: 'Serbest Sohbet',
              level: 'beginner',
              category: 'free-chat',
              description: 'Serbest sohbet'
            };
          }
          
          // İlk bot mesajını ekle
          if (action.payload.firstMessage) {
            state.messages = [{
              from: "bot",
              text: action.payload.firstMessage,
              timestamp: new Date().toISOString(),
              analysis: null
            }];
          }
        }
        
        saveStateToStorage(state);
      })
      .addCase(startFreeTalkChat.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveStateToStorage(state);
      })
      // Send Free Talk Message
      .addCase(sendFreeTalkMessage.pending, (state) => {
        state.isLoading = true;
        saveStateToStorage(state);
      })
             .addCase(sendFreeTalkMessage.fulfilled, (state, action) => {
         state.isLoading = false;
         
         // API'den gelen bot yanıtını messages array'ine ekle
         if (action.payload && action.payload.response) {
           const newMessage = {
             from: "bot",
             text: action.payload.response,
             timestamp: new Date().toISOString(),
             analysis: action.payload.analysis || null
           };
           state.messages.push(newMessage);
           
           // Mesajları zaman damgasına göre sırala
           state.messages.sort((a, b) => new Date(a.timestamp) - new Date(b.timestamp));
         }
         
         saveStateToStorage(state);
       })
      .addCase(sendFreeTalkMessage.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveStateToStorage(state);
      })
      .addCase(getAllScenarios.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveStateToStorage(state);
      })
      .addCase(getAllScenarios.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scenarios = action.payload;
        saveStateToStorage(state);
      })
      .addCase(getAllScenarios.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveStateToStorage(state);
      })
      .addCase(getScenarioByCategory.pending, (state) => { 
        state.isLoading = true;
        state.error = null;
        saveStateToStorage(state);
      })
      .addCase(getScenarioByCategory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.scenarioByCategory = action.payload;
        saveStateToStorage(state);
      })
      .addCase(getScenarioByCategory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveStateToStorage(state);
      })
      .addCase(getUserActiveScenarios.pending, (state) => { 
        state.isLoading = true;
        state.error = null;
        saveStateToStorage(state);
      })
      .addCase(getUserActiveScenarios.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userActiveScenarios = action.payload;
        saveStateToStorage(state);
      })
      .addCase(getUserActiveScenarios.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveStateToStorage(state);
      })
      .addCase(getUserCompletedScenarios.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveStateToStorage(state);
      })
      .addCase(getUserCompletedScenarios.fulfilled, (state, action) => {
        state.isLoading = false;
        state.userCompletedScenarios = action.payload.filter(chat => chat.status === 'completed');
        saveStateToStorage(state);
      })
      .addCase(endConversation.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveStateToStorage(state);
      })
      .addCase(endConversation.fulfilled, (state, action) => {
        state.isLoading = false;
        state.conversationSummary = action.payload;
        saveStateToStorage(state);
      })
      .addCase(endConversation.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveStateToStorage(state);
       })
       .addCase(getMentorTips.pending, (state) => {
         state.isLoading = true;
         state.error = null;
         saveStateToStorage(state);
       })
       .addCase(getMentorTips.fulfilled, (state, action) => {
         state.isLoading = false;
         state.mentorTips = action.payload;
         saveStateToStorage(state);
       })
       .addCase(getMentorTips.rejected, (state, action) => {
         state.isLoading = false;
         state.error = action.payload;
         saveStateToStorage(state);
       })
       .addCase(getHints.pending, (state) => {
         state.isLoading = true;
         state.error = null;
         saveStateToStorage(state);
       })
       .addCase(getHints.fulfilled, (state, action) => {
         state.isLoading = false;
         state.hints = action.payload;
         saveStateToStorage(state);
       })
       .addCase(getHints.rejected, (state, action) => {
         state.isLoading = false;
         state.error = action.payload;
         saveStateToStorage(state);
       })

  }
});

export const { 
  setSelectedScenario, 
  setChatId,
  addMessage, 
  clearMessages, 
  clearError, 
  resetScenario 
} = scenarioSlice.actions;

export default scenarioSlice.reducer; 