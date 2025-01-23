import React, { useState } from "react";
import Shop from "./images/shop.png";
import { Link } from "react-router-dom";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const handleInputChange = (e) => {
    const { id, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [id]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    const { fullName, email, password, repeatPassword, agreeToTerms } = formData;

    if (password !== repeatPassword) {
      setError("Passwords do not match.");
      return;
    }

    if (!agreeToTerms) {
      setError("You must agree to the terms and conditions to register.");
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await fetch("http://localhost:5000/api/auth/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ fullName, email, password, agreeToTerms }),
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess("Registration successful! You can now log in.");
        setFormData({
          fullName: "",
          email: "",
          password: "",
          repeatPassword: "",
          agreeToTerms: false,
        });
      } else {
        setError(data.message || "Registration failed.");
      }
    } catch (err) {
      setError("An error occurred. Please try again later.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="w-full flex h-screen pt-32 md:mt-20 mt-40">
      {/* Left Section with Image */}
      <div className="w-full md:w-1/2 h-full hidden md:flex items-center justify-center bg-gray-900">
        <img src={Shop} alt="Shop" className="max-w-full h-auto" />
      </div>

      {/* Right Section with Form */}
      <div
        className="w-full md:w-1/2 h-full flex items-center justify-center bg-white"
        style={{
          backgroundImage: `url(${Shop})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <form
          className="max-w-md w-full p-8 shadow-lg rounded-lg border border-gray-200 bg-white opacity-95"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold text-gray-800 mb-6 text-center">
            Register New Account
          </h1>

          {error && (
            <div className="mb-4 text-red-500 text-sm text-center">
              {error}
            </div>
          )}
          {success && (
            <div className="mb-4 text-green-500 text-sm text-center">
              {success}
            </div>
          )}

          {/* Full Name Field */}
          <div className="mb-4">
            <label
              htmlFor="fullName"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Full Name
            </label>
            <input
              type="text"
              id="fullName"
              value={formData.fullName}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-950"
              placeholder="Enter full name"
              required
            />
          </div>

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
              value={formData.email}
              onChange={handleInputChange}
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
              value={formData.password}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Enter password"
              required
            />
          </div>

          {/* Repeat Password Field */}
          <div className="mb-4">
            <label
              htmlFor="repeatPassword"
              className="block text-sm font-medium text-gray-700 mb-2"
            >
              Repeat Password
            </label>
            <input
              type="password"
              id="repeatPassword"
              value={formData.repeatPassword}
              onChange={handleInputChange}
              className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
              placeholder="Repeat password"
              required
            />
          </div>

          {/* Agree to Terms */}
          <div className="flex items-center mb-6">
            <input
              type="checkbox"
              id="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
              className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
              required
            />
            <label htmlFor="agreeToTerms" className="ml-2 text-sm text-gray-700">
              I agree to the{" "}
              <a href="/terms" className="text-blue-500 hover:underline">
                terms and conditions
              </a>
              .
            </label>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-black focus:outline-none focus:ring-2 focus:ring-black"
            disabled={loading}
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default Register;
