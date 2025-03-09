import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock, Mail, User } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from './AuthContext';
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
    <motion.div 
      className="min-h-screen flex items-center justify-center md:mt-32"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-xl"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div 
          className="bg-white rounded-lg overflow-hidden"
          transition={{ duration: 0.3 }}
        >
          <div className="py-2 px-4">
            <div className="flex justify-center mb-2">
              <div className="bg-black p-1 rounded-full">
                <User className="text-white" size={28} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-black text-center">Welcome Back</h1>
            <p className="text-gray-950 text-center text-sm mt-1">Sign in to continue</p>
          </div>

          <form onSubmit={handleSubmit} className="p-8">
            {error && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-red-50 text-red-500 rounded-lg text-sm font-medium"
              >
                {error}
              </motion.div>
            )}

            <div className="space-y-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full p-3.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="text-sm font-medium text-gray-700">Password</label>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full p-3.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div className="flex items-center">
               <Link to="/forgot-password" className="text-md text-green-600 hover:text-green-800 transition-colors justify-end">
                    Forgot password?
                  </Link>
              </div>

              <motion.button
                type="submit"
                className="w-full bg-black text-white py-3.5 rounded-lg font-medium hover:bg-green-600 transition-colors"
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isLoading}
              >
                {isLoading ? 'Signing in...' : 'Sign in'}
              </motion.button>
            </div>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Don't have an account?{' '}
                <Link to="/register" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                  Sign up now
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Login;