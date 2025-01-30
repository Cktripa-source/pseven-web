import { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaSearch } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './dashboard';

const JobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [editingApplicationId, setEditingApplicationId] = useState(null);
  const [editedApplication, setEditedApplication] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [applicationsPerPage] = useState(3);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      const response = await fetch('https://pseven-api-test.onrender.com/api/applications');
      if (!response.ok) {
        throw new Error('Failed to fetch applications');
      }
      const data = await response.json();
      setApplications(data);
    } catch (err) {
      console.error('Error fetching applications:', err);
      toast.error('Error fetching applications!');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  const handleSearchClick = () => {
    setCurrentPage(1); // Reset to the first page when search is clicked
  };

  const handleEditApplication = (application) => {
    setEditingApplicationId(application._id);
    setEditedApplication({ ...application });
  };

  const handleSaveEditedApplication = async () => {
    try {
      toast.dismiss();

      const response = await fetch(
        `http://localhost:5000/api/applications/${editedApplication._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editedApplication),
        }
      );
      if (!response.ok) throw new Error('Failed to update application');

      // Update the application in the list
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === editedApplication._id ? editedApplication : application
        )
      );

      setEditingApplicationId(null); // Hide the editing form after save
      toast.success('Application updated successfully!');
    } catch (err) {
      console.error('Error saving application:', err);
      toast.error('Error saving application!');
    }
  };

  const handleDeleteApplication = async (id) => {
    try {
      toast.dismiss();

      const response = await fetch(
        `https://pseven-api-test.onrender.com/api/applications/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete application');

      setApplications(applications.filter((application) => application._id !== id));
      toast.success('Application deleted successfully!');
    } catch (err) {
      console.error('Error deleting application:', err);
      toast.error('Error deleting application!');
    }
  };

  const handleChangeStatus = async (applicationId, newStatus) => {
    try {
      toast.dismiss();

      const response = await fetch(
        `https://pseven-api-test.onrender.com/api/applications/${applicationId}/status`,
        {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ status: newStatus }),
        }
      );

      if (!response.ok) throw new Error('Failed to update status');

      // Update the application status
      setApplications((prevApplications) =>
        prevApplications.map((application) =>
          application._id === applicationId
            ? { ...application, status: newStatus }
            : application
        )
      );
      toast.success('Application status updated!');
    } catch (err) {
      console.error('Error changing application status:', err);
      toast.error('Error changing status!');
    }
  };

  // Filter applications based on search query
  const filteredApplications = applications.filter(
    (application) =>
      application.fullName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      application.email.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredApplications.length / applicationsPerPage);
  const currentApplications = filteredApplications.slice(
    (currentPage - 1) * applicationsPerPage,
    currentPage * applicationsPerPage
  );

  return (
    <>
    <Dashboard/>
    <div className="p-20 min-h-screen sm:ml-64 bg-gray-900">
      <div className="bg-gray-800 p-4 border-2 border-dashed rounded-lg shadow-md border-gray-700">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 w-2/3">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 bg-gray-700 text-white rounded w-full"
              placeholder="Search by full name or email ........................"
            />
            <button
              onClick={handleSearchClick}
              className="text-white text-xl p-1 border rounded-full"
            >
              <FaSearch />
            </button>
          </div>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-white">Job Applications</h2>

        {filteredApplications.length === 0 && (
          <p className="text-white">No applications found.</p>
        )}

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
              <tr>
                <th className="px-3 py-2 text-xs">Full Name</th>
                <th className="px-3 py-2 text-xs">Email</th>
                <th className="px-3 py-2 text-xs">CV Link</th>
                <th className="px-3 py-2 text-xs">Cover Letter</th>
                <th className="px-3 py-2 text-xs">Status</th>
                <th className="px-3 py-2 text-xs">Actions</th>
              </tr>
            </thead>
            <tbody>
              {currentApplications.map((application) => (
                <tr
                  key={application._id}
                  className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
                >
                  <td className="px-3 py-4">
                    {editingApplicationId === application._id ? (
                      <input
                        type="text"
                        value={editedApplication.fullName || application.fullName}
                        onChange={(e) =>
                          setEditedApplication({ ...editedApplication, fullName: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    ) : (
                      application.fullName
                    )}
                  </td>
                  <td className="px-3 py-4">
                    {editingApplicationId === application._id ? (
                      <input
                        type="text"
                        value={editedApplication.email || application.email}
                        onChange={(e) =>
                          setEditedApplication({ ...editedApplication, email: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    ) : (
                      application.email
                    )}
                  </td>
                  <td className="px-3 py-4">
                    {editingApplicationId === application._id ? (
                      <input
                        type="text"
                        value={editedApplication.cvLink || application.cvLink}
                        onChange={(e) =>
                          setEditedApplication({ ...editedApplication, cvLink: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    ) : (
                      <a href={application.cvLink} target="_blank" rel="noopener noreferrer" className='text-orange-500 font-extrabold hover:text-orange-300'>
                        View CV
                      </a>
                    )}
                  </td>
                  <td className="px-3 py-4">
                    {editingApplicationId === application._id ? (
                      <input
                        type="text"
                        value={editedApplication.coverLetter || application.coverLetter}
                        onChange={(e) =>
                          setEditedApplication({ ...editedApplication, coverLetter: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    ) : (
                      application.coverLetter
                    )}
                  </td>
                  <td className="px-3 py-4">
                    {editingApplicationId === application._id ? (
                      <select
                        value={editedApplication.status || application.status}
                        onChange={(e) =>
                          setEditedApplication({ ...editedApplication, status: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      >
                        <option value="Pending">Pending</option>
                        <option value="Reviewed">Reviewed</option>
                        <option value="Accepted">Accepted</option>
                        <option value="Rejected">Rejected</option>
                      </select>
                    ) : (
                      application.status
                    )}
                  </td>
                  <td className="px-3 py-4 flex items-center space-x-2">
                    {editingApplicationId === application._id ? (
                      <>
                        <button
                          onClick={handleSaveEditedApplication}
                          className="bg-blue-500 p-2 rounded-full text-white"
                        >
                          <FaSave />
                        </button>
                        <button
                          onClick={() => setEditingApplicationId(null)}
                          className="bg-red-500 p-2 rounded-full text-white"
                        >
                          <FaTrashAlt />
                        </button>
                      </>
                    ) : (
                      <>
                        <button
                          onClick={() => handleEditApplication(application)}
                          className="bg-yellow-500 p-2 rounded-full text-white"
                        >
                          <FaEdit />
                        </button>
                        <button
                          onClick={() => handleDeleteApplication(application._id)}
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
              className="px-4 py-2 bg-blue-500 text-white rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </div>
    </>
  );
};

export default JobApplications;
