import React from "react";
import Shop from "./images/shop.png";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div className="w-full h-screen flex flex-col md:flex-row pt-20 md:mt-32 mt-40"> {/* Ensure the padding here to avoid overlapping with navbar */}
      {/* Left Section with Image (Hidden on mobile and visible on larger screens) */}
      <div className="w-full md:w-1/2 h-full hidden md:flex items-center justify-center bg-gray-900">
        <img src={Shop} alt="Shop" className="max-w-full h-auto" />
      </div>

      {/* Right Section with Form (Image as background on mobile) */}
      <div
        className="w-full md:w-1/2 h-full flex items-center justify-center bg-white"
        style={{ backgroundImage: `url(${Shop})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <form className="max-w-md w-full p-8 shadow-lg rounded-lg border border-gray-200 bg-white opacity-95">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Login to Your Account
          </h1>

          {/* Email Field */}
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950"
              placeholder="name@example.com"
              required
            />
          </div>

          {/* Password Field */}
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Your Password
            </label>
            <input
              type="password"
              id="password"
              className="w-full p-3 border border-gray-400 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Forgot Password */}
          <div className="flex justify-end mb-6">
            <a href="#" className="text-sm text-blue-500 hover:underline">
              Forgot your password?
            </a>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
          >
            Login
          </button>

          {/* Register Link */}
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-700">
              Don't have an account?{" "}
              <Link to="/register" className="text-blue-500 hover:underline">
                Register here
              </Link>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
