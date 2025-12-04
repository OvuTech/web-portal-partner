'use client';

import { useState } from 'react';
import { 
  ChevronDown,
  ChevronLeft,
  ChevronRight,
  Download,
  ArrowUpDown,
  X,
  Upload,
  Cloud
} from 'lucide-react';
import { cn, formatCurrency } from '@/lib/utils';
import * as Dialog from '@radix-ui/react-dialog';

interface Payout {
  id: string;
  date: string;
  route: string;
  totalSales: number;
  payout: number;
  status: 'Processing' | 'Paid';
}

interface Reconciliation {
  id: string;
  date: string;
  trip: string;
  ovuRecord: number;
  operatorRecord: number;
  difference: number;
}

interface Dispute {
  id: string;
  disputeId: string;
  trip: string;
  amount: number;
  reason: string;
  status: 'Under Review' | 'Resolved';
  date?: string;
  description?: string;
  evidence?: string;
  resolutionDate?: string;
  resolutionSummary?: string;
  responses?: Array<{
    action: string;
    time: string;
    date: string;
  }>;
}

const mockPayouts: Payout[] = [
  {
    id: '1',
    date: '20 Oct',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    totalSales: 210000,
    payout: 200000,
    status: 'Processing',
  },
  {
    id: '2',
    date: '20 Oct',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    totalSales: 210000,
    payout: 200000,
    status: 'Paid',
  },
  {
    id: '3',
    date: '20 Oct',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    totalSales: 210000,
    payout: 200000,
    status: 'Paid',
  },
  {
    id: '4',
    date: '20 Oct',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    totalSales: 210000,
    payout: 200000,
    status: 'Paid',
  },
  {
    id: '5',
    date: '20 Oct',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    totalSales: 210000,
    payout: 200000,
    status: 'Paid',
  },
  {
    id: '6',
    date: '20 Oct',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    totalSales: 210000,
    payout: 200000,
    status: 'Paid',
  },
  {
    id: '7',
    date: '20 Oct',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    totalSales: 210000,
    payout: 200000,
    status: 'Paid',
  },
  {
    id: '8',
    date: '20 Oct',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    totalSales: 210000,
    payout: 200000,
    status: 'Paid',
  },
  {
    id: '9',
    date: '20 Oct',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    totalSales: 210000,
    payout: 200000,
    status: 'Paid',
  },
  {
    id: '10',
    date: '20 Oct',
    route: 'Lagos (Iyanapaja) - Benin (uselu)',
    totalSales: 210000,
    payout: 200000,
    status: 'Paid',
  },
];

