import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';

// Create axios instance with default config
const api = axios.create({
  baseURL: 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add axios interceptor for token handling
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('userToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser ] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('userToken');
    if (token) {
      try {
        const response = await api.get('/auth/check');
        setUser (response.data.user);
        // Redirect based on role
        if (response.data.user.role === 'admin') {
          navigate('/admin/dashboardoverview');
        } else {
          navigate('/admin');
        }
      } catch (err) {
        if (err.response?.status === 404) {
          console.error('Auth Check Endpoint Not Found:', err);
          // Handle the 404 error, e.g., log out the user
          localStorage.removeItem('userToken');
          setUser (null);
          navigate('/login');
        } else {
          handleAuthError(err);
        }
      }
    } else {
      setLoading(false); // No token, just set loading to false
    }
  };
  const handleAuthError = (err) => {
    console.error('Auth Error:', err);
    localStorage.removeItem('userToken');
    setUser (null);
    setError(err.response?.data?.message || 'Authentication failed');
    if (err.response?.status === 401) {
      navigate('/login');
    }
    setLoading(false); // Ensure loading is set to false on error
  };

  const login = async (email, password) => {
    try {
      setError(null);
      const response = await api.post('/auth/login', {
        email,
        password,
      });
      
      const { token, user: userData } = response.data;
      localStorage.setItem('userToken', token);
      setUser (userData);

      // Redirect based on role
      if (userData.role === 'admin') {
        navigate('/admin/dashboardoverview');
      } else {
        navigate('/admin');
      }

      return { success: true };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      const response = await api.post('/auth/register', userData);
      
      // If registration is successful, automatically log in
      if (response.data.success) {
        return await login(userData.email, userData.password);
      }
      
      return { success: true, message: 'Registration successful!' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Registration failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  const logout = async () => {
    try {
      // Optional: Call logout endpoint if you have one
      // await api.post('/auth/logout');
      localStorage.removeItem('userToken');
      setUser (null);
      setError(null);
      navigate('/login');
    } catch (err) {
      console.error('Logout error:', err);
    }
  };

  const clearError = () => {
    setError(null);
  };

  return (
    <AuthContext.Provider 
      value={{ 
        user, 
        loading, 
        error, 
        login, 
        register, 
        logout, 
        clearError,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {loading ? <div>Loading...</div> : children} {/* Show loading state */}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

// Optional: Export the api instance for use in other parts of the application
export const authApi = api;