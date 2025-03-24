import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, AlertTriangle, ShieldAlert } from "lucide-react";
import { useAuth } from "../AuthContext";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate, Link } from "react-router-dom";

const AdminLogin = () => {
  const { adminLogin } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  // Remove the useEffect that was causing the double redirect

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    try {
      // Attempt admin login
      const result = await adminLogin(email, password);
      
      if (!result.success) {
        setFormError(result.error || "Login failed");
        toast.error(result.error || "Login failed");
        
        // If this was a regular user attempting to use admin login
        if (result.isUserAttempt && result.redirectTo) {
          toast.info("It looks like you're a regular user. Redirecting to user login...");
          setTimeout(() => {
            navigate(result.redirectTo);
          }, 2000);
        }
      } else {
        toast.success("Login successful! Redirecting...");
        
        // Always use navigate for consistency
        navigate(result.redirectTo);
      }
    } catch (error) {
      setFormError("An unexpected error occurred");
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-gray-100 p-4">
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md rounded-lg bg-white p-8 shadow-lg"
      >
        <div className="flex justify-center mb-4">
          <div className="bg-blue-600 p-2 rounded-full">
            <ShieldAlert className="text-white" size={32} />
          </div>
        </div>
        
        <h1 className="mb-6 text-center text-2xl font-bold text-gray-800">
          Admin Portal
        </h1>
        
        <form onSubmit={handleSubmit} className="space-y-6">
          <div className="space-y-2">
            <label htmlFor="email" className="text-sm font-medium text-gray-700">
              Admin Email
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Mail className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="email"
                id="email"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="admin@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </div>
          
          <div className="space-y-2">
            <label htmlFor="password" className="text-sm font-medium text-gray-700">
              Password
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 left-0 flex items-center pl-3">
                <Lock className="h-5 w-5 text-gray-400" />
              </div>
              <input
                type="password"
                id="password"
                className="w-full rounded-md border border-gray-300 py-2 pl-10 pr-3 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </div>
          
          {formError && (
            <div className="flex items-center rounded-md bg-red-50 p-3 text-sm text-red-600 font-medium">
              <AlertTriangle className="mr-2 h-5 w-5 text-red-500" />
              {formError}
            </div>
          )}
          
          <button
            type="submit"
            className="w-full rounded-md bg-blue-600 py-2 px-4 font-medium text-white transition duration-200 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-70"
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="flex items-center justify-center">
                <svg className="mr-2 h-5 w-5 animate-spin text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Authenticating...
              </span>
            ) : (
              "Admin Login"
            )}
          </button>
          
          <div className="text-center pt-4 border-t border-gray-200">
            <p className="text-center text-gray-500 text-sm">
              Regular user?{' '}
              <Link to="/login" className="text-blue-600 hover:text-blue-800 font-medium transition-colors">
                Go to user login
              </Link>
            </p>
          </div>
        </form>
        
        {/* Toast Container */}
        <ToastContainer position="top-right" autoClose={5000} />
      </motion.div>
    </div>
  );
};

export default AdminLogin;