import axios from 'axios';

const API_BASE = 'https://kittenfind-backend-5.onrender.com/api';


const api = axios.create({
  baseURL: API_BASE,
  // Remove fixed Content-Type—let Axios auto-set for FormData (multipart) vs JSON
});

// Token interceptor
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  // Optional: Set JSON only if not FormData
  if (!(config.data instanceof FormData)) {
    config.headers['Content-Type'] = 'application/json';
  }
  return config;
});

// Auth endpoints (JSON)
export const authApi = {
  register: (data) => api.post('/auth/register', data),
  login: (data) => api.post('/auth/login', data),
  getMe: () => api.get('/auth/me'),
};

// Cats endpoints
export const catsApi = {
  getAll: () => api.get('/cats'),
  getOne: (id) => api.get(`/cats/${id}`),
  create: (data) => api.post('/cats', data), // FormData auto-handles multipart
  update: (id, data) => api.put(`/cats/${id}`, data),
  delete: (id) => api.delete(`/cats/${id}`),
};

export default api;