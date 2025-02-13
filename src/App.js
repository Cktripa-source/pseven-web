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
                {!isAdminRoute && <Navbar />}

                {/* Main Content */}
                {!isOffline ? (
                    <>
                        <Routes>
                            {/* Public Routes */}
                            <Route path="/" element={<><Carousel /><Shopping /></>} />
                            <Route path="/viewcart" element={<ViewCart />} />
                            <Route path="/login" element={<Login />} />
                            <Route path="/register" element={<Register />} />
                            <Route path="/shopping" element={<Shopping />} />
                            <Route path="/product/:id" element={<ViewProductDetail />} />
                            <Route path="/job-employers" element={<JobEmployers />} />
                            <Route path="/services" element={<Services />} />
                            <Route path="/others" element={<Others />} />
                            <Route path="/about" element={<AboutUs />} />
                            <Route path="/faq" element={<Faq />} />
                            <Route path="/contact" element={<ContactUs />} />
                            <Route path="/checkout" element={<Checkout />} />
                            <Route path="/payment" element={<Payment />} />
                            <Route path="/order-confirmation" element={<OrderConfirmation />} />

                            {/* Admin Routes */}
                            <Route path="/admin/*" element={<AdminPages />} />
                            <Route path="/admin" element={<AdminAuth />} />
                        </Routes>

                        {/* Floating Chat Box - Only show on non-admin routes and when online */}
                        {!isAdminRoute && <FloatingChatBox userId={userId} />}
                    </>
                ) : (
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
