'use client';

import { useState, ReactNode } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  Menu,
  X,
  ChevronDown,
  LogOut,
  User,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/contexts/AuthContext';

interface DashboardLayoutProps {
  children: ReactNode;
}

const navigationItems = [
  { name: 'Dashboard', href: '/dashboard', icon: '/icons/dashboard.svg' },
  { name: 'Bookings', href: '/dashboard/bookings', icon: '/icons/bookings.svg', badge: 10 },
  { name: 'Schedules & Inventory', href: '/dashboard/schedules', icon: '/icons/schedule.svg' },
  { name: 'Payouts & Reports', href: '/dashboard/payouts', icon: '/icons/wallet.svg' },
  { name: 'Uploads / Manifest', href: '/dashboard/uploads', icon: '/icons/upload.svg' },
  { name: 'Settings', href: '/dashboard/settings', icon: '/icons/settings.svg' },
  { name: 'Notifications', href: '/dashboard/notifications', icon: '/icons/notification.svg', badge: 10 },
];

export function DashboardLayout({ children }: DashboardLayoutProps) {
  const pathname = usePathname();
  const { partner, logout } = useAuth();
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [userMenuOpen, setUserMenuOpen] = useState(false);

  const isActive = (href: string) => {
    if (href === '/dashboard') {
      return pathname === '/dashboard';
    }
    return pathname.startsWith(href);
  };

  return (
    <div className="flex min-h-screen bg-[#F8F9FA]">
      {/* Mobile Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar - White background */}
      <aside
        className={cn(
          'fixed inset-y-0 left-0 z-50 w-[260px] bg-white border-r border-gray-200 transform transition-transform duration-300 ease-in-out lg:translate-x-0 lg:static lg:z-auto',
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="flex items-center justify-between h-16 px-5 border-b border-gray-100">
            <div className="flex items-center gap-2">
              <Image
                src="/bird.png"
                alt="OVU Logo"
                width={35}
                height={30}
                className="h-7 w-auto"
              />
              <span className="text-lg font-bold text-gray-900 tracking-wider" style={{ fontFamily: 'Arial, sans-serif' }}>OVU</span>
            </div>
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden text-gray-500 hover:text-gray-700"
            >
              <X className="h-5 w-5" />
            </button>
          </div>

          {/* Operator Label */}
          <div className="px-5 py-3">
            <p className="text-xs text-gray-500">Operator Management System</p>
          </div>

          {/* Navigation */}
          <nav className="flex-1 px-3 space-y-1 overflow-y-auto">
            {navigationItems.map((item) => {
              const active = isActive(item.href);

              return (
                <Link
                  key={item.name}
                  href={item.href}
                  onClick={() => setSidebarOpen(false)}
                  className={cn(
                    'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-colors',
                    active
                      ? 'bg-[#0B5B7A] text-white'
                      : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
                  )}
                >
                  <Image
                    src={item.icon}
                    alt={item.name}
                    width={20}
                    height={20}
                    className={cn('h-5 w-5', active ? 'brightness-0 invert' : 'opacity-60')}
                  />
                  <span className="flex-1">{item.name}</span>
                  {item.badge && (
                    <span className={cn(
                      'flex items-center justify-center min-w-[20px] h-5 px-1.5 text-xs font-semibold rounded-full',
                      active ? 'bg-white/20 text-white' : 'bg-[#0B5B7A] text-white'
                    )}>
                      {item.badge}
                    </span>
                  )}
                </Link>
              );
            })}
          </nav>

          {/* User Section */}
          <div className="p-4 border-t border-gray-100">
            <div className="flex items-center gap-3 px-2">
              <div className="w-10 h-10 rounded-full bg-[#0B5B7A] flex items-center justify-center text-white font-semibold text-sm">
                {partner?.first_name?.charAt(0) || 'A'}{partner?.last_name?.charAt(0) || 'O'}
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-gray-900 truncate">
                  {partner?.first_name} {partner?.last_name || 'Partner'}
                </p>
                <p className="text-xs text-gray-500">Administrator</p>
              </div>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Top Header */}
        <header className="sticky top-0 z-30 bg-white border-b border-gray-200">
          <div className="flex items-center justify-between px-4 lg:px-6 py-4">
            {/* Left Section - Page Title & Welcome */}
            <div className="flex items-center gap-3 flex-1">
              <button
                onClick={() => setSidebarOpen(true)}
                className="lg:hidden p-2 -ml-2 text-gray-600 hover:text-gray-900 cursor-pointer"
              >
                <Menu className="h-5 w-5" />
              </button>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">
                  {pathname === '/dashboard' && 'Dashboard'}
                  {pathname === '/dashboard/bookings' && 'Bookings'}
                  {pathname === '/dashboard/schedules' && 'Schedules & Inventory'}
                  {pathname === '/dashboard/payouts' && 'Payouts & Reports'}
                  {pathname === '/dashboard/uploads' && 'Uploads / Manifest'}
                  {pathname === '/dashboard/settings' && 'Settings'}
                  {pathname === '/dashboard/notifications' && 'Notifications'}
                </h1>
                <p className="text-sm text-gray-500 mt-1">
                  {pathname === '/dashboard' && `Welcome back ${partner?.first_name || 'Partner'}! Here's what's happening today. 👋`}
                  {pathname === '/dashboard/bookings' && 'Manage and Track all your bookings'}
                  {pathname === '/dashboard/schedules' && 'Manage your trip schedules and vehicle inventory'}
                  {pathname === '/dashboard/payouts' && 'View your earnings, transactions, and payout history'}
                  {pathname === '/dashboard/uploads' && 'Upload schedules and download passenger manifests'}
                  {pathname === '/dashboard/settings' && 'Manage your account settings and preferences'}
                  {pathname === '/dashboard/notifications' && 'View and manage your notifications'}
                </p>
              </div>
            </div>

            {/* Right Section */}
            <div className="flex items-center gap-3">
              {/* Last Updated */}
              <p className="hidden md:block text-xs text-gray-400">
                Last updated: {new Date().toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
              </p>

              {/* Notifications */}
              <button className="relative p-2 text-gray-500 hover:text-gray-700 hover:bg-gray-100 rounded-lg transition-colors cursor-pointer">
                <Image
                  src="/icons/notification.svg"
                  alt="Notifications"
                  width={20}
                  height={20}
                  className="h-5 w-5"
                />
              </button>

              {/* User Menu */}
              <div className="relative">
                <button
                  onClick={() => setUserMenuOpen(!userMenuOpen)}
                  className="w-9 h-9 rounded-full bg-[#0B5B7A] flex items-center justify-center text-white text-sm font-semibold cursor-pointer"
                >
                  {partner?.first_name?.charAt(0) || 'A'}{partner?.last_name?.charAt(0) || 'O'}
                </button>

                {/* Dropdown */}
                {userMenuOpen && (
                  <>
                    <div
                      className="fixed inset-0 z-40"
                      onClick={() => setUserMenuOpen(false)}
                    />
                    <div className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg border border-gray-200 py-1 z-50">
                      <div className="px-4 py-3 border-b border-gray-100">
                        <p className="text-sm font-medium text-gray-900">
                          {partner?.first_name} {partner?.last_name || 'Partner'}
                        </p>
                        <p className="text-xs text-gray-500 truncate">
                          {partner?.email || 'partner@example.com'}
                        </p>
                      </div>
                      <Link
                        href="/dashboard/settings"
                        onClick={() => setUserMenuOpen(false)}
                        className="flex items-center gap-3 px-4 py-2.5 text-sm text-gray-700 hover:bg-gray-50"
                      >
                        <User className="h-4 w-4" />
                        Profile Settings
                      </Link>
                      <button
                        onClick={() => {
                          setUserMenuOpen(false);
                          logout();
                        }}
                        className="w-full flex items-center gap-3 px-4 py-2.5 text-sm text-red-600 hover:bg-red-50 cursor-pointer"
                      >
                        <LogOut className="h-4 w-4" />
                        Sign Out
                      </button>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Page Content */}
        <main className="flex-1 p-4 lg:p-6 overflow-auto">
          {children}
        </main>
      </div>
    </div>
  );
}

export default DashboardLayout;
