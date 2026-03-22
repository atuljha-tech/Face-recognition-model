import axios from 'axios';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Health check
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Admin endpoints - IMPORTANT: Use /auth/admin/login
export const loginUser = async (username: string, password: string) => {
  const response = await api.post('/auth/admin/login', { username, password });
  return response.data;
};

export const registerAdmin = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/admin/register', { username, email, password });
  return response.data;
};

// User phone endpoints
export const sendOTP = async (phone: string) => {
  const response = await api.post('/auth/user/send-otp', { phone });
  return response.data;
};

export const verifyOTP = async (phone: string, otp: string) => {
  const response = await api.post('/auth/user/verify-otp', { phone, otp });
  return response.data;
};

// Face registration and recognition
export const registerPerson = async (name: string, images: File[]) => {
  const formData = new FormData();
  formData.append('name', name);
  images.forEach((image) => {
    formData.append('images', image);
  });
  const response = await api.post('/register', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const recognizeFace = async (image: File, threshold: number = 0.5) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('threshold', threshold.toString());
  const response = await api.post('/recognize', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
  return response.data;
};

export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

export const getRecognitionLogs = async (limit: number = 100, days: number = 7) => {
  const response = await api.get(`/logs/recognition?limit=${limit}&days=${days}`);
  return response.data;
};

export const getRecognitionStats = async (days: number = 7) => {
  const response = await api.get(`/logs/recognition/stats?days=${days}`);
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('user_role');
  localStorage.removeItem('username');
  localStorage.removeItem('phone');
};

