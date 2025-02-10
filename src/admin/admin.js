import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock, User } from "lucide-react";
import { useAuth } from "../AuthContext"; // Importing the Auth context

export default function AdminAuth() {
  const { login, register, error } = useAuth(); // Accessing login and register functions from context
  const [isSignup, setIsSignup] = useState(false);
  const [role, setRole] = useState("user"); // Default role is 'user'
  const [formError, setFormError] = useState(""); 
  // To store error messages
  // In the handleSubmit function
const handleSubmit = async (e) => {
  e.preventDefault();
  
  const formData = new FormData(e.target);
  const name = formData.get("name");  // Ensure 'name' is correctly retrieved
  const email = formData.get("email");
  const password = formData.get("password");

  if (isSignup) {
    const userData = {
      fullName: name,  // Change 'name' to 'fullName'
      email,
      password,
      role,
      agreeToTerms: role === 'user' ? true : undefined,  
    };    
    const response = await register(userData);
    if (!response.success) {
      setFormError(response.error || "Registration failed");
    }
  } else {
    const response = await login(email, password);
    if (!response.success) {
      setFormError(response.error || "Login failed");
    }
  }
};

  
  
  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 bg-gray-800 shadow-xl"
      >
        <div className="p-4">
          <h2 className="text-2xl font-bold text-center mb-4">
            {isSignup ? "Admin Signup" : "Admin Login"}
          </h2>
          <form onSubmit={handleSubmit}>
            {isSignup && (
              <div className="mb-4 flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
                <User className="text-gray-400" />
                <input
                  id="name"
                  type="text"
                  className="bg-gray-700 text-white border-none focus:ring-0 w-full"
                  placeholder="Your Name"
                  name="name"
                  required
                />
              </div>
            )}
            <div className="mb-4 flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
              <Mail className="text-gray-400" />
              <input
                id="email"
                type="email"
                className="bg-gray-700 text-white border-none focus:ring-0 w-full"
                placeholder="Your Email"
                name="email"
                required
              />
            </div>
            <div className="mb-4 flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
              <Lock className="text-gray-400" />
              <input
                id="password"
                type="password"
                className="bg-gray-700 text-white border-none focus:ring-0 w-full"
                placeholder="Your Password"
                name="password"
                required
              />
            </div>

            {/* Role selection for admin */}
            {isSignup && (
              <div className="mb-4 bg-gray-700 p-2 rounded-lg">
                <label htmlFor="role" className="text-gray-400">Select Role</label>
                <select
                  id="role"
                  name="role"
                  className="bg-gray-700 text-white border-none focus:ring-0 w-full"
                  value={role}
                  onChange={(e) => setRole(e.target.value)}
                >
                  <option value="user">User</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
            )}

            {/* Show error message */}
            {formError && <p className="text-red-500 text-center mt-2">{formError}</p>}

            <button
              type="submit"
              className="w-full mt-4 bg-blue-600 hover:bg-blue-700 shadow-lg p-2 rounded"
            >
              {isSignup ? "Sign Up" : "Log In"}
            </button>
          </form>
          <div className="text-center mt-4">
            <button
              onClick={() => setIsSignup(!isSignup)}
              className="text-sm text-blue-400 hover:underline"
            >
              {isSignup
                ? "Already have an account? Log In"
                : "Don't have an account? Sign Up"}
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
