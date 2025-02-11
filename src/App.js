import React, { useState, useEffect } from 'react';
import { AuthProvider } from './AuthContext';
import { AlertTriangle } from "lucide-react";
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Carousel from './Carousel';
import FeaturedProducts from './featuredproduct';
import Navbar from './nav';
import Footer from './footer';
import ViewCart from './viewcart';
import Login from './login';
import Register from './register';
import Shopping from './shopping';
import ViewProductDetail from "./ViewProductDetail";

// Import new page components
import JobEmployers from './JobEmployers';
import BuySell from './shopping';
import Others from './Others';
import AboutUs from './AboutUs';
import Faq from './Faq';
import ContactUs from './ContactUs';
import Checkout from './Checkout';
import Payment from './payment';
import OrderConfirmation from './order-confirmation';
import Services from "./Services";

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
import AdminAuth from './admin/admin';
import Loading from './loading';
import FloatingChatBox from './chatbox'; // Import the chat component

function App() {
  const location = useLocation();
  const isAdminRoute = location.pathname.startsWith('/admin');

  // State for loading and network status
  const [isLoading, setIsLoading] = useState(true);
  const [isOffline, setIsOffline] = useState(!navigator.onLine);
  const [isSlowNetwork, setIsSlowNetwork] = useState(false);
  const [isOfflineMessageVisible, setIsOfflineMessageVisible] = useState(isOffline);
  const [isSlowNetworkMessageVisible, setIsSlowNetworkMessageVisible] = useState(isSlowNetwork);
  const [userId, setUserId] = useState(null); // Add state for user ID

  useEffect(() => {
    // Check for initial offline status
    setIsOffline(!navigator.onLine);

    // Handle offline and online events
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    // Check for slow network
    const handleNetworkChange = () => {
      if (navigator.connection && navigator.connection.downlink < 1) {
        setIsSlowNetwork(true);
      } else {
        setIsSlowNetwork(false);
      }
    };

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    if (navigator.connection) {
      window.addEventListener('load', handleNetworkChange);
    }

    // Clean up event listeners
    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
      if (navigator.connection) {
        window.removeEventListener('load', handleNetworkChange);
      }
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return <Loading />;
  }

  const handleCloseOfflineMessage = () => {
    setIsOfflineMessageVisible(false);
  };

  const handleCloseSlowNetworkMessage = () => {
    setIsSlowNetworkMessageVisible(false);
  };

  return (
    <AuthProvider>
      <CartProvider>
        {!isAdminRoute && <Navbar />}

        {/* Network Warning Messages */}
        {isOfflineMessageVisible && isOffline && (
          <div className="bg-green-400 text-white p-4 fixed top-0 w-full text-center z-50 flex justify-between items-center">
            <AlertTriangle /> <span>You are offline. Please check your internet connection.</span>
            <button 
              onClick={handleCloseOfflineMessage}
              className="bg-white text-green-500 py-2 px-4 rounded-full"
            >
              X
            </button>
          </div>
        )}

        {isSlowNetworkMessageVisible && isSlowNetwork && (
          <div className="bg-yellow-500 text-white p-4 fixed top-0 w-full text-center z-50 flex justify-between items-center">
            <AlertTriangle /> <span>Your network is slow. Please wait while we load the content.</span>
            <button 
              onClick={handleCloseSlowNetworkMessage}
              className="bg-white text-yellow-500 py-2 px-4 rounded-full"
            >
              X
            </button>
          </div>
        )}

        {/* Main Content */}
        {!isOffline ? (
          <>
            <Routes>
              <Route 
                path="/" 
                element={
                  <>
                    <Carousel />
                    <FeaturedProducts />
                  </>
                } 
              />
              <Route path="/viewcart" element={<ViewCart />} />
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/shopping" element={<Shopping />} />
              <Route path="/product/:id" element={<ViewProductDetail />} />

              {/* New Routes */}
              <Route path="/job-employers" element={<JobEmployers />} />
              <Route path="/shopping" element={<BuySell />} />
              <Route path="/services" element={<Services />} />
              <Route path="/others" element={<Others />} />
              <Route path="/about" element={<AboutUs />} />
              <Route path="/faq" element={<Faq />} />
              <Route path="/contact" element={<ContactUs />} />
              <Route path="/checkout" element={<Checkout />} />
              <Route path="/payment" element={<Payment />} />
              <Route path="/order-confirmation" element={<OrderConfirmation />} />

              {/* Admin Routes */}
              <Route path="/admin/" element={<AdminAuth />} />
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

            {/* Floating Chat Box - Only show on non-admin routes and when online */}
            {!isAdminRoute && <FloatingChatBox userId={userId} />}
          </>
        ) : (
          // Offline Message
          <div className="flex flex-col justify-center items-center min-h-screen bg-green-200">
            <AlertTriangle className='text-gray-950 h-20 w-20 p-4' />
            <h1 className="text-2xl text-center">You are offline. Please check your internet connection.</h1>
            <p className="mt-4">Content is unavailable while offline. Please reconnect to the internet.</p>
          </div>
        )}

        {!isAdminRoute && <Footer />}
      </CartProvider>
    </AuthProvider>
  );
}

export default App;