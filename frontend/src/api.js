import axios from 'axios';

const api = axios.create({
  baseURL: process.env.REACT_APP_API_URL,  // e.g. http://localhost:5000 or your Render URL
});

// Automatically include JWT token if present
api.interceptors.request.use(cfg => {
  const token = localStorage.getItem('token');
  if (token) cfg.headers.Authorization = `Bearer ${token}`;
  return cfg;
});

export default api;
