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

// Import new page components
import JobEmployers from './JobEmployers';
import BuySell from './BuySell';
import Services from './Services';
import Others from './Others';
import AboutUs from './AboutUs';
import Faq from './Faq';
import ContactUs from './ContactUs';
import Checkout from './Checkout';

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

        {/* Page Routes */}
        <Route path="/job-employers" element={<JobEmployers />} />
        <Route path="/buy-sell" element={<BuySell />} />
        <Route path="/services" element={<Services />} />
        <Route path="/others" element={<Others />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<ContactUs />} />

        {/* Other Routes */}
        <Route path="/viewcart" element={<ViewCart setCartCount={setCartCount} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path='/shopping' element={<Shopping />} />
        <Route path='/checkout' element={<Checkout />} />
      </Routes>
    </Router>
  );
}

export default App;
