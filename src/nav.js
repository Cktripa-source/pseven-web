import { Link } from 'react-router-dom';
import React, { useState, useEffect, useRef } from 'react';
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
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  const dropdownRefs = useRef({});
  const searchRef = useRef(null);

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

  // Close dropdowns when clicking outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (isProfileDropdownOpen || isNotificationsOpen || isSearchOpen) {
        // Check if the click was on a nav item that toggles a dropdown
        const isNavItemClick = Object.values(dropdownRefs.current).some(
          ref => ref && ref.contains(event.target)
        );
        
        if (!isNavItemClick && !event.target.closest('.dropdown-content')) {
          setIsProfileDropdownOpen(false);
          setIsNotificationsOpen(false);
          setIsSearchOpen(false);
        }
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [isProfileDropdownOpen, isNotificationsOpen, isSearchOpen]);

  const toggleMobileMenu = () => setIsMobileMenuOpen(!isMobileMenuOpen);
  
  const toggleProfileDropdown = () => {
    setIsProfileDropdownOpen(!isProfileDropdownOpen);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  };
  
  const toggleNotifications = () => {
    setIsNotificationsOpen(!isNotificationsOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
    if (isSearchOpen) setIsSearchOpen(false);
  };

  const toggleSearch = () => {
    setIsSearchOpen(!isSearchOpen);
    if (isProfileDropdownOpen) setIsProfileDropdownOpen(false);
    if (isNotificationsOpen) setIsNotificationsOpen(false);
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Handle search submission
    console.log(`Searching for: ${searchQuery}`);
    // Close search dropdown after search
    setIsSearchOpen(false);
  };

  // Generate user avatar with first letter
  const getUserAvatar = () => {
    if (user?.avatar) return user.avatar;
    
    const fullName = user?.fullName || 'User';
    const firstLetter = fullName.charAt(0).toUpperCase();
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];
    const colorIndex = fullName.charCodeAt(0) % colors.length;
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
    { key: 'home', path: '/', label: 'Home', icon: Home },
    { key: 'jobs', path: '/job-employers', label: 'Jobs', icon: Briefcase },
    { key: 'shopping', path: '/shopping', label: 'Buy & Sell', icon: ShoppingBag },
    { key: 'services', path: '/services', label: 'Services', icon: Settings },
    { key: 'others', path: '/others', label: 'Others', icon: Tag }
  ];

  const handleLogout = () => {
    logout();
    setIsProfileDropdownOpen(false);
  };

  // Sample search results for global search
  const getSearchResults = (query) => {
    if (!query) return [];
    
    const allResults = [
      { id: 1, category: 'Home', title: 'Homepage Banner', link: '/home/banner' },
      { id: 2, category: 'Home', title: 'Featured Products', link: '/home/featured' },
      { id: 3, category: 'Jobs', title: 'Software Developer', link: '/jobs/software-developer' },
      { id: 4, category: 'Jobs', title: 'Marketing Manager', link: '/jobs/marketing-manager' },
      { id: 5, category: 'Shopping', title: 'Electronics', link: '/shopping/electronics' },
      { id: 6, category: 'Shopping', title: 'Clothing', link: '/shopping/clothing' },
      { id: 7, category: 'Services', title: 'Web Development', link: '/services/web-development' },
      { id: 8, category: 'Services', title: 'Graphic Design', link: '/services/graphic-design' },
      { id: 9, category: 'Others', title: 'Community Events', link: '/others/community-events' },
      { id: 10, category: 'Others', title: 'Help Center', link: '/others/help-center' }
    ];
    
    return allResults.filter(item => 
      item.title.toLowerCase().includes(query.toLowerCase()) ||
      item.category.toLowerCase().includes(query.toLowerCase())
    );
  };

  return (
    <nav 
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 overflow-visible ${
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
                className="h-6 sm:h-8 rounded-full shadow-sm"
              />
            </motion.div>
            <motion.div 
              className="font-bold text-sm sm:text-lg"
              whileHover={{ letterSpacing: "0.03em" }}
              transition={{ duration: 0.3 }}
            >
              <span className="text-green-600">P</span>
              <span className={isScrolled ? "text-gray-900" : "text-gray-50"}>SEVEN</span>
            </motion.div>
          </Link>
        </div>

        {/* Navigation Menu - Desktop */}
        <div className="hidden lg:flex items-center space-x-6">
          {navItems.map(({ key, path, label, icon: Icon }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 5 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.05 * idx }}
            >
              <Link
                to={path}
                className={`flex items-center space-x-1 px-3 py-2 rounded-lg transition-all duration-200 ${
                  isScrolled ? 'text-gray-800 hover:bg-gray-200' : 'text-gray-200 hover:bg-gray-700'
                }`}
              >
                <Icon size={16} className="shrink-0" />
                <span>{label}</span>
              </Link>
            </motion.div>
          ))}
        </div>

        {/* Right Section - Icons and Mobile Menu */}
        <div className="flex items-center space-x-2 sm:space-x-4">
          {/* Search Icon */}
          <div className="relative">
            <button 
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
              }`}
              onClick={toggleSearch}
              ref={el => {
                dropdownRefs.current.search = el;
                searchRef.current = el;
              }}
            >
              <Search size={20} className={isScrolled ? 'text-gray-800' : 'text-gray-200'} />
            </button>
            
            <AnimatePresence>
        {isSearchOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-50"
          >
            <div className="bg-white w-full max-w-4xl p-4 m-auto rounded-lg shadow-lg">
              <form onSubmit={handleSearchSubmit}>
                <div className="relative">
                  <input
                    type="text"
                    placeholder="Search across all categories..."
                    value={searchQuery}
                    onChange={handleSearchChange}
                    className="w-full px-3 py-2 pl-10 border border-gray-300 rounded-full focus:outline-none focus:ring-2 focus:ring-green-500"
                    autoFocus
                  />
                  <Search size={16} className="absolute left-3 top-3 text-gray-400" />
                </div>
              </form>
              <div className="mt-4 max-h-60 overflow-y-auto">
                {searchQuery && getSearchResults(searchQuery).map(result => (
                  <div key={result.id}>
                    <Link
                      to={result.link}
                      onClick={() => setIsSearchOpen(false)}
                      className="block px-2 py-2 hover:bg-gray-100 rounded-md transition-colors text-sm"
                    >
                      <span className="text-xs text-gray-500">{result.category}</span>
                      <div>{result.title}</div>
                    </Link>
                  </div>
                ))}

                {searchQuery && getSearchResults(searchQuery).length === 0 && (
                  <div className="px-2 py-2 text-gray-500 text-sm text-center">
                    No results found
                  </div>
                )}

                {!searchQuery && (
                  <div className="px-2 py-2 text-gray-500 text-sm text-center">
                    Type to search
                  </div>
                )}
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
          </div>

          {/* Cart Icon */}
          <Link to="/viewcart" className="relative">
            <button className={`p-2 rounded-full transition-colors ${
              isScrolled ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
            }`}>
             <ShoppingCart size={20} className={isScrolled ? 'text-gray-800' : 'text-gray-200'} />
              {getCartCount() > 0 && (
                <span className="absolute -top-1 -right-1 bg-green-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                  {getCartCount() > 9 ? '9+' : getCartCount()}
                </span>
              )}
            </button>
          </Link>

          {/* Notifications Icon */}
          <div className="relative">
            <button 
              className={`p-2 rounded-full transition-colors ${
                isScrolled ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
              }`}
              onClick={toggleNotifications}
              ref={el => dropdownRefs.current.notifications = el}
            >
              <Bell size={20} className={isScrolled ? 'text-gray-800' : 'text-gray-200'} />
              <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
                3
              </span>
            </button>
            
           <AnimatePresence>
  {isNotificationsOpen && (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 10 }}
      className="absolute md:right-0 -right-20 m-auto top-full mt-2 w-80 md:w-[700px] bg-white rounded-lg shadow-lg py-3 dropdown-content"
    >
      <div className="px-4 pb-2 border-b border-gray-100 flex justify-between items-center">
        <h3 className="font-semibold text-gray-800">Notifications</h3>
        <ChevronDown size={16} className="text-gray-500" />
      </div>
      <div className="max-h-60 overflow-y-auto">
        <div className="px-4 py-2 border-b border-gray-100 hover:bg-gray-50">
          <div className="text-sm font-medium">New message from John</div>
          <div className="text-xs text-gray-500">2 minutes ago</div>
        </div>
        <div className="px-4 py-2 border-b border-gray-100 hover:bg-gray-50">
          <div className="text-sm font-medium">Your item has been shipped</div>
          <div className="text-xs text-gray-500">3 hours ago</div>
        </div>
        <div className="px-4 py-2 hover:bg-gray-50">
          <div className="text-sm font-medium">Password changed successfully</div>
          <div className="text-xs text-gray-500">Yesterday</div>
        </div>
      </div>
      <div className="px-4 pt-2 border-t border-gray-100">
        <Link to="/notifications" className="text-sm text-green-600 hover:text-green-700">
          View all notifications
        </Link>
      </div>
    </motion.div>
  )}
</AnimatePresence>

          </div>

          {/* Profile Dropdown */}
          <div className="relative">
            {isAuthenticated ? (
              <button
                className="flex items-center space-x-1"
                onClick={toggleProfileDropdown}
                ref={el => dropdownRefs.current.profile = el}
              >
                <div className="relative">
                  {typeof user?.avatar === 'string' ? (
                    <img 
                      src={user.avatar} 
                      alt="Profile" 
                      className="h-7 w-7 rounded-full object-cover border-2 border-green-500"
                    />
                  ) : (
                    getUserAvatar()
                  )}
                </div>
                <ChevronDown size={16} className={isScrolled ? 'text-gray-800' : 'text-gray-200'} />
              </button>
            ) : (
              /* Login/Register buttons for desktop view only */
              <div className="hidden lg:flex items-center space-x-2">
                <Link
                  to="/login"
                  className={`flex items-center space-x-1 px-3 py-1.5 rounded-md text-sm ${
                    isScrolled 
                      ? 'text-gray-800 hover:bg-gray-200' 
                      : 'text-gray-200 hover:bg-gray-700'
                  }`}
                >
                  <LogIn size={16} />
                  <span>Login</span>
                </Link>
                <Link
                  to="/register"
                  className="flex items-center space-x-1 px-3 py-1.5 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors"
                >
                  <UserPlus size={16} />
                  <span>Register</span>
                </Link>
              </div>
            )}
            
            <AnimatePresence>
              {isAuthenticated && isProfileDropdownOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 10 }}
                  className="absolute right-0 top-full mt-2 w-60 bg-white rounded-lg shadow-lg py-2 dropdown-content"
                >
                  <div className="px-4 py-2 border-b border-gray-100">
                    <div className="font-medium">{user?.name}</div>
                    <div className="text-sm text-gray-500">{user?.fullName}</div>
                  </div>
                  <Link to="/userDashboard" className="block px-4 py-2 hover:bg-gray-50">My Dashboard</Link>
                  <div className="border-t border-gray-100 mt-1 pt-1">
                    <button 
                      onClick={handleLogout}
                      className="block w-full text-left px-4 py-2 text-red-600 hover:bg-gray-50"
                    >
                      Logout
                    </button>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
          
          {/* Mobile Menu Button - Show even for non-authenticated users */}
          <div className="lg:hidden">
            <button
              onClick={toggleMobileMenu}
              className={`p-2 rounded-md transition-colors ${
                isScrolled ? 'hover:bg-gray-200' : 'hover:bg-gray-800'
              }`}
            >
              {isMobileMenuOpen ? (
                <X size={24} className={isScrolled ? 'text-gray-800' : 'text-gray-200'} />
              ) : (
                <Menu size={24} className={isScrolled ? 'text-gray-800' : 'text-gray-200'} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      <AnimatePresence>
        {isMobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            className={`lg:hidden overflow-hidden ${
              isScrolled ? 'bg-gray-100' : 'bg-gray-800'
            }`}
          >
            <div className="container mx-auto px-4 py-3 space-y-1">
              {navItems.map(({ key, path, label, icon: Icon }) => (
                <Link
                  key={key}
                  to={path}
                  className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                    isScrolled 
                      ? 'text-gray-800 hover:bg-gray-200' 
                      : 'text-gray-200 hover:bg-gray-700'
                  }`}
                  onClick={() => setIsMobileMenuOpen(false)}
                >
                  <Icon size={18} />
                  <span>{label}</span>
                </Link>
              ))}
              
              {/* Login and Register buttons for mobile - always show in mobile menu when not authenticated */}
              {!isAuthenticated && (
                <div className="py-2 space-y-2 border-t border-gray-700 mt-2">
                  <Link
                    to="/login"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                      isScrolled 
                        ? 'text-gray-800 bg-gray-200 hover:bg-gray-300' 
                        : 'text-gray-200 bg-gray-700 hover:bg-gray-600'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <LogIn size={18} />
                    <span>Login</span>
                  </Link>
                  <Link
                    to="/register"
                    className="flex items-center space-x-2 px-3 py-2 rounded-md bg-green-600 hover:bg-green-700 text-white"
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <UserPlus size={18} />
                    <span>Register</span>
                  </Link>
                </div>
              )}
              
              {/* User profile options when logged in */}
              {isAuthenticated && (
                <div className="py-2 space-y-1 border-t border-gray-700 mt-2">
                  <div className="px-3 py-2">
                    <div className={isScrolled ? "font-medium text-gray-800" : "font-medium text-gray-200"}>{user?.name}</div>
                    <div className={isScrolled ? "text-sm text-gray-600" : "text-sm text-gray-400"}>{user?.email}</div>
                  </div>
                  <Link
                    to="/profile"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                      isScrolled ? 'text-gray-800 hover:bg-gray-200' : 'text-gray-200 hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>My Profile</span>
                  </Link>
                  <Link
                    to="/orders"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                      isScrolled ? 'text-gray-800 hover:bg-gray-200' : 'text-gray-200 hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>My Orders</span>
                  </Link>
                  <Link
                    to="/favorites"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                      isScrolled ? 'text-gray-800 hover:bg-gray-200' : 'text-gray-200 hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Saved Items</span>
                  </Link>
                  <Link
                    to="/settings"
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md ${
                      isScrolled ? 'text-gray-800 hover:bg-gray-200' : 'text-gray-200 hover:bg-gray-700'
                    }`}
                    onClick={() => setIsMobileMenuOpen(false)}
                  >
                    <span>Settings</span>
                  </Link>
                  <button
                    onClick={() => {
                      handleLogout();
                      setIsMobileMenuOpen(false);
                    }}
                    className={`flex items-center space-x-2 px-3 py-2 rounded-md w-full text-left ${
                      isScrolled ? 'text-red-600 hover:bg-gray-200' : 'text-red-400 hover:bg-gray-700'
                    }`}
                  >
                    <span>Logout</span>
                  </button>
                </div>
              )}
              
              <div className="pt-2 mt-2 border-t border-gray-700">
                <div className="flex items-center space-x-2">
                  <Mail size={16} className={isScrolled ? 'text-gray-600' : 'text-gray-400'} />
                  <a 
                    href="mailto:support@pseven.com" 
                    className={isScrolled ? 'text-gray-800' : 'text-gray-300'}
                  >
                    support@pseven.com
                  </a>
                </div>
                <div className="flex items-center space-x-2 mt-2">
                  <Phone size={16} className={isScrolled ? 'text-gray-600' : 'text-gray-400'} />
                  <a 
                    href="tel:+1234567890" 
                    className={isScrolled ? 'text-gray-800' : 'text-gray-300'}
                  >
                    +1 (234) 567-890
                  </a>
                </div>
                <div className="flex items-center space-x-4 mt-3">
                  <a 
                    href="https://facebook.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-1.5 rounded-full ${
                      isScrolled ? 'hover:bg-gray-200' : 'hover:bg-gray-700'
                    }`}
                  >
                    <Facebook size={18} className={isScrolled ? 'text-gray-700' : 'text-gray-300'} />
                  </a>
                  <a 
                    href="https://twitter.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-1.5 rounded-full ${
                      isScrolled ? 'hover:bg-gray-200' : 'hover:bg-gray-700'
                    }`}
                  >
                    <Twitter size={18} className={isScrolled ? 'text-gray-700' : 'text-gray-300'} />
                  </a>
                  <a 
                    href="https://instagram.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-1.5 rounded-full ${
                      isScrolled ? 'hover:bg-gray-200' : 'hover:bg-gray-700'
                    }`}
                  >
              <Instagram size={18} className={isScrolled ? 'text-gray-700' : 'text-gray-300'} />
                  </a>
                  <a 
                    href="https://youtube.com" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className={`p-1.5 rounded-full ${
                      isScrolled ? 'hover:bg-gray-200' : 'hover:bg-gray-700'
                    }`}
                  >
                    <Youtube size={18} className={isScrolled ? 'text-gray-700' : 'text-gray-300'} />
                  </a>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </nav>
  );
}

export default Navbar;