import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaSearch, FaPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const JobManagement = () => {
  const [jobs, setJobs] = useState([]);
  const [editingJobId, setEditingJobId] = useState(null);
  const [editedJob, setEditedJob] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(3);
  const [isAddingJob, setIsAddingJob] = useState(false);

  // Base API URL (localhost)
  const API_BASE_URL = 'http://localhost:5000/api/jobs';

  // Get authentication token
  const getAuthToken = () => {
    return localStorage.getItem('token');
  };

  useEffect(() => {
    fetchJobs();
  }, []);

  const fetchJobs = async () => {
    try {
      const response = await fetch(API_BASE_URL);
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

      // Get authentication token
      const token = getAuthToken();
      if (!token) {
        toast.error('You must be logged in to edit jobs');
        return;
      }

      // Create FormData if there's an image file
      let requestBody;
      let fetchOptions;

      if (editedJob.imageFile) {
        const formData = new FormData();
        Object.keys(editedJob).forEach(key => {
          if (key !== 'imageFile') {
            formData.append(key, editedJob[key]);
          }
        });
        
        if (editedJob.imageFile) {
          formData.append('image', editedJob.imageFile);
        }
        
        requestBody = formData;
        fetchOptions = {
          method: 'PUT',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        };
      } else {
        // If no new image is uploaded, send JSON
        const jobData = { ...editedJob };
        delete jobData.imageFile;
        
        requestBody = JSON.stringify(jobData);
        fetchOptions = {
          method: 'PUT',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: requestBody,
        };
      }

      const response = await fetch(
        `${API_BASE_URL}/${editedJob._id}`,
        fetchOptions
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to update job');
      }

      // Update the job in the list
      setJobs((prevJobs) =>
        prevJobs.map((job) => (job._id === editedJob._id ? editedJob : job))
      );

      setEditingJobId(null); // Hide the editing form after save
      toast.success('Job updated successfully!');
    } catch (err) {
      console.error('Error saving job:', err);
      toast.error(`Error saving job: ${err.message}`);
    }
  };

  const handleDeleteJob = async (id) => {
    try {
      toast.dismiss();

      // Get authentication token
      const token = getAuthToken();
      if (!token) {
        toast.error('You must be logged in to delete jobs');
        return;
      }

      const response = await fetch(
        `${API_BASE_URL}/${id}`,
        {
          method: 'DELETE',
          headers: {
            'Authorization': `Bearer ${token}`
          }
        }
      );

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to delete job');
      }

      setJobs(jobs.filter((job) => job._id !== id));
      toast.success('Job deleted successfully!');
    } catch (err) {
      console.error('Error deleting job:', err);
      toast.error(`Error deleting job: ${err.message}`);
    }
  };

  const handleAddJob = () => {
    setIsAddingJob(true);
    setEditedJob({
      title: '',
      description: '',
      location: '',
      employmentType: 'Full-time',
      image: '',
      postedBy: 'Admin', // Assuming 'Admin' is posting jobs
      status: 'Open',
    });
  };

  const handleSaveNewJob = async () => {
    try {
      toast.dismiss();

      // Get authentication token
      const token = getAuthToken();
      if (!token) {
        toast.error('You must be logged in to add jobs');
        return;
      }

      // Create FormData if there's an image file
      let requestBody;
      let fetchOptions;

      if (editedJob.imageFile) {
        const formData = new FormData();
        Object.keys(editedJob).forEach(key => {
          if (key !== 'imageFile') {
            formData.append(key, editedJob[key]);
          }
        });
        
        if (editedJob.imageFile) {
          formData.append('image', editedJob.imageFile);
        }
        
        requestBody = formData;
        fetchOptions = {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${token}`
          },
          body: formData,
        };
      } else {
        // If no image is uploaded, send JSON
        const jobData = { ...editedJob };
        delete jobData.imageFile;
        
        requestBody = JSON.stringify(jobData);
        fetchOptions = {
          method: 'POST',
          headers: { 
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}`
          },
          body: requestBody,
        };
      }

      const response = await fetch(API_BASE_URL, fetchOptions);

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to add new job');
      }

      const newJob = await response.json(); 
      
      // Extract the job data from the response based on the backend structure
      const jobToAdd = newJob.job || newJob;

      // Add the new job to the start of the job list
      setJobs((prevJobs) => [jobToAdd, ...prevJobs]);

      setIsAddingJob(false); // Hide the adding form after saving
      toast.success('Job added successfully!');
    } catch (err) {
      console.error('Error adding job:', err);
      toast.error(`Error adding job: ${err.message}`);
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

  const handleImageChange = (e) => {
    if (e.target.files && e.target.files[0]) {
      setEditedJob({
        ...editedJob,
        imageFile: e.target.files[0],
        image: URL.createObjectURL(e.target.files[0]) // Preview URL
      });
    }
  };

  // Function to display image correctly with localhost path
  const getImageUrl = (imagePath) => {
    if (!imagePath) return null;
    
    // If it's a blob/preview URL, use it directly
    if (imagePath.startsWith('blob:') || imagePath.startsWith('http')) {
      return imagePath;
    }
    
    // Otherwise, construct the full URL for backend images
    return `http://localhost:5000${imagePath}`;
  };

  // Filter jobs based on search query
  const filteredJobs = jobs.filter(
    (job) =>
      job.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      job.location.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  const currentJobs = filteredJobs.slice(
    (currentPage - 1) * jobsPerPage,
    currentPage * jobsPerPage
  );

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    });
  };

  // Rest of your component remains unchanged
  return (
    <>
      <div className="p-8 space-y-8 bg-gray-900 min-h-screen">
        <div className="bg-gray-800 p-4 border-2 border-dashed rounded-lg shadow-md border-green-200 w-full">
          <div className="flex justify-between items-center mb-6">
            <div className="flex items-center space-x-2 w-2/3">
              <input
                type="text"
                value={searchQuery}
                onChange={handleSearchChange}
                className="p-2 bg-gray-700 text-white rounded w-full"
                placeholder="Search by title or location ........................"
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
                  <th className="px-3 py-2 text-xs font-semibold text-white">Location</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Employment Type</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Image</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Posted By</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Status</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Posted Date</th>
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
                      <textarea
                        value={editedJob.description || ''}
                        onChange={(e) =>
                          setEditedJob({ ...editedJob, description: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded w-full"
                        rows="3"
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
                        type="file"
                        accept="image/*"
                        onChange={handleImageChange}
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                      {editedJob.image && (
                        <img 
                          src={getImageUrl(editedJob.image)} 
                          alt="Job preview" 
                          className="mt-2 w-16 h-16 object-cover"
                        />
                      )}
                    </td>
                    <td className="px-3 py-4">
                      <input
                        type="text"
                        value={editedJob.postedBy || 'Admin'}
                        onChange={(e) =>
                          setEditedJob({ ...editedJob, postedBy: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
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
                    <td className="px-3 py-4">-</td>
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
                          <textarea
                            value={editedJob.description || job.description}
                            onChange={(e) =>
                              setEditedJob({ ...editedJob, description: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded w-full"
                            rows="3"
                          />
                        ) : (
                          <div className="max-h-20 overflow-y-auto">{job.description}</div>
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
                          <div>
                            <input
                              type="file"
                              accept="image/*"
                              onChange={handleImageChange}
                              className="p-2 bg-gray-700 text-white rounded"
                            />
                            {(editedJob.image || job.image) && (
                              <img 
                                src={getImageUrl(editedJob.image || job.image)} 
                                alt="Job" 
                                className="mt-2 w-16 h-16 object-cover"
                              />
                            )}
                          </div>
                        ) : (
                          job.image ? (
                            <img 
                              src={getImageUrl(job.image)} 
                              alt="Job" 
                              className="w-16 h-16 object-cover"
                            />
                          ) : (
                            "No image"
                          )
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingJobId === job._id ? (
                          <input
                            type="text"
                            value={editedJob.postedBy || job.postedBy}
                            onChange={(e) =>
                              setEditedJob({ ...editedJob, postedBy: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          job.postedBy
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
                          <span className={`px-2 py-1 rounded ${job.status === 'Open' ? 'bg-green-700' : 'bg-red-700'}`}>
                            {job.status}
                          </span>
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {job.createdAt ? formatDate(job.createdAt) : '-'}
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
            {totalPages > 0 && (
              <div className="flex justify-between items-center my-4">
                <button
                  disabled={currentPage === 1}
                  onClick={() => setCurrentPage(currentPage - 1)}
                  className={`px-4 py-2 text-white rounded ${currentPage === 1 ? 'bg-gray-600' : 'bg-red-500'}`}
                >
                  Previous
                </button>
                <span className="text-white">
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  disabled={currentPage === totalPages || totalPages === 0}
                  onClick={() => setCurrentPage(currentPage + 1)}
                  className={`px-4 py-2 text-white rounded ${currentPage === totalPages || totalPages === 0 ? 'bg-gray-600' : 'bg-green-500'}`}
                >
                  Next
                </button>
              </div>
            )}
          </div>
        </div>
        <ToastContainer />
      </div>
    </>
  );
};

export default JobManagement;