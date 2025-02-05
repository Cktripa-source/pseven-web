import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import Shop from "./images/shop.png";
import Loading from "./loading"; // Make sure you import the Loading component

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(true); // Add loading state
  const navigate = useNavigate();

  // Simulate loading before showing the form
  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false); // After 3 seconds, show the login form
    }, 3000);

    return () => clearTimeout(timer);
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const response = await axios.post("https://pseven-api-test.onrender.com/api/auth/login", {
        email,
        password,
      });

      // Store token in localStorage
      localStorage.setItem("userToken", response.data.token);

      // Redirect to dashboard
      navigate("/dashboard");
    } catch (error) {
      setError(error.response?.data?.message || "An error occurred. Please try again.");
    }
  };

  // If loading, show the loading page
  if (isLoading) {
    return <Loading />;
  }

  return (
    <div className="w-full h-screen flex flex-col md:flex-row pt-20 md:mt-10 mt-10">
      {/* Left Section with Image */}
      <motion.div
        className="hidden md:flex w-1/2 bg-gray-900 items-center justify-center h-screen"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src={Shop} alt="Shop" className="max-w-full h-auto rounded-lg shadow-lg" />
      </motion.div>

      {/* Right Section with Form */}
      <motion.div
        className="w-full md:w-1/2 h-full flex items-center justify-center bg-white px-6 py-12"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form
          className="max-w-md w-full p-8 shadow-lg rounded-lg border border-gray-200"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">Login to Your Account</h1>

          {/* Error Message */}
          {error && <p className="text-green-500 text-center mb-4">{error}</p>}

          {/* Email Field */}
          <motion.div
            className="mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              Your Email
            </label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="email"
                id="email"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="name@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
          </motion.div>

          {/* Password Field */}
          <motion.div
            className="mb-4"
            whileHover={{ scale: 1.02 }}
            transition={{ duration: 0.3 }}
          >
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              Your Password
            </label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
              <input
                type="password"
                id="password"
                className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
          </motion.div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <a href="#" className="text-sm text-green-500 hover:underline">
              Forgot your password?
            </a>
          </div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
            whileHover={{ scale: 1.05 }}
          >
            Login
          </motion.button>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Don't have an account?{" "}
              <Link to="/register" className="text-green-500 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

export default Login;
