import axios from 'axios';
import { store } from '../store/index.js';
import { logout, refreshToken } from '../store/authSlice.js';
import { logTokenInfo, isTokenExpiringSoon } from '../utils/tokenUtils.js';

// Axios instance oluştur
const api = axios.create({
  baseURL: 'http://localhost:5000',
  headers: {
    'Content-Type': 'application/json',
  },
  withCredentials: true, // Cookie'leri otomatik gönder
});

// Request interceptor - her request'e token ekle
api.interceptors.request.use(
  (config) => {
    const state = store.getState();
    const token = state.auth.accessToken;
    
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
      
      // Debug: Token bilgilerini logla
      logTokenInfo(token);
      
      // Token yakında expire olacaksa uyarı ver
      if (isTokenExpiringSoon(token, 1)) { // 1 dakika kala uyarı
        console.warn('Access token will expire soon, consider refreshing');
      }
    }
    
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor - token expire olduğunda refresh et
api.interceptors.response.use(
  (response) => {
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    // Token expire olduysa ve henüz retry yapılmadıysa
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      try {
        // Refresh token ile yeni token al - Authorization header'ı olmadan
        const response = await axios.post('http://localhost:5000/api/auth/refresh', {}, {
          withCredentials: true
        });
        
        const { accessToken } = response.data.data;
        
        // Store'u güncelle
        store.dispatch(refreshToken({ accessToken }));
        
        // Orijinal request'i yeni token ile tekrar dene
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        
        // Yeni token'ı localStorage'a kaydet - mevcut user bilgisini koru
        const currentState = store.getState();
        const existingAuthState = JSON.parse(localStorage.getItem('authState') || '{}');
        const authState = {
          user: existingAuthState.user || currentState.auth.user, // Mevcut user bilgisini koru
          accessToken: accessToken,
          isAuthenticated: true,
        };
        localStorage.setItem('authState', JSON.stringify(authState));
        
        return api(originalRequest);
        
      } catch (refreshError) {
        console.error('Refresh error details:', {
          status: refreshError.response?.status,
          data: refreshError.response?.data,
          message: refreshError.message,
          config: refreshError.config
        });
        
        // Refresh token da expire olduysa logout yap
        store.dispatch(logout());
        
        // Login sayfasına yönlendir
        if (window.location.pathname !== '/login') {
          window.location.href = '/login';
        }
        
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api; 