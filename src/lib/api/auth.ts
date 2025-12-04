import apiClient from './client';

export interface PartnerRegisterRequest {
  first_name: string;
  last_name: string;
  email: string;
  password: string;
  phone: string;
  company_name: string;
  business_type: string;
  website?: string;
  tax_id?: string;
  business_description?: string;
  expected_monthly_volume?: number;
}

export interface PartnerLoginRequest {
  email: string;
  password: string;
}

export interface PartnerResponse {
  id: string;
  email: string;
  name?: string; // API returns name (combined first_name + last_name)
  first_name?: string; // May be present if API splits it
  last_name?: string; // May be present if API splits it
  phone?: string;
  company_name?: string;
  business_type?: string;
  website?: string;
  tax_id?: string;
  business_description?: string;
  status?: 'pending' | 'active' | 'suspended' | 'PENDING_VERIFICATION' | 'pending_verification';
  created_at: string;
}

export interface PartnerRegisterResponse {
  message: string;
  partner_id: string;
  email: string;
  status: 'pending_verification' | 'active';
}

export interface TokenResponse {
  access_token: string;
  refresh_token?: string;
  token_type: string;
}

export interface ForgotPasswordRequest {
  email: string;
}

export const authService = {
  // Register a new partner (self-service registration via /api/v1/partners/auth/register)
  register: async (data: PartnerRegisterRequest): Promise<PartnerRegisterResponse> => {
    const response = await apiClient.post('/v1/partners/auth/register', data);
    return response.data;
  },

  // Login partner
  login: async (data: PartnerLoginRequest): Promise<TokenResponse> => {
    const response = await apiClient.post('/auth/login', data);
    const { access_token, refresh_token } = response.data;
    
    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('partner_access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('partner_refresh_token', refresh_token);
      }
    }
    
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  // Get current partner
  getCurrentPartner: async (): Promise<PartnerResponse> => {
    const response = await apiClient.get('/auth/me');
    return response.data;
  },

  // Logout
  logout: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('partner_access_token');
      localStorage.removeItem('partner_refresh_token');
      window.location.href = '/login';
    }
  },

  // Check if authenticated
  isAuthenticated: (): boolean => {
    if (typeof window !== 'undefined') {
      return !!localStorage.getItem('partner_access_token');
    }
    return false;
  },

  // Clear tokens
  clearTokens: () => {
    if (typeof window !== 'undefined') {
      localStorage.removeItem('partner_access_token');
      localStorage.removeItem('partner_refresh_token');
    }
  },
};

export default authService;
