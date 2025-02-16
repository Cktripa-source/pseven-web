import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Home, Briefcase, ShoppingBag, Settings, Tag, Phone, Mail, 
  Facebook, Twitter, Instagram, Youtube, LogIn, UserPlus, Menu, 
  X, ShoppingCart, Search, User, Bell, LogOut, ChevronDown 
} from 'lucide-react';
import Logo from './images/logo.png';
import { useCart } from './CartContext';
import { useAuth } from './AuthContext'; // Assuming you have an auth context

function Navbar() {
  const { getCartCount } = useCart();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth(); // Add authentication context

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
    <nav className="bg-gray-900 text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
      {/* Top Section */}
      <div className="hidden md:flex justify-between items-center px-6 py-2 bg-gray-950 text-sm border-b border-gray-800">
        <div className="flex items-center space-x-4">
          <p className="flex items-center space-x-2 hover:text-green-400 transition-colors">
            <Phone className="h-4 w-4" />
            <span>+250791855396</span>
          </p>
          <a href="mailto:psevenrwanda@gmail.com" className="flex items-center space-x-2 hover:text-green-400 transition-colors">
            <Mail className="h-4 w-4" />
            <span>psevenrwanda@gmail.com</span>
          </a>
        </div>

        <div className="flex items-center space-x-6">
          {/* Social Icons */}
          <div className="flex space-x-4">
            {[Youtube, Facebook, Twitter, Instagram].map((Icon, idx) => (
              <motion.a 
                key={idx} 
                href="#" 
                className="hover:text-green-400 transition-colors"
                whileHover={{ scale: 1.1 }}
              >
                <Icon className="h-4 w-4" />
              </motion.a>
            ))}
          </div>

          {/* Auth Section */}
          {!isAuthenticated ? (
            <div className="flex space-x-4">
              <Link to="/login" className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Link>
              <Link to="/register" className="flex items-center space-x-2 hover:text-green-400 transition-colors">
                <UserPlus className="h-4 w-4" />
                <span>Register</span>
              </Link>
            </div>
          ) : null}
        </div>
      </div>

      {/* Main Navbar */}
      <div className="flex justify-between items-center px-6 py-1 bg-gray-900 border-b border-gray-800">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <motion.img
            src={Logo}
            alt="Logo"
            className="h-10 rounded-full"
            whileHover={{ scale: 1.05, rotate: 360 }}
            transition={{ duration: 0.5 }}
          />
          <span className="font-bold text-xl text-green-400">
            P<span className="text-white">SEVEN</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="hidden md:flex flex-1 max-w-2xl mx-8">
          <div className="relative w-full">
            <input
              type="search"
              placeholder="Search products, services, jobs..."
              className="w-full py-2 px-4 pr-10 rounded-full bg-gray-800 border border-gray-700 focus:border-green-400 focus:ring-1 focus:ring-green-400 focus:outline-none text-sm"
            />
            <Search className="absolute right-3 top-2.5 h-5 w-5 text-gray-400" />
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-6">
        <Link to="/viewcart" className="relative hover:text-green-400 transition-colors">
      <ShoppingCart className="h-6 w-6" />
      <motion.span
        className="absolute -top-1 -right-1 bg-green-400 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center"
        animate={{ scale: [1, 1.2, 1] }}
        transition={{ repeat: Infinity, duration: 1.5 }}
      >
        {getCartCount() || 0}
      </motion.span>
    </Link>
          {isAuthenticated ? (
            <>
              {/* Notifications */}
              <div className="relative">
                <button
                  onClick={toggleNotifications}
                  className="relative hover:text-green-400 transition-colors"
                >
                  <Bell className="h-6 w-6" />
                  <span className="absolute -top-1 -right-1 bg-green-400 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center">
                    3
                  </span>
                </button>
                
                {/* Notifications Dropdown */}
                {isNotificationsOpen && (
                  <div className="absolute right-0 mt-2 w-80 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700">
                    <div className="px-4 py-2 border-b border-gray-700">
                      <h3 className="font-semibold">Notifications</h3>
                    </div>
                    {/* Add notification items here */}
                  </div>
                )}
              </div>

              {/* Cart */}
              <Link to="/viewcart" className="relative hover:text-green-400 transition-colors">
                <ShoppingCart className="h-6 w-6" />
                <motion.span
                  className="absolute -top-1 -right-1 bg-green-400 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center"
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ repeat: Infinity, duration: 1.5 }}
                >
                  {getCartCount()}
                </motion.span>
              </Link>

              {/* User Profile */}
              <div className="relative">
                <button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 hover:text-green-400 transition-colors"
                >
                  <img
                    src={user?.avatar || '/default-avatar.png'}
                    alt="Profile"
                    className="h-8 w-8 rounded-full border-2 border-green-400"
                  />
                  <span className="hidden md:block">{user?.name || 'User'}</span>
                  <ChevronDown className="h-4 w-4" />
                </button>

                {/* Profile Dropdown */}
                {isProfileDropdownOpen && (
                  <div className="absolute right-0 mt-2 w-48 bg-gray-800 rounded-lg shadow-lg py-2 border border-gray-700">
                    <Link to="/profile" className="block px-4 py-2 hover:bg-gray-700 transition-colors">
                      Profile
                    </Link>
                    <Link to="/settings" className="block px-4 py-2 hover:bg-gray-700 transition-colors">
                      Settings
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="w-full text-left px-4 py-2 text-red-400 hover:bg-gray-700 transition-colors"
                    >
                      Logout
                    </button>
                  </div>
                )}
              </div>
            </>
          ) : (
            <div className="md:hidden flex items-center space-x-4">
              <Link to="/login" className="hover:text-green-400 transition-colors">
                <LogIn className="h-6 w-6" />
              </Link>
              <Link to="/register" className="hover:text-green-400 transition-colors">
                <UserPlus className="h-6 w-6" />
              </Link>
            </div>
          )}

          {/* Mobile Menu Button */}
          <button onClick={toggleMobileMenu} className="md:hidden hover:text-green-400 transition-colors">
            {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Navigation Menu */}
      <div className="hidden md:flex justify-center py-2 bg-gray-950 border-b border-gray-800">
        <div className="flex space-x-8">
          {navItems.map(({ path, label, icon: Icon }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx }}
            >
              <Link
                to={path}
                className="flex items-center space-x-2 hover:text-green-400 transition-colors py-1 px-3 rounded-md hover:bg-gray-800"
              >
                <Icon className="h-4 w-4" />
                <span>{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-gray-900 absolute top-full left-0 w-full border-t border-gray-800"
        >
          <div className="p-4">
            <input
              type="search"
              placeholder="Search..."
              className="w-full py-2 px-4 rounded-full bg-gray-800 border border-gray-700 focus:border-green-400 focus:outline-none text-sm"
            />
          </div>
          <div className="divide-y divide-gray-800">
            {navItems.map(({ path, label, icon: Icon }) => (
              <Link
                key={path}
                to={path}
                className="flex items-center space-x-2 px-6 py-3 hover:bg-gray-800 transition-colors"
                onClick={toggleMobileMenu}
              >
                <Icon className="h-5 w-5" />
                <span>{label}</span>
              </Link>
            ))}
          </div>
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;