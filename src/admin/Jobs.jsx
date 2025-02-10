import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaSearch, FaPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import Dashboard from './dashboard';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(3);
  const [isAddingJob, setIsAddingJob] = useState(false); // Track adding a new job

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch('https://api.psevenrwanda.com/api/jobs');
      if (!response.ok) {
        throw new Error('Failed to fetch jobs');
      }
      const data = await response.json();
      setJobs(data);
    } catch (err) {
      console.error('Error fetching jobs:', err);
      toast.error('Error fetching jobs!');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  const handleEditJob = (job) => {
    setEditingJobId(job._id);
    setEditedJob({ ...job });
  };

  const handleSaveEditedJob = async () => {
    try {
      toast.dismiss();

      const response = await fetch(
        `https://api.psevenrwanda.com/api/jobs/${editedJob._id}`,
        {
          method: 'PUT',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(editedJob),
        }
      );

      if (!response.ok) throw new Error('Failed to update job');

      // Update the job in the list
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === editedJob._id ? editedJob : job))
      );

      setEditingJobId(null); // Hide the editing form after save
      toast.success('Job updated successfully!');
    } catch (err) {
      console.error('Error saving job:', err);
      toast.error('Error saving job!');
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      toast.dismiss();

      const response = await fetch(
        `https://api.psevenrwanda.com/api/jobs/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete job');

      setJobs(jobs.filter((job) => job._id !== id));
      toast.success('Job deleted successfully!');
    } catch (err) {
      console.error('Error deleting job:', err);
      toast.error('Error deleting job!');
    }
  };

  const handleAddJob = () => {
    setIsAddingJob(true);
    setEditedJob({
      title: '',
      description: '',
      location: '',
      salary: '',
      employmentType: 'Full-time',
      skillsRequired: [],
      postedBy: 'Admin', // Assuming 'Admin' is posting jobs
      status: 'Open',
    });
  };

  const handleSaveNewJob = async () => {
    try {
      toast.dismiss();

      const response = await fetch('https://api.psevenrwanda.com/api/jobs', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(editedJob),
      });

      if (!response.ok) throw new Error('Failed to add new job');

      const newJob = await response.json(); // Get the added job

      // Add the new job to the start of the job list
      setJobs((prevJobs) => [newJob, ...prevJobs]);

      setIsAddingJob(false); // Hide the adding form after saving
      toast.success('Job added successfully!');
    } catch (err) {
      console.error('Error adding job:', err);
      toast.error('Error adding job!');
    }
  };

  const handleCancelEdit = () => {
    setEditingJobId(null);
    setEditedJob({});
  };

  const handleCancelAdd = () => {
    setIsAddingJob(false);
    setEditedJob({});
  };

  // Filter jobs based on search query
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  return (
    <>
    <Dashboard/>
    <div className="p-20 min-h-screen sm:ml-64 bg-gray-900">

      <div className="bg-gray-800 p-4 border-2 border-dashed rounded-lg shadow-md border-gray-700 w-full">
        <div className="flex justify-between items-center mb-6">
          <div className="flex items-center space-x-2 w-2/3">
            <input
              type="text"
              value={searchQuery}
              onChange={handleSearchChange}
              className="p-2 bg-gray-700 text-white rounded w-full"
              placeholder="Search by title or category ........................"
            />
            <FaSearch className="text-white text-3xl p-1 border rounded-full" />
          </div>
          <button
            onClick={handleAddJob}
            className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg"
          >
            <FaPlus className="mr-2" /> Add New Job
          </button>
        </div>

        <h2 className="text-2xl font-semibold mb-6 text-white">Job Management</h2>

        <div className="overflow-x-auto shadow-md sm:rounded-lg">
          <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
              <tr>
                <th className="px-3 py-2 text-xs font-semibold text-white">Job Title</th>
                <th className="px-3 py-2 text-xs font-semibold text-white">Description</th>
                <th className="px-3 py-2 text-xs font-semibold text-white">Salary</th>
                <th className="px-3 py-2 text-xs font-semibold text-white">Location</th>
                <th className="px-3 py-2 text-xs font-semibold text-white">Employment Type</th>
                <th className="px-3 py-2 text-xs font-semibold text-white">Skills Required</th>
                <th className="px-3 py-2 text-xs font-semibold text-white">Status</th>
                <th className="px-3 py-2 text-xs font-semibold text-white">Actions</th>
              </tr>
            </thead>
            <tbody>
              {/* If adding a new job */}
              {isAddingJob && (
                <tr className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                  <td className="px-3 py-4">
                    <input
                      type="text"
                      value={editedJob.title || ''}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, title: e.target.value })
                      }
                      className="p-2 bg-gray-700 text-white rounded"
                    />
                  </td>
                  
                  <td className="px-3 py-4">
                    <input
                      type="text"
                      value={editedJob.description || ''}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, description: e.target.value })
                      }
                      className="p-2 bg-gray-700 text-white rounded"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <input
                      type="number"
                      value={editedJob.salary || ''}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, salary: e.target.value })
                      }
                      className="p-2 bg-gray-700 text-white rounded"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <input
                      type="text"
                      value={editedJob.location || ''}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, location: e.target.value })
                      }
                      className="p-2 bg-gray-700 text-white rounded"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <select
                      value={editedJob.employmentType || 'Full-time'}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, employmentType: e.target.value })
                      }
                      className="p-2 bg-gray-700 text-white rounded"
                    >
                      <option value="Full-time">Full-time</option>
                      <option value="Part-time">Part-time</option>
                      <option value="Contract">Contract</option>
                      <option value="Internship">Internship</option>
                      <option value="Temporary">Temporary</option>
                    </select>
                  </td>
                  <td className="px-3 py-4">
                    <input
                      type="text"
                      value={editedJob.skillsRequired.join(', ') || ''}
                      onChange={(e) =>
                        setEditedJob({
                          ...editedJob,
                          skillsRequired: e.target.value.split(',').map((item) => item.trim()),
                        })
                      }
                      className="p-2 bg-gray-700 text-white rounded"
                      placeholder="Enter skills separated by commas"
                    />
                  </td>
                  <td className="px-3 py-4">
                    <select
                      value={editedJob.status || 'Open'}
                      onChange={(e) =>
                        setEditedJob({ ...editedJob, status: e.target.value })
                      }
                      className="p-2 bg-gray-700 text-white rounded"
                    >
                      <option value="Open">Open</option>
                      <option value="Closed">Closed</option>
                    </select>
                  </td>
                  <td className="px-3 py-4 flex items-center space-x-2">
                    <button
                      onClick={handleSaveNewJob}
                      className="bg-green-500 p-2 rounded-full text-white"
                    >
                      <FaSave />
                    </button>
                    <button
                      onClick={handleCancelAdd}
                      className="bg-red-500 p-2 rounded-full text-white"
                    >
                      <FaTrashAlt />
                    </button>
                  </td>
                </tr>
              )}

              {/* If editing an existing job */}
              {!isAddingJob &&
                currentJobs.map((job) => (
                  <tr
                    key={job._id}
                    className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
                  >
                    <td className="px-3 py-4">
                      {editingJobId === job._id ? (
                        <input
                          type="text"
                          value={editedJob.title || job.title}
                          onChange={(e) =>
                            setEditedJob({ ...editedJob, title: e.target.value })
                          }
                          className="p-2 bg-gray-700 text-white rounded"
                        />
                      ) : (
                        job.title
                      )}
                    </td>
                  
                    <td className="px-3 py-4">
                      {editingJobId === job._id ? (
                        <input
                          type="text"
                          value={editedJob.description || job.description}
                          onChange={(e) =>
                            setEditedJob({ ...editedJob, description: e.target.value })
                          }
                          className="p-2 bg-gray-700 text-white rounded"
                        />
                      ) : (
                        job.description
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {editingJobId === job._id ? (
                        <input
                          type="number"
                          value={editedJob.salary || job.salary}
                          onChange={(e) =>
                            setEditedJob({ ...editedJob, salary: e.target.value })
                          }
                          className="p-2 bg-gray-700 text-white rounded"
                        />
                      ) : (
                        `$${job.salary}`
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {editingJobId === job._id ? (
                        <input
                          type="text"
                          value={editedJob.location || job.location}
                          onChange={(e) =>
                            setEditedJob({ ...editedJob, location: e.target.value })
                          }
                          className="p-2 bg-gray-700 text-white rounded"
                        />
                      ) : (
                        job.location
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {editingJobId === job._id ? (
                        <select
                          value={editedJob.employmentType || job.employmentType}
                          onChange={(e) =>
                            setEditedJob({ ...editedJob, employmentType: e.target.value })
                          }
                          className="p-2 bg-gray-700 text-white rounded"
                        >
                          <option value="Full-time">Full-time</option>
                          <option value="Part-time">Part-time</option>
                          <option value="Contract">Contract</option>
                          <option value="Internship">Internship</option>
                          <option value="Temporary">Temporary</option>
                        </select>
                      ) : (
                        job.employmentType
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {editingJobId === job._id ? (
                        <input
                          type="text"
                          value={editedJob.skillsRequired.join(', ') || job.skillsRequired.join(', ')}
                          onChange={(e) =>
                            setEditedJob({
                              ...editedJob,
                              skillsRequired: e.target.value.split(',').map((item) => item.trim()),
                            })
                          }
                          className="p-2 bg-gray-700 text-white rounded"
                        />
                      ) : (
                        job.skillsRequired.join(', ')
                      )}
                    </td>
                    <td className="px-3 py-4">
                      {editingJobId === job._id ? (
                        <select
                          value={editedJob.status || job.status}
                          onChange={(e) =>
                            setEditedJob({ ...editedJob, status: e.target.value })
                          }
                          className="p-2 bg-gray-700 text-white rounded"
                        >
                          <option value="Open">Open</option>
                          <option value="Closed">Closed</option>
                        </select>
                      ) : (
                        job.status
                      )}
                    </td>
                    <td className="px-3 py-4 flex items-center space-x-2">
                      {editingJobId === job._id ? (
                        <>
                          <button
                            onClick={handleSaveEditedJob}
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
                            onClick={() => handleEditJob(job)}
                            className="bg-yellow-500 p-2 rounded-full text-white"
                          >
                            <FaEdit />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
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
      <ToastContainer />
    </div>
    </>
  );
};

export default JobManagement;
 