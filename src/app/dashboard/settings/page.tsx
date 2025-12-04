'use client';

import { useState } from 'react';
import { Bell, User, ChevronDown, Building2, Upload } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

const settingsTabs = [
  { id: 'profile', name: 'Profile' },
  { id: 'company', name: 'Company' },
  { id: 'notifications', name: 'Notifications' },
  { id: 'api', name: 'API Credentials' },
  { id: 'accessibility', name: 'Accessibility' },
  { id: 'payout', name: 'Payout & Bank Info' },
  { id: 'security', name: 'Security' },
  { id: 'compliance', name: 'Compliance & Documents' },
];

const notificationSettings = [
  { id: 'booking', title: 'Booking Updates', description: 'Get notified when bookings are created or modified', enabled: true },
  { id: 'payout', title: 'Payout Alerts', description: 'Notifications about payouts and transactions', enabled: true },
  { id: 'schedule', title: 'Schedule Changes', description: 'Alerts when schedules are updated', enabled: true },
  { id: 'marketing', title: 'Marketing Communications', description: 'Promotional emails and newsletters', enabled: true },
];

export default function SettingsPage() {
  const { partner } = useAuth();
  const [activeTab, setActiveTab] = useState('profile');
  const [notifications, setNotifications] = useState(notificationSettings);
  const [firstName, setFirstName] = useState(partner?.first_name || '');
  const [lastName, setLastName] = useState(partner?.last_name || '');
  const [email, setEmail] = useState(partner?.email || '');
  const [phone, setPhone] = useState(partner?.phone || '+234');
  const [role, setRole] = useState('Administrator');
  const [companyName, setCompanyName] = useState(partner?.company_name || '');
  const [businessId, setBusinessId] = useState('BUS-123456789');
  const [businessAddress, setBusinessAddress] = useState('123 Main Street, Suite 100');
  const [city, setCity] = useState('Iyanapaja');
  const [state, setState] = useState('Lagos');
  const [zipCode, setZipCode] = useState('10001');

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="border-b border-gray-100 px-5 overflow-x-auto">
          <div className="flex gap-1 min-w-max">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-3 text-sm font-medium transition-colors whitespace-nowrap',
                  activeTab === tab.id
                    ? 'text-[#0B5B7A] border-b-2 border-[#0B5B7A]'
                    : 'text-gray-500 hover:text-gray-700'
                )}
              >
                {tab.name}
              </button>
            ))}
          </div>
        </div>

        {/* Tab Content */}
        <div className="p-5">
          {activeTab === 'notifications' && (
            <div className="space-y-6">
              {/* Notifications (General) Section */}
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 rounded-lg border-2 border-yellow-400 flex items-center justify-center flex-shrink-0">
                  <Bell className="h-5 w-5 text-yellow-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Notifications</h3>
                  <p className="text-xs text-gray-500">Choose what updates you receive</p>
                </div>
              </div>

              {/* Email Notifications Section */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Email Notifications</h4>
                  <p className="text-xs text-gray-500 mb-4">Receive email updates about your bookings</p>
                </div>

                {/* Notification Toggles */}
                {notifications.map((notification) => (
                  <div
                    key={notification.id}
                    className="flex items-center justify-between py-3 border-b border-gray-100 last:border-0"
                  >
                    <div>
                      <h4 className="text-sm font-medium text-gray-900">{notification.title}</h4>
                      <p className="text-xs text-gray-500">{notification.description}</p>
                    </div>
                    <button
                      onClick={() => toggleNotification(notification.id)}
                      className={cn(
                        'relative w-11 h-6 rounded-full transition-colors',
                        notification.enabled ? 'bg-green-500' : 'bg-gray-200'
                      )}
                    >
                      <span
                        className={cn(
                          'absolute top-1 w-4 h-4 rounded-full bg-white transition-transform shadow',
                          notification.enabled ? 'left-6' : 'left-1'
                        )}
                      />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="space-y-6">
              {/* Profile Information Section */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-[#0B5B7A]/10 flex items-center justify-center flex-shrink-0">
                  <User className="h-5 w-5 text-[#0B5B7A]" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Profile information</h3>
                  <p className="text-xs text-gray-500">Update your personal details.</p>
                </div>
              </div>

              {/* Form Fields */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                {/* Column 1 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">First Name</label>
                    <input
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter name."
                      className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Phone Number</label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234"
                      className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Last Name</label>
                    <input
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter name."
                      className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</label>
                    <input
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Role</label>
                    <div className="relative">
                      <select
                        value={role}
                        onChange={(e) => setRole(e.target.value)}
                        className="w-full h-10 px-4 pr-10 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A] appearance-none bg-white"
                      >
                        <option value="Administrator">Administrator</option>
                        <option value="Manager">Manager</option>
                        <option value="Operator">Operator</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button className="h-10 px-6 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button className="h-10 px-6 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#094A63] transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'company' && (
            <div className="space-y-6">
              {/* Company Information Section */}
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <Building2 className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Company information</h3>
                  <p className="text-xs text-gray-500">Manage your business details.</p>
                </div>
              </div>

              {/* Company Profile Card */}
              <div className="bg-gray-50 rounded-lg p-6 mb-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-4">
                    <div className="w-20 h-20 rounded-full bg-[#0B5B7A] flex flex-col items-center justify-center text-white">
                      <span className="text-lg font-bold">GUO</span>
                      <span className="text-xs">TRANSPORT CO.</span>
                    </div>
                    <div>
                      <h4 className="text-base font-semibold text-gray-900 mb-1">
                        {companyName || 'GUO Transport Company'}
                      </h4>
                      <p className="text-xs text-gray-500">{businessId}</p>
                    </div>
                  </div>
                  <button className="h-10 px-4 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#094A63] transition-colors flex items-center gap-2">
                    <Upload className="h-4 w-4" />
                    Upload Image
                  </button>
                </div>
              </div>

              {/* Form Fields */}
              <div className="space-y-4">
                {/* Row 1 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Company Name</label>
                    <input
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter name."
                      className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 placeholder:text-gray-400 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Business ID</label>
                    <input
                      type="text"
                      value={businessId}
                      onChange={(e) => setBusinessId(e.target.value)}
                      className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Business Address</label>
                    <input
                      type="text"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">City</label>
                    <input
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">State</label>
                    <input
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-medium text-gray-500 mb-1.5">Zip Code</label>
                    <input
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full h-10 px-4 rounded-lg border border-gray-200 text-sm text-gray-900 focus:outline-none focus:border-[#0B5B7A] focus:ring-1 focus:ring-[#0B5B7A]"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <button className="h-10 px-6 bg-white border border-gray-200 text-gray-700 text-sm font-medium rounded-lg hover:bg-gray-50 transition-colors">
                  Cancel
                </button>
                <button className="h-10 px-6 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#094A63] transition-colors">
                  Save Changes
                </button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h3>
                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Current Password</label>
                    <input
                      type="password"
                      className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0B5B7A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">New Password</label>
                    <input
                      type="password"
                      className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0B5B7A]"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</label>
                    <input
                      type="password"
                      className="w-full h-11 px-4 rounded-lg border border-gray-200 text-sm focus:outline-none focus:border-[#0B5B7A]"
                    />
                  </div>
                  <button className="h-10 px-6 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#014d6b] transition-colors">
                    Update Password
                  </button>
                </div>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-xs text-gray-500 mt-1">Add an extra layer of security</p>
                  </div>
                  <button className="h-10 px-4 border border-[#0B5B7A] text-[#0B5B7A] text-sm font-medium rounded-lg hover:bg-[#0B5B7A]/10 transition-colors">
                    Enable
                  </button>
                </div>
              </div>
            </div>
          )}

          {!['notifications', 'profile', 'security'].includes(activeTab) && (
            <div className="flex flex-col items-center justify-center py-12 text-center">
              <div className="w-16 h-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <svg className="w-8 h-8 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">
                {settingsTabs.find(t => t.id === activeTab)?.name}
              </h3>
              <p className="text-sm text-gray-500">This section is coming soon</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
