import axios from 'axios';

const API_BASE = 'http://localhost:8080/api';

const api = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Token automatically add karo har request mein
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth APIs
export const loginUser = (data) => 
  api.post('/auth/login', data);

export const registerUser = (data) => 
  api.post('/auth/register', data);

// Document APIs
export const uploadDocument = (formData) =>
  api.post('/documents/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' }
  });

export const getAllDocuments = () =>
  api.get('/documents/all');

export const deleteDocument = (id) =>
  api.delete(`/documents/${id}`);

// Chat APIs
export const createSession = (userId) =>
  api.post(`/chat/session?userId=${userId}`);

export const askQuestion = (sessionId, question) =>
  api.post(`/chat/ask?sessionId=${sessionId}&question=${encodeURIComponent(question)}`);

export const getChatHistory = (sessionId) =>
  api.get(`/chat/history/${sessionId}`);

export default api;