import React, { useState } from 'react';
import FeaturedProduct from './featuredproduct';

const Shopping = () => {
  const [cartCount, setCartCount] = useState(() => {
    const savedCount = localStorage.getItem('cartCount');
    return savedCount ? parseInt(savedCount, 10) : 0;
  });

  return (
    <div className="w-full h-screen flex flex-col md:flex-row">
      <main className="max-w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
      <header className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 flex justify-between items-center">
          <h1 className="text-3xl font-bold text-gray-900">Shopping Page</h1>
          <div className="text-lg font-medium text-gray-700">
            Cart Items: <span className="font-bold text-indigo-600">{cartCount}</span>
          </div>
        </div>
      </header>
        <FeaturedProduct setCartCount={setCartCount} />
      </main>
    </div>
  );
};

export default Shopping;
