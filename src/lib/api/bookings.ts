import apiClient from './client';

export interface Booking {
  id: string;
  booking_reference: string;
  user_id: string;
  transport_type: 'bus' | 'flight' | 'train';
  status: 'pending' | 'confirmed' | 'cancelled' | 'completed' | 'refunded';
  origin: string;
  destination: string;
  departure_date: string;
  arrival_date?: string;
  total_passengers: number;
  total_price: number;
  currency: string;
  passengers?: PassengerInfo[];
  contact?: ContactInfo;
  selected_seats?: string[];
  created_at: string;
  updated_at?: string;
}

export interface PassengerInfo {
  first_name: string;
  last_name: string;
  gender: string;
  email?: string;
  phone?: string;
}

export interface ContactInfo {
  email: string;
  phone: string;
}

export interface BookingFilters {
  status?: string;
  transport_type?: string;
  date_from?: string;
  date_to?: string;
  search?: string;
  page?: number;
  limit?: number;
}

export interface BookingListResponse {
  bookings: Booking[];
  total: number;
  page: number;
  limit: number;
}

export const bookingsService = {
  // Get all bookings for the partner
  getBookings: async (filters?: BookingFilters): Promise<BookingListResponse> => {
    const params = new URLSearchParams();
    if (filters) {
      Object.entries(filters).forEach(([key, value]) => {
        if (value !== undefined && value !== '') {
          params.append(key, String(value));
        }
      });
    }
    const response = await apiClient.get(`/bookings?${params.toString()}`);
    return response.data;
  },

  // Get single booking by ID
  getBooking: async (id: string): Promise<Booking> => {
    const response = await apiClient.get(`/bookings/${id}`);
    return response.data;
  },

  // Update booking status
  updateBookingStatus: async (id: string, status: string): Promise<Booking> => {
    const response = await apiClient.patch(`/bookings/${id}`, { status });
    return response.data;
  },

  // Confirm a booking
  confirmBooking: async (id: string): Promise<Booking> => {
    const response = await apiClient.post(`/bookings/${id}/confirm`);
    return response.data;
  },

  // Cancel a booking
  cancelBooking: async (id: string, reason?: string): Promise<Booking> => {
    const response = await apiClient.post(`/bookings/${id}/cancel`, { reason });
    return response.data;
  },
};

export default bookingsService;
