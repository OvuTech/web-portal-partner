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
  departure_date: string; // ISO 8601 datetime
  arrival_date: string; // ISO 8601 datetime
  vehicle_number?: string;
  vehicle_type?: string;
  driver_name?: string;
  driver_phone?: string;
  total_seats: number;
  price: number;
  amenities?: string[];
  notes?: string;
}

export const schedulesService = {
  // Get all schedules
  getSchedules: async (params?: {
    status?: string;
    route_id?: string;
    start_date?: string;
    end_date?: string;
    skip?: number;
    limit?: number;
  }): Promise<Schedule[]> => {
    const queryParams = new URLSearchParams();
    if (params?.status) queryParams.append('status', params.status);
    if (params?.route_id) queryParams.append('route_id', params.route_id);
    if (params?.start_date) queryParams.append('start_date', params.start_date);
    if (params?.end_date) queryParams.append('end_date', params.end_date);
    if (params?.skip) queryParams.append('skip', String(params.skip));
    if (params?.limit) queryParams.append('limit', String(params.limit));
    
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
    const response = await apiClient.put(`/schedules/${id}`, data);
    return response.data;
  },

  // Cancel schedule
  cancelSchedule: async (id: string): Promise<void> => {
    await apiClient.delete(`/schedules/${id}`);
  },

  // Bulk create schedules (for CSV upload)
  bulkCreateSchedules: async (schedules: CreateScheduleRequest[]): Promise<{
    success: Schedule[];
    errors: Array<{ row: number; error: string; data: CreateScheduleRequest }>;
  }> => {
    const success: Schedule[] = [];
    const errors: Array<{ row: number; error: string; data: CreateScheduleRequest }> = [];

    for (let i = 0; i < schedules.length; i++) {
      try {
        const schedule = await schedulesService.createSchedule(schedules[i]);
        success.push(schedule);
      } catch (error: any) {
        errors.push({
          row: i + 1,
          error: error.response?.data?.detail || error.message || 'Unknown error',
          data: schedules[i],
        });
      }
    }

    return { success, errors };
  },
};

export default schedulesService;
