import React, { useState, useEffect } from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Carousel from './Carousel';
import FeaturedProducts from './featuredproduct';
import PopularProduct from './popularproduct';
import Navbar from './nav';
import Footer from './footer';
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
import Payment from './payment';
import OrderConfirmation from './order-confirmation';

// Admin Components
import DashboardOverview from './admin/dashboardoverview';
import ProductManagement from './admin/productManagement';
import Inbox from './admin/Inbox';
import UserManagement from './admin/Users';
import Jobs from './admin/Jobs';
import ManageServices from './admin/Services';
import Settings from './admin/Settings';
import JobApplications from './admin/jobapplication';
import AboutAdmin from './admin/About';
import Logout from './admin/Logout';
import Signup from './admin/Signup';

function App() {
  const [cartCount, setCartCount] = useState(() => {
    const savedCartCount = localStorage.getItem('cartCount');
    return savedCartCount ? parseInt(savedCartCount, 10) : 0;
  });

  useEffect(() => {
    localStorage.setItem('cartCount', cartCount);
  }, [cartCount]);

  const location = useLocation(); 
  const isAdminRoute = location.pathname.startsWith('/admin'); 

  return (
    <>
      {!isAdminRoute && <Navbar cartCount={cartCount} />}

      <Routes>
        <Route 
          path="/" 
          element={
            <>
              <Carousel />
              <FeaturedProducts setCartCount={setCartCount} />
              <PopularProduct setCartCount={setCartCount} />
            </>
          } 
        />
        <Route path="/job-employers" element={<JobEmployers />} />
        <Route path="/buy-sell" element={<BuySell />} />
        <Route path="/services" element={<Services />} />
        <Route path="/others" element={<Others />} />
        <Route path="/about" element={<AboutUs />} />
        <Route path="/faq" element={<Faq />} />
        <Route path="/contact" element={<ContactUs />} />
        <Route path="/viewcart" element={<ViewCart setCartCount={setCartCount} />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/shopping" element={<Shopping />} />
        <Route path="/checkout" element={<Checkout />} />
        <Route path="/payment" element={<Payment />} />
        <Route path="/order-confirmation" element={<OrderConfirmation />} />

        {/* Admin Routes */}
        <Route path="/admin/dashboardoverview" element={<DashboardOverview />} />
        <Route path="/admin/inbox" element={<Inbox />} />
        <Route path="/admin/users" element={<UserManagement />} />
        <Route path="/admin/productmanagement" element={<ProductManagement />} />
        <Route path="/admin/jobs" element={<Jobs />} />
        <Route path="/admin/services" element={<ManageServices />} />
        <Route path="/admin/settings" element={<Settings />} />
        <Route path="/admin/jobapplication" element={<JobApplications />} />
        <Route path="/admin/about" element={<AboutAdmin />} />
        <Route path="/admin/logout" element={<Logout />} />
        <Route path="/admin/signup" element={<Signup />} />
      </Routes>

      {/* Conditionally render Footer */}
      {!isAdminRoute && <Footer />}
    </>
  );
}
export default App;