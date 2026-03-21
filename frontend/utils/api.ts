import axios from 'axios';

// Use environment variable for API URL (changes based on dev/production)
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 30000,
});

// Add auth token to every request if available
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('access_token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Health check (no auth needed)
export const healthCheck = async () => {
  const response = await api.get('/health');
  return response.data;
};

// Authentication endpoints
export const registerUser = async (username: string, email: string, password: string) => {
  const response = await api.post('/auth/register', {
    username,
    email,
    password
  });
  return response.data;
};

export const loginUser = async (username: string, password: string) => {
  const response = await api.post('/auth/login', {
    username,
    password
  });
  return response.data;
};

export const logoutUser = () => {
  localStorage.removeItem('access_token');
  localStorage.removeItem('username');
};

// Register a person (requires auth)
export const registerPerson = async (name: string, images: File[]) => {
  const formData = new FormData();
  formData.append('name', name);
  images.forEach((image) => {
    formData.append('images', image);
  });

  const response = await api.post('/register', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Recognize a face (requires auth)
export const recognizeFace = async (image: File, threshold: number = 0.5) => {
  const formData = new FormData();
  formData.append('image', image);
  formData.append('threshold', threshold.toString());

  const response = await api.post('/recognize', formData, {
    headers: {
      'Content-Type': 'multipart/form-data',
    },
  });
  return response.data;
};

// Get all users (requires auth)
export const getUsers = async () => {
  const response = await api.get('/users');
  return response.data;
};

// Delete a user (requires auth)
export const deleteUser = async (userId: number) => {
  const response = await api.delete(`/users/${userId}`);
  return response.data;
};

// Get stats (requires auth)
export const getStats = async () => {
  const response = await api.get('/stats');
  return response.data;
};

// Get recognition logs (requires auth)
export const getRecognitionLogs = async (limit: number = 100, days: number = 7) => {
  const response = await api.get(`/logs/recognition?limit=${limit}&days=${days}`);
  return response.data;
};

// Get recognition stats (requires auth)
export const getRecognitionStats = async (days: number = 7) => {
  const response = await api.get(`/logs/recognition/stats?days=${days}`);
  return response.data;
};