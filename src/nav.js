import { Link } from 'react-router-dom';
import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Home, Briefcase, ShoppingBag, Settings, Tag, Phone, Mail, Facebook, Twitter, Instagram, Youtube, LogIn, UserPlus, Menu, X, ShoppingCart } from 'lucide-react';
import Logo from './images/logo.png';

function Navbar() {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [cart, setCart] = useState([]);

  useEffect(() => {
    const storedCart = JSON.parse(localStorage.getItem("cart")) || [];
    setCart(storedCart);
  }, []);

  const getCartCount = () => {
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <nav className="bg-black/50 backdrop-blur-md text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
      {/* Top Section */}
      <div className="flex flex-wrap justify-between items-center px-6 py-2 bg-black text-sm">
        <div className="flex items-center space-x-4">
          <p className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-white" />
            <span>+250791855396</span>
          </p>
          <a href="mailto:psevenrwanda@gmail.com" className="flex items-center space-x-2 hover:text-red-500">
            <Mail className="h-5 w-5 text-white" />
            <span>psevenrwanda@gmail.com</span>
          </a>
        </div>
        {/* Social Icons */}
        <div className="flex space-x-4">
          {[Youtube, Facebook, Twitter, Instagram].map((Icon, idx) => (
            <a key={idx} href="#" className="hover:text-red-500" aria-label={Icon.name}>
              <Icon className="h-6 w-6 text-white" />
            </a>
          ))}
        </div>
        {/* Login/Register */}
        <div className="flex space-x-4">
          <Link to="/login" className="flex items-center space-x-2 hover:text-red-500">
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </Link>
          <Link to="/register" className="flex items-center space-x-2 hover:text-red-500">
            <UserPlus className="h-5 w-5" />
            <span>Register</span>
          </Link>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex justify-between items-center px-6 py-3 bg-gray-900">
        <Link to="/" className="flex items-center space-x-2">
          <motion.img 
            src={Logo} 
            alt="Logo" 
            className="h-10 rounded-full" 
            whileHover={{ scale: 1.1 }}
          />
          <span className="font-bold text-lg hover:text-gray-400">P<span className="text-gray-400">SEVEN</span></span>
        </Link>
        <div className="relative w-full max-w-sm">
          <input 
            type="text" 
            placeholder="Search Product..." 
            className="w-full py-2 px-4 rounded-lg bg-gray-800 text-white focus:outline-none"
          />
        </div>
        <div className="relative">
          <Link to="/viewcart" className="relative">
            <ShoppingCart className="w-8 h-8 text-white hover:text-red-500" />
            <motion.span 
              className="absolute -top-2 -right-2 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {getCartCount()}
            </motion.span>
          </Link>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-center py-3 bg-gray-800">
        <div className="flex space-x-8">
          {[{ path: '/', label: 'Home', icon: Home }, { path: '/job-employers', label: 'Jobs', icon: Briefcase }, { path: '/shopping', label: 'Buy & Sell', icon: ShoppingBag }, { path: '/services', label: 'Services', icon: Settings }, { path: '/others', label: 'Others', icon: Tag }].map(({ path, label, icon: Icon }, idx) => (
            <Link key={idx} to={path} className="flex items-center space-x-2 hover:text-red-500">
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </div>
      </div>

      {/* Mobile Menu Button */}
      <button onClick={toggleMobileMenu} className="md:hidden absolute top-4 right-6">
        {isMobileMenuOpen ? <X className="h-6 w-6 text-white" /> : <Menu className="h-6 w-6 text-white" />}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <motion.div 
          initial={{ opacity: 0, y: -20 }} 
          animate={{ opacity: 1, y: 0 }} 
          exit={{ opacity: 0, y: -20 }}
          className="md:hidden bg-gray-900 text-white py-4 px-6 flex flex-col space-y-4 absolute top-14 w-full left-0"
        >
          {[{ path: '/', label: 'Home', icon: Home }, { path: '/job-employers', label: 'Jobs', icon: Briefcase }, { path: '/shopping', label: 'Buy & Sell', icon: ShoppingBag }, { path: '/services', label: 'Services', icon: Settings }, { path: '/others', label: 'Others', icon: Tag }].map(({ path, label, icon: Icon }, idx) => (
            <Link key={idx} to={path} className="flex items-center space-x-2 hover:text-red-500">
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          ))}
        </motion.div>
      )}
    </nav>
  );
}

export default Navbar;
