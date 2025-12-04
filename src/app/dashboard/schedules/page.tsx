'use client';

import { useState } from 'react';
import { 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Upload,
  Pencil,
  Trash2,
  X
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';

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
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'active' | 'upcoming' | 'past')}
              className={cn(
                'relative px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-[#0B5B7A] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
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
          <select className="h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]">
            <option>Date range</option>
            <option>Today</option>
            <option>This Week</option>
            <option>This Month</option>
          </select>
          <select className="h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]">
            <option>Route</option>
            <option>Lagos - Abuja</option>
            <option>Lagos - Port Harcourt</option>
            <option>Lagos - Benin</option>
          </select>
          <button className="flex items-center gap-2 h-10 px-4 bg-[#0B5B7A] text-white text-sm font-semibold rounded-lg hover:bg-[#014d6b] transition-colors">
            <Upload className="h-4 w-4" />
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
                        className="group w-8 h-8 rounded-full bg-[#0B5B7A] flex items-center justify-center hover:bg-white hover:border-2 hover:border-[#0B5B7A] transition-colors"
                      >
                        <Pencil className="h-4 w-4 text-white group-hover:text-[#0B5B7A] transition-colors" />
                      </button>
                      <button className="group w-8 h-8 rounded-full bg-red-600 flex items-center justify-center hover:bg-white hover:border-2 hover:border-red-600 transition-colors">
                        <Trash2 className="h-4 w-4 text-white group-hover:text-red-600 transition-colors" />
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
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
            «
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
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
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
            <ChevronRight className="h-4 w-4" />
          </button>
          <button className="w-8 h-8 flex items-center justify-center text-gray-400 hover:text-gray-600">
            »
          </button>
        </div>
      </div>

      {/* Edit Trip Modal */}
      <Dialog.Root open={isEditModalOpen} onOpenChange={setIsEditModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
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
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure's Date
                    </label>
                    <select
                      value={editForm.departureDate}
                      onChange={(e) => setEditForm({ ...editForm, departureDate: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    >
                      <option>Oct 22, 2025</option>
                      <option>Oct 23, 2025</option>
                      <option>Oct 24, 2025</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Departure Time
                    </label>
                    <select
                      value={editForm.departureTime}
                      onChange={(e) => setEditForm({ ...editForm, departureTime: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    >
                      <option>08:00 AM</option>
                      <option>09:00 AM</option>
                      <option>10:00 AM</option>
                      <option>11:00 AM</option>
                      <option>12:00 PM</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Arrival Time
                    </label>
                    <select
                      value={editForm.arrivalTime}
                      onChange={(e) => setEditForm({ ...editForm, arrivalTime: e.target.value })}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    >
                      <option>1:45 PM</option>
                      <option>2:00 PM</option>
                      <option>2:30 PM</option>
                      <option>3:00 PM</option>
                      <option>3:30 PM</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-3 gap-4">
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Seats
                      </label>
                      <input
                        type="number"
                        value={editForm.seats}
                        onChange={(e) => setEditForm({ ...editForm, seats: parseInt(e.target.value) || 0 })}
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Booked
                      </label>
                      <input
                        type="number"
                        value={editForm.booked}
                        onChange={(e) => setEditForm({ ...editForm, booked: parseInt(e.target.value) || 0 })}
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-medium text-gray-700 mb-1">
                        Remaining
                      </label>
                      <input
                        type="number"
                        value={remainingSeats}
                        readOnly
                        className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-gray-50"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Price
                    </label>
                    <input
                      type="text"
                      value={`₦${editForm.price.toLocaleString()}.00`}
                      onChange={(e) => {
                        const value = e.target.value.replace(/[₦,]/g, '');
                        const numValue = parseInt(value) || 0;
                        setEditForm({ ...editForm, price: numValue });
                      }}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Status
                    </label>
                    <select
                      value={editForm.status}
                      onChange={(e) => setEditForm({ ...editForm, status: e.target.value as 'Active' | 'Synced' })}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    >
                      <option>Active</option>
                      <option>Synced</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Type
                    </label>
                    <select
                      value={editForm.type}
                      onChange={(e) => setEditForm({ ...editForm, type: e.target.value as 'Manual' | 'API' })}
                      className="w-full h-10 px-3 rounded-lg border border-gray-200 text-sm text-gray-900 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    >
                      <option>Manual</option>
                      <option>API</option>
                    </select>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 mt-6 pt-6 border-t border-gray-200">
                  <button className="flex-1 h-10 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#014d6b] transition-colors">
                    Deactivate Trip
                  </button>
                  <button className="flex-1 h-10 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                    Save Changes
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
