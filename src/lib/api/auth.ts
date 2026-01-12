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
  expires_in?: number;
  partner?: PartnerResponse; // Partner data may be included in login response
}

export interface ForgotPasswordRequest {
  email: string;
}

export interface ResetPasswordRequest {
  token: string;
  password: string; // Frontend uses 'password', API route transforms to 'new_password'
}

export interface RefreshTokenRequest {
  refresh_token: string;
}

export interface ChangePasswordRequest {
  current_password: string;
  new_password: string;
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
    const { access_token, refresh_token, partner } = response.data;
    
    // Store tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('partner_access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('partner_refresh_token', refresh_token);
      }
      // Store partner data if included in response
      if (partner) {
        localStorage.setItem('partner_data', JSON.stringify(partner));
      }
    }
    
    return response.data;
  },

  // Forgot password
  forgotPassword: async (data: ForgotPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/auth/forgot-password', data);
    return response.data;
  },

  // Reset password
  resetPassword: async (data: ResetPasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.post('/v1/partners/auth/reset-password', data);
    return response.data;
  },

  // Refresh token
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await apiClient.post('/v1/partners/auth/refresh', {
      refresh_token: refreshToken,
    });
    const { access_token, refresh_token, partner } = response.data;
    
    // Store new tokens
    if (typeof window !== 'undefined') {
      localStorage.setItem('partner_access_token', access_token);
      if (refresh_token) {
        localStorage.setItem('partner_refresh_token', refresh_token);
      }
      // Update partner data if included
      if (partner) {
        localStorage.setItem('partner_data', JSON.stringify(partner));
      }
    }
    
    return response.data;
  },

  // Change password
  changePassword: async (data: ChangePasswordRequest): Promise<{ message: string }> => {
    const response = await apiClient.put('/v1/partners/auth/change-password', data);
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
      localStorage.removeItem('partner_data');
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
      localStorage.removeItem('partner_data');
    }
  },

  // Register partner as operator
  registerAsOperator: async (data: {
    company_name?: string;
    business_type?: string;
    license_number?: string;
    address?: string;
  }): Promise<any> => {
    const response = await apiClient.post('/operators/register-operator', data);
    return response.data;
  },
};

export default authService;
