import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from './AuthContext'; // Adjust import based on your auth implementation

/**
 * Protected route component that checks for authentication and authorization
 * Redirects to login if not authenticated
 * Redirects to forbidden page if authenticated but lacks required role
 * 
 * @param {Object} props
 * @param {JSX.Element} props.element - The element to render if authorized
 * @param {string} [props.requiredRole] - Optional role required to access the route
 * @returns {JSX.Element}
 */
const ProtectedRoute = ({ element, requiredRole }) => {
  const { isAuthenticated, user } = useAuth();
  const location = useLocation();

  // Not authenticated - redirect to login with return path
  if (!isAuthenticated) {
    return <Navigate to="/login" state={{ from: location.pathname }} replace />;
  }

  // If role check is required and user doesn't have the required role
  if (requiredRole && (!user.role || user.role !== requiredRole)) {
    return <Navigate to="/forbidden" replace />;
  }

  // User is authenticated and authorized
  return element;
};

export default ProtectedRoute;