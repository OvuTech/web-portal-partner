'use client';

import { useState } from 'react';
import { Search, Download, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';

interface ManifestTrip {
  id: string;
  tripId: string;
  route: string;
  date: string;
  vehicleNo: string;
  status: 'Generated' | 'Awaiting Confirmation' | 'Failed / Cancelled';
}

interface ManifestPassenger {
  id: string;
  passenger: string;
  seat: string;
  phone: string;
  bookingId: string;
  paymentStatus: 'Paid' | 'Pending' | 'Failed';
}

const mockTrips: ManifestTrip[] = [
  {
    id: '1',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Generated',
  },
  {
    id: '2',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Generated',
  },
  {
    id: '3',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Awaiting Confirmation',
  },
  {
    id: '4',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Generated',
  },
  {
    id: '5',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Failed / Cancelled',
  },
  {
    id: '6',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Generated',
  },
  {
    id: '7',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Generated',
  },
  {
    id: '8',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Generated',
  },
  {
    id: '9',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Generated',
  },
  {
    id: '10',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Generated',
  },
  {
    id: '11',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Generated',
  },
  {
    id: '12',
    tripId: 'TRP - 0093',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    date: '22 Oct',
    vehicleNo: 'ABC-233-LAG',
    status: 'Generated',
  },
];

const mockPassengers: ManifestPassenger[] = [
  { id: '1', passenger: 'Ajayi Oluwatobiloba', seat: '2B', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
  { id: '2', passenger: 'Ajayi Oluwatobiloba', seat: '13', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
  { id: '3', passenger: 'Endurance idahugbe', seat: '2A', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
  { id: '4', passenger: 'Solomon Rondon', seat: '5', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
  { id: '5', passenger: 'Beatrice Lawanson', seat: '6', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
  { id: '6', passenger: 'godswill Akpabio', seat: '4', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
  { id: '7', passenger: 'Ajayi Oluwatobiloba', seat: '3', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
  { id: '8', passenger: 'Ajayi Oluwatobiloba', seat: '2', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
  { id: '9', passenger: 'Ajayi Oluwatobiloba', seat: '12', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
  { id: '10', passenger: 'Ajayi Oluwatobiloba', seat: '10', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
  { id: '11', passenger: 'Ajayi Oluwatobiloba', seat: '9', phone: '08123456789', bookingId: 'OVU - 33214', paymentStatus: 'Paid' },
];

const statusConfig = {
  'Generated': { label: 'Generated', className: 'bg-green-100 text-green-700', dotClass: 'bg-green-500' },
  'Awaiting Confirmation': { label: 'Awaiting Confirmation', className: 'bg-yellow-100 text-yellow-700', dotClass: 'bg-yellow-500' },
  'Failed / Cancelled': { label: 'Failed / Cancelled', className: 'bg-red-100 text-red-700', dotClass: 'bg-red-500' },
};

export default function UploadsPage() {
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedTrip, setSelectedTrip] = useState<ManifestTrip | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  const handleDownload = (trip: ManifestTrip) => {
    if (trip.status === 'Generated') {
      setSelectedTrip(trip);
      setIsModalOpen(true);
    }
  };

  return (
    <div className="space-y-6">
      {/* Search and Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
          <input
            type="text"
            placeholder="Search with booking ID or Trip Name"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full h-10 pl-10 pr-4 rounded-lg border border-gray-200 text-sm placeholder:text-gray-400 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
          />
        </div>
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
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Trip ID</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Route</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Date</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Vehicle / Flight No</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Status</th>
                <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Action</th>
              </tr>
            </thead>
            <tbody>
              {mockTrips.map((trip) => {
                const status = statusConfig[trip.status];
                return (
                  <tr key={trip.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900">{trip.tripId}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{trip.route}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{trip.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">{trip.vehicleNo}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                        status.className
                      )}>
                        <span className={cn('w-1.5 h-1.5 rounded-full', status.dotClass)} />
                        {status.label}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {trip.status === 'Generated' ? (
                        <button
                          onClick={() => handleDownload(trip)}
                          className="flex items-center gap-1.5 text-sm text-[#0B5B7A] hover:underline font-medium"
                        >
                          <Download className="h-4 w-4" />
                          Download
                        </button>
                      ) : trip.status === 'Awaiting Confirmation' ? (
                        <button disabled className="flex items-center gap-1.5 text-sm text-gray-400 cursor-not-allowed">
                          <Download className="h-4 w-4" />
                        </button>
                      ) : (
                        <span className="text-sm text-gray-400">N/A</span>
                      )}
                    </td>
                  </tr>
                );
              })}
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

      {/* Download Manifest Modal */}
      <Dialog.Root open={isModalOpen} onOpenChange={setIsModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-4xl bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            {selectedTrip && (
              <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Download Manifest - {selectedTrip.route.split(' - ').map((part, i) => {
                      if (i === 0) return part;
                      // Capitalize first letter inside parentheses
                      return part.replace(/\(([a-z])/, (match, letter) => `(${letter.toUpperCase()}`);
                    }).join(' → ')}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedTrip.date.includes('Oct') ? selectedTrip.date.replace('Oct', 'Oct 2025') : selectedTrip.date}
                  </p>
                </div>

                {/* Passengers Table */}
                <div className="mb-6 overflow-x-auto">
                  <table className="w-full">
                    <thead>
                      <tr className="border-b border-gray-100">
                        <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Passenger</th>
                        <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Seat</th>
                        <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Phone</th>
                        <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Booking ID</th>
                        <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Payment Status</th>
                      </tr>
                    </thead>
                    <tbody>
                      {mockPassengers.map((passenger) => (
                        <tr key={passenger.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                          <td className="py-3 px-4 text-sm text-gray-900">{passenger.passenger}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{passenger.seat}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{passenger.phone}</td>
                          <td className="py-3 px-4 text-sm text-gray-600">{passenger.bookingId}</td>
                          <td className="py-3 px-4">
                            <span className={cn(
                              'inline-flex items-center px-2.5 py-1 rounded-full text-xs font-medium',
                              passenger.paymentStatus === 'Paid'
                                ? 'bg-green-100 text-green-700'
                                : passenger.paymentStatus === 'Pending'
                                ? 'bg-yellow-100 text-yellow-700'
                                : 'bg-red-100 text-red-700'
                            )}>
                              {passenger.paymentStatus}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>

                {/* Action Buttons */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Send to Email
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Download CSV
                  </button>
                  <button
                    onClick={() => setIsModalOpen(false)}
                    className="h-10 px-4 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#094A63] transition-colors"
                  >
                    Download PDF
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
