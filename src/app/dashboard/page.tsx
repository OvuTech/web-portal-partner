'use client';

import { 
  TrendingUp, 
  TrendingDown, 
  Ticket, 
  Users, 
  DollarSign, 
  Calendar,
  Upload,
  FileText,
  Download,
  Bell,
  ChevronDown,
  Wallet
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';

const stats = [
  {
    title: 'Total Bookings',
    value: '1,567',
    date: '18th October 2025',
    change: '+12.5%',
    trend: 'up',
    icon: Ticket,
    iconBg: '#0B5B7A1A', // Light blue
    iconColor: 'text-white',
  },
  {
    title: 'Seats Filled',
    value: '20',
    change: '+12.5%',
    trend: 'up',
    icon: Users,
    iconBg: '#FFC1071A', // Light yellow
    iconColor: 'text-gray-700',
  },
  {
    title: 'Pending Confirmations',
    value: '50',
    change: '-12.5%',
    trend: 'down',
    icon: Calendar,
    iconBg: '#4CAF501A', // Light green
    iconColor: 'text-gray-700',
  },
  {
    title: 'Total Revenue & Payout',
    value: formatCurrency(1500000),
    change: '+12.5%',
    trend: 'up',
    icon: DollarSign,
    iconBg: '#0B5B7A1A', // Light blue
    iconColor: 'text-gray-700',
  },
];

const actionCards = [
  {
    title: 'Upload Schedule',
    description: 'Add new bus/flight schedules manually.',
    buttonText: 'Upload',
    icon: Upload,
  },
  {
    title: 'View Payout Summary',
    description: 'Review settlements & reconciliation reports.',
    buttonText: 'Open',
    icon: Wallet,
  },
  {
    title: 'Download Manifest',
    description: 'Get today\'s passenger list for confirmed trips.',
    buttonText: 'Download',
    icon: FileText,
  },
];

// Daily booking trend data
const bookingTrendData = [
  { date: '28 Oct', Confirmed: 45, Pending: 20, Cancelled: 5 },
  { date: '29 Oct', Confirmed: 52, Pending: 18, Cancelled: 3 },
  { date: '30 Oct', Confirmed: 48, Pending: 22, Cancelled: 7 },
  { date: '31 Oct', Confirmed: 60, Pending: 15, Cancelled: 4 },
  { date: '01 Nov', Confirmed: 55, Pending: 19, Cancelled: 6 },
  { date: '02 Nov', Confirmed: 58, Pending: 17, Cancelled: 5 },
  { date: '03 Nov', Confirmed: 62, Pending: 14, Cancelled: 3 },
];

// Top routes data
const routesData = [
  { name: 'Lagos → Abuja', value: 40, color: '#0B5B7A' },
  { name: 'Abuja → Enugu', value: 25, color: '#4CAF50' },
  { name: 'Lagos → Owerri', value: 20, color: '#FFC107' },
  { name: 'Others', value: 15, color: '#F44336' },
];

const notifications = [
  {
    id: 1,
    message: 'New Booking received BK-009 has been created by Sarah Johnson',
    time: '2 minutes ago',
  },
  {
    id: 2,
    message: 'Payment confirmed for booking BK-008',
    time: '15 minutes ago',
  },
  {
    id: 3,
    message: 'Schedule updated for route Lagos → Abuja',
    time: '1 hour ago',
  },
];

const COLORS = ['#0B5B7A', '#4CAF50', '#FFC107', '#F44336'];

export default function DashboardPage() {
  return (
    <div className="space-y-6">
      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 md:gap-6">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div 
              key={stat.title} 
              className="bg-white rounded-[10px] border border-gray-200 relative w-full lg:w-[337px] h-[162px]"
            >
              <div className="p-4 h-full flex flex-col justify-between">
                <div className="flex flex-col" style={{ gap: '16px' }}>
                  <div>
                    <p className="text-sm text-gray-600 mb-1">{stat.title}</p>
                  </div>
                  <div>
                    <div className="flex items-center justify-between mb-2">
                      <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                      <div 
                        className="w-[42px] h-[42px] rounded-[5px] flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: stat.iconBg }}
                      >
                        <Icon className={`h-6 w-6 ${stat.iconColor}`} />
                      </div>
                    </div>
                    {stat.title === 'Total Bookings' && stat.date ? (
                      <p className="text-xs text-gray-400">{stat.date}</p>
                    ) : stat.title !== 'Total Bookings' ? (
                      <span className={`flex items-center gap-1 text-sm font-medium ${
                        stat.trend === 'up' ? 'text-green-600' : 'text-red-600'
                      }`}>
                        {stat.trend === 'up' ? (
                          <TrendingUp className="h-4 w-4" />
                        ) : (
                          <TrendingDown className="h-4 w-4" />
                        )}
                        {stat.change}
                      </span>
                    ) : null}
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Action Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        {actionCards.map((card) => {
          const Icon = card.icon;
          return (
            <div key={card.title} className="bg-blue-50 rounded-xl border border-gray-200 p-4 md:p-6">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 rounded-lg bg-ovu-primary/10 flex items-center justify-center flex-shrink-0">
                  <Icon className="h-5 w-5 text-ovu-primary" />
                </div>
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-gray-900 mb-1">{card.title}</h3>
                  <p className="text-sm text-gray-500">{card.description}</p>
                </div>
                <button className="bg-ovu-primary text-white py-2 px-4 rounded-lg hover:bg-ovu-secondary transition-colors font-medium whitespace-nowrap">
                  {card.buttonText}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Daily Booking Trend Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="text-lg font-semibold text-gray-900">Daily Booking Trend</h2>
            <div className="flex items-center gap-2">
              <select className="text-sm border border-gray-200 rounded-lg px-3 py-1.5 focus:outline-none focus:ring-2 focus:ring-ovu-primary/20">
                <option>This week</option>
                <option>This month</option>
                <option>This year</option>
              </select>
            </div>
          </div>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={bookingTrendData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="date" stroke="#666" />
              <YAxis stroke="#666" />
              <Tooltip />
              <Legend />
              <Line type="monotone" dataKey="Confirmed" stroke="#4CAF50" strokeWidth={2} />
              <Line type="monotone" dataKey="Pending" stroke="#FFC107" strokeWidth={2} />
              <Line type="monotone" dataKey="Cancelled" stroke="#F44336" strokeWidth={2} />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Top Routes Chart */}
        <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
          <h2 className="text-lg font-semibold text-gray-900 mb-6">Top Routes by Booking Volume</h2>
          <div className="flex items-center justify-center">
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={routesData}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                  outerRadius={100}
                  fill="#8884d8"
                  dataKey="value"
                >
                  {routesData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </div>
          <div className="mt-4 space-y-2">
            {routesData.map((route, index) => (
              <div key={route.name} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: COLORS[index % COLORS.length] }}
                  />
                  <span className="text-gray-600">{route.name}</span>
                </div>
                <span className="font-medium text-gray-900">{route.value}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Notifications Section */}
      <div className="bg-white rounded-xl border border-gray-200 p-4 md:p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center gap-2">
            <Bell className="h-5 w-5 text-gray-600" />
            <h2 className="text-lg font-semibold text-gray-900">Notifications</h2>
          </div>
          <button className="text-sm text-ovu-primary font-medium hover:underline">
            View all
          </button>
        </div>
        <div className="space-y-3">
          {notifications.map((notification) => (
            <div key={notification.id} className="p-3 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors">
              <p className="text-sm text-gray-900">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
