import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Logo from './images/logo.png';

function Navbar({ cartCount }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const handleLinkClick = () => {
    setIsMobileMenuOpen(false); // Close the menu when a link is clicked
  };

  return (
    <nav className="bg-black text-white fixed top-0 left-0 right-0 z-10">
      {/* Top Section (Contact Information) */}
      <div className="md:flex justify-between items-center px-6 py-0 bg-black text-sm text-white transition duration-300">
        <div className="p-4 text-center md:text-left">
          <p>📞 +250791855396 | <a href="mailto:psevenrwanda@gmail.com" className="hover:text-red-500 transition duration-300">psevenrwanda@gmail.com</a></p>
        </div>
        <div className="flex space-x-6 md:space-x-8 text-md">
          <a href="#" className="hover:text-red-500 transition duration-300 text-white">YouTube</a>
          <a href="#" className="hover:text-red-500 transition duration-300 text-white">Facebook</a>
          <a href="#" className="hover:text-red-500 transition duration-300 text-white">Twitter</a>
          <a href="#" className="hover:text-red-500 transition duration-300 text-white">Instagram</a>
        </div>
        <div className="flex space-x-6 mt-3 md:mt-0">
          <Link to="/login" className="bg-white text-black py-2 px-6 rounded-lg hover:bg-red-500 hover:text-white transition duration-300">Login</Link>
          <Link to="/register" className="bg-white text-black py-2 px-6 rounded-lg hover:bg-red-500 hover:text-white transition duration-300">Register</Link>
        </div>
      </div>

      {/* Second Section (Logo, Cart, Search, and Buttons) */}
      <div className="flex mt-4 justify-between items-center px-6 py-4 bg-gray-900 transition duration-300 ease-in-out flex-wrap">
        <div className="flex items-center space-x-4">
          <Link to="/" className="flex items-center space-x-2">
            <img src={Logo} alt="Logo" className="h-12 rounded-full transition duration-300 hover:scale-110 transform" />
            <span className="font-bold text-xl transition duration-300 hover:text-gray-400">
              P<span className="text-gray-400">SEVEN</span>
            </span>
          </Link>
        </div>
        <div className="flex items-end justify-between space-x-6 w-full max-w-xl mx-auto mt-2 lg:mt-0">
          <div className="relative w-full lg:w-1/2">
            <input type="text" placeholder="Search Product ........." className="py-2 px-4 rounded-lg bg-gray-800 text-white placeholder-gray-400 focus:outline-none w-full transition duration-300 ease-in-out" />
            <button className="absolute right-2 top-2">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 text-gray-400" viewBox="0 0 24 25" fill="none" stroke="currentColor" strokeWidth="2">
                <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 1114 0 7 7 0 01-14 0z" />
              </svg>
            </button>
          </div>
          <div className="relative">
            <Link to="/viewcart" className="transition duration-300 hover:scale-110 transform">
              <svg xmlns="http://www.w3.org/2000/svg" className="w-8 h-8 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l3 9h10l3-9h2M6 12h12l-1 5H7l-1-5z" />
              </svg>
            </Link>
            <span className="absolute top-0 right-0 bg-red-500 text-xs text-white rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </div>
        </div>
      </div>

      {/* Third Section (Menu Links - only show on md and larger) */}
      <div className="hidden md:flex justify-center items-center bg-gray-950 py-4 transition duration-300 ease-in-out">
        <div className="flex space-x-8 p-1">
          <Link to="/" className="hover:text-red-500 transition font-semibold text-md duration-300">Home</Link>
          <Link to="/job-employers" className="hover:text-red-500 transition font-semibold text-md duration-300">Job & Employers</Link>
          <Link to="/buy-sell" className="hover:text-red-500 transition font-semibold text-md duration-300">Buy & Sell</Link>
          <Link to="/services" className="hover:text-red-500 transition font-semibold text-md duration-300">Our Services</Link>
          <Link to="/others" className="hover:text-red-500 transition font-semibold text-md duration-300">Others</Link>
          <Link to="/about" className="hover:text-red-500 transition font-semibold text-md duration-300">About Us</Link>
          <Link to="/faq" className="hover:text-red-500 transition font-semibold text-md duration-300">FAQ</Link>
          <Link to="/contact" className="hover:text-red-500 transition font-semibold text-md duration-300">Contact Us</Link>
        </div>
      </div>

      {/* Mobile Menu Toggle */}
      <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} 
      className="lg:hidden md:hidden py-2 px-4 bg-white rounded-lg hover:bg-red-500 
       justify-end text-center text-black font-extrabold absolute right-4 top-36">
        {isMobileMenuOpen ? (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
          </svg>
        ) : (
          <svg xmlns="http://www.w3.org/2000/svg" className="w-6 h-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16m-7 6h7" />
          </svg>
        )}
      </button>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-800 text-white p-4">
          <Link to="/" onClick={handleLinkClick} className="block p-2 hover:bg-slate-950 rounded-md hover:text-red-500 transition font-semibold text-md duration-300">Home</Link>
          <Link to="/job-employers" onClick={handleLinkClick} className="block p-2 hover:bg-slate-950 rounded-md hover:text-red-500 transition font-semibold text-md duration-300">Job & Employers</Link>
          <Link to="/buy-sell" onClick={handleLinkClick} className="block p-2 hover:bg-slate-950 rounded-md hover:text-red-500 transition font-semibold text-md duration-300">Buy & Sell</Link>
          <Link to="/services" onClick={handleLinkClick} className="block p-2 hover:bg-slate-950 rounded-md hover:text-red-500 transition font-semibold text-md duration-300">Our Services</Link>
          <Link to="/others" onClick={handleLinkClick} className="block p-2 hover:bg-slate-950 rounded-md hover:text-red-500 transition font-semibold text-md duration-300">Others</Link>
          <Link to="/about" onClick={handleLinkClick} className="block p-2 hover:bg-slate-950 rounded-md hover:text-red-500 transition font-semibold text-md duration-300">About Us</Link>
          <Link to="/faq" onClick={handleLinkClick} className="block p-2 hover:bg-slate-950 rounded-md hover:text-red-500 transition font-semibold text-md duration-300">FAQ</Link>
          <Link to="/contact" onClick={handleLinkClick} className="block p-2 hover:bg-slate-950 rounded-md hover:text-red-500 transition font-semibold text-md duration-300">Contact Us</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
