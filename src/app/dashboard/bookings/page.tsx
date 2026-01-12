'use client';

import { useState } from 'react';
import { Search, SlidersHorizontal, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';
import { Input } from '@/components/ui/input';

interface Booking {
  id: string;
  bookingId: string;
  passenger: string;
  route: string;
  date: string;
  seat: string;
  status: 'confirmed' | 'awaiting' | 'cancelled' | 'refunded' | 'checked-in';
  payment: number;
}

// Mock data matching Figma design
const mockBookings: Booking[] = [
  { id: '1', bookingId: 'OVU-45921', passenger: 'A. Oluwatobiloba', route: 'Lagos → Abuja', date: '21 Oct', seat: '8A', status: 'confirmed', payment: 210000 },
  { id: '2', bookingId: 'OVU-45921', passenger: 'A. Idagbue', route: 'Lagos → Abuja', date: '21 Oct', seat: '8A', status: 'awaiting', payment: 210000 },
  { id: '3', bookingId: 'OVU-45921', passenger: 'A. Idagbue', route: 'Lagos → Abuja', date: '21 Oct', seat: '8A', status: 'cancelled', payment: 210000 },
  { id: '4', bookingId: 'OVU-45921', passenger: 'A. Idagbue', route: 'Lagos → Abuja', date: '21 Oct', seat: '8A', status: 'refunded', payment: 210000 },
  { id: '5', bookingId: 'OVU-45921', passenger: 'A. Idagbue', route: 'Lagos → Abuja', date: '21 Oct', seat: '8A', status: 'checked-in', payment: 210000 },
  { id: '6', bookingId: 'OVU-45921', passenger: 'A. Idagbue', route: 'Lagos → Abuja', date: '21 Oct', seat: '8A', status: 'confirmed', payment: 210000 },
  { id: '7', bookingId: 'OVU-45921', passenger: 'A. Idagbue', route: 'Lagos → Abuja', date: '21 Oct', seat: '8A', status: 'confirmed', payment: 210000 },
  { id: '8', bookingId: 'OVU-45921', passenger: 'A. Idagbue', route: 'Lagos → Abuja', date: '21 Oct', seat: '8A', status: 'confirmed', payment: 210000 },
  { id: '9', bookingId: 'OVU-45921', passenger: 'A. Idagbue', route: 'Lagos → Abuja', date: '21 Oct', seat: '8A', status: 'confirmed', payment: 210000 },
  { id: '10', bookingId: 'OVU-45921', passenger: 'A. Idagbue', route: 'Lagos → Abuja', date: '21 Oct', seat: '8A', status: 'confirmed', payment: 210000 },
];

const statusConfig = {
  confirmed: { label: 'Confirmed', className: 'text-green-600', dotClass: 'bg-green-500' },
  awaiting: { label: 'Awaiting', className: 'text-yellow-600', dotClass: 'bg-yellow-500' },
  cancelled: { label: 'Cancelled', className: 'text-red-600', dotClass: 'bg-red-500' },
  refunded: { label: 'Refunded', className: 'text-purple-600', dotClass: 'bg-purple-500' },
  'checked-in': { label: 'Checked in', className: 'text-blue-600', dotClass: 'bg-blue-500' },
};

export default function BookingsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedBooking, setSelectedBooking] = useState<Booking | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);

  const handleViewBooking = (booking: Booking) => {
    setSelectedBooking(booking);
    setIsModalOpen(true);
  };

  return (
    <div className="h-full">
      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Header */}
        <div className="p-5 border-b border-gray-100">
          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 z-10" />
              <Input
                type="text"
                placeholder="search by passenger name, booking ID, or route."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full h-10 pl-10 bg-gray-50 focus:bg-white"
              />
            </div>
            <div className="flex gap-2">
              <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                <SlidersHorizontal className="h-4 w-4" />
                Filters
              </button>
              <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors cursor-pointer">
                Cheapest
                <ChevronDown className="h-4 w-4" />
              </button>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Booking ID</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Passenger</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Route</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Seat</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Payment</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockBookings.map((booking) => {
                const status = statusConfig[booking.status];

                return (
                  <tr
                    key={booking.id}
                    className="border-b border-gray-50 hover:bg-gray-50 transition-colors"
                  >
                    <td className="py-3 px-4 text-sm text-gray-900">{booking.bookingId}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{booking.passenger}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{booking.route}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{booking.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{booking.seat}</td>
                    <td className="py-3 px-4">
                      <span className={cn('inline-flex items-center gap-1.5 text-sm', status.className)}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', status.dotClass)} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4 text-sm text-gray-900">₦{booking.payment.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleViewBooking(booking)}
                        className="text-sm text-[#0B5B7A] hover:underline font-medium"
                      >
                        View
                      </button>
                    </td>
                  </tr>
                );
              })}
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

      {/* Booking Details Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-md bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            {selectedBooking && (
              <div className="p-6">
                {/* Modal Header */}
                <div className="mb-6">
                  <div className="flex items-center justify-between">
                    <p className="text-xs text-gray-500">Booking ID: {selectedBooking.bookingId}</p>
                    <span className={cn(
                      'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                      statusConfig[selectedBooking.status].className,
                      selectedBooking.status === 'confirmed' ? 'bg-green-100' : '',
                      selectedBooking.status === 'awaiting' ? 'bg-yellow-100' : '',
                      selectedBooking.status === 'cancelled' ? 'bg-red-100' : '',
                      selectedBooking.status === 'refunded' ? 'bg-purple-100' : '',
                      selectedBooking.status === 'checked-in' ? 'bg-blue-100' : ''
                    )}>
                      <span className={cn('w-1.5 h-1.5 rounded-full', statusConfig[selectedBooking.status].dotClass)} />
                      {statusConfig[selectedBooking.status].label}
                    </span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{selectedBooking.route}</p>
                </div>

                {/* Passenger Details */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Passenger Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Name</p>
                      <p className="text-sm text-gray-900">Ajayi Oluwatobiloba</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Phone</p>
                      <p className="text-sm text-gray-900">+234 8012345678</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Email</p>
                      <p className="text-sm text-gray-900">ajayioluwatobiloba@mail.com</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Seat No.</p>
                      <p className="text-sm text-gray-900">{selectedBooking.seat}</p>
                    </div>
                  </div>
                </div>

                {/* Trip Details */}
                <div className="mb-6">
                  <h3 className="text-sm font-semibold text-gray-900 mb-4">Trip Details</h3>
                  
                  <div className="space-y-3">
                    <div>
                      <p className="text-xs text-gray-500">Departure</p>
                      <p className="text-sm text-gray-900">Oct 21, 2025 - 8:00 AM</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Arrival</p>
                      <p className="text-sm text-gray-900">1:45 PM</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Price</p>
                      <p className="text-sm text-gray-900">₦{selectedBooking.payment.toLocaleString()}</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Vehicle</p>
                      <p className="text-sm text-gray-900">ABC-233-LAG</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Payment status</p>
                      <p className="text-sm text-gray-900">Paid via Wallet</p>
                    </div>
                    
                    <div>
                      <p className="text-xs text-gray-500">Booking Time</p>
                      <p className="text-sm text-gray-900">Oct 20, 09:22 PM</p>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button className="flex-1 h-10 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#014d6b] transition-colors cursor-pointer">
                    Confirm Seat
                  </button>
                  <button className="flex-1 h-10 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors cursor-pointer">
                    Decline Booking
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
