import axios from 'axios';

// In development, use proxy. In production, use full URL
const API_BASE_URL = process.env.NODE_ENV === 'development' 
  ? 'http://127.0.0.1:8000/' // Direct URL for development - proxy sometimes has issues
  : process.env.REACT_APP_API_URL || 'http://31.220.82.177:8010/';

export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
    'Accept': 'application/json',
  },
});

// Helper function to decode JWT token and check expiration
function isTokenExpired(token: string): boolean {
  try {
    // Convert base64url to base64
    const base64 = token.split('.')[1]
      .replace(/-/g, '+')
      .replace(/_/g, '/');
    
    // Add padding if needed
    const padded = base64 + '='.repeat((4 - base64.length % 4) % 4);
    
    const payload = JSON.parse(atob(padded));
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    return true;
  }
}

// Track if refresh is in progress to prevent multiple refresh attempts
let isRefreshing = false;
let failedQueue: Array<{ resolve: (value?: any) => void; reject: (reason?: any) => void }> = [];

const processQueue = (error: any, token: string | null = null) => {
  failedQueue.forEach(({ resolve, reject }) => {
    if (error) {
      reject(error);
    } else {
      resolve(token);
    }
  });
  
  failedQueue = [];
};

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('access_token');
    if (token && !isTokenExpired(token)) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Making request to:', (config.baseURL || '') + (config.url || ''));
    }
    
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
    // Only log in development
    if (process.env.NODE_ENV === 'development') {
      console.log('Response received:', response.status, response.config.url);
    }
    return response;
  },
  async (error) => {
    const originalRequest = error.config;
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        // If refresh is already in progress, queue this request
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(() => {
          return apiClient(originalRequest);
        }).catch(err => {
          return Promise.reject(err);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;
      
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
          processQueue(null, access);
          
          return apiClient(originalRequest);
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          processQueue(refreshError, null);
          
          // Refresh failed, clear tokens
          localStorage.removeItem('access_token');
          localStorage.removeItem('refresh_token');
          localStorage.removeItem('user_type');
          localStorage.removeItem('user_id');
          localStorage.removeItem('username');
          
          // Only redirect if not already on auth page
          if (!window.location.pathname.includes('login')) {
            window.location.href = '/';
          }
        } finally {
          isRefreshing = false;
        }
      } else {
        // No refresh token, clear everything
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        localStorage.removeItem('user_type');
        localStorage.removeItem('user_id');
        localStorage.removeItem('username');
        
        if (!window.location.pathname.includes('login')) {
          window.location.href = '/';
        }
      }
    }
    
    return Promise.reject(error);
  }
);

export default apiClient;