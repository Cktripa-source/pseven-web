import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
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
  const [isScrolled, setIsScrolled] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const [bubbles, setBubbles] = useState([]);

  // Handle scroll effect with debounce
  useEffect(() => {
    let timeoutId;
    const handleScroll = () => {
      if (timeoutId) {
        clearTimeout(timeoutId);
      }
      
      timeoutId = setTimeout(() => {
        setIsScrolled(window.scrollY > 20);
      }, 50);
    };
    
    window.addEventListener('scroll', handleScroll);
    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (timeoutId) clearTimeout(timeoutId);
    };
  }, []);

  // Generate bubbles
  useEffect(() => {
    // Generate random bubbles
    const generateBubbles = () => {
      const newBubbles = [];
      const bubbleCount = 20;
      
      for (let i = 0; i < bubbleCount; i++) {
        newBubbles.push({
          id: i,
          x: Math.random() * 100, // percentage position
          size: Math.random() * 20 + 10, // bubble size between 10-30px
          duration: Math.random() * 10 + 5, // animation duration between 10-30s
          delay: Math.random() * 0.2, // delay start between 0-10s
          opacity: Math.random() * 0.6 + 0.2, // opacity between 0.1-0.4
        });
      }
      
      setBubbles(newBubbles);
    };
    
    generateBubbles();
    
    // Regenerate bubbles periodically
    const interval = setInterval(generateBubbles, 30000);
    
    return () => clearInterval(interval);
  }, []);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
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

  // Generate user avatar with first letter
  const getUserAvatar = () => {
    if (user?.avatar) return user.avatar;
    
    const name = user?.name || 'User';
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];
    const colorIndex = name.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];
    
    return (
      <div 
        className="h-7 w-7 rounded-full flex items-center justify-center text-white text-xs font-bold shadow-sm"
        style={{ backgroundColor: bgColor }}
      >
        {firstLetter}
      </div>
    );
  };

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
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-hidden ${
        isScrolled ? 'backdrop-blur-md bg-gray-200/90' : 'bg-gray-900 backdrop-blur-md'
      }`}
    >
      {/* Bubbles Container */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        {bubbles.map((bubble) => (
          <motion.div
            key={bubble.id}
            className="absolute rounded-full"
            initial={{ 
              left: `${bubble.x}%`,
              bottom: -bubble.size,
              width: bubble.size,
              height: bubble.size,
              opacity: bubble.opacity,
              background: isScrolled ? 
                `radial-gradient(circle at center, rgb(79, 240, 186), rgb(66, 247, 187))` :
                `radial-gradient(circle at center, rgba(132, 248, 138, 0.56), rgb(122, 241, 142))`
            }}
            animate={{ 
              bottom: '120%',
              opacity: [bubble.opacity, bubble.opacity * 1.5, 0]
            }}
            transition={{ 
              duration: bubble.duration,
              delay: bubble.delay,
              ease: "linear",
              repeat: Infinity,
              repeatDelay: Math.random() * 5
            }}
          />
        ))}
      </div>

      {/* Single Row Navbar */}
      <div className="container m-auto px-4 flex gap-6 items-center justify-between h-20 relative">
        {/* Logo */}
        <div className="flex items-center">
          <Link to="/" className="flex items-center space-x-2 group">
            <motion.div
              whileHover={{ scale: 1.05, rotate: 5 }}
              transition={{ type: "spring", stiffness: 400, damping: 10 }}
            >
              <img
                src={Logo}
                alt="Logo"
                className="h-8 rounded-full shadow-sm"
              />
            </motion.div>
            <motion.div 
              className="font-bold text-lg"
              whileHover={{ letterSpacing: "0.03em" }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-green-600">P</span>
              <span className={isScrolled ? "text-gray-900" : "text-gray-50"}>SEVEN</span>
            </motion.div>
          </Link>
        </div>

        {/* Navigation Menu - Desktop only */}
        <div className="hidden md:flex items-center space-x-6">
          {navItems.map(({ path, label, icon: Icon }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
            >
              <Link
                to={path}
                className={`flex items-center space-x-1.5 transition-all py-1 px-2 rounded-md hover:bg-gray-100 text-sm font-medium group ${
                  isScrolled ? 'text-gray-950 hover:text-green-600' : 'text-gray-50 hover:text-green-600'
                }`}
              >
                <Icon className="h-4 w-4 group-hover:text-green-600" />
                <span>{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Search Bar - Desktop */}
        <div className="hidden lg:flex flex-1 max-w-md mx-4">
          <div className="relative w-full group">
            <input
              type="search"
              placeholder="Search products, services, jobs..."
              className="w-full py-1.5 px-4 pr-10 rounded-full bg-gray-100 border border-gray-200 focus:border-green-500 focus:ring-1 focus:ring-green-500 focus:outline-none text-sm transition-all group-hover:bg-white placeholder:text-gray-500"
            />
            <button className="absolute right-3 top-1.5 text-gray-500 group-hover:text-green-600 transition-colors">
              <Search className="h-4 w-4" />
            </button>
          </div>
        </div>

        {/* Right Section */}
        <div className="flex items-center space-x-1 md:space-x-4">
          {/* Cart with bubble animation on hover */}
          <motion.div whileHover={{ y: -2 }} className="relative">
            <Link to="/viewcart" className="relative text-gray-700 hover:text-green-600 transition-colors p-1.5 group">
              <ShoppingCart className="h-5 w-5" />
              {getCartCount() > 0 && (
                <motion.span
                  className="absolute top-4 -right-4 bg-green-600 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-sm"
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ type: "spring", stiffness: 400, damping: 10 }}
                >
                  {getCartCount() || 0}
                </motion.span>
              )}
              
              {/* Mini bubbles on hover */}
              <AnimatePresence>
                {[1, 2, 3].map((i) => (
                  <motion.div
                    key={`cart-bubble-${i}`}
                    className="absolute rounded-full bg-green-500/30 hidden group-hover:block"
                    style={{
                      width: 4 + i * 2,
                      height: 4 + i * 2,
                      bottom: 0,
                      left: 8 + i * 3,
                    }}
                    initial={{ y: 0, opacity: 0 }}
                    animate={{ y: -15 - i * 5, opacity: [0, 0.8, 0] }}
                    exit={{ opacity: 0 }}
                    transition={{ 
                      duration: 1.5,
                      delay: i * 0.2,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                ))}
              </AnimatePresence>
            </Link>
          </motion.div>
          
          {isAuthenticated ? (
            <>
              {/* Notifications with bubble animations */}
              <div className="relative dropdown-container">
                <motion.button
                  onClick={toggleNotifications}
                  className="relative text-gray-700 hover:text-green-600 transition-colors p-1.5 group"
                  whileHover={{ y: -2 }}
                >
                  <Bell className="h-5 w-5" />
                  <motion.span 
                    className="absolute -top-1 -right-1 bg-green-600 text-xs text-white rounded-full w-4 h-4 flex items-center justify-center text-[10px] font-bold shadow-sm"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    whileHover={{ scale: 1.2 }}
                  >
                    3
                  </motion.span>
                  
                  {/* Notification ripple effect */}
                  <motion.div
                    className="absolute -top-1 -right-1 rounded-full border-2 border-green-500/50 hidden group-hover:block"
                    style={{ width: 16, height: 16 }}
                    animate={{ 
                      scale: [1, 1.5, 2],
                      opacity: [1, 0.5, 0]
                    }}
                    transition={{ 
                      duration: 1.5,
                      repeat: Infinity,
                      repeatType: "loop"
                    }}
                  />
                </motion.button>
                
                {/* Notifications Dropdown */}
                <AnimatePresence>
                  {isNotificationsOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute right-0 mt-2 w-80 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center justify-between">
                        <h3 className="font-medium text-green-600">Notifications</h3>
                        <span className="text-xs bg-green-100 text-green-600 px-2 py-0.5 rounded-full">3 new</span>
                      </div>
                      <div className="max-h-60 overflow-y-auto">
                        {[1, 2, 3].map((item) => (
                          <div key={item} className="px-4 py-2 hover:bg-gray-50 transition-colors border-b border-gray-100">
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center flex-shrink-0">
                                <Bell className="h-4 w-4 text-green-600" />
                              </div>
                              <div>
                                <p className="text-sm font-medium text-gray-900">New notification {item}</p>
                                <p className="text-xs text-gray-500 mt-0.5">Just now</p>
                              </div>
                            </div>
                          </div>
                        ))}
                      </div>
                      <div className="px-4 py-2 border-t border-gray-200">
                        <button className="w-full text-center text-xs text-green-600 hover:text-green-700">
                          View all notifications
                        </button>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>

              {/* User Profile */}
              <div className="relative dropdown-container">
                <motion.button
                  onClick={toggleProfileDropdown}
                  className="flex items-center space-x-2 text-gray-800 hover:text-green-600 transition-colors p-1 group"
                  whileHover={{ y: -2 }}
                >
                  {typeof getUserAvatar() === 'string' ? (
                    <div className="relative">
                      <img
                        src={getUserAvatar()}
                        alt="Profile"
                        className="h-7 w-7 rounded-full border-2 border-green-500/30 shadow-sm object-cover"
                      />
                      
                      {/* Avatar glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-green-500/0 hidden group-hover:block"
                        animate={{ 
                          boxShadow: ["0 0 0 0px rgba(16, 185, 129, 0.2)", "0 0 0 4px rgba(16, 185, 129, 0)"],
                          borderColor: ["rgba(16, 185, 129, 0.6)", "rgba(16, 185, 129, 0)"]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      {getUserAvatar()}
                      
                      {/* Avatar glow effect on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-full border-2 border-green-500/0 hidden group-hover:block"
                        animate={{ 
                          boxShadow: ["0 0 0 0px rgba(16, 185, 129, 0.2)", "0 0 0 4px rgba(16, 185, 129, 0)"],
                          borderColor: ["rgba(16, 185, 129, 0.6)", "rgba(16, 185, 129, 0)"]
                        }}
                        transition={{ 
                          duration: 1.5,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                    </div>
                  )}
                  <span className="hidden md:block text-sm font-medium max-w-24 truncate">
                    {user?.name || 'User'}
                  </span>
                  <ChevronDown className={`h-3 w-3 opacity-70 transition-transform duration-300 ${isProfileDropdownOpen ? 'rotate-180' : ''}`} />
                </motion.button>

                {/* Profile Dropdown */}
                <AnimatePresence>
                  {isProfileDropdownOpen && (
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      transition={{ type: "spring", stiffness: 400, damping: 30 }}
                      className="absolute right-0 mt-2 w-56 bg-white rounded-lg shadow-lg py-2 border border-gray-200 z-50"
                    >
                      <div className="px-4 py-2 border-b border-gray-200 flex items-center space-x-3">
                        {typeof getUserAvatar() === 'string' ? (
                          <img
                            src={getUserAvatar()}
                            alt="Profile"
                            className="h-10 w-10 rounded-full border-2 border-green-500/30 shadow-sm object-cover"
                          />
                        ) : (
                          getUserAvatar()
                        )}
                        <div>
                          <p className="font-medium text-gray-900">{user?.name || 'User'}</p>
                          <p className="text-xs text-gray-500">{user?.email || 'user@example.com'}</p>
                        </div>
                      </div>
                      
                      <div className="py-1">
                        {[
                          { label: 'Your Profile', path: '/profile' },
                          { label: 'Account Settings', path: '/settings' },
                          { label: 'Your Orders', path: '/orders' }
                        ].map((item, idx) => (
                          <Link 
                            key={idx}
                            to={item.path} 
                            className="flex items-center px-4 py-2 hover:bg-gray-50 transition-colors text-sm space-x-2 text-gray-700"
                            onClick={() => setIsProfileDropdownOpen(false)}
                          >
                            <span>{item.label}</span>
                          </Link>
                        ))}
                      </div>
                      
                      <div className="border-t border-gray-200 my-1"></div>
                      <button
                        onClick={handleLogout}
                        className="w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50 transition-colors text-sm flex items-center space-x-2"
                      >
                        <LogIn className="h-4 w-4 rotate-180" />
                        <span>Logout</span>
                      </button>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            </>
          ) : (
            <div className="flex items-center space-x-2 md:space-x-3">
              <motion.div whileHover={{ y: -2 }} className="hidden md:block relative group">
                <Link to="/login" className="px-4 py-1.5 text-green-50 border border-green-50 hover:bg-gray-950 rounded-full text-sm font-medium transition-colors">
                  Sign In
                </Link>
                {/* Bubble effect on hover */}
                <AnimatePresence>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={`signin-bubble-${i}`}
                      className="absolute rounded-full bg-green-500/30 hidden group-hover:block"
                      style={{
                        width: 4 + i * 2,
                        height: 4 + i * 2,
                        bottom: -2,
                        left: 20 + i * 10,
                      }}
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: -15 - i * 3, opacity: [0, 0.8, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 1.5,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="hidden md:block relative group">
                <Link to="/register" className="px-4 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-full text-sm font-medium transition-colors shadow-sm">
                  Sign Up
                </Link>
                {/* Bubble effect on hover */}
                <AnimatePresence>
                  {[1, 2, 3].map((i) => (
                    <motion.div
                      key={`signup-bubble-${i}`}
                      className="absolute rounded-full bg-green-200 hidden group-hover:block"
                      style={{
                        width: 4 + i * 2,
                        height: 4 + i * 2,
                        bottom: -2,
                        left: 20 + i * 10,
                      }}
                      initial={{ y: 0, opacity: 0 }}
                      animate={{ y: -15 - i * 3, opacity: [0, 0.8, 0] }}
                      exit={{ opacity: 0 }}
                      transition={{ 
                        duration: 1.5,
                        delay: i * 0.2,
                        repeat: Infinity,
                        repeatType: "loop"
                      }}
                    />
                  ))}
                </AnimatePresence>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="md:hidden">
                <Link to="/login" className="text-gray-700 hover:text-green-600 transition-colors p-1.5">
                  <LogIn className="h-5 w-5" />
                </Link>
              </motion.div>
              <motion.div whileHover={{ y: -2 }} className="md:hidden">
                <Link to="/register" className="text-gray-700 hover:text-green-600 transition-colors p-1.5">
                  <UserPlus className="h-5 w-5" />
                </Link>
              </motion.div>
            </div>
          )}

          {/* Mobile Menu Button with bubble animation */}
          <motion.button 
            onClick={toggleMobileMenu} 
            className="md:hidden text-gray-800 hover:text-green-600 transition-colors p-1.5 relative group"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            {isMobileMenuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            
            {/* Button bubble animations */}
            <AnimatePresence>
              {!isMobileMenuOpen && [1, 2].map((i) => (
                <motion.div
                  key={`menu-bubble-${i}`}
                  className="absolute rounded-full bg-green-500/20 hidden group-hover:block"
                  style={{
                    width: 4 + i * 2,
                    height: 4 + i * 2,
                    top: i * 3 + 2,
                    right: i * 3,
                  }}
                  initial={{ x: 0, opacity: 0 }}
                  animate={{ x: [-5, 5, -5], opacity: [0, 0.8, 0] }}
                  exit={{ opacity: 0 }}
                  transition={{ 
                    duration: 2,
                    delay: i * 0.3,
                    repeat: Infinity,
                    repeatType: "loop"
                  }}
                />
              ))}
            </AnimatePresence>
          </motion.button>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.3 }}
            className="md:hidden bg-white/95 backdrop-blur-sm absolute top-full left-0 w-full border-t border-gray-200 shadow-lg z-50"
          >
            <div className="p-4">
              <div className="relative">
                <input
                  type="search"
                  placeholder="Search products, services, jobs..."
                  className="w-full py-2 px-4 pl-10 rounded-full bg-gray-100 border border-gray-200 focus:border-green-500 focus:outline-none text-sm transition-all"
                />
                <Search className="absolute left-3.5 top-2.5 h-4 w-4 text-gray-500" />
              </div>
            </div>
            <div className="divide-y divide-gray-200">
              {navItems.map(({ path, label, icon: Icon }, idx) => (
                <motion.div
                  key={path}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: idx * 0.05 }}
                >
                  <Link
                    to={path}
                    className="flex items-center space-x-3 px-6 py-3 hover:bg-gray-50 transition-colors group text-gray-800"
                    onClick={toggleMobileMenu}
                  >
                    <div className="w-8 h-8 rounded-full bg-gray-100 flex items-center justify-center relative">
                      <Icon className="h-4 w-4 text-green-600 group-hover:scale-110 transition-transform" />
                      
                      {/* Icon bubble animation on hover */}
                      <motion.div
                        className="absolute inset-0 rounded-full hidden group-hover:block"
                        animate={{ 
                          boxShadow: ["0 0 0 0px rgba(16, 185, 129, 0.3)", "0 0 0 4px rgba(16, 185, 129, 0)"]
                        }}
                        transition={{ 
                          duration: 1.2,
                          repeat: Infinity,
                          repeatType: "loop"
                        }}
                      />
                    </div>
                    <span className="font-medium">{label}</span>
                  </Link>
                </motion.div>
              ))}
            </div>
            
            {/* Contact Info in Mobile Menu - Kept in mobile view */}
            <div className="px-6 py-3 border-t border-gray-200">
              <p className="text-sm font-medium text-gray-700 mb-2">Contact Us</p>
              <div className="space-y-2">
                <a href="tel:+250791855396" className="flex items-center space-x-2 text-gray-600 text-sm group">
                  <Phone className="h-4 w-4 text-green-600 group-hover:animate-pulse" />
                  <span className="group-hover:text-green-600 transition-colors">+250791855396</span>
                </a>
                <a href="mailto:psevenrwanda@gmail.com" className="flex items-center space-x-2 text-gray-600 text-sm group">
                  <Mail className="h-4 w-4 text-green-600 group-hover:animate-pulse" />
                  <span className="group-hover:text-green-600 transition-colors">psevenrwanda@gmail.com</span>
                </a>
              </div>
            </div>
            
            {/* Mobile auth buttons */}
            {!isAuthenticated && (
              <motion.div 
                className="flex justify-center space-x-4 p-6 border-t border-gray-200"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                <Link 
                  to="/login" 
                  className="flex-1 text-center px-6 py-2.5 border border-green-600 text-green-600 rounded-full text-sm font-medium transition-colors relative overflow-hidden group"
                  onClick={toggleMobileMenu}
                >
                  <span className="relative z-10">Sign In</span>
                  <motion.div 
  className="absolute inset-0 bg-green-50 opacity-0 group-hover:opacity-100 transition-opacity"
  initial={{ x: "-100%" }}
  whileHover={{ x: "0%" }}
  transition={{ duration: 0.3 }}
/>
</Link>
<Link 
  to="/register" 
  className="flex-1 text-center px-6 py-2.5 bg-green-600 text-white rounded-full text-sm font-medium transition-colors shadow-sm relative overflow-hidden group"
  onClick={toggleMobileMenu}
>
  <span className="relative z-10">Sign Up</span>
  <motion.div 
    className="absolute inset-0 bg-green-700 opacity-0 group-hover:opacity-100 transition-opacity"
    initial={{ x: "-100%" }}
    whileHover={{ x: "0%" }}
    transition={{ duration: 0.3 }}
  />
</Link>
</motion.div>
)}

{/* Social Media Icons */}
<div className="flex justify-center items-center space-x-4 p-4 border-t border-gray-200">
  {[
    { icon: Facebook, href: "#", color: "#1877F2" },
    { icon: Twitter, href: "#", color: "#1DA1F2" },
    { icon: Instagram, href: "#", color: "#E4405F" },
    { icon: Youtube, href: "#", color: "#FF0000" }
  ].map((social, idx) => (
    <motion.a
      key={idx}
      href={social.href}
      target="_blank"
      rel="noopener noreferrer"
      whileHover={{ y: -3 }}
      className="p-2 rounded-full text-gray-600 hover:text-gray-800 transition-colors"
    >
      <social.icon className="h-5 w-5" />
    </motion.a>
  ))}
</div>
</motion.div>
)}
</AnimatePresence>
</nav>
);
}

export default Navbar;