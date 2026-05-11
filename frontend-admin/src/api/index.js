import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('admin_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('admin_token');
      localStorage.removeItem('admin_user');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export const signup = (data) => api.post('/auth/org-admin/signup', data);
export const login = (data) => api.post('/auth/org-admin/login', data);
export const getPublicOrgs = () => api.get('/public/organizations');

export const getFlags = () => api.get('/feature-flags');
export const createFlag = (data) => api.post('/feature-flags', data);
export const updateFlag = (id, data) => api.put(`/feature-flags/${id}`, data);
export const deleteFlag = (id) => api.delete(`/feature-flags/${id}`);
