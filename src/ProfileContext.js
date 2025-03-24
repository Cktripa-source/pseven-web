import React, { createContext, useContext, useState, useEffect } from 'react';
import { useAuth, api } from './AuthContext'; // Changed authApi to api

// Create Profile Context
const ProfileContext = createContext(null);

export const ProfileProvider = ({ children }) => {
  const { user, isAuthenticated, checkAuth } = useAuth();
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Load profile data when user changes or on initial authentication
  useEffect(() => {
    if (isAuthenticated && user) {
      setProfileData({
        fullName: user.fullName,
        email: user.email,
        role: user.role,
        permissions: user.permissions
      });
    } else {
      setProfileData(null);
    }
  }, [user, isAuthenticated]);

  // Update profile information
  const updateProfile = async (updatedData) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.put('/auth/update-profile', updatedData); // Changed authApi to api
      
      // Update local state with the new data
      setProfileData({
        ...profileData,
        ...updatedData
      });
      
      // Re-fetch user data to ensure consistency with server
      checkAuth();
      
      setSuccess(response.data.message || 'Profile updated successfully');
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to update profile';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Change password
  const changePassword = async (currentPassword, newPassword) => {
    try {
      setLoading(true);
      setError(null);
      setSuccess(null);
      
      const response = await api.put('/auth/change-password', { // Changed authApi to api
        currentPassword,
        newPassword
      });
      
      setSuccess(response.data.message || 'Password changed successfully');
      return { success: true, message: response.data.message };
    } catch (err) {
      const errorMessage = err.response?.data?.message || 'Failed to change password';
      setError(errorMessage);
      return { success: false, error: errorMessage };
    } finally {
      setLoading(false);
    }
  };

  // Clear notifications (success/error messages)
  const clearNotifications = () => {
    setError(null);
    setSuccess(null);
  };

  return (
    <ProfileContext.Provider value={{
      profileData,
      loading,
      error,
      success,
      updateProfile,
      changePassword,
      clearNotifications
    }}>
      {children}
    </ProfileContext.Provider>
  );
};

// Custom hook to use the Profile context
export const useProfile = () => {
  const context = useContext(ProfileContext);
  if (!context) {
    throw new Error('useProfile must be used within a ProfileProvider');
  }
  return context;
};