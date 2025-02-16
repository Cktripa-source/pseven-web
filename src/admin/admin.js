import React, { useState } from "react";
import { motion } from "framer-motion";
import { Mail, Lock } from "lucide-react";
import { useAuth } from "../AuthContext";

const AdminLogin = () => {
  const { login, error } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [formError, setFormError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setFormError("");

    try {
      const response = await login(email, password);
      if (!response.success) {
        setFormError(response.error || "Login failed");
      } else {
        // Handle successful login (e.g., redirect)
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-900 text-white">
      <motion.div
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="w-full max-w-md p-6 bg-gray-800 shadow-xl rounded-lg"
      >
        <h2 className="text-2xl font-bold text-center mb-4">Admin Login</h2>
        <form onSubmit={handleSubmit}>
          <div className="mb-4 flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
            <Mail className="text-gray-400" />
            <input
              type="email"
              className="bg-gray-700 text-white border-none focus:ring-0 w-full"
              placeholder="Your Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div className="mb-4 flex items-center gap-2 bg-gray-700 p-2 rounded-lg">
            <Lock className="text-gray-400" />
            <input
              type="password"
              className="bg-gray-700 text-white border-none focus:ring-0 w-full"
              placeholder="Your Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>
          {formError && <p className="text-red-500 text-center mt-2">{formError}</p>}
          <button
            type="submit"
            className={`w-full mt-4 ${isLoading ? 'bg-blue-500 cursor-not-allowed' : 'bg-blue-600 hover:bg-blue-700'} shadow-lg p-2 rounded`}
            disabled={isLoading}
          >
            {isLoading ? (
              <div className="animate-spin rounded-full h-5 w-5 border-t-2 border-b-2 border-white mx-auto"></div>
            ) : (
              "Log In"
            )}
          </button>
        </form>
        <div className="text-center mt-4">
          <button
            onClick={() => window.location.href = '/signup'} // Redirect to signup page
            className="text-sm text-blue-400 hover:underline"
          >
            Don't have an account? Sign Up
          </button>
        </div>
      </motion.div>
    </div>
  );
};

export default AdminLogin;