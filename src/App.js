import React, { useState, useEffect } from 'react';
import { AuthProvider } from './AuthContext';
import { AlertTriangle } from "lucide-react";
import { Routes, Route, useLocation } from 'react-router-dom';
import { CartProvider } from './CartContext';
import Navbar from './nav';
import Carousel from './Carousel';
import Footer from './footer';
import ViewCart from './viewcart';
import Login from './login';
import Dashboard from './userDashboard';
import EditProfile from './editeprofile';
import ForgotPassword from './ForgotPassword';
import ResetPassword from './ResetPassword';
import Register from './register';
import Shopping from './shopping';
import ViewProductDetail from "./ViewProductDetail";
import JobEmployers from './JobEmployers';
import Others from './Others';
import AboutUs from './AboutUs';
import Faq from './Faq';
import ContactUs from './ContactUs';
import Checkout from './Checkout';
import Payment from './payment';
import OrderConfirmation from './order-confirmation';
import Services from "./Services";
import FloatingChatBox from './chatbox';
import Loading from './loading';
import { ProfileProvider } from './ProfileContext';
import { NotFound, Forbidden } from './ErrorPages'; // Import the error components
import ProtectedRoute from './ProtectedRoute'; // Import the ProtectedRoute component

// Admin Pages
import AdminAuth from './admin/admin';
import AdminPages from './admin/alladmins';

function App() {
    const location = useLocation();
    const isAdminRoute = location.pathname.startsWith('/admin');

    const [isLoading, setIsLoading] = useState(true);
    const [isOffline, setIsOffline] = useState(!navigator.onLine);
    const [isSlowNetwork, setIsSlowNetwork] = useState(false);
    const [userId, setUserId] = useState(null);

    useEffect(() => {
        setIsOffline(!navigator.onLine);
        const handleOffline = () => setIsOffline(true);
        const handleOnline = () => setIsOffline(false);
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

    return (
        <AuthProvider>
            <CartProvider>
                <ProfileProvider>
                {!isAdminRoute && <Navbar />}

                {/* Network Status Notification */}
                {isOffline && (
                    <div className="bg-red-500 text-white p-2 text-center flex items-center justify-center">
                        <AlertTriangle className="mr-2" size={20} />
                        You are currently offline. Some features may be unavailable.
                    </div>
                )}
                {isSlowNetwork && !isOffline && (
                    <div className="bg-yellow-500 text-white p-2 text-center">
                        Slow network detected. Some content may load slowly.
                    </div>
                )}

                {/* Main Content */}
                <Routes>
                    {/* Public Routes */}
                    <Route path="/" element={<><Carousel /><Shopping /></>} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route path="/forgot-password" element={<ForgotPassword />} />
                    <Route path="/reset-password/:token" element={<ResetPassword />} />
                    <Route path="/shopping" element={<Shopping />} />
                    <Route path="/product/:id" element={<ViewProductDetail />} />
                    <Route path="/services" element={<Services />} />
                    <Route path="/others" element={<Others />} />
                    <Route path="/about" element={<AboutUs />} />
                    <Route path="/faq" element={<Faq />} />
                    <Route path="/contact" element={<ContactUs />} />
                    <Route path="/job-employers" element={<JobEmployers />} />
                    
                    {/* Protected User Routes */}
                    <Route path="/userDashboard" element={<ProtectedRoute element={<Dashboard />} />} />
                    <Route path="/editeprofile" element={<ProtectedRoute element={<EditProfile />} />} />
                    <Route path="/viewcart" element={<ProtectedRoute element={<ViewCart />} />} />
                    <Route path="/checkout" element={<ProtectedRoute element={<Checkout />} />} />
                    <Route path="/payment" element={<ProtectedRoute element={<Payment />} />} />
                    <Route path="/order-confirmation" element={<ProtectedRoute element={<OrderConfirmation />} />} />
                    
                    {/* Admin Routes */}
                    <Route path="/admin" element={<AdminAuth />} />
                    <Route path="/admin/*" element={<ProtectedRoute element={<AdminPages />} requiredRole="admin" />} />
                    
                    {/* Error Routes */}
                    <Route path="/forbidden" element={<Forbidden />} />
                    <Route path="*" element={<NotFound />} />
                </Routes>

                {/* Floating Chat Box - Only show on non-admin routes and when online */}
                {!isAdminRoute && !isOffline && <FloatingChatBox userId={userId} />}
                </ProfileProvider>
                
                {!isAdminRoute && <Footer />}
            </CartProvider>
        </AuthProvider>
    );
}

export default App;