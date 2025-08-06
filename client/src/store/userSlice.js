
import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { getCurrentUser } from '../services/authService.js';

const initialState = {
  id: null,
  first_name: '',
  last_name: '',
  email: '',
  level: '',
  isLoading: false,
  error: null,
};

// Async thunk - kullanıcı bilgilerini getir (token'dan veya API'den)
export const fetchCurrentUser = createAsyncThunk(
  'user/getCurrentUser',
  async (_, { rejectWithValue, getState }) => {
    try {
      // Önce auth state'inden kullanıcı bilgilerini al
      const authUser = getState().auth.user;
      
      if (authUser && authUser.id) {
        // Auth state'inde kullanıcı bilgileri varsa onları kullan
        return {
          id: authUser.id,
          user: {
            first_name: authUser.first_name,
            last_name: authUser.last_name
          },
          email: authUser.email,
          level: authUser.level
        };
      }
      
      // Auth state'inde yoksa API'den al
      const response = await getCurrentUser();
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kullanıcı bilgileri alınamadı'
      );
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setUser(state, action) {
      return { ...state, ...action.payload };
    },
    setLevel(state, action) {
      state.level = action.payload;
    },
    clearUser(state) {
      return initialState;
    },
    updateUserInfo(state, action) {
      return { ...state, ...action.payload };
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchCurrentUser.pending, (state) => {

        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {

        state.isLoading = false;
        state.id = action.payload.id;
        state.first_name = action.payload.user?.first_name || action.payload.first_name;
        state.last_name = action.payload.user?.last_name || action.payload.last_name;
        state.email = action.payload.email;
        state.level = action.payload.level;
        state.error = null;
      })
      .addCase(fetchCurrentUser.rejected, (state, action) => {
     
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectUserInfo = (state) => state.user;
export const selectUserName = (state) => `${state.user.first_name} ${state.user.last_name}`;
export const selectUserLevel = (state) => state.user.level;
export const selectUserEmail = (state) => state.user.email;
export const selectUserLoading = (state) => state.user.isLoading;
export const selectUserError = (state) => state.user.error;

export const { setUser, setLevel, clearUser, updateUserInfo } = userSlice.actions;
export default userSlice.reducer;