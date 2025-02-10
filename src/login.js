import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from './AuthContext';
import Shop from "./images/shop.png";
import Loading from "./loading";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { login } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError("");

    const result = await login(email, password);
    if (result.success) {
      navigate('/shopping');  // Redirect to shopping section after login
    } else {
      setError(result.error || 'Login failed');
    }
    setIsLoading(false);
  };


  if (isLoading) return <Loading />;

  return (
    <div className="w-full min-h-screen flex flex-col md:flex-row pt-20">
      <motion.div
        className="hidden md:flex w-1/2 bg-gray-900 items-center justify-center"
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <img src={Shop} alt="Shop" className="max-w-md rounded-lg shadow-lg" />
      </motion.div>

      <motion.div
        className="w-full md:w-1/2 flex items-center justify-center bg-white px-6 py-12"
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6 }}
      >
        <form onSubmit={handleSubmit} className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg border border-gray-200">
          <h1 className="text-2xl font-bold text-gray-800 text-center mb-6">Welcome Back</h1>
          
          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-4 p-3 bg-red-50 text-red-500 rounded-lg text-sm text-center"
            >
              {error}
            </motion.div>
          )}

          <motion.div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="name@example.com"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 text-gray-500" size={20} />
                <input
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full p-3 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-gray-900 focus:border-transparent"
                  placeholder="••••••••"
                  required
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  type="checkbox"
                  className="h-4 w-4 text-gray-900 border-gray-300 rounded focus:ring-gray-900"
                />
                <label className="ml-2 text-sm text-gray-700">Remember me</label>
              </div>
              <Link to="/forgot-password" className="text-sm text-green-500 hover:underline">
                Forgot password?
              </Link>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-gray-900 text-white py-3 rounded-lg font-medium hover:bg-black transition-colors"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={isLoading}
            >
              {isLoading ? 'Signing in...' : 'Sign in'}
            </motion.button>
          </motion.div>

          <p className="mt-6 text-center text-sm text-gray-600">
            Don't have an account?{' '}
            <Link to="/register" className="text-green-500 hover:underline font-medium">
              Sign up now
            </Link>
          </p>
        </form>
      </motion.div>
    </div>
  );
}
export default Login