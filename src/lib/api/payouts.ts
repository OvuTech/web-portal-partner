import apiClient from './client';

export interface Transaction {
  id: string;
  type: 'credit' | 'debit' | 'payout';
  amount: number;
  currency: string;
  description: string;
  reference: string;
  status: 'completed' | 'pending' | 'failed';
  created_at: string;
}

export interface PayoutRequest {
  amount: number;
  bank_account_id: string;
}

export interface BankAccount {
  id: string;
  bank_name: string;
  account_number: string;
  account_name: string;
  is_default: boolean;
}

export interface WalletBalance {
  available: number;
  pending: number;
  currency: string;
}

export const payoutsService = {
  // Get wallet balance
  getBalance: async (): Promise<WalletBalance> => {
    const response = await apiClient.get('/wallet/balance');
    return response.data;
  },

  // Get transaction history
  getTransactions: async (params?: { type?: string; page?: number; limit?: number }): Promise<Transaction[]> => {
    const queryParams = new URLSearchParams();
    if (params?.type) queryParams.append('type', params.type);
    if (params?.page) queryParams.append('page', String(params.page));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    const response = await apiClient.get(`/payouts?${queryParams.toString()}`);
    return response.data;
  },

  // Request payout
  requestPayout: async (data: PayoutRequest): Promise<Transaction> => {
    const response = await apiClient.post('/payouts', data);
    return response.data;
  },
};

export default payoutsService;
