import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Logo from './images/logo.png';

function Navbar({ cartCount }) {
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  return (
    <nav className="bg-black text-white">
      {/* First Line: Contacts */}
      <div className="flex justify-between items-center px-6 py-2 text-sm">
        <div>
          <p>+250791855396 | psevenrwanda@gmail.com</p>
        </div>
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-400">YouTube</a>
          <a href="#" className="hover:text-gray-400">Facebook</a>
          <a href="#" className="hover:text-gray-400">Twitter</a>
          <a href="#" className="hover:text-gray-400">Instagram</a>
        </div>
      </div>

      {/* Second Line: Logo, Search Bar, and Auth Buttons */}
      <div className="flex justify-between items-center px-6 py-4">
        {/* Logo */}
        <Link to="/" className="flex items-center space-x-2">
          <img src={Logo} alt="Logo" className="h-12 rounded-full" />
          <span className="font-bold text-xl">
            P<span className="text-gray-400">SEVEN</span>
          </span>
        </Link>

        {/* Search Bar */}
        <div className="relative hidden lg:block w-1/2">
          <input
            type="text"
            placeholder="Search Product"
            className="w-full py-2 px-4 rounded-lg bg-gray-700 text-white placeholder-gray-400 focus:outline-none"
          />
          <button className="absolute right-2 top-2">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5 text-gray-400"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path strokeLinecap="round" strokeLinejoin="round" d="M21 21l-6-6m2-5a7 7 0 1114 0 7 7 0 01-14 0z" />
            </svg>
          </button>
        </div>

        {/* Login/Register */}
        <div className="hidden lg:flex space-x-4">
          <Link to="/login" className="hover:text-gray-400">Login</Link>
          <Link to="/register" className="hover:text-gray-400">Register</Link>
        </div>

        {/* Mobile Menu Toggle */}
        <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="lg:hidden">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="w-6 h-6"
            fill="none"
            viewBox="0 0 24 24"
            stroke="currentColor"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="M4 6h16M4 12h16m-7 6h7"
            />
          </svg>
        </button>
      </div>

      {/* Third Line: Menu Links */}
      <div className="hidden lg:flex justify-center space-x-8 py-2 text-sm bg-gray-900">
        <Link to="/" className="hover:text-gray-400">Home</Link>
        <Link to="/job-employers" className="hover:text-gray-400">Job & Employers</Link>
        <Link to="/buy-sell" className="hover:text-gray-400">Buy & Sell</Link>
        <Link to="/services" className="hover:text-gray-400">Our Services</Link>
        <Link to="/others" className="hover:text-gray-400">Others</Link>
        <Link to="/about" className="hover:text-gray-400">About Us</Link>
        <Link to="/faq" className="hover:text-gray-400">FAQ</Link>
        <Link to="/contact" className="hover:text-gray-400">Contact Us</Link>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden bg-gray-900 text-white p-4">
          <Link to="/" className="block hover:text-gray-400 py-2">Home</Link>
          <Link to="/job-employers" className="block hover:text-gray-400 py-2">Job & Employers</Link>
          <Link to="/buy-sell" className="block hover:text-gray-400 py-2">Buy & Sell</Link>
          <Link to="/services" className="block hover:text-gray-400 py-2">Our Services</Link>
          <Link to="/others" className="block hover:text-gray-400 py-2">Others</Link>
          <Link to="/about" className="block hover:text-gray-400 py-2">About Us</Link>
          <Link to="/faq" className="block hover:text-gray-400 py-2">FAQ</Link>
          <Link to="/contact" className="block hover:text-gray-400 py-2">Contact Us</Link>
          <Link to="/login" className="block hover:text-gray-400 py-2">Login</Link>
          <Link to="/register" className="block hover:text-gray-400 py-2">Register</Link>
        </div>
      )}
    </nav>
  );
}

export default Navbar;
