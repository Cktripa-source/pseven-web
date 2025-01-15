import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Carousel from './Carousel';
import FeaturedProducts from './featuredproduct';
import PopularProduct from './popularproduct';
import Navbar from './nav';
import ViewCart from './viewcart'; 
import Login from './login';
import Register from './register';
import Shopping from './shopping';

function App() {
  const [cartCount, setCartCount] = useState(() => {
      // Retrieve cart count from localStorage or default to 0
      const savedCartCount = localStorage.getItem('cartCount');
      return savedCartCount ? parseInt(savedCartCount, 10) : 0;
  });

  // Update localStorage whenever cartCount changes
  useEffect(() => {
      localStorage.setItem('cartCount', cartCount);
  }, [cartCount]);

  return (
    <Router>
      <Navbar cartCount={cartCount} /> {/* Pass cartCount as a prop */}
      <Routes>
        {/* Main Page */}
        <Route 
          path="/" 
          element={
            <>
              <Carousel />
              <FeaturedProducts setCartCount={setCartCount} /> {/* Pass setCartCount as a prop */}
              <PopularProduct setCartCount={setCartCount} />
            </>
          } 
        />
        
        {/* View Cart Page */}
        <Route path="/viewcart" element={<ViewCart setCartCount={setCartCount} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/shopping' element={<Shopping />} />
      </Routes>
    </Router>
  );
}

export default App;