const mockReconciliations: Reconciliation[] = [
  {
    id: '1',
    date: '20 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 180000,
    operatorRecord: 185000,
    difference: 5000,
  },
  {
    id: '2',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '3',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '4',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '5',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '6',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '7',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '8',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '9',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '10',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '11',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '12',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '13',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
  {
    id: '14',
    date: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    ovuRecord: 159000,
    operatorRecord: 159000,
    difference: 0,
  },
];

const mockDisputes: Dispute[] = [
  {
    id: '1',
    disputeId: 'DP-0094',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 25000,
    reason: 'Missing Settlement',
    status: 'Under Review',
    date: '20 October 2025',
    description: 'Bank deducted convenience fee twice.',
    evidence: 'Settlement.Jpg',
    resolutionDate: '20th Oct 2025',
    resolutionSummary: 'Lorem ipsum dolor sit amet, consectetur adipiscing elit. Nunc dictum tellus eu lacus fermentum suscipit. Donec vestibulum aliquet massa, quis eleifend elit ornare non. Sed pellentesque elit id massa porta dapibus.',
    responses: [
      { action: 'Review Submitted', time: '08:00', date: '23 Oct' },
      { action: 'Dispute Ticket created', time: '08:00', date: '23 Oct' },
      { action: 'Refund Credited', time: '08:00', date: '23 Oct' },
      { action: 'Dispute Resolved', time: '08:00', date: '23 Oct' },
    ],
  },
  {
    id: '2',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
    date: '19 October 2025',
    description: 'incorrect AMount',
    resolutionDate: '19th Oct 2025',
    resolutionSummary: 'The dispute has been resolved and the incorrect amount has been corrected.',
    responses: [
      { action: 'Review Submitted', time: '08:00', date: '19 Oct' },
      { action: 'Dispute Resolved', time: '10:00', date: '19 Oct' },
    ],
  },
  {
    id: '3',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '4',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '5',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '6',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '7',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '8',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '9',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '10',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '11',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '12',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '13',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
  {
    id: '14',
    disputeId: '19 Oct',
    trip: 'Lagos (Iyanapaja) - Benin (uselu)',
    amount: 12000,
    reason: 'incorrect AMount',
    status: 'Resolved',
  },
];

export default function PayoutsPage() {
  const [activeTab, setActiveTab] = useState<'summary' | 'reconciliation' | 'disputes'>('summary');
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDispute, setSelectedDispute] = useState<Dispute | null>(null);
  const [isDisputeModalOpen, setIsDisputeModalOpen] = useState(false);
  const [selectedReconciliation, setSelectedReconciliation] = useState<Reconciliation | null>(null);
  const [isReconciliationModalOpen, setIsReconciliationModalOpen] = useState(false);
  const [operatorRecord, setOperatorRecord] = useState('');
  const [reasonForDifference, setReasonForDifference] = useState('');
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleViewDispute = (dispute: Dispute) => {
    setSelectedDispute(dispute);
    setIsDisputeModalOpen(true);
  };

  const handleReviewReconciliation = (recon: Reconciliation) => {
    setSelectedReconciliation(recon);
    setOperatorRecord(recon.operatorRecord.toString());
    setReasonForDifference('');
    setSelectedFile(null);
    setIsReconciliationModalOpen(true);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFile(file);
    }
  };

  const handleSubmitReconciliation = () => {
    // Handle submission logic here
    console.log('Submitting reconciliation:', {
      reconciliation: selectedReconciliation,
      operatorRecord,
      reasonForDifference,
      file: selectedFile,
    });
    setIsReconciliationModalOpen(false);
  };

  const tabs = [
    { id: 'summary', label: 'Payout Summary' },
    { id: 'reconciliation', label: 'Reconciliation' },
    { id: 'disputes', label: 'Disputes' },
  ];

  return (
    <div className="space-y-6">
      {/* Description */}
      <p className="text-sm text-gray-500">
        Overview of all payments, settlements, commissions, and reconciliation details
      </p>

      {/* Tabs and Filters */}
      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        {/* Tabs */}
        <div className="flex gap-2">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as 'summary' | 'reconciliation' | 'disputes')}
              className={cn(
                'px-4 py-2 rounded-lg text-sm font-medium transition-colors',
                activeTab === tab.id
                  ? 'bg-[#0B5B7A] text-white'
                  : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
              )}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* Filters */}
        <div className="flex items-center gap-3">
          <button className="flex items-center gap-2 h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white hover:bg-gray-50">
            <ArrowUpDown className="h-4 w-4" />
            Status
          </button>
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
          <select className="h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-700 bg-white focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]">
            <option>Export</option>
            <option>Export as CSV</option>
            <option>Export as PDF</option>
          </select>
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-gray-100">
                {activeTab === 'summary' ? (
                  <>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Route</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Total Sales</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Payout</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Status</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Action</th>
                  </>
                ) : activeTab === 'reconciliation' ? (
                  <>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Date</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Trip</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">OVU Record</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Operator record</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Difference</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Action</th>
                  </>
                ) : (
                  <>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Dispute ID</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Trip</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Amount</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Reason</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Status</th>
                    <th className="text-left text-xs font-medium text-gray-500 py-3 px-4">Action</th>
                  </>
                )}
              </tr>
            </thead>
            <tbody>
              {activeTab === 'summary' ? (
                mockPayouts.map((payout) => (
                  <tr key={payout.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900">{payout.date}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{payout.route}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">₦{payout.totalSales.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">₦{payout.payout.toLocaleString()}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                        payout.status === 'Paid' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      )}>
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          payout.status === 'Paid' ? 'bg-green-500' : 'bg-yellow-500'
                        )} />
                        {payout.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      {payout.status === 'Processing' ? (
                        <span className="text-sm text-gray-400">-</span>
                      ) : (
                        <button className="text-sm text-[#0B5B7A] hover:underline font-medium">
                          View Breakdown
                        </button>
                      )}
                    </td>
                  </tr>
                ))
              ) : activeTab === 'reconciliation' ? (
                mockReconciliations.map((recon) => {
                  const hasDifference = recon.difference !== 0;
                  return (
                    <tr 
                      key={recon.id} 
                      className={cn(
                        'hover:bg-gray-50 transition-colors',
                        hasDifference ? 'border-b-2 border-red-500' : 'border-b border-green-200'
                      )}
                    >
                      <td className="py-3 px-4 text-sm text-gray-900">{recon.date}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{recon.trip}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">₦{recon.ovuRecord.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">₦{recon.operatorRecord.toLocaleString()}</td>
                      <td className="py-3 px-4 text-sm text-gray-900">
                        {recon.difference === 0 ? '₦0.00' : `₦${recon.difference.toLocaleString()}`}
                      </td>
                      <td className="py-3 px-4">
                        {hasDifference ? (
                          <button 
                            onClick={() => handleReviewReconciliation(recon)}
                            className="text-sm text-[#0B5B7A] hover:underline font-medium"
                          >
                            Review
                          </button>
                        ) : (
                          <span className="text-sm text-green-600 font-medium">Matched</span>
                        )}
                      </td>
                    </tr>
                  );
                })
              ) : (
                mockDisputes.map((dispute) => (
                  <tr key={dispute.id} className="border-b border-gray-50 hover:bg-gray-50 transition-colors">
                    <td className="py-3 px-4 text-sm text-gray-900">{dispute.disputeId}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{dispute.trip}</td>
                    <td className="py-3 px-4 text-sm text-gray-900">₦{dispute.amount.toLocaleString()}</td>
                    <td className="py-3 px-4 text-sm text-gray-600">{dispute.reason}</td>
                    <td className="py-3 px-4">
                      <span className={cn(
                        'inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-medium',
                        dispute.status === 'Resolved' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-yellow-100 text-yellow-700'
                      )}>
                        <span className={cn(
                          'w-1.5 h-1.5 rounded-full',
                          dispute.status === 'Resolved' ? 'bg-green-500' : 'bg-yellow-500'
                        )} />
                        {dispute.status}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <button 
                        onClick={() => handleViewDispute(dispute)}
                        className="text-sm text-[#0B5B7A] hover:underline font-medium"
                      >
                        {dispute.status === 'Resolved' ? 'View Report' : 'View'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
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

      {/* Dispute Detail Modal */}
      <Dialog.Root open={isDisputeModalOpen} onOpenChange={setIsDisputeModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-2xl bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            {selectedDispute && (
              <div className="p-6">
                {/* Header */}
                <div className="flex items-start justify-between mb-6">
                  <div>
                    <h2 className="text-xl font-semibold text-gray-900 mb-1">
                      {selectedDispute.disputeId} Dispute
                    </h2>
                    {selectedDispute.resolutionDate && (
                      <p className="text-sm text-gray-500">
                        {selectedDispute.resolutionDate} - {selectedDispute.status === 'Resolved' ? 'Paid' : 'Under Review'}
                      </p>
                    )}
                  </div>
                  <button
                    onClick={() => setIsDisputeModalOpen(false)}
                    className="h-10 px-4 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#094A63] transition-colors"
                  >
                    Raise New Dispute
                  </button>
                </div>

                {/* Dispute Details */}
                <div className="space-y-4 mb-6">
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Date</label>
                    <p className="text-sm text-gray-900">{selectedDispute.date || 'N/A'}</p>
                  </div>
                  <div>
                    <label className="text-xs font-medium text-gray-500 mb-1 block">Description</label>
                    <p className="text-sm text-gray-900">{selectedDispute.description || selectedDispute.reason}</p>
                  </div>
                  {selectedDispute.evidence && (
                    <div>
                      <label className="text-xs font-medium text-gray-500 mb-1 block">Attached Evidence</label>
                      <a 
                        href="#" 
                        className="text-sm text-[#0B5B7A] hover:underline"
                      >
                        {selectedDispute.evidence}
                      </a>
                    </div>
                  )}
                </div>

                {/* OVU's Responses */}
                {selectedDispute.responses && selectedDispute.responses.length > 0 && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-4">OVU's Responses</h3>
                    <div className="space-y-3">
                      {selectedDispute.responses.map((response, index) => (
                        <div key={index} className="flex items-center gap-3 pb-3 border-b border-gray-100 last:border-0">
                          <div className="flex-1">
                            <p className="text-sm text-gray-900">{response.action}</p>
                          </div>
                          <div className="text-sm text-gray-500">
                            {response.time} | {response.date}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Resolution Summary */}
                {selectedDispute.resolutionSummary && (
                  <div className="mb-6">
                    <h3 className="text-sm font-semibold text-gray-900 mb-2">Resolution Summary</h3>
                    <p className="text-sm text-gray-600 leading-relaxed">
                      {selectedDispute.resolutionSummary}
                    </p>
                  </div>
                )}

                {/* Close Button */}
                <div className="flex justify-center pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setIsDisputeModalOpen(false)}
                    className="h-10 px-6 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                  >
                    Close
                  </button>
                </div>
              </div>
            )}
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Reconciliation Modal */}
      <Dialog.Root open={isReconciliationModalOpen} onOpenChange={setIsReconciliationModalOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            {selectedReconciliation && (
              <div className="p-6">
                {/* Header */}
                <div className="mb-6">
                  <h2 className="text-xl font-semibold text-gray-900 mb-1">
                    Reconcile Trip - {selectedReconciliation.trip.split(' - ').map((part, i) => {
                      if (i === 0) return part;
                      // Capitalize first letter inside parentheses (e.g., "uselu" -> "Uselu")
                      return part.replace(/\(([a-z])/, (match, letter) => `(${letter.toUpperCase()}`);
                    }).join(' → ')}
                  </h2>
                  <p className="text-sm text-gray-500">
                    {selectedReconciliation.date.includes('Oct') ? selectedReconciliation.date.replace('Oct', 'Oct 2025') : selectedReconciliation.date} - Paid
                  </p>
                </div>

                {/* OVU Recorded Amount */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    OVU Recorded Amount
                  </label>
                  <p className="text-sm text-gray-900 font-medium">
                    ₦{selectedReconciliation.ovuRecord.toLocaleString()}
                  </p>
                </div>

                {/* Operator's Record */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Operator's Record
                  </label>
                  <input
                    type="text"
                    value={operatorRecord}
                    onChange={(e) => setOperatorRecord(e.target.value)}
                    placeholder="₦0.00"
                    className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                  />
                </div>

                {/* Reason for Difference */}
                <div className="mb-4">
                  <label className="text-xs font-medium text-gray-500 mb-1 block">
                    Reason for Difference
                  </label>
                  <textarea
                    value={reasonForDifference}
                    onChange={(e) => setReasonForDifference(e.target.value)}
                    placeholder="Type here"
                    rows={4}
                    className="w-full px-4 py-3 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A] resize-none"
                  />
                </div>

                {/* Upload Evidence */}
                <div className="mb-6">
                  <label className="text-xs font-medium text-gray-500 mb-2 block">
                    Upload Evidence
                  </label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-[#0B5B7A] transition-colors">
                    <input
                      type="file"
                      id="file-upload"
                      onChange={handleFileChange}
                      accept=".jpeg,.png,.jpg,.pdf"
                      className="hidden"
                    />
                    <label htmlFor="file-upload" className="cursor-pointer">
                      <Cloud className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                      <p className="text-sm text-gray-700 font-medium mb-1">
                        Choose a file or drag & drop it here
                      </p>
                      <p className="text-xs text-gray-500 mb-3">
                        JPEG, PNG, JPG, PDF formats, up to 3mb
                      </p>
                      {selectedFile ? (
                        <p className="text-sm text-[#0B5B7A] font-medium">
                          {selectedFile.name}
                        </p>
                      ) : (
                        <button
                          type="button"
                          onClick={() => document.getElementById('file-upload')?.click()}
                          className="h-10 px-4 bg-gray-100 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-200 transition-colors"
                        >
                          Browse File
                        </button>
                      )}
                    </label>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-3 pt-4 border-t border-gray-100">
                  <button
                    onClick={() => setIsReconciliationModalOpen(false)}
                    className="flex-1 h-10 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={handleSubmitReconciliation}
                    className="flex-1 h-10 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#094A63] transition-colors"
                  >
                    Submit for review
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
