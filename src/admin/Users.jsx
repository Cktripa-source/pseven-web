import React, { useState, useEffect } from 'react';
import axios from 'axios';
import Dashboard from './dashboard';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://pseven-api-test.onrender.com/api/auth'); // Correct API endpoint
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`https://pseven-api-test.onrender.com/api/auth/${id}`); // Correct delete endpoint
      setUsers(users.filter((user) => user._id !== id));
    } catch (err) {
      setError('Failed to delete user.');
    }
  };

  const handleBurn = async (id) => {
    try {
      await axios.put(`https://pseven-api-test.onrender.com/api/auth/burn/${id}`); // Correct burn endpoint
      setUsers(users.map((user) =>
        user._id === id ? { ...user, burned: true } : user
      ));
    } catch (err) {
      setError('Failed to burn account.');
    }
  };

  const handleUnburn = async (id) => {
    try {
      await axios.put(`https://pseven-api-test.onrender.com/api/auth/unburn/${id}`); // Correct unburn endpoint
      setUsers(users.map((user) =>
        user._id === id ? { ...user, burned: false } : user
      ));
    } catch (err) {
      setError('Failed to unburn account.');
    }
  };

  return (
    <div>
      <Dashboard />
      <div className="p-20 min-h-screen sm:ml-64 bg-gray-950">
        <div className="bg-gray-900 p-4 border-2 border-dashed border-gray-700 rounded-lg shadow-md">
          <h2 className="text-2xl font-semibold mb-6 text-white">Users Management</h2>
          {error && <div className="text-red-500">{error}</div>}

          {loading ? (
            <p className="text-white">Loading users...</p>
          ) : users.length === 0 ? (
            <p className="text-white">No users found.</p>  
          ) : (
            <div className="overflow-x-auto shadow-md sm:rounded-lg mt-8">
              <table className="w-full text-sm text-left text-gray-400">
                <thead className="text-xs text-gray-300 uppercase bg-gray-800">
                  <tr>
                    <th className="px-4 py-2 border-b border-gray-700">Name</th>
                    <th className="px-4 py-2 border-b border-gray-700">Email</th>
                    <th className="px-4 py-2 border-b border-gray-700">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map((user) => (
                    <tr key={user._id} className="hover:bg-gray-800">
                      <td className="px-4 py-2 border-b border-gray-700">{user.fullName}</td>
                      <td className="px-4 py-2 border-b border-gray-700">{user.email}</td>
                      <td className="px-4 py-2 border-b border-gray-700">
                        {!user.burned ? (
                          <button
                            className="text-yellow-400 hover:underline"
                            onClick={() => handleBurn(user._id)}
                          >
                            Burn Account
                          </button>
                        ) : (
                          <button
                            className="text-green-400 hover:underline"
                            onClick={() => handleUnburn(user._id)}
                          >
                            Unburn Account
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default UserManagement;
