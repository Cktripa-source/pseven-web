import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';

const ResetPassword = () => {
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [message, setMessage] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [tokenValid, setTokenValid] = useState(false);
  const [tokenChecked, setTokenChecked] = useState(false);
  
  const { token } = useParams();
  const navigate = useNavigate();

  // Validate token on component mount
  useEffect(() => {
    const validateToken = async () => {
      try {
        const response = await axios.get(`/api/auth/validate-reset-token/${token}`);
        if (response.data.valid) {
          setTokenValid(true);
        } else {
          setError('This password reset link is invalid or has expired.');
        }
      } catch (err) {
        setError('This password reset link is invalid or has expired.');
      } finally {
        setTokenChecked(true);
      }
    };

    if (token) {
      validateToken();
    } else {
      setError('Reset token is missing.');
      setTokenChecked(true);
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Validate passwords
    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (password.length < 8) {
      setError('Password must be at least 8 characters long.');
      return;
    }
    
    setLoading(true);
    setError('');
    setMessage('');
    
    try {
      const response = await axios.post('/api/auth/reset-password', {
        token,
        password
      });
      
      setMessage(response.data.message);
      
      // Redirect to login page after a short delay
      setTimeout(() => {
        navigate('/login');
      }, 3000);
      
    } catch (err) {
      setError(err.response?.data?.message || 'An error occurred. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!tokenChecked) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <p className="text-center text-gray-600">Validating your reset token...</p>
      </div>
    );
  }

  if (!tokenValid && tokenChecked) {
    return (
      <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
        <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Password Reset</h2>
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
          {error || 'This password reset link is invalid or has expired.'}
        </div>
        <div className="text-center mt-4">
          <a href="/forgot-password" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
            Request a new password reset link
          </a>
        </div>
      </div>
    );
  }

  return (
    <div className="max-w-md mx-auto mt-10 p-6 bg-white rounded-lg shadow-md">
      <h2 className="text-2xl font-bold text-center text-gray-800 mb-6">Reset Your Password</h2>
      
      {message && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded mb-4">
          {message}
        </div>
      )}
      
      {error && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          {error}
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-1">
            New Password
          </label>
          <input
            type="password"
            id="password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Enter new password"
            minLength="8"
          />
        </div>
        
        <div>
          <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-1">
            Confirm Password
          </label>
          <input
            type="password"
            id="confirmPassword"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            placeholder="Confirm new password"
            minLength="8"
          />
        </div>
        
        <button 
          type="submit" 
          disabled={loading}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 px-4 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50 transition duration-200 ease-in-out disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
      
      <div className="text-center mt-4">
        <a href="/login" className="text-blue-600 hover:text-blue-800 text-sm font-medium">
          Back to Login
        </a>
      </div>
    </div>
  );
};

export default ResetPassword;