// src/api/axiosConfig.js
import axios from 'axios';
import Cookies from 'js-cookie';

const apiClient = axios.create({
    baseURL: process.env.REACT_APP_API_URL? `${process.env.REACT_APP_API_URL}` : '',
  headers: { 'Content-Type': 'application/json' },
});


apiClient.interceptors.request.use(config => {
  const token = Cookies.get('token');
  if (token) config.headers['Authorization'] = `Bearer ${token}`;
  return config;
});


apiClient.interceptors.response.use(
  res => res,
  err => {
    if (err.response?.status === 401) {
      Cookies.remove('token');
      window.location.href = '/login';
    }
    return Promise.reject(err);
  }
);

export default apiClient;
