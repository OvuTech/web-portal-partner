'use client';

import { useState, useEffect } from 'react';
import Image from 'next/image';
import { format } from 'date-fns';
import { 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  X,
  CalendarIcon,
  Upload,
  Loader2
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import { toast } from 'sonner';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Calendar } from '@/components/ui/calendar';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import routesService, { type Route, type CreateRouteRequest } from '@/lib/api/routes';
import schedulesService, { type CreateScheduleRequest } from '@/lib/api/schedules';

interface Schedule {
  id: string;
  route: string;
  departure: string;
  arrival: string;
  seats: number;
  booked: number;
  price: number;
  type: 'Manual' | 'API';
  status: 'Active' | 'Synced';
  departureDate?: string;
}

const mockSchedules: Schedule[] = [
  {
    id: '1',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 28,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '2',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 30,
    price: 15000,
    type: 'API',
    status: 'Synced',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '3',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 25,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '4',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 20,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '5',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 18,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '6',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 15,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '7',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 12,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '8',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 10,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '9',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 8,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '10',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 5,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '11',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 3,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '12',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 2,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '13',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 1,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
  {
    id: '14',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    departure: '08:00 AM',
    arrival: '1:45 PM',
    seats: 35,
    booked: 0,
    price: 15000,
    type: 'Manual',
    status: 'Active',
    departureDate: 'Oct 22, 2025',
  },
];

export default function SchedulesPage() {
  const [activeTab, setActiveTab] = useState<'active' | 'upcoming' | 'past'>('active');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedSchedule, setSelectedSchedule] = useState<Schedule | null>(null);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isAddRouteModalOpen, setIsAddRouteModalOpen] = useState(false);
  const [isCsvUploadModalOpen, setIsCsvUploadModalOpen] = useState(false);
  const [routes, setRoutes] = useState<Route[]>([]);
  const [isLoadingRoutes, setIsLoadingRoutes] = useState(false);
  const [isSubmittingRoute, setIsSubmittingRoute] = useState(false);
  const [isUploadingCsv, setIsUploadingCsv] = useState(false);
  const [csvUploadProgress, setCsvUploadProgress] = useState({ current: 0, total: 0 });
  const [csvUploadResults, setCsvUploadResults] = useState<{
    success: number;
    errors: Array<{ row: number; error: string }>;
  } | null>(null);
  const [editForm, setEditForm] = useState({
    departureDate: '',
    departureTime: '',
    arrivalTime: '',
    seats: 0,
    booked: 0,
    price: 0,
    status: 'Active' as 'Active' | 'Synced',
    type: 'Manual' as 'Manual' | 'API',
  });
  const [routeForm, setRouteForm] = useState({
    routeName: 'Lagos (Iyanapaja) - Benin (uselu)',
    departureTerminal: '',
    arrivalTerminal: '',
    departureTime: '08:00 AM',
    arrivalTime: '1:45 PM',
    vehicleType: 'Bus',
    vehicleName: 'Toyota Hiace',
    vehiclePlateNumber: 'SMK-888-TU',
    seatCount: '16',
    pricePerSeat: '0.00',
    discount: '0.00',
    discountEnabled: true,
    isRecurring: 'No',
    recurrenceType: 'Daily',
    daysOfWeek: [] as string[],
    startDate: undefined as Date | undefined,
    endDate: undefined as Date | undefined,
    tripDate: undefined as Date | undefined,
    autoConfirmBookings: true,
    bookingCloseTime: '1hr before departure',
  });

  // Fetch routes on component mount
  useEffect(() => {
    const fetchRoutes = async () => {
      setIsLoadingRoutes(true);
      try {
        // Check if token exists
        const token = localStorage.getItem('partner_access_token');
        if (!token) {
          console.error('No authentication token found');
          toast.error('Please log in to continue');
          return;
        }

        console.log('[Schedules] Fetching routes with token:', token.substring(0, 20) + '...');
        const fetchedRoutes = await routesService.getRoutes({ is_active: true });
        console.log('[Schedules] Routes fetched successfully:', fetchedRoutes);
        setRoutes(fetchedRoutes);
      } catch (error: any) {
        console.error('Failed to fetch routes:', error);
        const errorMessage = error.response?.data?.detail || error.message || 'Failed to load routes';
        const errorDetail = error.response?.data?.detail || '';
        console.error('Error details:', {
          status: error.response?.status,
          data: error.response?.data,
          message: errorMessage,
        });
        
        // Show error message - don't redirect on 401 if we're on dashboard
        if (error.response?.status === 401) {
          // Check if it's a permission issue (operator endpoints)
          const errorDetail = error.response?.data?.detail || '';
          if (errorDetail.includes('User not found')) {
            toast.error('User not found. You may need to register as an operator first. Please contact support.');
          } else if (errorDetail.includes('operator') || errorDetail.includes('permission') || errorDetail.includes('access')) {
            toast.error('You need operator permissions to access routes. Please contact support to enable operator access.');
          } else {
            toast.error('Authentication failed. Please log in again.');
          }
        } else {
          toast.error(errorMessage);
        }
      } finally {
        setIsLoadingRoutes(false);
      }
    };
    fetchRoutes();
  }, []);

  const handleEdit = (schedule: Schedule) => {
    setSelectedSchedule(schedule);
    setEditForm({
      departureDate: schedule.departureDate || 'Oct 22, 2025',
      departureTime: schedule.departure,
      arrivalTime: schedule.arrival,
      seats: schedule.seats,
      booked: schedule.booked || 0,
      price: schedule.price,
      status: schedule.status,
      type: schedule.type,
    });
    setIsEditModalOpen(true);
  };

  const handleAddRoute = async () => {
    setIsSubmittingRoute(true);
    try {
      // Parse route name to extract origin and destination
      const routeNameParts = routeForm.routeName.split(' - ');
      const origin = routeNameParts[0]?.trim() || '';
      const destination = routeNameParts[1]?.trim() || '';

      if (!origin || !destination) {
        toast.error('Please select a valid route');
        return;
      }

      // Calculate duration (default 8 hours if not specified)
      const estimatedDurationMinutes = 480; // 8 hours default

      // Parse price
      const basePrice = parseFloat(routeForm.pricePerSeat.replace(/[₦,]/g, '')) || 0;

      const routeData: CreateRouteRequest = {
        origin,
        destination,
        origin_terminal: routeForm.departureTerminal || undefined,
        destination_terminal: routeForm.arrivalTerminal || undefined,
        estimated_duration_minutes: estimatedDurationMinutes,
        base_price: basePrice,
        description: `${origin} to ${destination} route`,
        amenities: [],
      };

      const newRoute = await routesService.createRoute(routeData);
      toast.success('Route created successfully');
      
      // Refresh routes list
      const updatedRoutes = await routesService.getRoutes({ is_active: true });
      setRoutes(updatedRoutes);

      // If this is a route creation (not a schedule), close modal
      setIsAddRouteModalOpen(false);
      
      // Reset form
      setRouteForm({
        routeName: '',
        departureTerminal: '',
        arrivalTerminal: '',
        departureTime: '08:00 AM',
        arrivalTime: '1:45 PM',
        vehicleType: 'Bus',
        vehicleName: 'Toyota Hiace',
        vehiclePlateNumber: 'SMK-888-TU',
        seatCount: '16',
        pricePerSeat: '0.00',
        discount: '0.00',
        discountEnabled: true,
        isRecurring: 'No',
        recurrenceType: 'Daily',
        daysOfWeek: [],
        startDate: undefined,
        endDate: undefined,
        tripDate: undefined,
        autoConfirmBookings: true,
        bookingCloseTime: '1hr before departure',
      });
    } catch (error: any) {
      console.error('Failed to create route:', error);
      const errorMessage = error.response?.data?.detail || error.message || 'Failed to create route';
      toast.error(errorMessage);
    } finally {
      setIsSubmittingRoute(false);
    }
  };

  const parseCsvFile = (file: File): Promise<CreateScheduleRequest[]> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (e) => {
        try {
          const text = e.target?.result as string;
          const lines = text.split('\n').filter(line => line.trim());
          
          if (lines.length < 2) {
            reject(new Error('CSV file must have at least a header and one data row'));
            return;
          }

          // Parse header
          const headers = lines[0].split(',').map(h => h.trim().toLowerCase());
          
          // Required fields mapping
          const requiredFields = ['route_id', 'departure_date', 'arrival_date', 'total_seats', 'price'];
          const missingFields = requiredFields.filter(field => !headers.includes(field));
          
          if (missingFields.length > 0) {
            reject(new Error(`Missing required columns: ${missingFields.join(', ')}`));
            return;
          }

          // Parse data rows
          const schedules: CreateScheduleRequest[] = [];
          
          for (let i = 1; i < lines.length; i++) {
            const values = lines[i].split(',').map(v => v.trim());
            const row: any = {};
            
            headers.forEach((header, index) => {
              row[header] = values[index] || '';
            });

            // Convert date strings to ISO format
            let departureDate = row.departure_date;
            let arrivalDate = row.arrival_date;
            
            // If dates are in simple format, convert to ISO
            if (departureDate && !departureDate.includes('T')) {
              departureDate = new Date(departureDate).toISOString();
            }
            if (arrivalDate && !arrivalDate.includes('T')) {
              arrivalDate = new Date(arrivalDate).toISOString();
            }

            const schedule: CreateScheduleRequest = {
              route_id: row.route_id,
              departure_date: departureDate,
              arrival_date: arrivalDate,
              total_seats: parseInt(row.total_seats) || 0,
              price: parseFloat(row.price) || 0,
              vehicle_number: row.vehicle_number || undefined,
              vehicle_type: row.vehicle_type || undefined,
              driver_name: row.driver_name || undefined,
              driver_phone: row.driver_phone || undefined,
              amenities: row.amenities ? row.amenities.split(',').map((a: string) => a.trim()) : undefined,
              notes: row.notes || undefined,
            };

            schedules.push(schedule);
          }

          resolve(schedules);
        } catch (error: any) {
          reject(new Error(`Failed to parse CSV: ${error.message}`));
        }
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file);
    });
  };

  const handleCsvUpload = async (file: File) => {
    setIsUploadingCsv(true);
    setCsvUploadProgress({ current: 0, total: 0 });
    setCsvUploadResults(null);

    try {
      // Parse CSV
      const schedules = await parseCsvFile(file);
      
      if (schedules.length === 0) {
        toast.error('CSV file is empty');
        setIsUploadingCsv(false);
        return;
      }

      setCsvUploadProgress({ current: 0, total: schedules.length });

      // Upload schedules one by one
      const success: any[] = [];
      const errors: Array<{ row: number; error: string }> = [];

      for (let i = 0; i < schedules.length; i++) {
        try {
          await schedulesService.createSchedule(schedules[i]);
          success.push(i + 1);
          setCsvUploadProgress({ current: i + 1, total: schedules.length });
        } catch (error: any) {
          const errorMessage = error.response?.data?.detail || error.message || 'Unknown error';
          errors.push({
            row: i + 1,
            error: errorMessage,
          });
          setCsvUploadProgress({ current: i + 1, total: schedules.length });
        }
      }

      setCsvUploadResults({
        success: success.length,
        errors,
      });

      if (errors.length === 0) {
        toast.success(`Successfully uploaded ${success.length} schedules`);
        setIsCsvUploadModalOpen(false);
        // Refresh schedules list would go here
      } else {
        toast.warning(`Uploaded ${success.length} schedules, ${errors.length} failed`);
      }
    } catch (error: any) {
      console.error('CSV upload error:', error);
      toast.error(error.message || 'Failed to upload CSV file');
    } finally {
      setIsUploadingCsv(false);
    }
  };

  const remainingSeats = editForm.seats - editForm.booked;

  const tabs = [
    { id: 'active', label: 'Active Schedules', count: 10, badgeColor: 'bg-red-500' },
    { id: 'upcoming', label: 'Upcoming', count: 10, badgeColor: 'bg-gray-400' },
    { id: 'past', label: 'Past Trips', count: 10, badgeColor: 'bg-gray-400' },
  ];

  return (
    <div className="space-y-6">
      {/* Tabs and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Tabs */}
        <div className="flex gap-2 bg-[#F5F5F5] p-1 rounded-lg">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'active' | 'upcoming' | 'past')}
              className={cn(
                'relative pl-4 pr-4 pt-2 pb-2 rounded-lg text-sm font-medium transition-colors text-center cursor-pointer',
                activeTab === tab.id
                  ? 'bg-[#0B5B7A] text-white'
                  : 'text-gray-600 hover:text-gray-900'
              )}
            >
              {tab.label}
              <span
                className={cn(
                  'absolute -top-1 -right-1 w-5 h-5 rounded-full flex items-center justify-center text-xs font-semibold text-white',
                  tab.badgeColor
                )}
              >
                {tab.count}
              </span>
            </button>
          ))}
        </div>

        {/* Filters and Upload Button */}
        <div className="flex items-center gap-3">
          <Select defaultValue="date-range">
            <SelectTrigger className="h-10 w-full min-w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="date-range">Date range</SelectItem>
              <SelectItem value="today">Today</SelectItem>
              <SelectItem value="this-week">This Week</SelectItem>
              <SelectItem value="this-month">This Month</SelectItem>
            </SelectContent>
          </Select>
          <Select defaultValue="route">
            <SelectTrigger className="h-10 w-full min-w-[140px]">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="route">Route</SelectItem>
              <SelectItem value="lagos-abuja">Lagos - Abuja</SelectItem>
              <SelectItem value="lagos-port-harcourt">Lagos - Port Harcourt</SelectItem>
              <SelectItem value="lagos-benin">Lagos - Benin</SelectItem>
            </SelectContent>
          </Select>
          <button 
            onClick={() => setIsAddRouteModalOpen(true)}
            className="flex items-center justify-center h-10 px-5 min-w-[120px] bg-[#3D3D3D] text-white text-sm font-semibold rounded-lg hover:bg-[#2D2D2D] transition-colors cursor-pointer whitespace-nowrap"
          >
            Add New Route
          </button>
          <button
            onClick={() => setIsCsvUploadModalOpen(true)}
            className="flex items-center justify-center h-10 px-5 min-w-[120px] bg-[#0B5B7A] text-white text-sm font-semibold rounded-lg hover:bg-[#014d6b] transition-colors cursor-pointer whitespace-nowrap"
          >
            Upload CSV
          </button>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Route</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Arrival</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Arrival</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Seats</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Price</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Type</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockSchedules.map((schedule) => (
                <tr key={schedule.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                  <td className="py-3 px-4 text-sm text-gray-900">{schedule.route}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{schedule.departure}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{schedule.arrival}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{schedule.seats}</td>
                  <td className="py-3 px-4 text-sm text-gray-900">₦{schedule.price.toLocaleString()}</td>
                  <td className="py-3 px-4 text-sm text-gray-600">{schedule.type}</td>
                  <td className="py-3 px-4">
                    <span className={cn(
                      'inline-flex px-2.5 py-1 rounded-full text-xs font-medium',
                      schedule.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-blue-100 text-blue-700'
                    )}>
                      {schedule.status}
                    </span>
                  </td>
                  <td className="py-3 px-4">
                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => handleEdit(schedule)}
                        className="group w-8 h-8 rounded-full bg-[#0B5B7A] flex items-center justify-center hover:bg-white hover:border-2 hover:border-[#0B5B7A] transition-colors cursor-pointer"
                      >
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:text-[#0B5B7A] transition-colors">
                          <path d="M7.33333 17.25C7.16806 17.25 7.02961 17.194 6.918 17.082C6.80639 16.97 6.75039 16.8316 6.75 16.6667V15.2521C6.75 15.0965 6.77917 14.9482 6.8375 14.807C6.89583 14.6658 6.97847 14.542 7.08542 14.4354L14.45 7.08542C14.5667 6.97847 14.6956 6.89583 14.8368 6.8375C14.9779 6.77917 15.1261 6.75 15.2812 6.75C15.4364 6.75 15.5871 6.77917 15.7333 6.8375C15.8796 6.89583 16.0059 6.98333 16.1125 7.1L16.9146 7.91667C17.0312 8.02361 17.1162 8.15 17.1695 8.29583C17.2228 8.44167 17.2496 8.5875 17.25 8.73333C17.25 8.88889 17.2232 9.03725 17.1695 9.17842C17.1158 9.31958 17.0309 9.44831 16.9146 9.56458L9.56458 16.9146C9.45764 17.0215 9.33358 17.1042 9.19242 17.1625C9.05125 17.2208 8.90308 17.25 8.74792 17.25H7.33333ZM15.2667 9.55L16.0833 8.73333L15.2667 7.91667L14.45 8.73333L15.2667 9.55Z" fill="currentColor"/>
                        </svg>
                      </button>
                      <button className="group w-8 h-8 rounded-full bg-red-600 flex items-center justify-center hover:bg-white hover:border-2 hover:border-red-600 transition-colors cursor-pointer">
                        <svg width="24" height="24" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white group-hover:text-red-600 transition-colors">
                          <path d="M17 7H14.5L13.5 6H10.5L9.5 7H7V9H17V7ZM9 18H15C15.2652 18 15.5196 17.8946 15.7071 17.7071C15.8946 17.5196 16 17.2652 16 17V10H8V17C8 17.2652 8.10536 17.5196 8.29289 17.7071C8.48043 17.8946 8.73478 18 9 18Z" fill="currentColor"/>
                        </svg>
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center gap-1 p-4 border-t border-gray-100">
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
            «
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
            <ChevronLeft className="h-4 w-4" />
          </button>
          {[1, 2, 3, 4, 5, 6].map((page) => (
            <button
              key={page}
              onClick={() => setCurrentPage(page)}
              className={cn(
                'w-8 h-8 flex items-center justify-center text-sm rounded transition-colors',
                currentPage === page
                  ? 'bg-[#0B5B7A] text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              )}
            >
              {page}
            </button>
          ))}
          <span className="px-2 text-gray-400">...</span>
          <button
            onClick={() => setCurrentPage(10)}
            className={cn(
              'w-8 h-8 flex items-center justify-center text-sm rounded transition-colors',
              currentPage === 10
                ? 'bg-[#0B5B7A] text-white'
                : 'text-gray-600 hover:bg-gray-100'
            )}
          >
            10
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600 cursor-pointer">
            »
          </button>
        </div>
      </div>

      {/* Edit Trip Modal */}
      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Description className="sr-only">
              Edit trip schedule details
            </Dialog.Description>
            {selectedSchedule && (
              <div className="p-6">
                {/* Modal Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-bold text-gray-900 mb-1">
                    {selectedSchedule.route}
                  </h2>
                  <p className="text-sm text-gray-500">Trip ID: SCH-0293</p>
                </div>

                {/* Form Fields */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="edit-departureDate" className="block text-sm font-medium text-gray-700 mb-1">
                      Departure's Date
                    </Label>
                    <Select value={editForm.departureDate} onValueChange={(value) => setEditForm({ ...editForm, departureDate: value })}>
                      <SelectTrigger id="edit-departureDate" className="w-full h-10 bg-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Oct 22, 2025">Oct 22, 2025</SelectItem>
                        <SelectItem value="Oct 23, 2025">Oct 23, 2025</SelectItem>
                        <SelectItem value="Oct 24, 2025">Oct 24, 2025</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-departureTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Time
                    </Label>
                    <Select value={editForm.departureTime} onValueChange={(value) => setEditForm({ ...editForm, departureTime: value })}>
                      <SelectTrigger id="edit-departureTime" className="w-full h-10 bg-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                        <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                        <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                        <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                        <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-arrivalTime" className="block text-sm font-medium text-gray-700 mb-1">
                      Arrival Time
                    </Label>
                    <Select value={editForm.arrivalTime} onValueChange={(value) => setEditForm({ ...editForm, arrivalTime: value })}>
                      <SelectTrigger id="edit-arrivalTime" className="w-full h-10 bg-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="1:45 PM">1:45 PM</SelectItem>
                        <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                        <SelectItem value="2:30 PM">2:30 PM</SelectItem>
                        <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                        <SelectItem value="3:30 PM">3:30 PM</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <Label htmlFor="edit-seats" className="block text-sm font-medium text-gray-700 mb-1">
                        Seats
                      </Label>
                      <Input
                        id="edit-seats"
                        type="number"
                        value={editForm.seats}
                        onChange={(e) => setEditForm({ ...editForm, seats: parseInt(e.target.value) || 0 })}
                        className="w-full h-10 bg-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-booked" className="block text-sm font-medium text-gray-700 mb-1">
                        Booked
                      </Label>
                      <Input
                        id="edit-booked"
                        type="number"
                        value={editForm.booked}
                        onChange={(e) => setEditForm({ ...editForm, booked: parseInt(e.target.value) || 0 })}
                        className="w-full h-10 bg-gray-100"
                      />
                    </div>
                    <div>
                      <Label htmlFor="edit-remaining" className="block text-sm font-medium text-gray-700 mb-1">
                        Remaining
                      </Label>
                      <Input
                        id="edit-remaining"
                        type="number"
                        value={remainingSeats}
                        readOnly
                        className="w-full h-10 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-price" className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </Label>
                    <div className="relative">
                      <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-700 z-10">₦</span>
                      <Input
                        id="edit-price"
                        type="text"
                        value={`${editForm.price.toLocaleString()}.00`}
                        onChange={(e) => {
                          const value = e.target.value.replace(/[₦,]/g, '');
                          const numValue = parseInt(value) || 0;
                          setEditForm({ ...editForm, price: numValue });
                        }}
                        className="w-full h-10 bg-gray-100 pl-8"
                      />
                    </div>
                  </div>

                  <div>
                    <Label htmlFor="edit-status" className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </Label>
                    <Select value={editForm.status} onValueChange={(value) => setEditForm({ ...editForm, status: value as 'Active' | 'Synced' })}>
                      <SelectTrigger id="edit-status" className="w-full h-10 bg-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Synced">Synced</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <Label htmlFor="edit-type" className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </Label>
                    <Select value={editForm.type} onValueChange={(value) => setEditForm({ ...editForm, type: value as 'Manual' | 'API' })}>
                      <SelectTrigger id="edit-type" className="w-full h-10 bg-gray-100">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Manual">Manual</SelectItem>
                        <SelectItem value="API">API</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <Button className="flex-1 h-10 bg-[#0B5B7A] hover:bg-[#014d6b] text-white cursor-pointer">
                    Deactivate Trip
                  </Button>
                  <Button variant="outline" className="flex-1 h-10 cursor-pointer">
                    Save Changes
                  </Button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Add New Route Modal */}
      <Dialog.Root open={isAddRouteModalOpen} onOpenChange={setIsAddRouteModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Description className="sr-only">
              Add a new route with schedule details
            </Dialog.Description>
            <div className="p-6">
              {/* Modal Header */}
              <div className="mb-6">
                <div className="flex items-center justify-between mb-2">
                  <h2 className="text-xl font-bold text-gray-900">Add New Route</h2>
                  <button
                    onClick={() => setIsAddRouteModalOpen(false)}
                    className="text-gray-400 hover:text-gray-600 cursor-pointer"
                  >
                    <X className="h-5 w-5" />
                  </button>
                </div>
                <p className="text-sm text-gray-500">Lorem ipsum dolor</p>
              </div>

              {/* Form Sections */}
              <div className="space-y-6">
                {/* 1. Route Information */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">1. Route Information</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="routeName" className="text-sm font-medium text-gray-700 mb-1">Route Name</Label>
                        <Input
                          id="routeName"
                          type="text"
                          value={routeForm.routeName}
                          onChange={(e) => setRouteForm({ ...routeForm, routeName: e.target.value })}
                          placeholder="e.g., Lagos - Abuja"
                          className="w-full bg-gray-100 h-10"
                        />
                        <p className="text-xs text-gray-500 mt-1">Format: Origin - Destination</p>
                      </div>
                      <div>
                        <Label htmlFor="departureTerminal" className="text-sm font-medium text-gray-700 mb-1">Departure's Terminal</Label>
                        <Select value={routeForm.departureTerminal} onValueChange={(value) => setRouteForm({ ...routeForm, departureTerminal: value })}>
                          <SelectTrigger id="departureTerminal" className="w-full bg-gray-100 h-10">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Lagos (Iyanapaja)">Lagos (Iyanapaja)</SelectItem>
                            <SelectItem value="Lagos (Jibowu)">Lagos (Jibowu)</SelectItem>
                            <SelectItem value="Lagos (Oshodi)">Lagos (Oshodi)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="arrivalTerminal" className="text-sm font-medium text-gray-700 mb-1">Arrival Terminal</Label>
                        <Select value={routeForm.arrivalTerminal} onValueChange={(value) => setRouteForm({ ...routeForm, arrivalTerminal: value })}>
                          <SelectTrigger id="arrivalTerminal" className="w-full bg-gray-100 h-10">
                            <SelectValue placeholder="Select" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Benin (uselu)">Benin (uselu)</SelectItem>
                            <SelectItem value="Abuja (Jabi)">Abuja (Jabi)</SelectItem>
                            <SelectItem value="Port Harcourt (Mile 1)">Port Harcourt (Mile 1)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="departureTime" className="text-sm font-medium text-gray-700 mb-1">Departure Time</Label>
                        <Select value={routeForm.departureTime} onValueChange={(value) => setRouteForm({ ...routeForm, departureTime: value })}>
                          <SelectTrigger id="departureTime" className="w-full bg-gray-100 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="08:00 AM">08:00 AM</SelectItem>
                            <SelectItem value="09:00 AM">09:00 AM</SelectItem>
                            <SelectItem value="10:00 AM">10:00 AM</SelectItem>
                            <SelectItem value="11:00 AM">11:00 AM</SelectItem>
                            <SelectItem value="12:00 PM">12:00 PM</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="arrivalTime" className="text-sm font-medium text-gray-700 mb-1">Arrival Time</Label>
                      <Select value={routeForm.arrivalTime} onValueChange={(value) => setRouteForm({ ...routeForm, arrivalTime: value })}>
                        <SelectTrigger id="arrivalTime" className="w-full bg-gray-100 h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1:45 PM">1:45 PM</SelectItem>
                          <SelectItem value="2:00 PM">2:00 PM</SelectItem>
                          <SelectItem value="2:30 PM">2:30 PM</SelectItem>
                          <SelectItem value="3:00 PM">3:00 PM</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>

                {/* 2. Vehicle Details */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">2. Vehicle Details</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vehicleType" className="text-sm font-medium text-gray-700 mb-1">Vehicle Type</Label>
                        <Select value={routeForm.vehicleType} onValueChange={(value) => setRouteForm({ ...routeForm, vehicleType: value })}>
                          <SelectTrigger id="vehicleType" className="w-full bg-gray-100 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Bus">Bus</SelectItem>
                            <SelectItem value="Van">Van</SelectItem>
                            <SelectItem value="Car">Car</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="vehicleName" className="text-sm font-medium text-gray-700 mb-1">Vehicle Name</Label>
                        <Select value={routeForm.vehicleName} onValueChange={(value) => setRouteForm({ ...routeForm, vehicleName: value })}>
                          <SelectTrigger id="vehicleName" className="w-full bg-gray-100 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="Toyota Hiace">Toyota Hiace</SelectItem>
                            <SelectItem value="Mercedes Sprinter">Mercedes Sprinter</SelectItem>
                            <SelectItem value="Ford Transit">Ford Transit</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="vehiclePlateNumber" className="text-sm font-medium text-gray-700 mb-1">Vehicle Plate Number</Label>
                        <Select value={routeForm.vehiclePlateNumber} onValueChange={(value) => setRouteForm({ ...routeForm, vehiclePlateNumber: value })}>
                          <SelectTrigger id="vehiclePlateNumber" className="w-full bg-gray-100 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="SMK-888-TU">SMK-888-TU</SelectItem>
                            <SelectItem value="ABC-123-LAG">ABC-123-LAG</SelectItem>
                            <SelectItem value="XYZ-456-ABJ">XYZ-456-ABJ</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div>
                        <Label htmlFor="seatCount" className="text-sm font-medium text-gray-700 mb-1">Seat Count</Label>
                        <Input
                          id="seatCount"
                          type="text"
                          value={routeForm.seatCount}
                          onChange={(e) => setRouteForm({ ...routeForm, seatCount: e.target.value })}
                          className="w-full bg-gray-100 h-10"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 3. Pricing */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">3. Pricing</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label htmlFor="pricePerSeat" className="text-sm font-medium text-gray-700 mb-1">Price Per Seat</Label>
                      <div className="relative">
                        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-700 z-10">₦</span>
                        <Input
                          id="pricePerSeat"
                          type="text"
                          value={routeForm.pricePerSeat}
                          onChange={(e) => setRouteForm({ ...routeForm, pricePerSeat: e.target.value })}
                          placeholder="0.00"
                          className="w-full bg-gray-100 h-10 pl-8"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="discount" className="text-sm font-medium text-gray-700 mb-1">Discount</Label>
                      <div className="flex items-center gap-3">
                        <div className="relative flex-1">
                          <span className="absolute left-3 top-1/2 -translate-y-1/2 text-sm text-gray-700 z-10">₦</span>
                          <Input
                            id="discount"
                            type="text"
                            value={routeForm.discount}
                            onChange={(e) => setRouteForm({ ...routeForm, discount: e.target.value })}
                            placeholder="0.00"
                            className="w-full bg-gray-100 h-10 pl-8"
                          />
                        </div>
                        <Switch
                          checked={routeForm.discountEnabled}
                          onCheckedChange={(checked) => setRouteForm({ ...routeForm, discountEnabled: checked })}
                          className="data-[state=checked]:bg-green-500"
                        />
                      </div>
                    </div>
                  </div>
                </div>

                {/* 4. Recurring Trip Setup */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">4. Recurring Trip Setup</h3>
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <Label htmlFor="isRecurring" className="text-sm font-medium text-gray-700 mb-1">Is this a recurring trip?</Label>
                        <Select value={routeForm.isRecurring} onValueChange={(value) => setRouteForm({ ...routeForm, isRecurring: value })}>
                          <SelectTrigger id="isRecurring" className="w-full bg-gray-100 h-10">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="No">No</SelectItem>
                            <SelectItem value="Yes">Yes</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      {routeForm.isRecurring === 'Yes' && (
                        <div>
                          <Label htmlFor="recurrenceType" className="text-sm font-medium text-gray-700 mb-1">Recurrence Type</Label>
                          <Select value={routeForm.recurrenceType} onValueChange={(value) => setRouteForm({ ...routeForm, recurrenceType: value })}>
                            <SelectTrigger id="recurrenceType" className="w-full bg-gray-100 h-10">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="Daily">Daily</SelectItem>
                              <SelectItem value="Weekly">Weekly</SelectItem>
                              <SelectItem value="Monthly">Monthly</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      )}
                    </div>
                    
                    {routeForm.isRecurring === 'Yes' && routeForm.recurrenceType === 'Weekly' && (
                      <div>
                        <Label className="text-sm font-medium text-gray-700 mb-1">Days of week</Label>
                        <div className="flex gap-2 flex-wrap">
                          {['Sun', 'Mon', 'Tue', 'Wed', 'Thur', 'Fri', 'Sat'].map((day) => (
                            <Button
                              key={day}
                              type="button"
                              variant={routeForm.daysOfWeek.includes(day) ? "default" : "outline"}
                              onClick={() => {
                                const newDays = routeForm.daysOfWeek.includes(day)
                                  ? routeForm.daysOfWeek.filter(d => d !== day)
                                  : [...routeForm.daysOfWeek, day];
                                setRouteForm({ ...routeForm, daysOfWeek: newDays });
                              }}
                              className={cn(
                                routeForm.daysOfWeek.includes(day)
                                  ? 'bg-[#0B5B7A] text-white hover:bg-[#0B5B7A]/90'
                                  : ''
                              )}
                            >
                              {day}
                            </Button>
                          ))}
                        </div>
                      </div>
                    )}

                    {routeForm.isRecurring === 'Yes' ? (
                      <div className="grid grid-cols-2 gap-4">
                        <div>
                          <Label htmlFor="startDate" className="text-sm font-medium text-gray-700 mb-1">Start Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="startDate"
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-gray-100 h-10",
                                  !routeForm.startDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {routeForm.startDate ? format(routeForm.startDate, "dd - MM - yyyy") : <span>DD - MM - YYYY</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={routeForm.startDate}
                                onSelect={(date) => setRouteForm({ ...routeForm, startDate: date })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-sm font-medium text-gray-700 mb-1">End Date</Label>
                          <Popover>
                            <PopoverTrigger asChild>
                              <Button
                                id="endDate"
                                variant="outline"
                                className={cn(
                                  "w-full justify-start text-left font-normal bg-gray-100 h-10",
                                  !routeForm.endDate && "text-muted-foreground"
                                )}
                              >
                                <CalendarIcon className="mr-2 h-4 w-4" />
                                {routeForm.endDate ? format(routeForm.endDate, "dd - MM - yyyy") : <span>DD - MM - YYYY</span>}
                              </Button>
                            </PopoverTrigger>
                            <PopoverContent className="w-auto p-0" align="start">
                              <Calendar
                                mode="single"
                                selected={routeForm.endDate}
                                onSelect={(date) => setRouteForm({ ...routeForm, endDate: date })}
                                initialFocus
                              />
                            </PopoverContent>
                          </Popover>
                        </div>
                      </div>
                    ) : (
                      <div>
                        <Label htmlFor="tripDate" className="text-sm font-medium text-gray-700 mb-1">Trip Date</Label>
                        <Popover>
                          <PopoverTrigger asChild>
                            <Button
                              id="tripDate"
                              variant="outline"
                              className={cn(
                                "w-full justify-start text-left font-normal bg-gray-100 h-10",
                                !routeForm.tripDate && "text-muted-foreground"
                              )}
                            >
                              <CalendarIcon className="mr-2 h-4 w-4" />
                              {routeForm.tripDate ? format(routeForm.tripDate, "dd - MM - yyyy") : <span>DD - MM - YYYY</span>}
                            </Button>
                          </PopoverTrigger>
                          <PopoverContent className="w-auto p-0" align="start">
                            <Calendar
                              mode="single"
                              selected={routeForm.tripDate}
                              onSelect={(date) => setRouteForm({ ...routeForm, tripDate: date })}
                              initialFocus
                            />
                          </PopoverContent>
                        </Popover>
                      </div>
                    )}
                  </div>
                </div>

                {/* 5. Booking Rules */}
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">5. Booking Rules</h3>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label htmlFor="autoConfirm" className="text-sm font-medium text-gray-700">Auto-confirm bookings</Label>
                      <Switch
                        id="autoConfirm"
                        checked={routeForm.autoConfirmBookings}
                        onCheckedChange={(checked) => setRouteForm({ ...routeForm, autoConfirmBookings: checked })}
                        className="data-[state=checked]:bg-green-500"
                      />
                    </div>
                    <div>
                      <Label htmlFor="bookingCloseTime" className="text-sm font-medium text-gray-700 mb-1">Booking close time</Label>
                      <Select value={routeForm.bookingCloseTime} onValueChange={(value) => setRouteForm({ ...routeForm, bookingCloseTime: value })}>
                        <SelectTrigger id="bookingCloseTime" className="w-full bg-gray-100 h-10">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="1hr before departure">1hr before departure</SelectItem>
                          <SelectItem value="2hr before departure">2hr before departure</SelectItem>
                          <SelectItem value="3hr before departure">3hr before departure</SelectItem>
                          <SelectItem value="30min before departure">30min before departure</SelectItem>
                          <SelectItem value="15min before departure">15min before departure</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                <Button
                  variant="outline"
                  onClick={() => setIsAddRouteModalOpen(false)}
                  className="flex-1 h-10 cursor-pointer"
                >
                  Cancel
                </Button>
                <Button
                  onClick={handleAddRoute}
                  disabled={isSubmittingRoute}
                  className="flex-1 h-10 bg-[#0B5B7A] hover:bg-[#0B5B7A]/90 text-white cursor-pointer disabled:opacity-50"
                >
                  {isSubmittingRoute ? (
                    <>
                      <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    'Add Route'
                  )}
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* CSV Upload Modal */}
      <Dialog.Root open={isCsvUploadModalOpen} onOpenChange={setIsCsvUploadModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            <Dialog.Description className="sr-only">
              Upload a CSV file to create multiple schedules at once
            </Dialog.Description>
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <h2 className="text-xl font-bold text-gray-900">Upload Schedules CSV</h2>
                <button
                  onClick={() => {
                    setIsCsvUploadModalOpen(false);
                    setCsvUploadResults(null);
                    setCsvUploadProgress({ current: 0, total: 0 });
                  }}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Upload a CSV file to create multiple schedules at once</p>

              <div className="space-y-4">
                {/* CSV Format Info */}
                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <h3 className="text-sm font-semibold text-blue-900 mb-2">CSV Format Requirements</h3>
                  <p className="text-xs text-blue-700 mb-2">Required columns:</p>
                  <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                    <li><code>route_id</code> - Route ID (must exist)</li>
                    <li><code>departure_date</code> - ISO 8601 format (e.g., 2024-12-25T08:00:00Z)</li>
                    <li><code>arrival_date</code> - ISO 8601 format</li>
                    <li><code>total_seats</code> - Integer (e.g., 35)</li>
                    <li><code>price</code> - Number (e.g., 15000)</li>
                  </ul>
                  <p className="text-xs text-blue-700 mt-2">Optional columns:</p>
                  <ul className="text-xs text-blue-700 list-disc list-inside space-y-1">
                    <li><code>vehicle_number</code>, <code>vehicle_type</code>, <code>driver_name</code>, <code>driver_phone</code>, <code>amenities</code> (comma-separated), <code>notes</code></li>
                  </ul>
                </div>

                {/* File Upload */}
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Select CSV File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-900 mb-1">Choose a file or drag & drop it here</p>
                    <p className="text-xs text-gray-500 mb-4">CSV format only, up to 5MB</p>
                    <label className="inline-block cursor-pointer">
                      <input
                        type="file"
                        accept=".csv"
                        onChange={(e) => {
                          const file = e.target.files?.[0];
                          if (file) {
                            handleCsvUpload(file);
                          }
                        }}
                        className="hidden"
                        disabled={isUploadingCsv}
                      />
                      <Button variant="outline" disabled={isUploadingCsv} type="button">
                        Browse File
                      </Button>
                    </label>
                  </div>
                </div>

                {/* Upload Progress */}
                {isUploadingCsv && csvUploadProgress.total > 0 && (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between text-sm">
                      <span className="text-gray-700">Uploading schedules...</span>
                      <span className="text-gray-600">
                        {csvUploadProgress.current} / {csvUploadProgress.total}
                      </span>
                    </div>
                    <div className="w-full bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-[#0B5B7A] h-2 rounded-full transition-all duration-300"
                        style={{ width: `${(csvUploadProgress.current / csvUploadProgress.total) * 100}%` }}
                      />
                    </div>
                  </div>
                )}

                {/* Upload Results */}
                {csvUploadResults && (
                  <div className={cn(
                    "border rounded-lg p-4",
                    csvUploadResults.errors.length === 0 ? "bg-green-50 border-green-200" : "bg-yellow-50 border-yellow-200"
                  )}>
                    <h3 className="text-sm font-semibold mb-2">
                      {csvUploadResults.errors.length === 0 ? 'Upload Complete!' : 'Upload Completed with Errors'}
                    </h3>
                    <p className="text-sm text-gray-700 mb-2">
                      Successfully uploaded: {csvUploadResults.success} schedules
                    </p>
                    {csvUploadResults.errors.length > 0 && (
                      <div className="mt-3">
                        <p className="text-sm font-medium text-red-700 mb-2">
                          Errors ({csvUploadResults.errors.length}):
                        </p>
                        <div className="max-h-40 overflow-y-auto space-y-1">
                          {csvUploadResults.errors.map((error, index) => (
                            <div key={index} className="text-xs text-red-600 bg-red-50 p-2 rounded">
                              Row {error.row}: {error.error}
                            </div>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                )}

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-200">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setIsCsvUploadModalOpen(false);
                      setCsvUploadResults(null);
                      setCsvUploadProgress({ current: 0, total: 0 });
                    }}
                    className="flex-1 h-10 cursor-pointer"
                    disabled={isUploadingCsv}
                  >
                    {csvUploadResults ? 'Close' : 'Cancel'}
                  </Button>
                  {csvUploadResults && csvUploadResults.errors.length > 0 && (
                    <Button
                      onClick={() => {
                        // Download error report
                        const errorReport = csvUploadResults.errors.map(e => `Row ${e.row}: ${e.error}`).join('\n');
                        const blob = new Blob([errorReport], { type: 'text/plain' });
                        const url = URL.createObjectURL(blob);
                        const a = document.createElement('a');
                        a.href = url;
                        a.download = 'upload-errors.txt';
                        a.click();
                        URL.revokeObjectURL(url);
                      }}
                      variant="outline"
                      className="flex-1 h-10 cursor-pointer"
                    >
                      Download Error Report
                    </Button>
                  )}
                </div>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
