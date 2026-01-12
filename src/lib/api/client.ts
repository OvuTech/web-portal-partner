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
      
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('partner_access_token');
        const currentPath = window.location.pathname;
        
        // Pages that handle errors gracefully (don't auto-redirect)
        // These pages will show error messages instead of redirecting
        const errorHandlingPages = ['/dashboard'];
        
        // Only redirect if:
        // 1. No token exists (not authenticated at all)
        // 2. Not on a dashboard page (let dashboard pages handle errors)
        // 3. Not already on login page
        const isOnDashboard = errorHandlingPages.some(path => currentPath.startsWith(path));
        
        if (!token) {
          // No token - definitely redirect
          localStorage.removeItem('partner_access_token');
          localStorage.removeItem('partner_refresh_token');
          localStorage.removeItem('partner_data');
          
          if (!currentPath.includes('/login')) {
            window.location.href = '/login';
          }
        } else if (!isOnDashboard) {
          // Has token but not on dashboard - might be expired
          // Only redirect if not on a page that handles errors
          if (!currentPath.includes('/login')) {
            localStorage.removeItem('partner_access_token');
            localStorage.removeItem('partner_refresh_token');
            localStorage.removeItem('partner_data');
            window.location.href = '/login';
          }
        }
        // If on dashboard and has token, let the error propagate so the UI can show it
      }
    }
    return Promise.reject(error);
  }
);

export default apiClient;
