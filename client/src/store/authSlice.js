import { createSlice, createAsyncThunk } from '@reduxjs/toolkit';
import { LoginUser, registerUser } from '../services/authService.js';
// Local storage'dan auth state'ini yükle
const loadAuthStateFromStorage = () => {
  try {
    const authState = localStorage.getItem('authState');
    
    if (!authState) return null;
    
    const parsedState = JSON.parse(authState);
 
    
    // Local storage'dan yüklenen kullanıcı bilgilerini kullan
    // Token'dan çıkarma işlemi yapmıyoruz çünkü backend'den gelen bilgileri kullanıyoruz
    
    return parsedState;
  } catch (error) {
   
    return null;
  }
};

// Local storage'a auth state'ini kaydet
const saveAuthStateToStorage = (state) => {
  try {
    localStorage.setItem('authState', JSON.stringify(state));
  } catch (error) {
   
  }
};

// Local storage'dan auth state'ini temizle
const clearAuthStateFromStorage = () => {
  try {
    localStorage.removeItem('authState');
  } catch (error) {
   
  }
};

const initialState = {
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  ...loadAuthStateFromStorage(), // Local storage'dan yükle
};

// Async thunk'lar
export const loginUser = createAsyncThunk(
  'auth/loginUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await LoginUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Giriş yapılırken bir hata oluştu'
      );
    }
  }
);

export const registerUserAsync = createAsyncThunk(
  'auth/registerUser',
  async (userData, { rejectWithValue }) => {
    try {
      const response = await registerUser(userData);
      return response;
    } catch (error) {
      return rejectWithValue(
        error.response?.data?.message || 'Kayıt olurken bir hata oluştu'
      );
    }
  }
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    // Login başarılı olduğunda
    loginSuccess: (state, action) => {
      const { user, accessToken, refreshToken } = action.payload;
      state.user = user;
      state.accessToken = accessToken;
      state.refreshToken = refreshToken;
      state.isAuthenticated = true;
      state.error = null;
      
      // Local storage'a kaydet
      saveAuthStateToStorage({
        user,
        accessToken,
        refreshToken,
        isAuthenticated: true,
      });
    },

    // Logout
    logout: (state) => {
      state.user = null;
      state.accessToken = null;
      state.refreshToken = null;
      state.isAuthenticated = false;
      state.error = null;
      
      // Local storage'dan temizle
      clearAuthStateFromStorage();
      
      // User state'ini de temizle
      return state;
    },

    // Token yenileme
    refreshToken: (state, action) => {
      state.accessToken = action.payload.accessToken;
      // Refresh token httpOnly cookie'de tutulduğu için state'e kaydetmiyoruz
      
      // Local storage'ı güncelle
      saveAuthStateToStorage({
        user: state.user,
        accessToken: state.accessToken,
        isAuthenticated: true,
      });
    },

    // Error temizleme
    clearError: (state) => {
      state.error = null;
    },

    // Loading state'i güncelleme
    setLoading: (state, action) => {
      state.isLoading = action.payload;
    },

    // User bilgilerini güncelleme
    updateUser: (state, action) => {
      state.user = { ...state.user, ...action.payload };
      
      // Local storage'ı güncelle
      saveAuthStateToStorage({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: true,
      });
    },
  },
  extraReducers: (builder) => {
    // Login async thunk
    builder
      .addCase(loginUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.isLoading = false;

        const { data } = action.payload;
  
        state.accessToken = data.accessToken;
        state.isAuthenticated = true;
        state.error = null;
        
        // Backend'den gelen kullanıcı bilgilerini kullan
   
        state.user = data.user; // Backend'den gelen bilgileri kullan
     
        // Local storage'a kaydet
        saveAuthStateToStorage({
          user: state.user,
          accessToken: data.accessToken,
          isAuthenticated: true,
        });
      })
      .addCase(loginUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
        state.isAuthenticated = false;
      });

    // Register async thunk
    builder
      .addCase(registerUserAsync.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(registerUserAsync.fulfilled, (state) => {
        state.isLoading = false;
        state.error = null;
      })
      .addCase(registerUserAsync.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload;
      });
  },
});

// Selectors
export const selectAuth = (state) => state.auth;
export const selectUser = (state) => state.auth.user;
export const selectAccessToken = (state) => state.auth.accessToken;
export const selectIsAuthenticated = (state) => state.auth.isAuthenticated;
export const selectIsLoading = (state) => state.auth.isLoading;
export const selectAuthError = (state) => state.auth.error;

// Actions
export const { 
  loginSuccess, 
  logout, 
  refreshToken, 
  clearError, 
  setLoading, 
  updateUser 
} = authSlice.actions;

export default authSlice.reducer; 