import apiClient from './client';

export interface Route {
  id: string;
  operator_id: string;
  origin: string;
  destination: string;
  origin_terminal?: string;
  destination_terminal?: string;
  distance_km?: number;
  estimated_duration_minutes: number;
  base_price: number;
  currency: string;
  status: string;
  is_active: boolean;
  description?: string;
  amenities: string[];
  created_at: string;
  updated_at: string;
}

export interface CreateRouteRequest {
  origin: string;
  destination: string;
  origin_terminal?: string;
  destination_terminal?: string;
  distance_km?: number;
  estimated_duration_minutes: number;
  base_price: number;
  description?: string;
  amenities?: string[];
}

export interface UpdateRouteRequest {
  origin_terminal?: string;
  destination_terminal?: string;
  distance_km?: number;
  estimated_duration_minutes?: number;
  base_price?: number;
  description?: string;
  amenities?: string[];
  is_active?: boolean;
}

export const routesService = {
  // Get all routes
  getRoutes: async (params?: {
    origin?: string;
    destination?: string;
    is_active?: boolean;
    skip?: number;
    limit?: number;
  }): Promise<Route[]> => {
    const queryParams = new URLSearchParams();
    if (params?.origin) queryParams.append('origin', params.origin);
    if (params?.destination) queryParams.append('destination', params.destination);
    if (params?.is_active !== undefined) queryParams.append('is_active', String(params.is_active));
    if (params?.skip) queryParams.append('skip', String(params.skip));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    
    const response = await apiClient.get(`/routes?${queryParams.toString()}`);
    return response.data;
  },

  // Get single route
  getRoute: async (id: string): Promise<Route> => {
    const response = await apiClient.get(`/routes/${id}`);
    return response.data;
  },

  // Create new route
  createRoute: async (data: CreateRouteRequest): Promise<Route> => {
    const response = await apiClient.post('/routes', data);
    return response.data;
  },

  // Update route
  updateRoute: async (id: string, data: UpdateRouteRequest): Promise<Route> => {
    const response = await apiClient.put(`/routes/${id}`, data);
    return response.data;
  },

  // Delete route
  deleteRoute: async (id: string): Promise<void> => {
    await apiClient.delete(`/routes/${id}`);
  },
};

export default routesService;


