// In utils/auth.js
export const getAuthToken = () => {
  return localStorage.getItem('authToken'); // Match the key used in AuthContext
};

// Check if user is logged in (simple check for token presence)
export const isLoggedIn = () => {
  return !!getAuthToken();
};

// Logout function (clears token)
export const logout = () => {
  localStorage.removeItem('authToken'); // Match the key used in AuthContext
};