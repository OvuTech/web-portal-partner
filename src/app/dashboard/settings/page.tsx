'use client';

import { useState } from 'react';
import { Bell, User, ChevronDown, Building2, Upload, Loader2, Eye, EyeOff, Copy, Trash2, Lock, CheckCircle, XCircle, X, RefreshCw, FileText, CreditCard, Shield, Code, Users, Plus } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';
import { authService } from '@/lib/api/auth';
import { toast } from 'sonner';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Button } from '@/components/ui/button';
import { Switch } from '@/components/ui/switch';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import * as Dialog from '@radix-ui/react-dialog';

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
  
  // Change password state
  const [currentPassword, setCurrentPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const [twoFactorEnabled, setTwoFactorEnabled] = useState(true);

  // API Credentials state
  const [showSecretKeys, setShowSecretKeys] = useState<Record<string, boolean>>({});
  const [selectedFramework, setSelectedFramework] = useState('nextjs');
  const publishableKey = 'pk_live_Z2xhnuilogfhksHjglzjzvzxcfdIOPDP12KKKLMo';
  const [secretKeys, setSecretKeys] = useState([
    { id: 'default', name: 'Default secret key', value: 'sk_live_------------------', isDefault: true },
    { id: 'test', name: 'Test', value: 'sk_live_test_------------------', isDefault: false },
    { id: 'testing', name: 'Testing Token', value: 'Pk_live_Z2xhnuilogfhksHjglzjzvzxcfdIOPDP12KKKLMoxcfdIOPD', isDefault: false },
  ]);

  // Team Access Management state
  const [isAddTeamMemberOpen, setIsAddTeamMemberOpen] = useState(false);
  const [teamMembers, setTeamMembers] = useState([
    { id: '1', name: 'Endurance Karounwi', email: 'endurance@ovuops.com', role: 'Finance', status: 'Active', lastLogin: 'Oct 22, 2025' },
    { id: '2', name: 'Tayo Meneke', email: 'tayo@ovuops.com', role: 'Dispatch', status: 'Active', lastLogin: 'Oct 22, 2025' },
    { id: '3', name: 'Endurance Karounwi', email: 'endurance@ovuops.com', role: 'Administrator', status: 'Pending', lastLogin: 'Oct 22, 2025' },
  ]);
  const [teamMemberForm, setTeamMemberForm] = useState({
    fullName: '',
    email: '',
    role: '',
    accessLevel: {
      bookings: true,
      payouts: true,
      reports: true,
      settings: true,
      api: true,
    },
  });

  // Payout & Bank Info state
  const [isUpdatePaymentOpen, setIsUpdatePaymentOpen] = useState(false);
  const [paymentForm, setPaymentForm] = useState({
    bankName: 'GT Bank',
    accountNumber: '0123456789',
    accountName: 'Default',
    settlementFrequency: 'Weekly',
    pspPartner: 'Paystack',
  });

  // Compliance & Documents state
  const [isUploadDocumentOpen, setIsUploadDocumentOpen] = useState(false);
  const [selectedDocument, setSelectedDocument] = useState<string | null>(null);
  const [documents, setDocuments] = useState([
    { id: '1', label: 'Document 1', description: 'Transport license', status: 'verified', taxId: '' },
    { id: '2', label: 'Document 2', description: 'CAC Registration Certificate', status: 'error', taxId: '' },
    { id: '3', label: 'Document 3 (Tax ID)', description: '', status: 'verified', taxId: '0000000000' },
    { id: '4', label: 'Document 4', description: 'NDPA Compliance File', status: 'verified', taxId: '' },
    { id: '5', label: 'Document 5', description: 'NDPA Compliance File', status: 'pending', taxId: '' },
  ]);
  const [uploadFile, setUploadFile] = useState<File | null>(null);
  const [uploadProgress, setUploadProgress] = useState(0);

  const toggleNotification = (id: string) => {
    setNotifications(notifications.map(n => 
      n.id === id ? { ...n, enabled: !n.enabled } : n
    ));
  };

  const copyToClipboard = (text: string, label: string) => {
    navigator.clipboard.writeText(text);
    toast.success(`${label} copied to clipboard`);
  };

  const toggleSecretKeyVisibility = (id: string) => {
    setShowSecretKeys(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setUploadFile(file);
      // Simulate upload progress
      let progress = 0;
      const interval = setInterval(() => {
        progress += 10;
        setUploadProgress(progress);
        if (progress >= 100) {
          clearInterval(interval);
        }
      }, 200);
    }
  };

  const handleChangePassword = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!currentPassword || !newPassword || !confirmPassword) {
      toast.error('Please fill in all fields');
      return;
    }

    if (newPassword.length < 8) {
      toast.error('New password must be at least 8 characters long');
      return;
    }

    // Check for special character
    const specialCharRegex = /[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/;
    if (!specialCharRegex.test(newPassword)) {
      toast.error('New password must contain at least one special character');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('New passwords do not match');
      return;
    }

    setIsChangingPassword(true);
    try {
      // Verify we have a token and it's valid before making the request
      if (typeof window !== 'undefined') {
        const token = localStorage.getItem('partner_access_token');
        if (!token) {
          toast.error('You must be logged in to change your password');
          setIsChangingPassword(false);
          return;
        }
        console.log('[Change Password] Token exists in localStorage');
        
        // Verify token is valid by checking if we can get partner info
        try {
          const partner = await authService.getCurrentPartner();
          console.log('[Change Password] Token is valid, partner ID:', partner.id);
        } catch (verifyError: any) {
          console.error('[Change Password] Token validation failed:', verifyError);
          toast.error('Your session has expired. Please log in again.');
          setIsChangingPassword(false);
          return;
        }
      }
      
      await authService.changePassword({
        current_password: currentPassword,
        new_password: newPassword,
      });
      toast.success('Password changed successfully');
      setCurrentPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } catch (error: any) {
      console.error('[Change Password] Full error:', error);
      console.error('[Change Password] Error response:', error.response);
      
      let message = 'Failed to change password. Please try again.';
      
      // Handle Pydantic validation errors
      if (error.response?.data?.detail) {
        const detail = error.response.data.detail;
        if (Array.isArray(detail) && detail.length > 0) {
          message = detail[0].msg || detail[0].message || message;
        } else if (typeof detail === 'string') {
          message = detail;
        } else if (detail.message) {
          message = detail.message;
        }
      } else if (error.message) {
        message = error.message;
      }
      
      // Don't redirect on settings page - show error instead
      toast.error(message);
      console.error('[Change Password] Error message:', message);
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <div className="space-y-6">
      {/* Main Content */}
      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {/* Tabs */}
        <div className="px-5 py-4">
          <div className="flex gap-2 bg-[#F5F5F5] p-1 rounded-lg">
            {settingsTabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'pl-4 pr-4 pt-2 pb-2 rounded-lg text-sm font-medium transition-colors text-center whitespace-nowrap cursor-pointer',
                  activeTab === tab.id
                    ? 'bg-[#0B5B7A] text-white'
                    : 'text-gray-600 hover:text-gray-900'
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
                    <Label htmlFor="firstName" className="block text-xs font-medium text-gray-500 mb-1.5">First Name</Label>
                    <Input
                      id="firstName"
                      type="text"
                      value={firstName}
                      onChange={(e) => setFirstName(e.target.value)}
                      placeholder="Enter name."
                      className="w-full h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="phone" className="block text-xs font-medium text-gray-500 mb-1.5">Phone Number</Label>
                    <Input
                      id="phone"
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+234"
                      className="w-full h-10"
                    />
                  </div>
                </div>

                {/* Column 2 */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="lastName" className="block text-xs font-medium text-gray-500 mb-1.5">Last Name</Label>
                    <Input
                      id="lastName"
                      type="text"
                      value={lastName}
                      onChange={(e) => setLastName(e.target.value)}
                      placeholder="Enter name."
                      className="w-full h-10"
                    />
                  </div>
                </div>

                {/* Column 3 */}
                <div className="space-y-4">
                  <div>
                    <Label htmlFor="email" className="block text-xs font-medium text-gray-500 mb-1.5">Email Address</Label>
                    <Input
                      id="email"
                      type="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="example@gmail.com"
                      className="w-full h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="role" className="block text-xs font-medium text-gray-500 mb-1.5">Role</Label>
                    <Select value={role} onValueChange={(value) => setRole(value)}>
                      <SelectTrigger id="role" className="w-full h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="Administrator">Administrator</SelectItem>
                        <SelectItem value="Manager">Manager</SelectItem>
                        <SelectItem value="Operator">Operator</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="outline" className="h-10 px-6 cursor-pointer">
                  Cancel
                </Button>
                <Button className="h-10 px-6 bg-[#0B5B7A] hover:bg-[#094A63] text-white cursor-pointer">
                  Save Changes
                </Button>
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
                  <button className="h-10 px-4 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#094A63] transition-colors flex items-center gap-2 cursor-pointer">
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
                    <Label htmlFor="companyName" className="block text-xs font-medium text-gray-500 mb-1.5">Company Name</Label>
                    <Input
                      id="companyName"
                      type="text"
                      value={companyName}
                      onChange={(e) => setCompanyName(e.target.value)}
                      placeholder="Enter name."
                      className="w-full h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessId" className="block text-xs font-medium text-gray-500 mb-1.5">Business ID</Label>
                    <Input
                      id="businessId"
                      type="text"
                      value={businessId}
                      onChange={(e) => setBusinessId(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="businessAddress" className="block text-xs font-medium text-gray-500 mb-1.5">Business Address</Label>
                    <Input
                      id="businessAddress"
                      type="text"
                      value={businessAddress}
                      onChange={(e) => setBusinessAddress(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>

                {/* Row 2 */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <Label htmlFor="city" className="block text-xs font-medium text-gray-500 mb-1.5">City</Label>
                    <Input
                      id="city"
                      type="text"
                      value={city}
                      onChange={(e) => setCity(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="state" className="block text-xs font-medium text-gray-500 mb-1.5">State</Label>
                    <Input
                      id="state"
                      type="text"
                      value={state}
                      onChange={(e) => setState(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                  <div>
                    <Label htmlFor="zipCode" className="block text-xs font-medium text-gray-500 mb-1.5">Zip Code</Label>
                    <Input
                      id="zipCode"
                      type="text"
                      value={zipCode}
                      onChange={(e) => setZipCode(e.target.value)}
                      className="w-full h-10"
                    />
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex justify-end gap-3 pt-4 border-t border-gray-100">
                <Button variant="outline" className="h-10 px-6 cursor-pointer">
                  Cancel
                </Button>
                <Button className="h-10 px-6 bg-[#0B5B7A] hover:bg-[#094A63] text-white cursor-pointer">
                  Save Changes
                </Button>
              </div>
            </div>
          )}

          {activeTab === 'security' && (
            <div className="space-y-6">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="text-sm font-semibold text-gray-900 mb-4">Change Password</h3>
                <form onSubmit={handleChangePassword} className="space-y-4">
                  <div>
                    <Label htmlFor="currentPassword" className="block text-sm font-medium text-gray-700 mb-2">Current Password</Label>
                    <Input
                      id="currentPassword"
                      type="password"
                      value={currentPassword}
                      onChange={(e) => setCurrentPassword(e.target.value)}
                      className="w-full h-11"
                      required
                      disabled={isChangingPassword}
                    />
                  </div>
                  <div>
                    <Label htmlFor="newPassword" className="block text-sm font-medium text-gray-700 mb-2">New Password</Label>
                    <Input
                      id="newPassword"
                      type="password"
                      value={newPassword}
                      onChange={(e) => setNewPassword(e.target.value)}
                      className="w-full h-11"
                      required
                      minLength={8}
                      disabled={isChangingPassword}
                    />
                    <p className="mt-1 text-xs text-gray-500">Must be at least 8 characters long and contain at least one special character</p>
                  </div>
                  <div>
                    <Label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">Confirm New Password</Label>
                    <Input
                      id="confirmPassword"
                      type="password"
                      value={confirmPassword}
                      onChange={(e) => setConfirmPassword(e.target.value)}
                      className="w-full h-11"
                      required
                      minLength={8}
                      disabled={isChangingPassword}
                    />
                  </div>
                  <button
                    type="submit"
                    disabled={isChangingPassword}
                    className="h-10 px-6 bg-[#0B5B7A] text-white text-sm font-medium rounded-lg hover:bg-[#014d6b] transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {isChangingPassword ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Updating...
                      </>
                    ) : (
                      'Update Password'
                    )}
                  </button>
                </form>
              </div>

              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900">Two-Factor Authentication</h3>
                    <p className="text-xs text-gray-500 mt-1">Add an extra layer of security to your account</p>
                  </div>
                  <Switch
                    checked={twoFactorEnabled}
                    onCheckedChange={setTwoFactorEnabled}
                    className="data-[state=checked]:bg-green-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* API Credentials Tab */}
          {activeTab === 'api' && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                  <Code className="h-5 w-5 text-blue-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">API Credentials</h3>
                  <p className="text-xs text-gray-500">Manage API Keys for this Instance</p>
                </div>
              </div>

              {/* Quick Copy Section */}
              <div className="bg-gray-800 rounded-lg p-6 text-white">
                <h4 className="text-sm font-semibold mb-2">Quick Copy</h4>
                <p className="text-xs text-gray-300 mb-4">Choose your framework and paste the code in your environmental file</p>
                <div className="bg-gray-900 rounded-lg p-4 mb-4 font-mono text-sm">
                  <div className="text-gray-400 mb-2">.env.local</div>
                  <div>NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY={publishableKey}</div>
                  <div>CLERK_SECRET_KEY={showSecretKeys['default'] ? secretKeys[0].value : 'sk_live_------------------'}</div>
                </div>
                <div className="flex items-center justify-between">
                  <p className="text-xs text-gray-400">These are the same public and secret keys as you see below</p>
                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => toggleSecretKeyVisibility('default')}
                      className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
                    >
                      {showSecretKeys['default'] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => copyToClipboard(`NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=${publishableKey}\nCLERK_SECRET_KEY=${secretKeys[0].value}`, 'Environment variables')}
                      className="bg-transparent border-gray-600 text-white hover:bg-gray-700"
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>
              </div>

              {/* Publishable Key Section */}
              <div className="space-y-4">
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Publishable Key</h4>
                  <p className="text-xs text-gray-500 mb-3">This key should be used in your frontend code, it can be safely shared and does not need to be kept secret.</p>
                  <div className="flex gap-2">
                    <Input
                      value={publishableKey}
                      readOnly
                      className="flex-1 bg-gray-50"
                    />
                    <Button
                      variant="outline"
                      onClick={() => copyToClipboard(publishableKey, 'Publishable key')}
                    >
                      <Copy className="h-4 w-4 mr-2" />
                      Copy
                    </Button>
                  </div>
                </div>

                {/* Secret Keys Section */}
                <div>
                  <h4 className="text-sm font-semibold text-gray-900 mb-1">Secret Keys</h4>
                  <p className="text-xs text-gray-500 mb-4">Securely manage these sensitive keys. Do not share them with anyone. If you suspect that one of your secret keys has been compromised, you should create a new key, update your code, then delete the compromised key.</p>
                  
                  <div className="space-y-4">
                    {secretKeys.map((key) => (
                      <div key={key.id} className="flex items-center gap-2">
                        <div className="flex-1">
                          <Label className="text-xs font-medium text-gray-500 mb-1 block">{key.name}</Label>
                          <Input
                            type={showSecretKeys[key.id] ? 'text' : 'password'}
                            value={key.value}
                            readOnly
                            className="bg-gray-50"
                          />
                        </div>
                        <div className="flex gap-2 mt-6">
                          {!key.isDefault && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => {
                                if (confirm('Are you sure you want to delete this key?')) {
                                  setSecretKeys(secretKeys.filter(k => k.id !== key.id));
                                  toast.success('Key deleted');
                                }
                              }}
                              className="text-red-600 hover:text-red-700 hover:bg-red-50"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          )}
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => toggleSecretKeyVisibility(key.id)}
                          >
                            {showSecretKeys[key.id] ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                          </Button>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(key.value, key.name)}
                          >
                            <Copy className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>

                  <Button
                    variant="outline"
                    className="mt-4"
                    onClick={() => {
                      const newKey = {
                        id: `key-${Date.now()}`,
                        name: 'New Key',
                        value: `sk_live_new_${Math.random().toString(36).substring(7)}`,
                        isDefault: false,
                      };
                      setSecretKeys([...secretKeys, newKey]);
                      toast.success('New key created');
                    }}
                  >
                    <Plus className="h-4 w-4 mr-2" />
                    Add new key
                  </Button>

                  <p className="text-xs text-red-600 mt-4">API keys are sensitive. Regenerating keys will disable old credentials immediately.</p>
                </div>
              </div>

              {/* Status Panel */}
              <div className="bg-gray-50 rounded-lg p-4 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-medium text-gray-700">Status</span>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 rounded-full bg-green-500"></div>
                    <span className="text-sm text-gray-600">Connected</span>
                  </div>
                </div>
                <Button className="bg-[#0B5B7A] hover:bg-[#0B5B7A]/90 text-white">
                  Test connection
                </Button>
              </div>
              <p className="text-xs text-gray-500">OVU will send a sample payload to your webhook</p>
            </div>
          )}

          {/* Accessibility Tab (Team Access Management) */}
          {activeTab === 'accessibility' && (
            <div className="space-y-6">
              <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                  <div className="w-10 h-10 rounded-lg bg-blue-100 flex items-center justify-center flex-shrink-0">
                    <Code className="h-5 w-5 text-blue-600" />
                  </div>
                  <div>
                    <h3 className="text-sm font-semibold text-gray-900 mb-1">Team Access Management</h3>
                    <p className="text-xs text-gray-500">Manage your team members</p>
                  </div>
                </div>
                <Button
                  onClick={() => setIsAddTeamMemberOpen(true)}
                  className="bg-[#0B5B7A] hover:bg-[#0B5B7A]/90 text-white"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Team Member
                </Button>
              </div>

              {/* Team Members Table */}
              <div className="border border-gray-200 rounded-lg overflow-hidden">
                <table className="w-full">
                  <thead className="bg-gray-50">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Name</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Email</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Role</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Status</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Last login</th>
                      <th className="px-4 py-3 text-left text-xs font-medium text-gray-500">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-200">
                    {teamMembers.map((member) => (
                      <tr key={member.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3 text-sm text-gray-900">{member.name}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{member.email}</td>
                        <td className="px-4 py-3 text-sm text-gray-600">{member.role}</td>
                        <td className="px-4 py-3">
                          <span className={cn(
                            'inline-flex items-center px-2 py-1 rounded-full text-xs font-medium',
                            member.status === 'Active' ? 'bg-green-100 text-green-700' : 'bg-yellow-100 text-yellow-700'
                          )}>
                            {member.status}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-sm text-gray-600">{member.lastLogin}</td>
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            {member.status === 'Pending' ? (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => toast.success('Invitation resent')}
                                className="h-8"
                              >
                                <RefreshCw className="h-3 w-3 mr-1" />
                                Resend
                              </Button>
                            ) : (
                              <>
                                <button className="p-1.5 hover:bg-gray-100 rounded cursor-pointer">
                                  <Upload className="h-4 w-4 text-gray-600" />
                                </button>
                                <button className="p-1.5 hover:bg-gray-100 rounded cursor-pointer">
                                  <Lock className="h-4 w-4 text-gray-600" />
                                </button>
                                <button
                                  onClick={() => {
                                    if (confirm('Are you sure you want to delete this team member?')) {
                                      setTeamMembers(teamMembers.filter(m => m.id !== member.id));
                                      toast.success('Team member deleted');
                                    }
                                  }}
                                  className="p-1.5 hover:bg-red-50 rounded cursor-pointer"
                                >
                                  <X className="h-4 w-4 text-red-600" />
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* Payout & Bank Info Tab */}
          {activeTab === 'payout' && (
            <div className="space-y-6">
              <div className="flex items-start gap-3 mb-6">
                <div className="w-10 h-10 rounded-lg bg-green-100 flex items-center justify-center flex-shrink-0">
                  <CreditCard className="h-5 w-5 text-green-600" />
                </div>
                <div>
                  <h3 className="text-sm font-semibold text-gray-900 mb-1">Payout & Bank Info</h3>
                  <p className="text-xs text-gray-500">Manage how OVU pays out settlements</p>
                </div>
              </div>

              {/* Primary Settlement Account */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Primary Settlement Account</h4>
                <div className="grid grid-cols-2 gap-4 mb-4">
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-1 block">Bank name</Label>
                    <p className="text-sm text-gray-900">GT Bank</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-1 block">Account Number</Label>
                    <p className="text-sm text-gray-900">0000000000</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-1 block">Name</Label>
                    <p className="text-sm text-gray-900">GIG Motors</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-1 block">Settlement Frequency</Label>
                    <p className="text-sm text-gray-900">Weekly</p>
                  </div>
                  <div>
                    <Label className="text-xs font-medium text-gray-500 mb-1 block">PSP Partner</Label>
                    <p className="text-sm text-gray-900">Paystack</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    <span className="text-sm text-green-600 font-medium">Verified</span>
                  </div>
                </div>
                <Button
                  onClick={() => setIsUpdatePaymentOpen(true)}
                  className="bg-[#0B5B7A] hover:bg-[#0B5B7A]/90 text-white"
                >
                  Update
                </Button>
              </div>

              {/* Alternate Settlement Account */}
              <div className="border border-gray-200 rounded-lg p-6">
                <h4 className="text-sm font-semibold text-gray-900 mb-4">Alternate Settlement Account</h4>
                <Button
                  variant="outline"
                  onClick={() => setIsUpdatePaymentOpen(true)}
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add
                </Button>
              </div>
            </div>
          )}

          {/* Compliance & Documents Tab */}
          {activeTab === 'compliance' && (
            <div className="space-y-6">
              <div className="bg-green-50 border border-green-200 rounded-lg p-4 flex items-start gap-3">
                <Shield className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-gray-900 font-medium">Compliance & Documents</p>
                  <p className="text-xs text-gray-600 mt-1">To support NDPA & CBN compliance for verified operators.</p>
                </div>
              </div>

              <div className="space-y-4">
                {documents.map((doc) => (
                  <div key={doc.id} className="border border-gray-200 rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <Label className="text-sm font-medium text-gray-900 block mb-1">{doc.label}</Label>
                        {doc.description && (
                          <p className="text-xs text-gray-500 mb-2">{doc.description}</p>
                        )}
                        {doc.taxId !== undefined && (
                          <Input
                            value={doc.taxId}
                            onChange={(e) => {
                              setDocuments(documents.map(d => d.id === doc.id ? { ...d, taxId: e.target.value } : d));
                            }}
                            className="w-full max-w-xs bg-gray-50 mt-2"
                          />
                        )}
                      </div>
                      <div className="flex items-center gap-4">
                        {doc.status === 'verified' && <CheckCircle className="h-5 w-5 text-green-600" />}
                        {doc.status === 'error' && <XCircle className="h-5 w-5 text-red-600" />}
                        {doc.status === 'pending' && <div className="w-5 h-5 rounded-full bg-yellow-400"></div>}
                        {doc.description && (
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSelectedDocument(doc.id);
                              setIsUploadDocumentOpen(true);
                            }}
                          >
                            {doc.status === 'verified' ? 'Replace' : 'Upload new'}
                          </Button>
                        )}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Add Team Member Modal */}
      <Dialog.Root open={isAddTeamMemberOpen} onOpenChange={setIsAddTeamMemberOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Dialog.Title className="text-xl font-bold text-gray-900">Add Team Member</Dialog.Title>
                <button
                  onClick={() => setIsAddTeamMemberOpen(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Lorem ipsum dolor adiuvat tehova</p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="teamFullName" className="block text-sm font-medium text-gray-700 mb-1">Full Name</Label>
                  <Input
                    id="teamFullName"
                    type="text"
                    value={teamMemberForm.fullName}
                    onChange={(e) => setTeamMemberForm({ ...teamMemberForm, fullName: e.target.value })}
                    placeholder="Enter name"
                    className="w-full bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="teamEmail" className="block text-sm font-medium text-gray-700 mb-1">Email Address</Label>
                  <Input
                    id="teamEmail"
                    type="email"
                    value={teamMemberForm.email}
                    onChange={(e) => setTeamMemberForm({ ...teamMemberForm, email: e.target.value })}
                    placeholder="Enter email"
                    className="w-full bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="teamRole" className="block text-sm font-medium text-gray-700 mb-1">Role</Label>
                  <Select value={teamMemberForm.role} onValueChange={(value) => setTeamMemberForm({ ...teamMemberForm, role: value })}>
                    <SelectTrigger id="teamRole" className="w-full bg-gray-100">
                      <SelectValue placeholder="Select role" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Administrator">Administrator</SelectItem>
                      <SelectItem value="Finance">Finance</SelectItem>
                      <SelectItem value="Dispatch">Dispatch</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-3">Access Level</Label>
                  <div className="grid grid-cols-2 gap-4">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-700">Bookings</Label>
                      <Switch
                        checked={teamMemberForm.accessLevel.bookings}
                        onCheckedChange={(checked) => setTeamMemberForm({ ...teamMemberForm, accessLevel: { ...teamMemberForm.accessLevel, bookings: checked } })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-700">Payouts</Label>
                      <Switch
                        checked={teamMemberForm.accessLevel.payouts}
                        onCheckedChange={(checked) => setTeamMemberForm({ ...teamMemberForm, accessLevel: { ...teamMemberForm.accessLevel, payouts: checked } })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-700">Reports</Label>
                      <Switch
                        checked={teamMemberForm.accessLevel.reports}
                        onCheckedChange={(checked) => setTeamMemberForm({ ...teamMemberForm, accessLevel: { ...teamMemberForm.accessLevel, reports: checked } })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-700">Settings</Label>
                      <Switch
                        checked={teamMemberForm.accessLevel.settings}
                        onCheckedChange={(checked) => setTeamMemberForm({ ...teamMemberForm, accessLevel: { ...teamMemberForm.accessLevel, settings: checked } })}
                      />
                    </div>
                    <div className="flex items-center justify-between">
                      <Label className="text-sm text-gray-700">API</Label>
                      <Switch
                        checked={teamMemberForm.accessLevel.api}
                        onCheckedChange={(checked) => setTeamMemberForm({ ...teamMemberForm, accessLevel: { ...teamMemberForm.accessLevel, api: checked } })}
                      />
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => {
                    toast.success('Team member invited');
                    setIsAddTeamMemberOpen(false);
                    setTeamMemberForm({ fullName: '', email: '', role: '', accessLevel: { bookings: true, payouts: true, reports: true, settings: true, api: true } });
                  }}
                  className="w-full bg-[#0B5B7A] hover:bg-[#0B5B7A]/90 text-white"
                >
                  Invite User
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Update Payment Account Details Modal */}
      <Dialog.Root open={isUpdatePaymentOpen} onOpenChange={setIsUpdatePaymentOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Dialog.Title className="text-xl font-bold text-gray-900">Update Payment Account Details</Dialog.Title>
                <button
                  onClick={() => setIsUpdatePaymentOpen(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Lorem ipsum dolor adiuvat tehova</p>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="bankName" className="block text-sm font-medium text-gray-700 mb-1">Bank Name</Label>
                  <Select value={paymentForm.bankName} onValueChange={(value) => setPaymentForm({ ...paymentForm, bankName: value })}>
                    <SelectTrigger id="bankName" className="w-full bg-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="GT Bank">GT Bank</SelectItem>
                      <SelectItem value="Access Bank">Access Bank</SelectItem>
                      <SelectItem value="Zenith Bank">Zenith Bank</SelectItem>
                      <SelectItem value="First Bank">First Bank</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="accountNumber" className="block text-sm font-medium text-gray-700 mb-1">Account Number</Label>
                  <Input
                    id="accountNumber"
                    type="text"
                    value={paymentForm.accountNumber}
                    onChange={(e) => setPaymentForm({ ...paymentForm, accountNumber: e.target.value })}
                    className="w-full bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="accountName" className="block text-sm font-medium text-gray-700 mb-1">Account Name</Label>
                  <Input
                    id="accountName"
                    type="text"
                    value={paymentForm.accountName}
                    onChange={(e) => setPaymentForm({ ...paymentForm, accountName: e.target.value })}
                    className="w-full bg-gray-100"
                  />
                </div>
                <div>
                  <Label htmlFor="settlementFrequency" className="block text-sm font-medium text-gray-700 mb-1">Settlement Frequency</Label>
                  <Select value={paymentForm.settlementFrequency} onValueChange={(value) => setPaymentForm({ ...paymentForm, settlementFrequency: value })}>
                    <SelectTrigger id="settlementFrequency" className="w-full bg-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Daily">Daily</SelectItem>
                      <SelectItem value="Weekly">Weekly</SelectItem>
                      <SelectItem value="Monthly">Monthly</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div>
                  <Label htmlFor="pspPartner" className="block text-sm font-medium text-gray-700 mb-1">PSP Partner</Label>
                  <Select value={paymentForm.pspPartner} onValueChange={(value) => setPaymentForm({ ...paymentForm, pspPartner: value })}>
                    <SelectTrigger id="pspPartner" className="w-full bg-gray-100">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="Paystack">Paystack</SelectItem>
                      <SelectItem value="Flutterwave">Flutterwave</SelectItem>
                      <SelectItem value="Stripe">Stripe</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <Button
                  onClick={() => {
                    toast.success('Payment account updated');
                    setIsUpdatePaymentOpen(false);
                  }}
                  className="w-full bg-[#0B5B7A] hover:bg-[#0B5B7A]/90 text-white"
                >
                  Update
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>

      {/* Upload Document Modal */}
      <Dialog.Root open={isUploadDocumentOpen} onOpenChange={setIsUploadDocumentOpen}>
        <Dialog.Portal>
          <Dialog.Overlay className="fixed inset-0 bg-black/50 z-50" />
          <Dialog.Content className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-full max-w-lg bg-white rounded-lg shadow-lg z-50 max-h-[90vh] overflow-y-auto">
            <div className="p-6">
              <div className="flex items-center justify-between mb-2">
                <Dialog.Title className="text-xl font-bold text-gray-900">Upload Document</Dialog.Title>
                <button
                  onClick={() => setIsUploadDocumentOpen(false)}
                  className="text-gray-400 hover:text-gray-600 cursor-pointer"
                >
                  <X className="h-5 w-5" />
                </button>
              </div>
              <p className="text-sm text-gray-500 mb-6">Lorem ipsum dolor adiuvat tehova</p>

              <div className="space-y-4">
                <div>
                  <Label className="block text-sm font-medium text-gray-700 mb-2">Upload File</Label>
                  <div className="border-2 border-dashed border-gray-300 rounded-lg p-8 text-center bg-gray-50">
                    <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-sm font-medium text-gray-900 mb-1">Choose a file or drag & drop it here</p>
                    <p className="text-xs text-gray-500 mb-4">JPEG, PNG, JPG, PDF formats, up to 3mb</p>
                    <label className="inline-block">
                      <input
                        type="file"
                        onChange={handleFileUpload}
                        className="hidden"
                        accept=".jpeg,.png,.jpg,.pdf"
                      />
                      <Button variant="outline" asChild>
                        <span className="cursor-pointer">Browse File</span>
                      </Button>
                    </label>
                  </div>
                </div>

                {uploadFile && (
                  <div className="border border-gray-200 rounded-lg p-4 bg-gray-50 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <FileText className="h-8 w-8 text-gray-600" />
                      <div>
                        <p className="text-sm font-medium text-gray-900">{uploadFile.name}</p>
                        <p className="text-xs text-gray-500">
                          {uploadProgress}% of 3 MB
                          {uploadProgress < 100 && <span className="ml-2">Uploading...</span>}
                        </p>
                      </div>
                    </div>
                    <button
                      onClick={() => {
                        setUploadFile(null);
                        setUploadProgress(0);
                      }}
                      className="text-gray-400 hover:text-gray-600"
                    >
                      <X className="h-5 w-5" />
                    </button>
                  </div>
                )}

                <Button
                  onClick={() => {
                    if (uploadFile) {
                      toast.success('Document uploaded successfully');
                      setIsUploadDocumentOpen(false);
                      setUploadFile(null);
                      setUploadProgress(0);
                    }
                  }}
                  className="w-full bg-[#0B5B7A] hover:bg-[#0B5B7A]/90 text-white"
                  disabled={!uploadFile || uploadProgress < 100}
                >
                  Replace
                </Button>
              </div>
            </div>
          </Dialog.Content>
        </Dialog.Portal>
      </Dialog.Root>
    </div>
  );
}
