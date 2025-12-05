import axios, { AxiosError, InternalAxiosRequestConfig } from 'axios';

// Use local API routes to avoid CORS
const API_BASE = '/api';

export const apiClient = axios.create({
  baseURL: API_BASE,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor to add auth token
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    if (typeof window !== 'undefined') {
      const token = localStorage.getItem('partner_access_token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling and token refresh
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };
    
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      
      if (typeof window !== 'undefined') {
        const refreshToken = localStorage.getItem('partner_refresh_token');
        
        // Try to refresh token if we have a refresh token
        if (refreshToken) {
          try {
            const { authService } = await import('./auth');
            const tokenResponse = await authService.refreshToken(refreshToken);
            
            // Update the original request with new token
            if (originalRequest.headers) {
              originalRequest.headers.Authorization = `Bearer ${tokenResponse.access_token}`;
            }
            
            // Retry the original request
            return apiClient(originalRequest);
          } catch (refreshError) {
            // Refresh failed - clear tokens and redirect to login
            localStorage.removeItem('partner_access_token');
            localStorage.removeItem('partner_refresh_token');
            localStorage.removeItem('partner_data');
            
            // Only redirect if not already on login page
            if (!window.location.pathname.includes('/login')) {
              window.location.href = '/login';
            }
          }
        } else {
          // No refresh token - clear tokens and redirect to login
          localStorage.removeItem('partner_access_token');
          localStorage.removeItem('partner_refresh_token');
          localStorage.removeItem('partner_data');
          
          // Only redirect if not already on login page
          if (!window.location.pathname.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
