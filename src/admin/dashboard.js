// Updated DashboardLayout.jsx
import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import {
  LayoutDashboard,
  Inbox,
  Users,
  Package,
  Briefcase,
  Settings,
  Menu,
  ChevronDown,
  User,
  LogOut,
  Wrench,
  X
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const navigation = [
    { name: 'Dashboard', href: '../admin/dashboardoverview', icon: LayoutDashboard },
    { name: 'View Inbox', href: '../admin/inbox', icon: Inbox, badge: '3' },
    { name: 'Manage Users', href: '../admin/users', icon: Users },
    { name: 'Manage Products', href: '../admin/productmanagement', icon: Package },
    { name: 'Jobs & Employers', href: '../admin/jobs', icon: Briefcase },
    { name: 'Manage Services', href: '../admin/services', icon: Wrench },
    { name: 'Settings', href: '../admin/settings', icon: Settings },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/admin');
  };

  const NavContent = () => (
    <div className="space-y-4">
      {navigation.map((item) => (
        <Link
          key={item.name}
          to={item.href}
          className="flex items-center gap-3 rounded-lg px-3 py-2 text-gray-200 transition-all hover:text-white hover:bg-gray-700"
        >
          <item.icon className="h-4 w-4" />
          <span>{item.name}</span>
          {item.badge && (
            <span className="ml-auto flex h-6 w-6 items-center justify-center rounded-full bg-gray-700 text-xs">
              {item.badge}
            </span>
          )}
        </Link>
      ))}
    </div>
  );

  return (
    <div className="min-h-screen">
      {/* Top Navigation Bar */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-700 bg-gray-800">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-400 hover:text-white"
            >
              <Menu className="h-6 w-6" />
            </button>

            <Link to="../admin/" className="flex items-center gap-2">
              <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full" />
              <span className="text-lg font-semibold text-white hidden md:inline-block">
                P<span>SEVEN</span>
              </span>
            </Link>
          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            <button 
              onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
              className="flex items-center gap-2 rounded-full focus:outline-none"
            >
              <img src="/logo.png" alt="Profile" className="h-8 w-8 rounded-full" />
              <span className="hidden md:inline-block text-white">{user?.fullName}</span>
              <ChevronDown className="h-4 w-4 text-gray-400" />
            </button>

            {/* Profile Dropdown Menu */}
            {isProfileDropdownOpen && (
              <div className="absolute right-0 mt-2 w-56 rounded-md bg-gray-800 py-1 shadow-lg ring-1 ring-black ring-opacity-5">
                <div className="px-4 py-2">
                  <p className="text-sm font-medium text-white">{user?.fullName}</p>
                  <p className="text-xs text-gray-400">{user?.email}</p>
                </div>
                <div className="border-t border-gray-700" />
                <Link
                  to="../admin/profile"
                  className="flex items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  <User className="h-4 w-4" />
                  profile
                </Link>
                <button
                  onClick={handleLogout}
                  className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-200 hover:bg-gray-700"
                >
                  <LogOut className="h-4 w-4" />
                  Sign Out
                </button>
              </div>
            )}
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="fixed inset-0 z-50 lg:hidden">
          <div 
            className="fixed inset-0 bg-black/50"
            onClick={() => setIsMobileMenuOpen(false)}
          />
          
          <div className="fixed inset-y-0 left-0 w-64 bg-gray-800 p-4">
            <div className="flex items-center justify-between mb-8">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full" />
                <span className="text-lg font-semibold text-white">
                  P<span>SEVEN</span>
                </span>
              </div>
              <button 
                onClick={() => setIsMobileMenuOpen(false)}
                className="text-gray-400 hover:text-white"
              >
                <X className="h-6 w-6" />
              </button>
            </div>
            <NavContent />
          </div>
        </div>
      )}

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 border-r border-gray-700 bg-gray-800 lg:block">
        <div className="flex h-full flex-col gap-4 p-4">
          <NavContent />
        </div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <div className="h-full">
          {children}
        </div>
      </main>
    </div>
  );
};

export default DashboardLayout;