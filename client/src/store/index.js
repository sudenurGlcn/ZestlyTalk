import { configureStore } from '@reduxjs/toolkit';
import userReducer from './userSlice.js';
import scenarioReducer from './scenarioSlice.js';
import authReducer from './authSlice.js';
import chatHistoryReducer from './chatHistorySlice.js';
import graphReducer from './graphSlice.js';

export const store = configureStore({
  reducer: {
    user: userReducer,
    scenario: scenarioReducer,
    auth: authReducer,
    chatHistory: chatHistoryReducer,
    graph: graphReducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST', 'persist/REHYDRATE'],
      },
    }),
});