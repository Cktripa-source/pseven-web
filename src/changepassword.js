import React, { useState } from 'react';
import { useProfile } from './ProfileContext';

const PasswordChangeForm = () => {
    const { loading, error, success, changePassword, clearNotifications } = useProfile();
  
    const [formData, setFormData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });
  
    const [passwordError, setPasswordError] = useState('');
  
    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: value
        }));

        // Clear any notifications when user starts editing
        if (success || error) {
            clearNotifications();
        }

        // Clear password match error when typing
        if (passwordError && (name === 'newPassword' || name === 'confirmPassword')) {
            setPasswordError('');
        }
    };
  
    const validateForm = () => {
        // Check if passwords match
        if (formData.newPassword !== formData.confirmPassword) {
            setPasswordError('New passwords do not match');
            return false;
        }

        // Check password length
        if (formData.newPassword.length < 8) {
            setPasswordError('Password must be at least 8 characters long');
            return false;
        }

        return true;
    };
  
    const handleSubmit = async (e) => {
        e.preventDefault();
  
        if (!validateForm()) {
            return;
        }
  
        const result = await changePassword(formData.currentPassword, formData.newPassword);
  
        if (result.success) {
            // Clear form on success
            setFormData({
                currentPassword: '',
                newPassword: '',
                confirmPassword: ''
            });
        }
    };
  
    return (
        <div className="card p-4 bg-gray-800 text-gray-200 shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Change Password</h2>

            {error && (
                <div className="bg-red-700 border border-red-600 text-white px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {passwordError && (
                <div className="bg-red-700 border border-red-600 text-white px-4 py-3 rounded mb-4">
                    {passwordError}
                </div>
            )}

            {success && (
                <div className="bg-green-700 border border-green-600 text-white px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="currentPassword" className="block text-sm font-medium mb-1">
                        Current Password
                    </label>
                    <input
                        type="password"
                        id="currentPassword"
                        name="currentPassword"
                        value={formData.currentPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="newPassword" className="block text-sm font-medium mb-1">
                        New Password
                    </label>
                    <input
                        type="password"
                        id="newPassword"
                        name="newPassword"
                        value={formData.newPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="confirmPassword" className="block text-sm font-medium mb-1">
                        Confirm New Password
                    </label>
                    <input
                        type="password"
                        id="confirmPassword"
                        name="confirmPassword"
                        value={formData.confirmPassword}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-green-600"
                        required
                    />
                </div>

                <div className="flex justify-end mt-4">
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Updating...' : 'Change Password'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default PasswordChangeForm;