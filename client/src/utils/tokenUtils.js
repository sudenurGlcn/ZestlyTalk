import { jwtDecode } from 'jwt-decode';

// Token'ı çöz ve payload'ı döndür
export const decodeToken = (token) => {
  try {
    return jwtDecode(token);
  } catch (error) {

    return null;
  }
};

// Token'ın geçerliliğini kontrol et
export const isTokenValid = (token) => {
  if (!token) return false;
  
  try {
    const decoded = jwtDecode(token);
    const currentTime = Date.now() / 1000;
    
    return decoded.exp > currentTime;
  } catch (error) {
    return false;
  }
};

// Token'dan kullanıcı bilgilerini çıkar
export const extractUserFromToken = (token) => {
  const decoded = decodeToken(token);
  
  if (!decoded) return null;
  return {
    id: decoded.sub || decoded.id,
    first_name: decoded.first_name || null,
    last_name: decoded.last_name || null,
    email: decoded.email || null,
    level: decoded.level || null,
    // Token'da olan diğer bilgiler
  };
}; 

// Token sürelerini kontrol etmek için utility fonksiyonlar

// JWT token'dan expire time'ı çıkar
export const getTokenExpirationTime = (token) => {
  if (!token) return null;
  
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    return payload.exp * 1000; // Unix timestamp'i milisaniyeye çevir
  } catch (error) {
    console.error('Token parse error:', error);
    return null;
  }
};

// Token'ın ne kadar süre sonra expire olacağını hesapla (dakika)
export const getTokenExpirationInMinutes = (token) => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return null;
  const now = Date.now();
  const timeUntilExpiration = expirationTime - now;
  return Math.floor(timeUntilExpiration / (1000 * 60)); // Dakika cinsinden
};

// Token'ın expire olup olmadığını kontrol et
export const isTokenExpired = (token) => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return true;
  
  return Date.now() >= expirationTime;
};

// Token'ın yakında expire olup olmadığını kontrol et (5 dakika öncesi)
export const isTokenExpiringSoon = (token, minutes = 5) => {
  const expirationTime = getTokenExpirationTime(token);
  if (!expirationTime) return true;
  const timeUntilExpiration = expirationTime - Date.now();
  const minutesUntilExpiration = timeUntilExpiration / (1000 * 60);
  return minutesUntilExpiration <= minutes;
};

// Token bilgilerini logla (debug için)
export const logTokenInfo = (token) => {
  if (!token) {
    return;
  }
  const expirationTime = getTokenExpirationTime(token);
  const minutesUntilExpiration = getTokenExpirationInMinutes(token);
}; 