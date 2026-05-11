import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('sa_token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

api.interceptors.response.use(
  (res) => res,
  (err) => {
    if (err.response?.status === 401) {
      localStorage.removeItem('sa_token');
      window.location.href = '/';
    }
    return Promise.reject(err);
  }
);

export const login = (data) => api.post('/auth/super-admin/login', data);
export const createOrganization = (data) => api.post('/organizations', data);
export const listOrganizations = () => api.get('/organizations');
