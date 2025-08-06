import api from "./axiosConfig.js";

export async function registerUser(userData) {
  const response = await api.post(`/api/users`, userData);
  return response.data;
}

export async function LoginUser(userData) {
  const response = await api.post(`/api/auth/login`, userData);

  return response.data;
}

export async function refreshToken() {
  const response = await api.post(`/auth/refresh`);
  return response.data;
}

export async function logout() {
  const response = await api.post(`/auth/logout`);
  return response.data;
}

export async function getCurrentUser() {
  const response = await api.get(`/api/auth/me`);

  return response.data;
}


