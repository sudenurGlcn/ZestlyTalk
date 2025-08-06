import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { chatHistoryService } from '../services/chatHistoryService.js';

// LocalStorage'dan state'i yükle
const loadStateFromStorage = () => {
  try {
    const serializedState = localStorage.getItem('chatHistoryState');
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
    localStorage.setItem('chatHistoryState', serializedState);
  } catch (err) {
    // Hata durumunda sessizce devam et
  }
};

// Async thunk for starting a scenario
export const getChatHistory = createAsyncThunk(
  'chatHistory/getChatHistory',
  async ({ userId }, { rejectWithValue }) => {
    try {
 
      const response = await chatHistoryService.getChatHistory(userId);

      return response;
    } catch (error) {

      return rejectWithValue(error.response?.data || 'Sohbet geçmişi alınamadı');
    }
  }
);

// Async thunk for getting chat messages
export const getChatMessages = createAsyncThunk(
  'chatHistory/getChatMessages',
  async ({ chatId }, { rejectWithValue }) => {
    try {
      const response = await chatHistoryService.getChatMessages(chatId);
      return response;
    } catch (error) {
      return rejectWithValue(error.response?.data || 'Sohbet mesajları alınamadı');
    }
  }
);

// Async thunk for sending message


const initialState = {
  selectedScenario: null,
  messages: [],
  isLoading: false,
  error: null,
  chatMessages: [],
  chatMessagesLoading: false,
  chatMessagesError: null,
  scenarioData: {
    id: null,
    title: '',
    level: '',
    category: '',
    description: ''
  }
};

// LocalStorage'dan yüklenen state ile başlangıç state'ini birleştir
const persistedState = loadStateFromStorage();
const finalInitialState = persistedState ? { ...initialState, ...persistedState } : initialState;

const chatHistorySlice = createSlice({
  name: 'chatHistory',
  initialState: finalInitialState,
  reducers: {
    setSelectedChat: (state, action) => {
      state.selectedChat = action.payload;
      state.chatData = action.payload;
      saveStateToStorage(state);
    },
   
    clearError: (state) => {
      state.error = null;
      saveStateToStorage(state);
    },
    
    clearChatMessages: (state) => {
      state.chatMessages = [];
      state.chatMessagesError = null;
      saveStateToStorage(state);
    },
    
  },
  extraReducers: (builder) => {
    builder
      // Start Scenario
      .addCase(getChatHistory.pending, (state) => {
        state.isLoading = true;
        state.error = null;
        saveStateToStorage(state);
      })
      .addCase(getChatHistory.fulfilled, (state, action) => {
        state.isLoading = false;
        state.chatHistory = action.payload;
     
        saveStateToStorage(state);
      })
      .addCase(getChatHistory.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        saveStateToStorage(state);
      })
      // Get Chat Messages
      .addCase(getChatMessages.pending, (state) => {
        state.chatMessagesLoading = true;
        state.chatMessagesError = null;
        saveStateToStorage(state);
      })
      .addCase(getChatMessages.fulfilled, (state, action) => {
        state.chatMessagesLoading = false;
        state.chatMessages = action.payload;
        saveStateToStorage(state);
      })
      .addCase(getChatMessages.rejected, (state, action) => {
        state.chatMessagesLoading = false;
        state.chatMessagesError = action.payload;
        saveStateToStorage(state);
      });
    }
  }
);

export const { setSelectedChat, clearError, clearChatMessages } = chatHistorySlice.actions;

export default chatHistorySlice.reducer;