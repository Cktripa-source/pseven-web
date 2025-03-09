import React, { useState } from 'react';
import axios from 'axios';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setMessage('');
    try {
      // If you've set up the proxy in package.json, use a relative path
      //const response = await axios.post('/api/auth/forgot-password', { email });
      
      // If proxy isn't set up, use the full URL
      const response = await axios.post('http://localhost:5000/api/auth/forgot-password', { email });
      
      setMessage(response.data.message);
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-2xl mx-auto mt-10 p-8 bg-white rounded-lg md:mt-32">
      <h2 className="text-2xl font-bold text-center text-black mb-8">Forgot Password</h2>
      <p>Welcome ! Enter you email and submit to get reset code and then verify it </p>
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-md mb-6">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-md mb-6">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label htmlFor="email" className="block text-sm font-semibold text-black mb-2">
            Email Address
          </label>
          <input
            type="email"
            id="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-green-500 transition-colors duration-200"
            placeholder="your@email.com"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-black hover:bg-green-600 text-white font-medium py-3 px-6 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
      </form>
      
      <div className="text-center mt-6">
        <a href="/login" className="text-black hover:text-green-600 text-sm font-medium transition-colors duration-200">
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ForgotPassword;