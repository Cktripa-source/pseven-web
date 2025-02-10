import { useState, useEffect } from 'react';
import { FaSearch, FaTrashAlt, FaEdit, FaSave } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './dashboard';
import axios from 'axios';

const UserManagement = () => {
  const [users, setUsers] = useState([]);
  const [editingUserId, setEditingUserId] = useState(null);
  const [editedUser, setEditedUser] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [usersPerPage] = useState(3);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get('https://api.psevenrwanda.com/api/auth');
      setUsers(response.data);
    } catch (err) {
      setError('Failed to fetch users.');
      toast.error('Failed to fetch users!');
    } finally {
      setLoading(false);
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  const handleSearchClick = () => {
    setCurrentPage(1); // Reset to the first
    setCurrentPage(1); // Reset to the first page when search is clicked
  };

  const handleEditUser = (user) => {
    setEditingUserId(user._id);
    setEditedUser({ ...user });
  };

  const handleSaveEditedUser = async () => {
    try {
      toast.dismiss();

      const response = await axios.put(
        `https://api.psevenrwanda.com/api/auth/burn/${editedUser._id}`,
        {
          status: editedUser.burned ? 'Burned' : 'Unburned',
        }
      );

      if (!response.data) throw new Error('Failed to update status');

      setUsers((prevUsers) =>
        prevUsers.map((user) =>
          user._id === editedUser._id ? { ...user, burned: editedUser.burned } : user
        )
      );

      setEditingUserId(null); // Hide the editing form after save
      toast.success('Account status updated successfully!');
    } catch (err) {
      console.error('Error saving user status:', err);
      toast.error('Error saving user status!');
    }
  };

  const handleCancelEdit = () => {
    setEditingUserId(null); // Cancel the editing form
  };

  const handleDeleteUser = async (id) => {
    try {
      toast.dismiss();
      const response = await axios.delete(`https://api.psevenrwanda.com/api/auth/${id}`);
      if (!response.data) throw new Error('Failed to delete user');
      setUsers(users.filter((user) => user._id !== id));
      toast.success('User deleted successfully!');
    } catch (err) {
      console.error('Error deleting user:', err);
      toast.error('Error deleting user!');
    }
  };

  // Filter users based on search query
  const filteredUsers = users.filter(
    (user) =>
      (user.fullName && user.fullName.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (user.email && user.email.toLowerCase().includes(searchQuery.toLowerCase()))
  );
  
  // Pagination logic
  const totalPages = Math.ceil(filteredUsers.length / usersPerPage);
  const currentUsers = filteredUsers.slice(
    (currentPage - 1) * usersPerPage,
    currentPage * usersPerPage
  );

  return (
    <>
      <Dashboard />
      <div className="p-20 min-h-screen sm:ml-64 bg-gray-900">
        <div className="bg-gray-800 p-4 border-2 border-dashed rounded-lg shadow-md border-gray-700">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 w-2/3">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="p-2 bg-gray-700 text-white rounded w-full"
                placeholder="Search by full name or email"
              />
              <button
                onClick={handleSearchClick}
                className="text-white text-xl p-1 border rounded-full"
              >
                <FaSearch />
              </button>
            </div>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-white">Users Management</h2>

          {loading && <p className="text-white">Loading users...</p>}
          {error && <p className="text-red-500">{error}</p>}

          {filteredUsers.length === 0 && !loading && (
            <p className="text-white">No users found.</p>
          )}

          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                  <th className="px-3 py-2 text-xs">Full Name</th>
                  <th className="px-3 py-2 text-xs">Email</th>
                  <th className="px-3 py-2 text-xs">Status</th>
                  <th className="px-3 py-2 text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {currentUsers.map((user) => (
                  <tr key={user._id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                    <td className="px-3 py-4">
                        {user.fullName}
                    </td>
                    <td className="px-3 py-4">
                      
                        {user.email}
                    </td>
                    <td className="px-3 py-4">
  {editingUserId === user._id ? (
    <select
      value={editedUser.burned ? 'Burned' : 'Unburned'}
      onChange={(e) =>
        setEditedUser({
          ...editedUser,
          burned: e.target.value === 'Burned',
        })
      }
      className="p-2 bg-gray-700 text-white rounded"
    >
      <option value="Unburned" className="text-green-500">Unburned</option>
      <option value="Burned" className="text-red-500">Burned</option>
    </select>
  ) : (
    <span
      className={`font-semibold ${
        user.burned ? 'text-red-500' : 'text-green-500'
      }`}
    >
      {user.burned ? 'Is Burned' : 'Not burned'}
    </span>
  )}
</td>

                    <td className="px-3 py-4 flex items-center space-x-2">
                      {editingUserId === user._id ? (
                        <>
                          <button
                            onClick={handleSaveEditedUser}
                            className="bg-green-500 p-2 rounded-full text-white"
                          >
                            <FaSave />
                          </button>
                          <button
                            onClick={handleCancelEdit}
                            className="bg-red-500 p-2 rounded-full text-white"
                          >
                            <FaTrashAlt />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => handleEditUser(user)}
                            className="bg-yellow-500 p-2 rounded-full text-white"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteUser(user._id)}
                            className="bg-red-500 p-2 rounded-full text-white"
                          >
                            <FaTrashAlt />
                          </button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>

            {/* Pagination */}
            <div className="flex justify-between items-center my-4">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(currentPage - 1)}
                className="px-4 py-2 bg-red-500 text-white rounded"
              >
                Previous
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(currentPage + 1)}
                className="px-4 py-2 bg-green-500 text-white rounded"
              >
                Next
              </button>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default UserManagement;
