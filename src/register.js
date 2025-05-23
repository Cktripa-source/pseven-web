import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import { Mail, Lock, User, ShieldCheck, CheckCircle } from "lucide-react";
import { useAuth } from './AuthContext';
import Loading from "./loading";

function Register() {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    password: "",
    repeatPassword: "",
    agreeToTerms: false,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();
  const { register } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    setSuccess("");

    if (formData.password !== formData.repeatPassword) {
      setError("Passwords do not match");
      setLoading(false);
      return;
    }

    if (!formData.agreeToTerms) {
      setError("Please agree to the terms and conditions");
      setLoading(false);
      return;
    }

    const result = await register({
      fullName: formData.fullName,
      email: formData.email,
      password: formData.password,
      agreeToTerms: formData.agreeToTerms
    });

    if (result.success) {
      setSuccess("Registration successful! Redirecting to login...");
      setTimeout(() => navigate('/login'), 2000);
    } else {
      setError(result.error || "Registration failed");
    }
    setLoading(false);
  };

  if (loading) return <Loading />;

  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center md:mt-24 px-4 py-12 "
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      <motion.div 
        className="w-full max-w-2xl"
        initial={{ y: 20 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.6, delay: 0.1 }}
      >
        <motion.div 
          className="bg-white rounded-xl overflow-hidden"
          transition={{ duration: 0.3 }}
        >
          <div className="bg-white py-6 px-8">
            <div className="flex justify-center mb-2">
              <div className="bg-black p-3 rounded-full">
                <User className="text-white" size={28} />
              </div>
            </div>
            <h1 className="text-2xl font-bold text-black text-center">Create Account</h1>
            <p className="text-gray-950 text-center text-sm mt-1">Join our community today</p>
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

            {success && (
              <motion.div
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 bg-green-50 text-green-600 rounded-lg text-sm font-medium flex items-center"
              >
                <CheckCircle className="mr-2 flex-shrink-0" size={16} />
                {success}
              </motion.div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                <div className="relative">
                  <User className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                    className="w-full p-3.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="John Doe"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Email</label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    className="w-full p-3.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="name@example.com"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Password</label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={formData.password}
                    onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                    className="w-full p-3.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                  <ShieldCheck className="absolute left-3 top-3.5 text-gray-400" size={18} />
                  <input
                    type="password"
                    value={formData.repeatPassword}
                    onChange={(e) => setFormData({ ...formData, repeatPassword: e.target.value })}
                    className="w-full p-3.5 pl-10 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors"
                    placeholder="••••••••"
                    required
                  />
                </div>
              </div>
            </div>

            <div className="flex items-center mt-6">
              <input
                id="terms"
                type="checkbox"
                checked={formData.agreeToTerms}
                onChange={(e) => setFormData({ ...formData, agreeToTerms: e.target.checked })}
                className="h-4 w-4 text-green-600 border-gray-300 rounded focus:ring-green-500"
              />
              <label htmlFor="terms" className="ml-2 text-sm text-gray-600">
                I agree to the{' '}
                <Link to="/terms" className="text-green-600 hover:text-green-800 transition-colors">
                  terms and conditions
                </Link>
              </label>
            </div>

            <motion.button
              type="submit"
              className="w-full bg-black text-white py-3.5 rounded-lg font-medium hover:bg-green-600 transition-colors mt-6"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              disabled={loading}
            >
              {loading ? 'Creating account...' : 'Create account'}
            </motion.button>

            <div className="mt-8 pt-6 border-t border-gray-200">
              <p className="text-center text-gray-600">
                Already have an account?{' '}
                <Link to="/login" className="text-green-600 hover:text-green-800 font-medium transition-colors">
                  Sign in instead
                </Link>
              </p>
            </div>
          </form>
        </motion.div>
      </motion.div>
    </motion.div>
  );
}

export default Register;