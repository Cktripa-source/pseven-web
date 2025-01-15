import { Link } from 'react-router-dom';
import React, { useState } from 'react';
import Logo from './images/logo.png';


function Navbar({ cartCount }) { // Accept cartCount as a prop
    const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
    const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
    return (
      <nav className="bg-black text-white fixed top-0 left-0 w-full z-50">
        {/* Top section with logo and menu items */}
        <div className="md:flex items-center justify-between p-4">
          {/* Logo */}
          <div className="flex items-center space-x-2 md:w-1/6 w-full justify-between p-4 mb-2">
            <span className="font-extrabold font-mono text-xl">
              <img src={Logo} alt="Logo" className="h-12 rounded-full" />
              P<span className="text-gray-400">SEVEN</span>
            </span>
            <button onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="md:hidden">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                className="w-6 h-6"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              </svg>
            </button>
          </div>
      
          {/* Tablet & Desktop Menu */}
          <div className="hidden lg:flex space-x-6 w-2/6 p-2">
            <Link to="/" className="hover:text-gray-400">Home</Link>
            <div className="relative">
              <button
                onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                className="flex items-center hover:text-gray-400"
              >
                Services
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                  className={`ml-2 w-3 h-3 transform ${isServicesMenuOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {isServicesMenuOpen && (
                <div className="full-width-dropdown">
                  <Link to="/service1" className="block hover:text-gray-400">Service 1</Link>
                  <Link to="/service2" className="block hover:text-gray-400">Service 2</Link>
                  <Link to="/service3" className="block hover:text-gray-400">Service 3</Link>
                </div>
              )}
            </div>
            <Link to="/job-apply" className="hover:text-gray-400">Job Apply</Link>
            <Link to="/shopping" className="hover:text-gray-400">Shopping</Link>
          </div>
      
          {/* Search bar */}
          <div className="hidden lg:block relative w-1/4 p-2">
            <input
              type="text"
              placeholder="Search for products..."
              className="w-2/3 py-2 px-4 rounded-lg bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
            />
            <button className="ml-2 absolute top-3 p-2 bg-white text-black rounded-full">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                />
              </svg>
            </button>
          </div>
      
          {/* Cart and User Actions */}
          <div className="flex items-center space-x-4 md:w-2/4 justify-between w-full p-4">
            <div className="relative">
              <Link to="/viewcart" className="hover:text-gray-400">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  className="w-10 h-10"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 3h2l3 9h10l3-9h2M6 12h12l-1 5H7l-1-5z"
                  />
                </svg>
              </Link>
              <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
                {cartCount}
              </span>
            </div>
            <div className="w-3/4 flex gap-10 justify-end">
              <Link to="/login">
                <button className="px-6 py-2 bg-black text-white rounded-lg shadow-md hover:bg-white hover:text-black border border-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-300">
                  Login
                </button>
              </Link>
        
              {/* Register Button */}
              <Link to="/register">
                <button className="px-6 py-2 bg-black text-white rounded-lg shadow-md hover:bg-white hover:text-black border border-white focus:outline-none focus:ring-2 focus:ring-black focus:ring-offset-2 transition-all duration-300">
                  Register
                </button>
              </Link>
            </div>
          </div>
        </div>
      
        {/* Mobile & Tablet Menu */}
        <div className="lg:hidden p-4 flex gap-4 items-center mb-5">
          {/* Search Bar */}
          <input
            type="text"
            placeholder="Search for products..."
            className="w-3/4 py-2 px-4 rounded-lg bg-gray-200 text-black placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500 shadow-sm"
          />
          <button className="p-2 bg-white text-black rounded-full">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-5 w-5"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
              strokeWidth="2"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </button>
        </div>
      
        {/* Mobile Menu Content */}
        {isMobileMenuOpen && (
          <div className="lg:hidden bg-black text-white p-10">
            <Link to="/" className="block hover:text-gray-400 p-2">Home</Link>
            <Link to="/job-apply" className="block hover:text-gray-400 p-2">Job Apply</Link>
            <Link to="/shopping" className="block hover:text-gray-400 p-2">Shopping</Link>
            <div className="mt-4">
              <button
                onClick={() => setIsServicesMenuOpen(!isServicesMenuOpen)}
                className="flex items-center hover:text-gray-400"
              >
                Services
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 10 6"
                  className={`ml-2 w-3 h-3 transform ${isServicesMenuOpen ? 'rotate-180' : ''}`}
                >
                  <path
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="m1 1 4 4 4-4"
                  />
                </svg>
              </button>
              {isServicesMenuOpen && (
                <div className="bg-gray-900 text-white mt-2 p-4 rounded-lg shadow-lg">
                  <Link to="/service1" className="block hover:text-gray-400">Service 1</Link>
                  <Link to="/service2" className="block hover:text-gray-400">Service 2</Link>
                  <Link to="/service3" className="block hover:text-gray-400">Service 3</Link>
                </div>
              )}
            </div>
          </div>
        )}
      </nav>
    );
}

export default Navbar;
