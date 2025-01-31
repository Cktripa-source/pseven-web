import React, { useState } from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ShieldCheck } from "lucide-react";
import Shop from "./images/shop.png";

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
    setFormData({ ...formData, [id]: type === "checkbox" ? checked : value });
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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ fullName, email, password }),
      });

      const data = await response.json();
      if (response.ok) {
        setSuccess("Registration successful! You can now log in.");
        setFormData({ fullName: "", email: "", password: "", repeatPassword: "", agreeToTerms: false });
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
    <div className="w-full h-screen flex flex-col md:flex-row pt-20 md:mt-10 mt-10">
      {/* Left Section - Image */}
      <motion.div
        className="hidden md:flex w-1/3 bg-gray-900 items-center justify-center h-screen"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src={Shop} alt="Shop" className="max-w-md rounded-lg shadow-lg" />
      </motion.div>

      {/* Right Section - Form */}
      <motion.div
        className="w-full md:w-3/42 flex items-center justify-center bg-white px-6 py-12 h-screen"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form
          className="w-full  bg-white p-8 shadow-lg rounded-lg border border-gray-200"
          onSubmit={handleSubmit}
        >
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Register New Account</h1>

          {/* Error & Success Messages */}
          {error && <p className="mb-4 text-red-500 text-sm text-center">{error}</p>}
          {success && <p className="mb-4 text-green-500 text-sm text-center">{success}</p>}

          {/* Input Fields - Split into Two Columns */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[ 
              { id: "fullName", type: "text", placeholder: "Enter full name", icon: User },
              { id: "email", type: "email", placeholder: "name@example.com", icon: Mail },
            ].map(({ id, type, placeholder, icon: Icon }, index) => (
              <motion.div key={id} className="mb-4" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                  {id === "fullName" ? "Full Name" : "Your Email"}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type={type}
                    id={id}
                    value={formData[id]}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder={placeholder}
                    required
                  />
                </div>
              </motion.div>
            ))}
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {[ 
              { id: "password", type: "password", placeholder: "Enter password", icon: Lock },
              { id: "repeatPassword", type: "password", placeholder: "Repeat password", icon: ShieldCheck },
            ].map(({ id, type, placeholder, icon: Icon }, index) => (
              <motion.div key={id} className="mb-4" whileHover={{ scale: 1.02 }} transition={{ duration: 0.3 }}>
                <label htmlFor={id} className="block text-sm font-medium text-gray-700 mb-2">
                  {id === "password" ? "Your Password" : "Repeat Password"}
                </label>
                <div className="relative">
                  <Icon className="absolute left-3 top-3 text-gray-500" size={20} />
                  <input
                    type={type}
                    id={id}
                    value={formData[id]}
                    onChange={handleInputChange}
                    className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-gray-900"
                    placeholder={placeholder}
                    required
                  />
                </div>
              </motion.div>
            ))}
          </div>

          {/* Terms & Conditions */}
          <motion.div className="flex items-center mb-6" whileHover={{ scale: 1.02 }}>
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
              <Link to="/terms" className="text-blue-500 hover:underline">terms and conditions</Link>.
            </label>
          </motion.div>

          {/* Submit Button */}
          <motion.button
            type="submit"
            className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium text-sm hover:bg-black transition duration-300"
            disabled={loading}
            whileHover={{ scale: 1.05 }}
          >
            {loading ? "Registering..." : "Register"}
          </motion.button>

          {/* Login Redirect */}
          <p className="text-sm text-gray-500 text-center mt-4">
            Already have an account?{" "}
            <Link to="/login" className="text-blue-500 hover:underline">Log in</Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}

export default Register;
