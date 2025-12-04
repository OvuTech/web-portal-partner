import apiClient from './client';

export interface Schedule {
  id: string;
  route_id: string;
  origin: string;
  destination: string;
  departure_time: string;
  arrival_time: string;
  vehicle_id: string;
  vehicle_name: string;
  vehicle_number: string;
  capacity: number;
  available_seats: number;
  price: number;
  currency: string;
  status: 'active' | 'cancelled' | 'completed';
  recurring: boolean;
  days_of_week?: string[];
  created_at: string;
}

export interface Vehicle {
  id: string;
  name: string;
  plate_number: string;
  type: string;
  capacity: number;
  status: 'active' | 'maintenance' | 'retired';
  features?: string[];
}

export interface CreateScheduleRequest {
  route_id: string;
  vehicle_id: string;
  departure_time: string;
  price: number;
  recurring?: boolean;
  days_of_week?: string[];
}

export const schedulesService = {
  // Get all schedules
  getSchedules: async (params?: { date?: string; status?: string }): Promise<Schedule[]> => {
    const queryParams = new URLSearchParams();
    if (params?.date) queryParams.append('date', params.date);
    if (params?.status) queryParams.append('status', params.status);
    const response = await apiClient.get(`/schedules?${queryParams.toString()}`);
    return response.data;
  },

  // Get single schedule
  getSchedule: async (id: string): Promise<Schedule> => {
    const response = await apiClient.get(`/schedules/${id}`);
    return response.data;
  },

  // Create new schedule
  createSchedule: async (data: CreateScheduleRequest): Promise<Schedule> => {
    const response = await apiClient.post('/schedules', data);
    return response.data;
  },

  // Update schedule
  updateSchedule: async (id: string, data: Partial<CreateScheduleRequest>): Promise<Schedule> => {
    const response = await apiClient.patch(`/schedules/${id}`, data);
    return response.data;
  },

  // Cancel schedule
  cancelSchedule: async (id: string): Promise<void> => {
    await apiClient.post(`/schedules/${id}/cancel`);
  },
};

export default schedulesService;
