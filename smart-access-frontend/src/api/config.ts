import axios from 'axios';

// In development, use proxy. In production, use full URL
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://localhost:8000' // Direct URL for development - proxy sometimes has issues
  : process.env.REACT_APP_API_URL || 'http://localhost:8000';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Debug logging
    console.log('Making request to:', (config.baseURL || '') + (config.url || ''));
    console.log('Request config:', config);
    
    return config;
  },
  (error) => {
    console.error('Request interceptor error:', error);
    return Promise.reject(error);
  }
);

// Response interceptor to handle token refresh
apiClient.interceptors.response.use(
  (response) => {
    console.log('Response received:', response);
    return response;
  },
  async (error) => {
    console.error('Response error:', error);
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      const refreshToken = localStorage.getItem('refresh_token');
      if (refreshToken) {
        try {
          const response = await axios.post(`${API_BASE_URL}/auth/refresh`, {
            refresh: refreshToken
          });
          
          const { access, refresh } = response.data;
          localStorage.setItem('access_token', access);
          localStorage.setItem('refresh_token', refresh);
          
          originalRequest.headers.Authorization = `Bearer ${access}`;
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          // Refresh failed, redirect to login
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_type');
          localStorage.removeItem('user_id');
          localStorage.removeItem('username');
          window.location.href = '/';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;