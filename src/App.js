import React, { useState, useEffect } from 'react';
import Logo from './images/gimbal.webp';
import Carousel from './Carousel';
import FeaturedProducts from './featuredproduct';

function Navbar() {
  const [cartCount, setCartCount] = useState(0);
  const [isServicesMenuOpen, setIsServicesMenuOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  // Retrieve the cart count from localStorage on component mount
  useEffect(() => {
    const storedCartCount = localStorage.getItem('cartCount');
    if (storedCartCount) {
      setCartCount(parseInt(storedCartCount, 10)); // Parse the count to an integer
    }
  }, []);

  // Toggle Services Menu
  const toggleServicesMenu = () => {
    setIsServicesMenuOpen(!isServicesMenuOpen);
  };

  // Toggle Mobile Menu
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };

  return (
    <>
      <nav className="bg-black text-white p-4">
        <div className="flex items-center justify-between">
          {/* Logo and Name */}
          <div className="flex items-center border rounded-full p-2">
            <img src={Logo} alt="Logo" className="md:h-20 h-10" />
            <span className="md:text-4xl uppercase font-bold">pseven</span>
          </div>

          {/* Menu Links (Desktop View - Next to Logo) */}
          <div className="hidden md:flex items-center space-x-6 ml-8">
            <a href="/" className="hover:text-gray-400">Home</a>
            <div className="relative">
              {/* Services Dropdown */}
              <button onClick={toggleServicesMenu} className="flex items-center hover:text-gray-400">
                Services
                <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" className={`ml-2 w-3 h-3 transform ${isServicesMenuOpen ? 'rotate-180' : ''}`}>
                  <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                </svg>
              </button>
              {/* Services Dropdown Content (Desktop View) */}
              {isServicesMenuOpen && (
                <div className="w-full bg-gray-900 text-white p-6 my-6 rounded-lg border border-gray-700">
                  <div className="flex flex-col space-y-4">
                    <a href="/service1" className="hover:text-gray-400 p-4">Service 1</a>
                    <a href="/service2" className="hover:text-gray-400 p-4">Service 2</a>
                    <a href="/service3" className="hover:text-gray-400 p-4">Service 3</a>
                  </div>
                </div>
              )}
            </div>
            <a href="/job-apply" className="hover:text-gray-400">Job Apply</a>
            <a href="/shopping" className="hover:text-gray-400">Shopping</a>
          </div>

          {/* Search Bar (Always Visible on Desktop) */}
          <div className="relative hidden md:block">
            <input type="text" placeholder="Search..." className="p-2 w-48 bg-gray-200 rounded" />
          </div>

          {/* Cart Icon with Counter */}
          <div className="relative flex items-center">
            <button className="p-2 hover:text-gray-400">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6 text-white">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l3 9h10l3-9h2M6 12h12l-1 5H7l-1-5z" />
              </svg>
            </button>
            <span className="absolute top-0 right-0 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">
              {cartCount}
            </span>
          </div>

          {/* Login & Register */}
          <div className="space-x-4">
            <button className="p-2 border border-white rounded hover:bg-white hover:text-black">Login</button>
            <button className="p-2 border border-white rounded hover:bg-white hover:text-black">Register</button>
          </div>
        </div>

        {/* Mobile Search Bar and Menu Toggle */}
        <div className="md:hidden flex items-center justify-between mt-4">
          <div className="relative flex items-center w-full">
            <input type="text" placeholder="Search..." className="p-2 w-full bg-gray-200 rounded" />
          </div>

          {/* Mobile Menu Toggle (Hamburger Icon) */}
          <div className="flex items-center">
            <button onClick={toggleMobileMenu} className="text-white">
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" className="w-6 h-6">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
              </svg>
            </button>
          </div>
        </div>

        {/* Mobile Menu (Toggleable) */}
        <div className={`md:hidden ${isMobileMenuOpen ? 'block' : 'hidden'} bg-black text-white p-4 space-y-4`}>
          <a href="/" className="block hover:text-gray-400">Home</a>
          <a href="/job-apply" className="block hover:text-gray-400">Job Apply</a>
          <a href="/shopping" className="block hover:text-gray-400">Shopping</a>
          
          {/* Mobile Services Dropdown */}
          <div className="relative">
            <button onClick={toggleServicesMenu} className="flex items-center hover:text-gray-400">
              Services
              <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 10 6" className={`ml-2 w-3 h-3 transform ${isServicesMenuOpen ? 'rotate-180' : ''}`}>
                <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
              </svg>
            </button>
            {/* Mobile Services Dropdown Content */}
            {isServicesMenuOpen && (
              <div className="w-full bg-gray-900 text-white p-6 my-6 rounded-lg border border-gray-700">
                <div className="flex flex-col space-y-4">
                  <a href="/service1" className="hover:text-gray-400 p-4">Service 1</a>
                  <a href="/service2" className="hover:text-gray-400 p-4">Service 2</a>
                  <a href="/service3" className="hover:text-gray-400 p-4">Service 3</a>
                </div>
              </div>
            )}
          </div>

          <div className="space-y-4">
            <button className="w-full p-2 border border-white rounded hover:bg-white hover:text-black">Login</button>
            <button className="w-full p-2 border border-white rounded hover:bg-white hover:text-black">Register</button>
          </div>
        </div>
      </nav>

      <Carousel />
      <FeaturedProducts setCartCount={setCartCount} />
    </>
  );
}

export default Navbar;
