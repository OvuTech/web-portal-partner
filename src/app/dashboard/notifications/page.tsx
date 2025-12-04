'use client';

import { useState } from 'react';
import { Bell, CheckCircle, AlertCircle, Info, Trash2, CheckCheck, Filter } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Notification {
  id: string;
  type: 'success' | 'warning' | 'info';
  title: string;
  message: string;
  time: string;
  read: boolean;
}

const mockNotifications: Notification[] = [
  { id: '1', type: 'success', title: 'Booking Confirmed', message: 'Booking OVU-45921 has been confirmed for Lagos → Abuja trip.', time: '2 min ago', read: false },
  { id: '2', type: 'info', title: 'New Booking', message: 'You have a new booking request for Lagos → Port Harcourt on Dec 15.', time: '15 min ago', read: false },
  { id: '3', type: 'warning', title: 'Payment Pending', message: 'Payment for booking OVU-45918 is still pending.', time: '1 hour ago', read: false },
  { id: '4', type: 'success', title: 'Payout Completed', message: 'Your weekly payout of ₦350,000 has been processed.', time: '3 hours ago', read: true },
  { id: '5', type: 'info', title: 'Schedule Update', message: 'Your schedule for tomorrow has been updated.', time: '5 hours ago', read: true },
  { id: '6', type: 'success', title: 'Booking Confirmed', message: 'Booking OVU-45920 has been confirmed.', time: '1 day ago', read: true },
  { id: '7', type: 'warning', title: 'Vehicle Maintenance', message: 'Vehicle ABC-233-LAG is due for maintenance.', time: '2 days ago', read: true },
];

const typeConfig = {
  success: { icon: CheckCircle, className: 'bg-green-100 text-green-600' },
  warning: { icon: AlertCircle, className: 'bg-yellow-100 text-yellow-600' },
  info: { icon: Info, className: 'bg-blue-100 text-blue-600' },
};

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState(mockNotifications);
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const unreadCount = notifications.filter(n => !n.read).length;
  const filteredNotifications = filter === 'unread' ? notifications.filter(n => !n.read) : notifications;

  const markAllAsRead = () => {
    setNotifications(notifications.map(n => ({ ...n, read: true })));
  };

  const markAsRead = (id: string) => {
    setNotifications(notifications.map(n => n.id === id ? { ...n, read: true } : n));
  };

  const deleteNotification = (id: string) => {
    setNotifications(notifications.filter(n => n.id !== id));
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-end">
        <button
          onClick={markAllAsRead}
          className="flex items-center gap-2 h-10 px-4 border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50"
        >
          <CheckCheck className="h-4 w-4" />
          Mark all as read
        </button>
      </div>

      {/* Filters */}
      <div className="flex gap-2">
        <button
          onClick={() => setFilter('all')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg', filter === 'all' ? 'bg-ovu-primary text-white' : 'text-gray-600 hover:bg-gray-100')}
        >
          All
        </button>
        <button
          onClick={() => setFilter('unread')}
          className={cn('px-4 py-2 text-sm font-medium rounded-lg', filter === 'unread' ? 'bg-ovu-primary text-white' : 'text-gray-600 hover:bg-gray-100')}
        >
          Unread ({unreadCount})
        </button>
      </div>

      {/* Notifications List */}
      <div className="bg-white rounded-xl shadow-sm overflow-hidden">
        {filteredNotifications.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12">
            <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
              <Bell className="h-8 w-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No notifications</h3>
            <p className="text-sm text-gray-500">You're all caught up!</p>
          </div>
        ) : (
          <div className="divide-y divide-gray-100">
            {filteredNotifications.map((notification) => {
              const config = typeConfig[notification.type];
              const Icon = config.icon;

              return (
                <div
                  key={notification.id}
                  className={cn('flex items-start gap-4 p-4 hover:bg-gray-50 transition-colors', !notification.read && 'bg-blue-50/50')}
                >
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', config.className)}>
                    <Icon className="h-5 w-5" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className={cn('text-sm font-medium', notification.read ? 'text-gray-700' : 'text-gray-900')}>
                          {notification.title}
                        </h3>
                        <p className="text-sm text-gray-500 mt-0.5">{notification.message}</p>
                        <p className="text-xs text-gray-400 mt-1">{notification.time}</p>
                      </div>
                      <div className="flex items-center gap-1 shrink-0">
                        {!notification.read && (
                          <button
                            onClick={() => markAsRead(notification.id)}
                            className="p-2 hover:bg-gray-100 rounded-lg"
                            title="Mark as read"
                          >
                            <CheckCircle className="h-4 w-4 text-gray-400" />
                          </button>
                        )}
                        <button
                          onClick={() => deleteNotification(notification.id)}
                          className="p-2 hover:bg-red-50 rounded-lg"
                          title="Delete"
                        >
                          <Trash2 className="h-4 w-4 text-red-400" />
                        </button>
                      </div>
                    </div>
                  </div>
                  {!notification.read && (
                    <div className="w-2 h-2 rounded-full bg-ovu-primary shrink-0 mt-2" />
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

