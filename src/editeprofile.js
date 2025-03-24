import React, { useState, useEffect } from 'react';
import { useProfile } from './ProfileContext';
import { useAuth } from './AuthContext';

const ProfileEditForm = () => {
    const { profileData, loading, error, success, updateProfile, clearNotifications } = useProfile();
    const { user } = useAuth();

    const [formData, setFormData] = useState({
        fullName: '',
        email: ''
    });

    // Initialize form with current user data when available
    useEffect(() => {
        if (profileData) {
            setFormData({
                fullName: profileData.fullName || '',
                email: profileData.email || ''
            });
        }
    }, [profileData]);

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
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        // Only update if data actually changed
        const hasChanged = 
            formData.fullName !== profileData.fullName || 
            formData.email !== profileData.email;

        if (!hasChanged) {
            return;
        }

        await updateProfile(formData);
    };

    return (
        <div className="card p-4 bg-gray-800 text-gray-200 shadow-md rounded-md">
            <h2 className="text-xl font-bold mb-4">Edit Profile</h2>

            {error && (
                <div className="bg-red-700 border border-red-600 text-white px-4 py-3 rounded mb-4">
                    {error}
                </div>
            )}

            {success && (
                <div className="bg-green-700 border border-green-600 text-white px-4 py-3 rounded mb-4">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label htmlFor="fullName" className="block text-sm font-medium mb-1">
                        Full Name
                    </label>
                    <input
                        type="text"
                        id="fullName"
                        name="fullName"
                        value={formData.fullName}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />
                </div>

                <div className="mb-4">
                    <label htmlFor="email" className="block text-sm font-medium mb-1">
                        Email Address
                    </label>
                    <input
                        type="email"
                        id="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        className="w-full px-3 py-2 border border-gray-600 bg-gray-700 text-gray-200 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-600"
                        required
                    />
                </div>

                <div className="flex items-center justify-between mt-4">
                    <div>
                        <span className="text-sm text-gray-400">
                            Role: <span className="font-medium">{user?.role || 'N/A'}</span>
                        </span>
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className={`px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-all duration-200 ${
                            loading ? 'opacity-70 cursor-not-allowed' : ''
                        }`}
                    >
                        {loading ? 'Saving...' : 'Save Changes'}
                    </button>
                </div>
            </form>
        </div>
    );
};

export default ProfileEditForm;