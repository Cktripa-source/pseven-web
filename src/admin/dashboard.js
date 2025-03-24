import React, { useState, useEffect } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '../AuthContext';
import { motion, AnimatePresence } from 'framer-motion';
import { Toaster, toast } from 'react-hot-toast';
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
  X,
  Bell
} from 'lucide-react';

const DashboardLayout = ({ children }) => {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const navigation = [
    { name: 'Dashboard', href: '../admin/dashboardoverview', icon: LayoutDashboard },
    { name: 'View Inbox', href: '../admin/inbox', icon: Inbox, badge: '3' },
    { name: 'Manage Users', href: '../admin/users', icon: Users },
    { name: 'Manage Products', href: '../admin/productmanagement', icon: Package },
    { name: 'Jobs & Employers', href: '../admin/jobs', icon: Briefcase },
    { name: 'Manage Services', href: '../admin/services', icon: Wrench },
    { name: 'Settings', href: '../admin/settings', icon: Settings },
  ];

  useEffect(() => {
    // Show welcome toast on initial load
    toast.success(`Welcome back, ${user?.fullName || 'Admin'}!`, {
      icon: '👋',
      duration: 3000,
    });
  }, []);

  const handleLogout = async () => {
    try {
      await logout();
      toast.success('Successfully logged out');
      navigate('/admin');
    } catch (error) {
      toast.error('Logout failed. Please try again.');
    }
  };

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen || isNotificationsOpen) {
        if (!event.target.closest('.dropdown-container')) {
          setIsProfileDropdownOpen(false);
          setIsNotificationsOpen(false);
        }
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen, isNotificationsOpen]);

  // Check if a navigation item is active
  const isActiveLink = (href) => {
    // If current path exactly matches href
    if (location.pathname === href) return true;
    
    // Handle nested paths - if current path starts with href and href is not just the base route
    if (href !== './admin' && location.pathname.startsWith(href)) return true;
    
    return false;
  };

  const NavItem = ({ item }) => {
    const active = isActiveLink(item.href);
    
    return (
      <Link
        to={item.href}
        className={`group flex items-center gap-3 rounded-lg px-3 py-2 transition-all duration-200 relative overflow-hidden ${
          active 
            ? 'bg-blue-500 text-white font-medium' 
            : 'text-gray-700 hover:bg-blue-50/50 hover:text-blue-600'
        }`}
      >
        {active && (
          <motion.div 
            layoutId="activeNavIndicator"
            className="absolute left-0 top-0 bottom-0 w-1 bg-white rounded-r-md"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.3 }}
          />
        )}
        
        <item.icon className={`h-5 w-5 transition-all duration-200 ${
          active ? 'text-white' : 'text-gray-500 group-hover:text-blue-500'
        }`} />
        
        <span className="font-medium">{item.name}</span>
        
        {item.badge && (
          <motion.span 
            initial={{ scale: 0.8 }}
            animate={{ scale: 1 }}
            transition={{ type: "spring", stiffness: 500, damping: 30 }}
            className={`ml-auto flex h-6 w-6 items-center justify-center rounded-full text-xs font-medium ${
              active 
                ? 'bg-blue-400 text-white' 
                : 'bg-blue-100 text-blue-600'
            }`}
          >
            {item.badge}
          </motion.span>
        )}
      </Link>
    );
  };

  const NavContent = () => (
    <div className="space-y-1">
      {navigation.map((item) => (
        <NavItem key={item.name} item={item} />
      ))}
    </div>
  );

  const notifications = [
    { id: 1, title: "New user registered", time: "2 minutes ago" },
    { id: 2, title: "System update completed", time: "1 hour ago" },
    { id: 3, title: "New order received", time: "3 hours ago" },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Toaster position="top-right" />
      
      {/* Top Navigation Bar */}
      <header className="fixed top-0 z-50 w-full border-b border-gray-200 bg-white shadow-sm backdrop-blur-md bg-white/90">
        <div className="flex h-16 items-center justify-between px-4">
          <div className="flex items-center gap-4">
            <motion.button 
              whileTap={{ scale: 0.9 }}
              onClick={() => setIsMobileMenuOpen(true)}
              className="lg:hidden p-2 text-gray-500 hover:text-blue-600 transition-colors"
            >
              <Menu className="h-6 w-6" />
            </motion.button>

            <Link to="../admin/dashboardoverview" className="flex items-center gap-2">
              <motion.img 
                initial={{ rotate: -10 }}
                animate={{ rotate: 0 }}
                transition={{ duration: 0.5 }}
                src="/logo.png" 
                alt="Logo" 
                className="h-8 w-8 rounded-full shadow-sm" 
              />
              <motion.span 
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: 0.1, duration: 0.5 }}
                className="text-lg font-bold text-gray-800 hidden md:inline-block"
              >
                P<span className="text-blue-600">SEVEN</span>
              </motion.span>
            </Link>
          </div>

          <div className="flex items-center gap-3">
            {/* Notifications */}
            <div className="dropdown-container relative">
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="relative p-2 text-gray-500 hover:text-blue-600 transition-colors rounded-full hover:bg-gray-100"
              >
                <Bell className="h-5 w-5" />
                <span className="absolute top-1 right-1 h-2 w-2 rounded-full bg-red-500"></span>
              </motion.button>
              
              <AnimatePresence>
                {isNotificationsOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-80 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-bold text-gray-800">Notifications</p>
                    </div>
                    <div className="max-h-80 overflow-y-auto">
                      {notifications.map((notification) => (
                        <motion.div
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3 }}
                          key={notification.id}
                          className="px-4 py-3 hover:bg-gray-50 border-b border-gray-100 cursor-pointer"
                        >
                          <p className="text-sm font-medium text-gray-800">{notification.title}</p>
                          <p className="text-xs text-gray-500">{notification.time}</p>
                        </motion.div>
                      ))}
                    </div>
                    <div className="px-4 py-2 text-center border-t border-gray-100">
                      <button className="text-sm text-blue-600 hover:text-blue-800 font-medium">View all notifications</button>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            {/* Profile Dropdown */}
            <div className="dropdown-container relative">
              <motion.button 
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setIsProfileDropdownOpen(!isProfileDropdownOpen)}
                className="flex items-center gap-2 rounded-full focus:outline-none"
              >
                <div className="flex items-center gap-2 border border-gray-200 rounded-full px-2 py-1 hover:bg-gray-50 transition-colors duration-200 hover:border-blue-200">
                  <img src="/logo.png" alt="Profile" className="h-8 w-8 rounded-full" />
                  <span className="hidden md:inline-block text-gray-700 font-medium">{user?.fullName}</span>
                  <ChevronDown className={`h-4 w-4 text-gray-400 transition-transform duration-200 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </div>
              </motion.button>

              {/* Profile Dropdown Menu */}
              <AnimatePresence>
                {isProfileDropdownOpen && (
                  <motion.div 
                    initial={{ opacity: 0, y: 10, scale: 0.95 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 10, scale: 0.95 }}
                    transition={{ duration: 0.2 }}
                    className="absolute right-0 mt-2 w-56 rounded-lg bg-white py-1 shadow-lg ring-1 ring-black ring-opacity-5 overflow-hidden"
                  >
                    <div className="px-4 py-3 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Link
                      to="../admin/profile"
                      className="flex items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <User className="h-4 w-4" />
                      Profile
                    </Link>
                    <motion.button
                      whileTap={{ scale: 0.97 }}
                      onClick={handleLogout}
                      className="flex w-full items-center gap-2 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50 transition-colors"
                    >
                      <LogOut className="h-4 w-4" />
                      Sign Out
                    </motion.button>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <>
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="fixed inset-0 z-50 bg-black/40 backdrop-blur-sm lg:hidden"
              onClick={() => setIsMobileMenuOpen(false)}
            />
            
            <motion.div 
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: "spring", stiffness: 300, damping: 30 }}
              className="fixed inset-y-0 left-0 z-50 w-72 bg-white p-4 shadow-xl lg:hidden"
            >
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-2">
                  <motion.img 
                    whileHover={{ rotate: 10 }}
                    src="/logo.png" 
                    alt="Logo" 
                    className="h-8 w-8 rounded-full" 
                  />
                  <span className="text-lg font-bold text-gray-800">
                    P<span className="text-blue-600">SEVEN</span>
                  </span>
                </div>
                <motion.button 
                  whileTap={{ scale: 0.9 }}
                  onClick={() => setIsMobileMenuOpen(false)}
                  className="text-gray-400 hover:text-gray-500 transition-colors"
                >
                  <X className="h-6 w-6" />
                </motion.button>
              </div>
              <div className="overflow-y-auto max-h-[calc(100vh-8rem)]">
                <NavContent />
              </div>
              <div className="mt-auto pt-4 border-t border-gray-200">
                <div className="flex items-center gap-3 p-2 rounded-lg bg-gray-50">
                  <img src="/logo.png" alt="Profile" className="h-8 w-8 rounded-full" />
                  <div>
                    <p className="text-sm font-medium text-gray-800">{user?.fullName}</p>
                    <p className="text-xs text-gray-500">Admin</p>
                  </div>
                </div>
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="fixed left-0 top-16 hidden h-[calc(100vh-4rem)] w-64 border-r border-gray-200 bg-white shadow-sm lg:block overflow-hidden">
        <motion.div 
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="flex h-full flex-col gap-4 p-4"
        >
          <div className="overflow-y-auto py-2">
            <NavContent />
          </div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="mt-auto border-t border-gray-200 pt-4"
          >
            <div className="flex items-center gap-3 rounded-lg px-3 py-2 bg-gray-50 shadow-sm">
              <div className="flex items-center gap-2">
                <img src="/logo.png" alt="Logo" className="h-8 w-8 rounded-full" />
                <div className="flex flex-col">
                  <span className="text-sm font-medium text-gray-700">{user?.fullName}</span>
                  <span className="text-xs text-gray-500">Admin</span>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </aside>

      {/* Main Content */}
      <main className="lg:pl-64 pt-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="h-full p-6"
        >
          {children}
        </motion.div>
      </main>
    </div>
  );
};

export default DashboardLayout;