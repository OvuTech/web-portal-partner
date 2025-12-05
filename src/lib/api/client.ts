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

// Response interceptor for error handling
apiClient.interceptors.response.use(
  (response) => response,
  async (error: AxiosError) => {
    if (error.response?.status === 401) {
      // Log the error details before redirecting
      console.error('[API Client] 401 Unauthorized:', {
        url: error.config?.url,
        status: error.response.status,
        data: error.response.data,
      });
      
      // Token expired or invalid - redirect to login
      if (typeof window !== 'undefined') {
        // Don't redirect immediately - let the error propagate so the UI can show it
        // Only redirect if we're not on a page that handles errors gracefully
        const currentPath = window.location.pathname;
        const errorHandlingPages = ['/dashboard/settings'];
        
        if (!errorHandlingPages.some(path => currentPath.includes(path))) {
          localStorage.removeItem('partner_access_token');
          localStorage.removeItem('partner_refresh_token');
          localStorage.removeItem('partner_data');
          // Only redirect if not already on login page
          if (!currentPath.includes('/login')) {
            window.location.href = '/login';
          }
        }
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
