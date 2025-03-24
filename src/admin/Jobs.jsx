import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { 
  PlusCircle, Edit2, Trash2, Search, X, Save, 
  BriefcaseBusiness, MapPin, Clock, Tag, User 
} from 'lucide-react';
import { getAuthToken } from '../utils/auth';

const JobAdminDashboard = () => {
  // State management
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [formMode, setFormMode] = useState('add'); // 'add' or 'edit'
  const [searchTerm, setSearchTerm] = useState('');
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [jobsPerPage] = useState(5);
  const [error, setError] = useState(null);
  
  // Form state
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    location: '',
    employmentType: 'Full-time',
    skillsRequired: '',
    postedBy: '',
    status: 'Open',
    image: null
  });
  
  // Image preview
  const [imagePreview, setImagePreview] = useState(null);
  const API='https://api.psevenrwanda.com';
  
  // Fetch jobs on component mount
  useEffect(() => {
    fetchJobs();
  }, []);
  
  const fetchJobs = async () => {
  
    try {
      const token = getAuthToken();
      
      // You might want to handle missing tokens differently in the public-facing component
      const response = await axios.get('https://api.psevenrwanda.com/api/jobs', {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
      });
      
      setJobs(response.data);
    } catch (err) {
      setError('Error fetching job data');
    } finally {
      setLoading(false);
    }
  };
  
  // Reset form
  const resetForm = () => {
    setFormData({
      title: '',
      description: '',
      location: '',
      employmentType: 'Full-time',
      skillsRequired: '',
      postedBy: '',
      status: 'Open',
      image: null
    });
    setImagePreview(null);
  };
  
  // Handle form input changes
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };
  
  // Handle image selection
  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setFormData({
        ...formData,
        image: file
      });
      
      // Create preview URL
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
      reader.readAsDataURL(file);
    }
  };
  
  // Open the form for adding a new job
  const handleAddJob = () => {
    resetForm();
    setFormMode('add');
    setShowForm(true);
  };
  
  // Open the form for editing an existing job
  const handleEditJob = (job) => {
    setFormData({
      ...job,
      skillsRequired: job.skillsRequired.join(', ')
    });
    setImagePreview(job.image ? `${API}/${job.image}` : null);
    setFormMode('edit');
    setShowForm(true);
  };
  
  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    if (!formData.title || !formData.description || !formData.location || !formData.employmentType) {
      toast.error('Please fill in all required fields');
      return;
    }
    
    try {
      setLoading(true);
      
      const token = getAuthToken();
      
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        toast.error('Authentication token not found. Please log in again.');
        setLoading(false);
        return;
      }
      
      // Create FormData object to send to the server (for file upload)
      const jobFormData = new FormData();
      for (const key in formData) {
        if (key === 'image' && formData[key] instanceof File) {
          jobFormData.append(key, formData[key]);
        } else if (key !== 'image') {
          jobFormData.append(key, formData[key]);
        }
      }
      
      let response;
      
      if (formMode === 'add') {
        response = await axios.post(`${API}/api/jobs`, jobFormData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Job created successfully');
      } else {
        response = await axios.put(`${API}/api/jobs/${formData._id}`, jobFormData, {
          headers: { 
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data'
          }
        });
        toast.success('Job updated successfully');
      }
      
      // Close form and refresh job list
      setShowForm(false);
      fetchJobs();
    } catch (error) {
      console.error('Error saving job:', error);
      if (error.response && error.response.status === 401) {
        setError('Authentication token expired. Please log in again.');
        toast.error('Authentication token expired. Please log in again.');
      } else {
        toast.error(formMode === 'add' ? 'Failed to create job' : 'Failed to update job');
      }
    } finally {
      setLoading(false);
    }
  };
  
  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    if (confirmDelete === jobId) {
      try {
        setLoading(true);
        
        const token = getAuthToken();
        
        if (!token) {
          setError('Authentication token not found. Please log in again.');
          toast.error('Authentication token not found. Please log in again.');
          setLoading(false);
          return;
        }
        
        await axios.delete(`${API}/api/jobs/${jobId}`, {
          headers: { Authorization: `Bearer ${token}` }
        });
        
        toast.success('Job deleted successfully');
        fetchJobs();
        setConfirmDelete(null);
      } catch (error) {
        console.error('Error deleting job:', error);
        if (error.response && error.response.status === 401) {
          setError('Authentication token expired. Please log in again.');
          toast.error('Authentication token expired. Please log in again.');
        } else {
          toast.error('Failed to delete job');
        }
      } finally {
        setLoading(false);
      }
    } else {
      setConfirmDelete(jobId);
      // Auto-reset confirm state after 3 seconds
      setTimeout(() => {
        setConfirmDelete(null);
      }, 3000);
    }
  };
  
  // Filter jobs based on search term
  const filteredJobs = jobs.filter(job => 
    job.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.location.toLowerCase().includes(searchTerm.toLowerCase()) ||
    job.employmentType.toLowerCase().includes(searchTerm.toLowerCase())
  );
  
  // Pagination
  const indexOfLastJob = currentPage * jobsPerPage;
  const indexOfFirstJob = indexOfLastJob - jobsPerPage;
  const currentJobs = filteredJobs.slice(indexOfFirstJob, indexOfLastJob);
  const totalPages = Math.ceil(filteredJobs.length / jobsPerPage);
  
  // Change page
  const paginate = (pageNumber) => setCurrentPage(pageNumber);
  
  return (
    <div className="min-h-screen bg-gray-50">
      <ToastContainer position="top-right" autoClose={3000} />
      
      {/* Header */}
      <div className="bg-white shadow">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <h1 className="text-2xl font-bold text-gray-900">Job Management</h1>
        </div>
      </div>
      
      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-4 bg-red-50 border-l-4 border-red-500 p-4">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="ml-3">
                <p className="text-sm text-red-700">{error}</p>
              </div>
            </div>
          </div>
        )}
        
        {/* Actions Bar */}
        <div className="flex flex-col md:flex-row md:items-center justify-between mb-6 gap-4">
          <div className="relative w-full md:w-96">
            <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
              <Search className="h-5 w-5 text-gray-400" />
            </div>
            <input
              type="text"
              className="pl-10 w-full rounded-lg border border-gray-300 p-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Search jobs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-5 w-5" />
              </button>
            )}
          </div>
          
          <button
            onClick={handleAddJob}
            className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg flex items-center transition-all duration-300 transform hover:scale-105"
          >
            <PlusCircle className="mr-2 h-5 w-5" />
            Add New Job
          </button>
        </div>
        
        {/* Jobs Table */}
        <div className="bg-white shadow overflow-hidden rounded-lg">
          {loading && !showForm ? (
            <div className="flex justify-center items-center p-12">
              <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
            </div>
          ) : currentJobs.length === 0 ? (
            <div className="flex flex-col items-center justify-center p-12 text-gray-500">
              <BriefcaseBusiness className="h-16 w-16 mb-4" />
              <p className="text-xl">No jobs found</p>
              <p className="mt-2">Add a new job or try a different search term</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Job</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Type</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {currentJobs.map((job) => (
                    <tr 
                      key={job._id} 
                      className="hover:bg-gray-50 transition-colors duration-150"
                    >
                     <td className="px-6 py-4 whitespace-nowrap">
  <div className="flex items-center">
    {job.image ? (
      <div className="relative">
        <img 
          className="h-10 w-10 rounded-full object-cover" 
          src={job.image} 
          alt={job.title} 
        />
        <div className="absolute top-0 left-0 hidden group-hover:block">
          <img 
            className="h-32 w-32 rounded-md object-cover" 
            src={job.image} 
            alt={job.title} 
          />
        </div>
      </div>
    ) : (
      <div className="h-10 w-10 rounded-full bg-blue-100 flex items-center justify-center">
        <BriefcaseBusiness className="h-5 w-5 text-blue-600" />
      </div>
    )}
    <div className="ml-4">
      <div className="text-sm font-medium text-gray-900">{job.title}</div>
      <div className="text-sm text-gray-500">Posted by: {job.postedBy}</div>
    </div>
  </div>
</td>

                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center text-sm text-gray-900">
                          <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                          {job.location}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-gray-900">{job.employmentType}</div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                          job.status === 'Open' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                        }`}>
                          {job.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleEditJob(job)}
                            className="text-indigo-600 hover:text-indigo-900 transition-colors duration-150"
                          >
                            <Edit2 className="h-5 w-5" />
                          </button>
                          <button
                            onClick={() => handleDeleteJob(job._id)}
                            className={`${
                              confirmDelete === job._id 
                                ? 'text-red-600 animate-pulse' 
                                : 'text-gray-600 hover:text-red-900'
                            } transition-colors duration-150`}
                          >
                            <Trash2 className="h-5 w-5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          
          {/* Pagination */}
          {!loading && filteredJobs.length > jobsPerPage && (
            <div className="px-4 py-3 flex items-center justify-between border-t border-gray-200 sm:px-6">
              <div className="hidden sm:flex-1 sm:flex sm:items-center sm:justify-between">
                <div>
                  <p className="text-sm text-gray-700">
                    Showing <span className="font-medium">{indexOfFirstJob + 1}</span> to{' '}
                    <span className="font-medium">
                      {Math.min(indexOfLastJob, filteredJobs.length)}
                    </span>{' '}
                    of <span className="font-medium">{filteredJobs.length}</span> results
                  </p>
                </div>
                <div>
                  <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px" aria-label="Pagination">
                    <button
                      onClick={() => paginate(Math.max(1, currentPage - 1))}
                      disabled={currentPage === 1}
                      className={`relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === 1 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Previous
                    </button>
                    
                    {Array.from({ length: totalPages }).map((_, index) => (
                      <button
                        key={index}
                        onClick={() => paginate(index + 1)}
                        className={`relative inline-flex items-center px-4 py-2 border border-gray-300 bg-white text-sm font-medium ${
                          currentPage === index + 1
                            ? 'z-10 bg-blue-50 border-blue-500 text-blue-600'
                            : 'text-gray-500 hover:bg-gray-50'
                        }`}
                      >
                        {index + 1}
                      </button>
                    ))}
                    
                    <button
                      onClick={() => paginate(Math.min(totalPages, currentPage + 1))}
                      disabled={currentPage === totalPages}
                      className={`relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium ${
                        currentPage === totalPages 
                          ? 'text-gray-300 cursor-not-allowed' 
                          : 'text-gray-500 hover:bg-gray-50'
                      }`}
                    >
                      Next
                    </button>
                  </nav>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
      
      {/* Job Form Modal */}
      {showForm && (
        <div className="fixed inset-0 overflow-y-auto z-50">
          <div className="flex items-center justify-center min-h-screen pt-4 px-4 pb-20 text-center sm:block sm:p-0">
            <div 
              className="fixed inset-0 transition-opacity" 
              aria-hidden="true"
              onClick={() => setShowForm(false)}
            >
              <div className="absolute inset-0 bg-gray-500 opacity-75"></div>
            </div>
            
            <div 
              className="inline-block align-bottom bg-white rounded-lg text-left overflow-hidden shadow-xl transform transition-all sm:my-8 sm:align-middle sm:max-w-2xl sm:w-full animate-fade-in-up"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="px-4 pt-5 pb-4 sm:p-6 sm:pb-4">
                <div className="sm:flex sm:items-start">
                  <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left w-full">
                    <h3 className="text-lg leading-6 font-medium text-gray-900">
                      {formMode === 'add' ? 'Add New Job' : 'Edit Job'}
                    </h3>
                    <div className="mt-4">
                      <form onSubmit={handleSubmit} className="space-y-4">
                        {/* Title */}
                        <div>
                          <label htmlFor="title" className="block text-sm font-medium text-gray-700">
                            Job Title <span className="text-red-500">*</span>
                          </label>
                          <input
                            type="text"
                            name="title"
                            id="title"
                            required
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.title}
                            onChange={handleInputChange}
                          />
                        </div>
                        
                        {/* Description */}
                        <div>
                          <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                            Description <span className="text-red-500">*</span>
                          </label>
                          <textarea
                            name="description"
                            id="description"
                            rows="3"
                            required
                            className="mt-1 focus:ring-blue-500 focus:border-blue-500 block w-full shadow-sm sm:text-sm border-gray-300 rounded-md"
                            value={formData.description}
                            onChange={handleInputChange}
                          ></textarea>
                        </div>
                        
                        {/* Location */}
                        <div>
                          <label htmlFor="location" className="block text-sm font-medium text-gray-700">
                            Location <span className="text-red-500">*</span>
                          </label>
                          <div className="mt-1 flex rounded-md shadow-sm">
                            <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                              <MapPin className="h-4 w-4" />
                            </span>
                            <input
                              type="text"
                              name="location"
                              id="location"
                              required
                              className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                              value={formData.location}
                              onChange={handleInputChange}
                            />
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Employment Type */}
                          <div>
                            <label htmlFor="employmentType" className="block text-sm font-medium text-gray-700">
                              Employment Type <span className="text-red-500">*</span>
                            </label>
                            <select
                              name="employmentType"
                              id="employmentType"
                              required
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={formData.employmentType}
                              onChange={handleInputChange}
                            >
                              <option value="Full-time">Full-time</option>
                              <option value="Part-time">Part-time</option>
                              <option value="Contract">Contract</option>
                              <option value="Internship">Internship</option>
                              <option value="Temporary">Temporary</option>
                            </select>
                          </div>
                          
                          {/* Status */}
                          <div>
                            <label htmlFor="status" className="block text-sm font-medium text-gray-700">
                              Status
                            </label>
                            <select
                              name="status"
                              id="status"
                              className="mt-1 block w-full py-2 px-3 border border-gray-300 bg-white rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm"
                              value={formData.status}
                              onChange={handleInputChange}
                            >
                              <option value="Open">Open</option>
                              <option value="Closed">Closed</option>
                            </select>
                          </div>
                        </div>
                        
                        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                          {/* Posted By */}
                          <div>
                            <label htmlFor="postedBy" className="block text-sm font-medium text-gray-700">
                              Posted By <span className="text-red-500">*</span>
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                <User className="h-4 w-4" />
                              </span>
                              <input
                                type="text"
                                name="postedBy"
                                id="postedBy"
                                required
                                className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                value={formData.postedBy}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                          
                          {/* Skills */}
                          <div>
                            <label htmlFor="skillsRequired" className="block text-sm font-medium text-gray-700">
                              Skills (comma separated)
                            </label>
                            <div className="mt-1 flex rounded-md shadow-sm">
                              <span className="inline-flex items-center px-3 rounded-l-md border border-r-0 border-gray-300 bg-gray-50 text-gray-500 sm:text-sm">
                                <Tag className="h-4 w-4" />
                              </span>
                              <input
                                type="text"
                                name="skillsRequired"
                                id="skillsRequired"
                                className="focus:ring-blue-500 focus:border-blue-500 flex-1 block w-full rounded-none rounded-r-md sm:text-sm border-gray-300"
                                placeholder="e.g. React, Node.js, MongoDB"
                                value={formData.skillsRequired}
                                onChange={handleInputChange}
                              />
                            </div>
                          </div>
                        </div>
                        
                        {/* Image Upload */}
                        <div>
                          <label className="block text-sm font-medium text-gray-700">
                            Job Image
                          </label>
                          <div className="mt-1 flex items-center">
                            {imagePreview ? (
                              <div className="relative">
                                <img
                                  src={imagePreview}
                                  alt="Preview"
                                  className="h-32 w-32 object-cover rounded-md"
                                />
                                <button
                                  type="button"
                                  className="absolute top-0 right-0 bg-red-500 text-white rounded-full p-1 transform translate-x-1/2 -translate-y-1/2"
                                  onClick={() => {
                                    setImagePreview(null);
                                    setFormData({...formData, image: null});
                                  }}
                                >
                                  <X className="h-4 w-4" />
                                </button>
                              </div>
                            ) : (
                              <div className="flex justify-center items-center h-32 w-32 bg-gray-100 rounded-md border-2 border-dashed border-gray-300">
                                <label htmlFor="image-upload" className="cursor-pointer text-center p-2">
                                  <svg className="mx-auto h-12 w-12 text-gray-400" stroke="currentColor" fill="none" viewBox="0 0 48 48" aria-hidden="true">
                                    <path d="M28 8H12a4 4 0 00-4 4v20m32-12v8m0 0v8a4 4 0 01-4 4H12a4 4 0 01-4-4v-4m32-4l-3.172-3.172a4 4 0 00-5.656 0L28 28M8 32l9.172-9.172a4 4 0 015.656 0L28 28m0 0l4 4m4-24h8m-4-4v8m-12 4h.02" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
                                  </svg>
                                  <div className="text-sm text-gray-600">
                                    Upload image
                                  </div>
                                </label>
                                <input
                                  id="image-upload"
                                  name="image"
                                  type="file"
                                  className="sr-only"
                                  accept="image/*"
                                  onChange={handleImageChange}
                                />
                              </div>
                            )}
                          </div>
                          <p className="mt-2 text-sm text-gray-500">
                            Upload a job-related image (company logo, etc). PNG, JPG up to 2MB.
                          </p>
                        </div>
                      </form>
                    </div>
                  </div>
                </div>
              </div>
              <div className="bg-gray-50 px-4 py-3 sm:px-6 sm:flex sm:flex-row-reverse">
                <button
                  type="button"
                  onClick={handleSubmit}
                  className="w-full inline-flex justify-center rounded-md border border-transparent shadow-sm px-4 py-2 bg-blue-600 text-base font-medium text-white hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  <Save className="mr-2 h-5 w-5" />
                  {formMode === 'add' ? 'Create Job' : 'Update Job'}
                </button>
                <button
                  type="button"
                  onClick={() => setShowForm(false)}
                  className="mt-3 w-full inline-flex justify-center rounded-md border border-gray-300 shadow-sm px-4 py-2 bg-white text-base font-medium text-gray-700 hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 sm:mt-0 sm:ml-3 sm:w-auto sm:text-sm"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobAdminDashboard;