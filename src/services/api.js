import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Transactions
export const transactionAPI = {
  getAll: (params) => api.get('/transactions', { params }),
  getById: (id) => api.get(`/transactions/${id}`),
  create: (data) => api.post('/transactions', data),
  update: (id, data) => api.put(`/transactions/${id}`, data),
  delete: (id) => api.delete(`/transactions/${id}`),
};

// Dashboard
export const dashboardAPI = {
  getStats: (params) => api.get('/dashboard/stats', { params }),
  getHistory: (params) => api.get('/dashboard/history', { params }),
};

// Categories
export const categoryAPI = {
  getAll: () => api.get('/categories'),
  getSummary: () => api.get('/categories/summary'),
  create: (data) => api.post('/categories', data),
};

// Accounts
export const accountAPI = {
  getAll: () => api.get('/accounts'),
  getById: (id) => api.get(`/accounts/${id}`),
  create: (data) => api.post('/accounts', data),
  update: (id, data) => api.put(`/accounts/${id}`, data),
  delete: (id) => api.delete(`/accounts/${id}`),
  transfer: (data) => api.post('/accounts/transfer', data),
};

export default api;
