'use client';

import { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { useRouter } from 'next/navigation';
import { authService, PartnerResponse, PartnerLoginRequest } from '@/lib/api/auth';

interface AuthContextType {
  partner: PartnerResponse | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: PartnerLoginRequest) => Promise<void>;
  logout: () => void;
  refreshPartner: () => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [partner, setPartner] = useState<PartnerResponse | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const router = useRouter();

  // Check authentication on mount
  useEffect(() => {
    const checkAuth = async () => {
      if (authService.isAuthenticated()) {
        try {
          // Try to get partner data from localStorage first (from login response)
          let partnerData: PartnerResponse | null = null;
          if (typeof window !== 'undefined') {
            const storedPartner = localStorage.getItem('partner_data');
            if (storedPartner) {
              try {
                partnerData = JSON.parse(storedPartner);
              } catch (e) {
                // Invalid stored data, fetch from API
              }
            }
          }
          
          // If no stored data, fetch from API
          if (!partnerData) {
            partnerData = await authService.getCurrentPartner();
          }
          
          // If API returns name instead of first_name/last_name, split it
          if (partnerData.name && !partnerData.first_name) {
            const nameParts = partnerData.name.split(' ');
            partnerData.first_name = nameParts[0] || '';
            partnerData.last_name = nameParts.slice(1).join(' ') || '';
          }
          setPartner(partnerData);
        } catch (error) {
          console.error('Failed to get partner data:', error);
          authService.logout();
        }
      }
      setIsLoading(false);
    };

    checkAuth();
  }, []);

  const login = async (data: PartnerLoginRequest) => {
    const loginResponse = await authService.login(data);
    
    // Use partner data from login response if available, otherwise fetch it
    let partnerData: PartnerResponse;
    if (loginResponse.partner) {
      partnerData = loginResponse.partner;
      // Store it for later use
      if (typeof window !== 'undefined') {
        localStorage.setItem('partner_data', JSON.stringify(partnerData));
      }
    } else {
      // Fallback: fetch from API if not in login response
      try {
        partnerData = await authService.getCurrentPartner();
      } catch (error) {
        console.error('Failed to get partner data after login:', error);
        throw new Error('Login successful but failed to fetch partner information');
      }
    }
    
    // If API returns name instead of first_name/last_name, split it
    if (partnerData.name && !partnerData.first_name) {
      const nameParts = partnerData.name.split(' ');
      partnerData.first_name = nameParts[0] || '';
      partnerData.last_name = nameParts.slice(1).join(' ') || '';
    }
    setPartner(partnerData);
    router.push('/dashboard');
  };

  const logout = () => {
    setPartner(null);
    authService.logout();
  };

  const refreshPartner = async () => {
    if (authService.isAuthenticated()) {
      const partnerData = await authService.getCurrentPartner();
      // If API returns name instead of first_name/last_name, split it
      if (partnerData.name && !partnerData.first_name) {
        const nameParts = partnerData.name.split(' ');
        partnerData.first_name = nameParts[0] || '';
        partnerData.last_name = nameParts.slice(1).join(' ') || '';
      }
      setPartner(partnerData);
    }
  };

  return (
    <AuthContext.Provider
      value={{
        partner,
        isLoading,
        isAuthenticated: !!partner,
        login,
        logout,
        refreshPartner,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
