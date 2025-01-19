import React from "react";
import Shop from "./images/shop.png";
import { Link } from "react-router-dom";

function Register() {
  return (
    <div className="w-full flex h-screen pt-32 md:mt-20 mt-40">
      {/* Left Section with Image (visible on desktop and hidden on mobile) */}
      <div className="w-full md:w-1/2 h-full hidden md:flex items-center justify-center bg-gray-900">
        <img src={Shop} alt="Shop" className="max-w-full h-auto" />
      </div>

      {/* Right Section with Form and Image as background on mobile */}
      <div
        className="w-full md:w-1/2 h-full flex items-center justify-center bg-white"
        style={{ backgroundImage: `url(${Shop})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
      >
        <form className="max-w-md w-full p-8 shadow-lg rounded-lg border border-gray-200 bg-white opacity-95">
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Register New Account
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950"
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
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Repeat Password Field */}
          <div className="mb-4">
            <label
              htmlFor="repeat-password"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Repeat Password
            </label>
            <input
              type="password"
              id="repeat-password"
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Repeat password"
              required
            />
          </div>

          {/* Terms and Conditions */}
          <div className="flex items-start mb-6">
            <label htmlFor="terms" className="ml-2 text-sm text-gray-700">
              Already Have an Account?{" "}
              <Link to="/login" className="text-blue-500 hover:underline">
                Login Here
              </Link>
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
          >
            Register
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
