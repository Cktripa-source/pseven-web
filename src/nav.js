import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Briefcase, ShoppingBag, Settings, Tag, Phone, Mail, 
  Facebook, Twitter, Instagram, Youtube, LogIn, UserPlus, Menu, 
  X, ShoppingCart, Search, Bell, ChevronDown 
} from 'lucide-react';
import Logo from './images/logo.png';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext';

function Navbar() {
  const { getCartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => setIsProfileDropdownOpen(!isProfileDropdownOpen);
  const toggleNotifications = () => setIsNotificationsOpen(!isNotificationsOpen);

  // Navigation items
  const navItems = [
    { path: '/', label: 'Home', icon: Home },
    { path: '/job-employers', label: 'Jobs', icon: Briefcase },
    { path: '/shopping', label: 'Buy & Sell', icon: ShoppingBag },
    { path: '/services', label: 'Services', icon: Settings },
    { path: '/others', label: 'Others', icon: Tag }
  ];

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  return (
    <nav className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50 shadow-md">
      {/* Compact Top Section with gradient */}
      <div className="hidden md:flex justify-between items-center px-4 py-1 bg-gradient-to-r from-gray-950 to-gray-900 text-xs border-b border-gray-800">
        <div className="flex items-center space-x-3">
          <p className="flex items-center space-x-1 hover:text-green-400 transition-colors">
            <Phone className="h-3 w-3" />
            <span>+250791855396</span>
          </p>
          <a href="mailto:psevenrwanda@gmail.com" className="flex items-center space-x-1 hover:text-green-400 transition-colors">
            <Mail className="h-3 w-3" />
            <span>psevenrwanda@gmail.com</span>
          </a>
        </div>

        <div className="flex items-center space-x-4">
          {/* Social Icons */}
          <div className="flex space-x-3">
            {[Youtube, Facebook, Twitter, Instagram].map((Icon, idx) => (
              <motion.a 
                key={idx} 
                href="#" 
                className="hover:text-green-400 transition-colors opacity-80 hover:opacity-100"
                whileHover={{ scale: 1.1, y: -1 }}
              >
                <Icon className="h-3 w-3" />
              </motion.a>
            ))}
          </div>

          {/* Auth Section */}
          {!isAuthenticated ? (
            <div className="flex space-x-3">
              <Link to="/login" className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                <LogIn className="h-3 w-3" />
                <span>Login</span>
              </Link>
              <span className="text-gray-600">|</span>
              <Link to="/register" className="flex items-center space-x-1 hover:text-green-400 transition-colors">
                <UserPlus className="h-3 w-3" />
                <span>Register</span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Navbar with glass effect */}
      <div className="flex justify-between items-center px-4 py-0.5 bg-gray-900/95 backdrop-blur-sm border-b border-gray-800">
        {/* Logo with subtle animation */}
        <Link to="/" className="flex items-center space-x-1">
          <motion.img
            src={Logo}
            alt="Logo"
            className="h-8 rounded-full shadow-sm"
            whileHover={{ scale: 1.05, rotate: 360 }}
            transition={{ duration: 0.5 }}
          />
          <motion.span 
            className="font-bold text-lg"
            whileHover={{ letterSpacing: "0.05em" }}
            transition={{ duration: 0.3 }}
          >
            <span className="text-green-400">P</span>
            <span className="text-white">SEVEN</span>
          </motion.span>
        </Link>

        {/* Search Bar with refined styling */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-4">
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Search products, services, jobs..."
              className="w-full py-1 px-3 pr-8 rounded-full bg-gray-800/80 border border-gray-700 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none text-xs transition-all placeholder:text-gray-500"
            />
            <Search className="absolute right-3 top-1.5 h-3.5 w-3.5 text-gray-400" />
          </div>
        </div>

        {/* Right Section with improved spacing */}
        <div className="flex items-center space-x-4">
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <motion.button
                  onClick={toggleNotifications}
                  className="relative hover:text-green-400 transition-colors"
                  whileHover={{ y: -1 }}
                >
                  <Bell className="h-5 w-5" />
                  <span className="absolute -top-1 -right-1 bg-green-500 text-xs text-white rounded-full w-3 h-3 flex items-center justify-center text-[10px] shadow-md">
                    3
                  </span>
                </motion.button>
                
                {/* Notifications Dropdown with improved styling */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg py-2 border border-gray-700 z-50 animate-in fade-in duration-150">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <h3 className="font-semibold text-green-400">Notifications</h3>
                    </div>
                    {/* Add notification items here */}
                  </div>
                )}
              </div>

              {/* Cart with improved animation */}
              <motion.div whileHover={{ y: -1 }}>
                <Link to="/viewcart" className="relative hover:text-green-400 transition-colors">
                  <ShoppingCart className="h-5 w-5" />
                  <motion.span
                    className="absolute -top-1 -right-1 bg-green-500 text-xs text-white rounded-full w-3 h-3 flex items-center justify-center text-[10px] shadow-md"
                    animate={{ scale: [1, 1.2, 1] }}
                    transition={{ repeat: Infinity, duration: 1.5 }}
                  >
                    {getCartCount()}
                  </motion.span>
                </Link>
              </motion.div>

              {/* User Profile with improved styling */}
              <div className="relative">
                <motion.button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-1 hover:text-green-400 transition-colors"
                  whileHover={{ y: -1 }}
                >
                  <img
                    src={user?.avatar || '/default-avatar.png'}
                    alt="Profile"
                    className="h-6 w-6 rounded-full border-2 border-green-400 shadow-md object-cover"
                  />
                  <span className="hidden md:block text-xs font-medium">{user?.name || 'User'}</span>
                  <ChevronDown className="h-3 w-3 opacity-70" />
                </motion.button>

                {/* Profile Dropdown with improved styling */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800/95 backdrop-blur-sm rounded-lg shadow-lg py-2 border border-gray-700 z-50 animate-in fade-in duration-150">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700/70 transition-colors text-sm">
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-700/70 transition-colors text-sm">
                      Settings
                    </Link>
                    <div className="border-t border-gray-700 my-1"></div>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700/70 transition-colors text-sm"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="md:hidden flex items-center space-x-3">
              <motion.div whileHover={{ y: -1 }}>
                <Link to="/login" className="hover:text-green-400 transition-colors">
                  <LogIn className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -1 }}>
                <Link to="/register" className="hover:text-green-400 transition-colors">
                  <UserPlus className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          )}

          {/* Mobile Menu Button with improved animation */}
          <motion.button 
            onClick={toggleMobileMenu} 
            className="md:hidden hover:text-green-400 transition-colors"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </motion.button>
        </div>
      </div>

      {/* Navigation Menu with improved styling */}
      <div className="hidden md:flex justify-center py-1 bg-gradient-to-r from-gray-900 to-gray-950 border-b border-gray-800">
        <div className="flex space-x-6">
          {navItems.map(({ path, label, icon: Icon }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Link
                to={path}
                className="flex items-center space-x-1 hover:text-green-400 transition-colors py-0.5 px-2 rounded-md hover:bg-gray-800/50 text-xs font-medium"
              >
                <Icon className="h-3 w-3" />
                <span>{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Menu with improved animation and styling */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: "auto" }}
          exit={{ opacity: 0, height: 0 }}
          transition={{ duration: 0.2 }}
          className="md:hidden bg-gray-900/95 backdrop-blur-sm absolute top-full left-0 w-full border-t border-gray-800 shadow-lg z-50"
        >
          <div className="p-3">
            <div className="relative">
              <input
                type="search"
                placeholder="Search..."
                className="w-full py-1.5 px-3 pl-8 rounded-full bg-gray-800/80 border border-gray-700 focus:border-green-400 focus:outline-none text-sm transition-all"
              />
              <Search className="absolute left-3 top-2 h-4 w-4 text-gray-400" />
            </div>
          </div>
          <div className="divide-y divide-gray-800/50">
            {navItems.map(({ path, label, icon: Icon }, idx) => (
              <motion.div
                key={path}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: idx * 0.05 }}
              >
                <Link
                  to={path}
                  className="flex items-center space-x-2 px-4 py-2 hover:bg-gray-800/50 transition-colors group"
                  onClick={toggleMobileMenu}
                >
                  <Icon className="h-4 w-4 text-green-400 group-hover:scale-110 transition-transform" />
                  <span>{label}</span>
                </Link>
              </motion.div>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;