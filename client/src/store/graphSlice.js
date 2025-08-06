import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import  graphService  from '../services/graphService.js';

// Async thunk'lar
export const fetchUserErrorsByTopics = createAsyncThunk(
  'graph/fetchUserErrorsByTopics',
  async (period, { rejectWithValue }) => {
    try {
      const data = await graphService.getUserErrorsByTopics(period);
    
      return { data, period };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Grammar hataları yüklenirken hata oluştu');
    }
  }
);

export const fetchUserRadarScores = createAsyncThunk(
  'graph/fetchUserRadarScores',
  async ({ userId, period }, { rejectWithValue }) => {
    try {
      const data = await graphService.getUserRadarScores(userId, period);
      return { data, period };
    } catch (error) {
      return rejectWithValue(error.response?.data?.message || 'Radar scores yüklenirken hata oluştu');
    }
  }
);

const initialState = {
  errorsByTopics: {
    weekly: null,
    monthly: null
  },
  errors: {
    weekly: null,
    monthly: null
  },
  stats: {
    weekly: null,
    monthly: null
  },
  radarScores: {
    weekly: null,
    monthly: null
  },
  currentPeriod: 'weekly',
  isLoading: false,
  error: null
};

const graphSlice = createSlice({
  name: 'graph',
  initialState,
  reducers: {
    setCurrentPeriod: (state, action) => {
      state.currentPeriod = action.payload;
    },
    clearErrors: (state) => {
      state.errorsByTopics = { weekly: null, monthly: null };
      state.errors = { weekly: null, monthly: null };
      state.stats = { weekly: null, monthly: null };
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    }
  },
  extraReducers: (builder) => {
    builder
      // fetchUserErrorsByTopics
      .addCase(fetchUserErrorsByTopics.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchUserErrorsByTopics.fulfilled, (state, action) => {
        state.isLoading = false;
        const { data, period } = action.payload;
        const periodKey = period === 'week' ? 'weekly' : 'monthly';
        state.errorsByTopics[periodKey] = data;
      })
             .addCase(fetchUserErrorsByTopics.rejected, (state, action) => {
         state.isLoading = false;
         state.error = action.payload;
       })
       
       // fetchUserRadarScores
       .addCase(fetchUserRadarScores.pending, (state) => {
         state.isLoading = true;
         state.error = null;
       })
       .addCase(fetchUserRadarScores.fulfilled, (state, action) => {
         state.isLoading = false;
         const { data, period } = action.payload;
         const periodKey = period === 'week' ? 'weekly' : 'monthly';
         state.radarScores[periodKey] = data;
       })
       .addCase(fetchUserRadarScores.rejected, (state, action) => {
         state.isLoading = false;
         state.error = action.payload;
       })
  }
});

export const { setCurrentPeriod, clearErrors, clearError } = graphSlice.actions;

// Selectors
export const selectGraph = (state) => state.graph;
export const selectErrorsByTopics = (state) => state.graph.errorsByTopics;
export const selectErrors = (state) => state.graph.errors;
export const selectStats = (state) => state.graph.stats;
export const selectRadarScores = (state) => state.graph.radarScores;
export const selectCurrentPeriod = (state) => state.graph.currentPeriod;
export const selectIsLoading = (state) => state.graph.isLoading;
export const selectError = (state) => state.graph.error;

export default graphSlice.reducer; 