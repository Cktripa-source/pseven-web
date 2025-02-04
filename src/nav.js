import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Home, Briefcase, ShoppingBag, Settings, Tag, Phone, Mail, Facebook, Twitter, Instagram, Youtube, LogIn, UserPlus, Menu, X, ShoppingCart,SearchIcon } from 'lucide-react';
import Logo from './images/logo.png';
import { useCart } from './CartContext'; // Import the cart context

function Navbar() {
  const { getCartCount } = useCart(); // Get the cart count from context
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };


  return (
    <nav className="bg-black/50 backdrop-blur-md text-white fixed top-0 left-0 right-0 z-50 shadow-lg">
      
      {/* Top Section - Mobile Only */}
      <div className="md:hidden flex justify-between items-center px-6 py-2 bg-black text-sm">
        <button onClick={toggleMobileMenu} className="text-white">
          {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
        <div className="flex items-center space-x-4">
          <Link to="/login" className="flex items-center space-x-2 hover:text-green-500">
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </Link>
          <Link to="/register" className="flex items-center space-x-2 hover:text-green-500">
            <UserPlus className="h-5 w-5" />
            <span>Register</span>
          </Link>
        </div>
      </div>

      {/* Top Section - Desktop Only */}
      <div className="hidden md:flex justify-between items-center px-6 py-2 bg-gray-950  text-sm">
        <div className="flex items-center space-x-4">
          <p className="flex items-center space-x-2">
            <Phone className="h-5 w-5 text-white" />
            <span>+250791855396</span>
          </p>
          <a href="mailto:psevenrwanda@gmail.com" className="flex items-center space-x-2 hover:text-green-500">
            <Mail className="h-5 w-5 text-white" />
            <span>psevenrwanda@gmail.com</span>
          </a>
        </div>

        {/* Social Icons */}
        <div className="flex space-x-4">
          {[Youtube, Facebook, Twitter, Instagram].map((Icon, idx) => (
            <motion.a 
              key={idx} 
              href="#" 
              className="hover:text-green-500"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.1 * idx, duration: 0.3 }}
            >
              <Icon className="h-6 w-6 text-white" />
            </motion.a>
          ))}
        </div>

        {/* Login/Register */}
        <div className="flex space-x-4">
          <Link to="/login" className="flex items-center space-x-2 hover:text-green-500">
            <LogIn className="h-5 w-5" />
            <span>Login</span>
          </Link>
          <Link to="/register" className="flex items-center space-x-2 hover:text-green-500">
            <UserPlus className="h-5 w-5" />
            <span>Register</span>
          </Link>
        </div>
      </div>

      {/* Middle Section */}
      <div className="flex justify-between items-center px-6 py-0 bg-gray-900 border-b transition-all">
        <Link to="/" className="flex items-center space-x-2">
          <motion.img
            src={Logo}
            alt="Logo"
            className="h-14 rounded-full"
            whileHover={{ scale: 1, rotate: 100 }}
          />
          <span className="font-bold text-lg hover:text-green-400">
            P<span className="hover:text-green-400">SEVEN</span>
          </span>
        </Link>
               {/*Searching bar */}
               <div className='w-2/6 flex space-x-1 bg-slate-800 rounded-full text-sm px-2'>
                <input type="search"  placeholder="Search by name and categories ........" className='py-2 px-2 rounded-full w-full outline-none border-none bg-slate-800'/>
                 <button  className='p-1 rounded-full  outline-none border-none bg-slate-800 hover:text-green-500'><SearchIcon/></button>
               </div>
        {/* Cart Icon */}
        <div className="relative flex items-center space-x-4">
          <Link to="/viewcart" className="relative">
            <ShoppingCart className="w-8 h-10 text-white hover:text-green-500" />
            <motion.span
              className="absolute -top-2 -right-2 bg-green-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center"
              animate={{ scale: [1, 1.2, 1] }}
              transition={{ repeat: Infinity, duration: 1.5 }}
            >
              {getCartCount()} {/* Auto-updating count */}
            </motion.span>
          </Link>
        </div>
      </div>

      {/* Desktop Menu */}
      <div className="hidden md:flex justify-center py-2 bg-gray-950">
        <div className="flex space-x-8">
          {[{ path: '/', label: 'Home', icon: Home }, { path: '/job-employers', label: 'Jobs', icon: Briefcase }, { path: '/shopping', label: 'Buy & Sell', icon: ShoppingBag }, { path: '/services', label: 'Services', icon: Settings }, { path: '/others', label: 'Others', icon: Tag }].map(({ path, label, icon: Icon }, idx) => (
            <motion.div
              key={idx}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 * idx, duration: 0.3 }}
            >
              <Link to={path} className="flex items-center space-x-2 hover:text-green-500  hover:border-b-2 p-1 border-green-500 rounded-md transition-all">
                <Icon className="h-5 w-5" />
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
    className="md:hidden bg-gray-900 text-white py-4 px-6 flex flex-col space-y-10 absolute top-0 w-full left-0 h-screen"
  >
    <button onClick={toggleMobileMenu} className="text-white">
      {isMobileMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
    </button>
    {[{ path: '/', label: 'Home', icon: Home }, { path: '/job-employers', label: 'Jobs', icon: Briefcase }, { path: '/shopping', label: 'Buy & Sell', icon: ShoppingBag }, { path: '/services', label: 'Services', icon: Settings }, { path: '/others', label: 'Others', icon: Tag }].map(({ path, label, icon: Icon }, idx) => (
      <Link 
        key={idx} 
        to={path} 
        className="flex items-center space-x-2 hover:text-green-500"
        onClick={toggleMobileMenu} // Close the menu when a link is clicked
      >
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
