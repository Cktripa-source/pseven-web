import React, { createContext, useContext, useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
const API_ONLINE='https://api.psevenrwanda.com/api/';
// Create separate API instances for user and admin
const baseAPI = axios.create({
  baseURL: API_ONLINE|| 'http://localhost:5000/api',
  headers: {
    'Content-Type': 'application/json'
  }
});

// Add axios interceptor for token handling
baseAPI.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('authToken');
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
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    checkAuth();
  }, []);

  const checkAuth = async () => {
    const token = localStorage.getItem('authToken');
    const authType = localStorage.getItem('authType');
    
    if (token) {
      try {
        const response = await baseAPI.get('/auth/check');
        setUser(response.data.user);
        
        // Route users based on role and current location
        const currentPath = window.location.pathname;
        const isAdminPath = currentPath.startsWith('/admin');
        
        if (response.data.user.role === 'admin') {
          if (!isAdminPath) {
            // Admin is on user routes, redirect to admin dashboard
            navigate('/admin/dashboardoverview');
          }
        } else {
          if (isAdminPath) {
            // Regular user is on admin routes, redirect to user area
            navigate('/shopping');
          }
        }
        
        setLoading(false);
      } catch (err) {
        handleAuthError(err);
      }
    } else {
      setLoading(false);
    }
  };
  
  const handleAuthError = (err) => {
    console.error('Auth Error:', err);
    localStorage.removeItem('authToken');
    localStorage.removeItem('authType');
    setUser(null);
    setError(err.response?.data?.message || 'Authentication failed');
    
    // Determine where to redirect based on current path
    const currentPath = window.location.pathname;
    if (currentPath.startsWith('/admin')) {
      navigate('/admin/');
    } else {
      navigate('/login');
    }
    
    setLoading(false);
  };

  // User-specific login function
  const userLogin = async (email, password) => {
    try {
      setError(null);
      
      // First check if this is an admin trying to log in to user route
      const isLikelyAdmin = await checkIfAdmin(email);
      
      if (isLikelyAdmin) {
        return { 
          success: false, 
          error: 'User not found',
          redirectTo: '/login',
          isAdminAttempt: true
        };
      }
      
      // Proceed with regular user login
      const response = await baseAPI.post('/auth/login', {
        email,
        password,
      });
      
      const { token, user: userData } = response.data;
      
      // Double-check that we're not logging in an admin
      if (userData.role === 'admin') {
        return { 
          success: false, 
          error: 'User not found',
          redirectTo: '/login',
          isAdminAttempt: true
        };
      }
      
      // Store auth info
      localStorage.setItem('authToken', token);
      localStorage.setItem('authType', 'user');
      setUser(userData);
      
      return { success: true, redirectTo: '/shopping' };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Admin-specific login function
  const adminLogin = async (email, password) => {
    try {
      setError(null);
      
      // Check if this is actually a regular user trying to log in
      const isAdmin = await checkIfAdmin(email);
      
      if (!isAdmin) {
        return { 
          success: false, 
          error: 'Unknown admin: Guessed user',
          redirectTo: '/login',
          isUserAttempt: true
        };
      }
      
      // Proceed with admin login attempt using the specific admin route
      const response = await baseAPI.post('/auth/admin-login', {
        email,
        password,
      });
      
      const { token, user: userData } = response.data;
      
      // Verify this is really an admin (redundant but safe)
      if (userData.role !== 'admin') {
        return { 
          success: false, 
          error: 'Unknown admin: Guessed user',
          redirectTo: '/login',
          isUserAttempt: true
        };
      }
      
      // Store auth info before navigation
      localStorage.setItem('authToken', token);
      localStorage.setItem('authType', 'admin');
      setUser(userData);
      
      // Use React Router for consistent navigation
      return { 
        success: true, 
        redirectTo: '/admin/dashboardoverview'
      };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Login failed';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    }
  };

  // Helper function to check if an email belongs to an admin
  const checkIfAdmin = async (email) => {
    try {
      console.log('Checking if email is admin:', email);
      const response = await baseAPI.post('/auth/check-role', { email });
      console.log('Response from check-role:', response.data);
      return response.data.role === 'admin';
    } catch (err) {
      // Log more detailed error information
      console.error('Role check failed:', err);
      console.error('Response status:', err.response?.status);
      console.error('Response data:', err.response?.data);
      return false;
    }
  };

  const register = async (userData) => {
    try {
      setError(null);
      
      // Check if trying to register as admin via API only
      const isAdmin = await checkIfAdmin(userData.email);
      if (isAdmin) {
        return { 
          success: false, 
          error: 'Cannot register admin accounts through public registration'
        };
      }
      
      const response = await baseAPI.post('/auth/register', userData);
      
      if (response.data.success) {
        return { success: true, message: 'Registration successful!' };
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
      const isAdmin = user?.role === 'admin';
      
      localStorage.removeItem('authToken');
      localStorage.removeItem('authType');
      setUser(null);
      setError(null);
      
      // Redirect based on user type
      if (isAdmin) {
        navigate('/admin');
      } else {
        navigate('/login');
      }
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
        userLogin,
        adminLogin, 
        register, 
        logout, 
        clearError,
        checkAuth,
        isAuthenticated: !!user,
        isAdmin: user?.role === 'admin'
      }}
    >
      {loading ? <div>Loading...</div> : children}
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

// Export the api instance for use in other parts of the application
export const api = baseAPI;