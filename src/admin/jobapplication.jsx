import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Download,
  ChevronDown,
  ChevronUp,
  Filter,
  Check,
  X,
  Search,
  RefreshCw,
  Eye,
  Trash2,
  AlertTriangle,
  Maximize2,
  Minimize2,
  XCircle,
  FileText,
  Edit
} from 'lucide-react';
import { getAuthToken } from '../utils/auth';

const AdminJobApplications = () => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [expandedApplication, setExpandedApplication] = useState(null);
  const [statusFilter, setStatusFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [viewingCV, setViewingCV] = useState(null);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [fullscreenCV, setFullscreenCV] = useState(false);
  const [cvLoading, setCvLoading] = useState(false);
  const [cvError, setCvError] = useState(null);
  const [actionLoading, setActionLoading] = useState({});
  const [statusUpdateModal, setStatusUpdateModal] = useState(null);
  
  const API_BASE_URL = process.env.REACT_APP_API_BASE_URL || 'https://api.psevenrwanda.com';

  useEffect(() => {
    fetchApplications();
  }, []);

 // Example debugging in AdminJobApplications.js
const fetchApplications = async () => {
  setLoading(true);
  setError(null);
  
  try {
    const token = getAuthToken();
    console.log("Token retrieved:", token ? "Token exists" : "No token found");
    
    if (!token) {
      setError('Authentication token not found. Please log in again.');
      return;
    }

    const response = await axios.get(`${API_BASE_URL}/api/applications`, {
      headers: { Authorization: `Bearer ${token}` }
    });
    
    console.log("API response:", response.status);
    setApplications(response.data);
  } catch (err) {
    console.error('Error details:', err);
    setError(err.response?.data?.message || 'Failed to fetch applications. Please check your permissions.');
  } finally {
    setLoading(false);
  }
};
  const handleViewCV = async (cvPath, applicationName) => {
    setCvLoading(true);
    setCvError(null);
    try {
      const isCloudinaryUrl = cvPath.includes('cloudinary.com');
      let fetchUrl = cvPath;
      
      const token = getAuthToken();
      if (!token) {
        setCvError('Authentication token not found. Please log in again.');
        return;
      }
      
      if (isCloudinaryUrl) {
        let publicId;
        const regex = /cloudinary\.com\/(?:[^\/]+)\/(?:[^\/]+)\/(?:[^\/]+)\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/;
        const matches = cvPath.match(regex);
        
        if (matches && matches[1]) {
          publicId = matches[1];
        } else {
          const urlParts = cvPath.split('/');
          const fileName = urlParts[urlParts.length - 1].split('.')[0];
          publicId = fileName;
        }
        
        let resourceType = 'raw';
        if (publicId.startsWith('cvs/') || cvPath.toLowerCase().match(/\.(jpe?g|png|gif|bmp|webp|pdf)$/)) {
          resourceType = 'image';
        } else if (cvPath.toLowerCase().match(/\.(mp4|mov|avi|wmv)$/)) {
          resourceType = 'video';
        }
        
        const signedUrlResponse = await axios.get(
          `${API_BASE_URL}/api/uploads/get-signed-url`, 
          { 
            params: { publicId, resourceType },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (!signedUrlResponse.data || !signedUrlResponse.data.url) {
          throw new Error('Invalid response from signed URL endpoint');
        }
        
        fetchUrl = signedUrlResponse.data.url;
      } else {
        const isAbsoluteUrl = cvPath.startsWith('http://') || cvPath.startsWith('https://');
        fetchUrl = isAbsoluteUrl ? cvPath : `${API_BASE_URL}${cvPath.startsWith('/') ? cvPath : `/${cvPath}`}`;
      }

      const response = await axios.get(fetchUrl, {
        responseType: 'blob',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });

      if (!response.data || response.data.size === 0) {
        throw new Error('Empty response received');
      }

      const blobUrl = URL.createObjectURL(response.data);
      setViewingCV({
        path: blobUrl,
        name: applicationName,
        type: getFileType(cvPath),
      });
    } catch (err) {
      console.error('Error loading CV:', err);
      setCvError(err.message || 'Failed to load the CV file. The file might be protected or inaccessible.');
    } finally {
      setCvLoading(false);
    }
  };

  const getFileType = (path) => {
    if (!path) return 'unknown';
    
    const extension = path.split('.').pop().toLowerCase();
    
    if (extension === 'pdf') return 'pdf';
    if (['doc', 'docx'].includes(extension)) return 'word';
    if (['jpg', 'jpeg', 'png', 'gif'].includes(extension)) return 'image';
    
    return 'other';
  };

  const handleDownloadCV = async (cvPath) => {
    setActionLoading({ downloadCV: true });
    
    try {
      const isCloudinaryUrl = cvPath.includes('cloudinary.com');
      let fetchUrl = cvPath;
      
      const token = getAuthToken();
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
      
      if (isCloudinaryUrl) {
        // Reuse the same Cloudinary logic from handleViewCV
        let publicId;
        const regex = /cloudinary\.com\/(?:[^\/]+)\/(?:[^\/]+)\/(?:[^\/]+)\/(?:v\d+\/)?(.+?)(?:\.\w+)?$/;
        const matches = cvPath.match(regex);
        
        if (matches && matches[1]) {
          publicId = matches[1];
        } else {
          const urlParts = cvPath.split('/');
          const fileName = urlParts[urlParts.length - 1].split('.')[0];
          publicId = fileName;
        }
        
        let resourceType = 'raw';
        if (publicId.startsWith('cvs/') || cvPath.toLowerCase().match(/\.(jpe?g|png|gif|bmp|webp|pdf)$/)) {
          resourceType = 'image';
        } else if (cvPath.toLowerCase().match(/\.(mp4|mov|avi|wmv)$/)) {
          resourceType = 'video';
        }
        
        const signedUrlResponse = await axios.get(
          `${API_BASE_URL}/api/uploads/get-signed-url`, 
          { 
            params: { publicId, resourceType },
            headers: { Authorization: `Bearer ${token}` }
          }
        );
        
        if (!signedUrlResponse.data || !signedUrlResponse.data.url) {
          throw new Error('Invalid response from signed URL endpoint');
        }
        
        fetchUrl = signedUrlResponse.data.url;
      } else {
        const isAbsoluteUrl = cvPath.startsWith('http://') || cvPath.startsWith('https://');
        fetchUrl = isAbsoluteUrl ? cvPath : `${API_BASE_URL}${cvPath.startsWith('/') ? cvPath : `/${cvPath}`}`;
      }

      const response = await axios.get(fetchUrl, {
        responseType: 'blob',
        headers: {
          'Cache-Control': 'no-cache',
          'Pragma': 'no-cache',
          'Expires': '0',
        }
      });

      const blobUrl = URL.createObjectURL(response.data);
      const fileName = cvPath.split('/').pop();

      const link = document.createElement('a');
      link.href = blobUrl;
      link.setAttribute('download', fileName);
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);

      setTimeout(() => URL.revokeObjectURL(blobUrl), 100);
    } catch (err) {
      alert('Failed to download the CV file');
      console.error(err);
    } finally {
      setActionLoading({ downloadCV: false });
    }
  };
  const handleUpdateApplicationStatus = async (applicationId, newStatus) => {
    setActionLoading({ [applicationId]: true });
    
    try {
      const token = getAuthToken();
      if (!token) {
        alert('Authentication token not found. Please log in again.');
        return;
      }
  
      await axios.patch(
        `${API_BASE_URL}/api/applications/${applicationId}`, 
        { status: newStatus },
        { headers: { Authorization: `Bearer ${token}` } }
      );
  
      // Update the application in the current state
      setApplications(applications.map(app => 
        app._id === applicationId ? { ...app, status: newStatus } : app
      ));
      
      setStatusUpdateModal(null);
    } catch (err) {
      alert(`Failed to update application status: ${err.message}`);
      console.error('Error updating application status:', err);
    } finally {
      setActionLoading({ [applicationId]: false });
    }
  };

  const cleanupViewer = () => {
    if (viewingCV?.path) {
      URL.revokeObjectURL(viewingCV.path);
    }
    setViewingCV(null);
    setFullscreenCV(false);
  };

  useEffect(() => {
    return () => cleanupViewer();
  }, []);

  const getSortedApplications = () => {
    const filtered = applications.filter(app => {
      const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
      const matchesSearch = 
        app.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        app.job?.title?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesStatus && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortConfig.key === 'createdAt') {
        return sortConfig.direction === 'asc' 
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }

      // For nested properties like job.title
      const aVal = sortConfig.key.includes('.')
        ? getNestedValue(a, sortConfig.key) || ''
        : a[sortConfig.key] || '';
      const bVal = sortConfig.key.includes('.')
        ? getNestedValue(b, sortConfig.key) || ''
        : b[sortConfig.key] || '';

      return sortConfig.direction === 'asc'
        ? (aVal < bVal ? -1 : 1) : (aVal > bVal ? 1 : -1);
    });
  };

  // Helper function to get nested values like job.title
  const getNestedValue = (obj, path) => {
    return path.split('.').reduce((prev, curr) => {
      return prev ? prev[curr] : null;
    }, obj);
  };

  const handleDeleteApplication = async (applicationId) => {
    setActionLoading({ [applicationId]: true });
    try {
      const token = getAuthToken();

      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      await axios.delete(`${API_BASE_URL}/api/applications/${applicationId}`, {
        headers: { Authorization: `Bearer ${token}` }
      });

      setApplications(applications.filter(app => app._id !== applicationId));
      setDeleteConfirmation(null);
      setExpandedApplication(null);
    } catch (err) {
      alert('Failed to delete application');
      console.error(err);
    } finally {
      setActionLoading({ [applicationId]: false });
    }
  };

  const handleSort = (key) => {
    const direction = sortConfig.key === key && sortConfig.direction === 'asc' ? 'desc' : 'asc';
    setSortConfig({ key, direction });
  };

  const getStatusClass = (status) => {
    const statusClasses = {
      pending: 'bg-yellow-100 text-yellow-800',
      reviewed: 'bg-blue-100 text-blue-800',
      interviewed: 'bg-purple-100 text-purple-800',
      rejected: 'bg-red-100 text-red-800',
      hired: 'bg-green-100 text-green-800',
    };
    return statusClasses[status] || 'bg-gray-100 text-gray-800';
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-600">Loading applications...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 border border-red-200">
        <p className="font-medium">Error</p>
        <p>{error}</p>
        <button 
          onClick={fetchApplications}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </button>
      </div>
    );
  }

  const sortedApplications = getSortedApplications();

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {/* Modal for Viewing CV */}
      {viewingCV && (
        <div className={`fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 ${fullscreenCV ? 'p-0' : 'p-4'}`}>
          <div className={`bg-white rounded-lg shadow-xl ${fullscreenCV ? 'w-full h-full rounded-none' : 'w-full max-w-4xl h-3/4'}`}>
            <div className="flex justify-between items-center border-b p-4">
              <h3 className="text-lg font-medium flex items-center">
                <FileText className="h-5 w-5 mr-2" />
                CV: {viewingCV.name}
              </h3>
              <div className="flex space-x-2">
                <button 
                  onClick={() => setFullscreenCV(!fullscreenCV)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title={fullscreenCV ? "Exit Fullscreen" : "Fullscreen"}
                >
                  {fullscreenCV ? <Minimize2 className="h-5 w-5" /> : <Maximize2 className="h-5 w-5" />}
                </button>
                <button 
                  onClick={() => handleDownloadCV(viewingCV.path)}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Download CV"
                  disabled={actionLoading.downloadCV}
                >
                  {actionLoading.downloadCV ? 
                    <RefreshCw className="h-5 w-5 animate-spin" /> : 
                    <Download className="h-5 w-5" />}
                </button>
                <button 
                  onClick={cleanupViewer}
                  className="p-1 text-gray-500 hover:text-gray-700"
                  title="Close"
                >
                  <XCircle className="h-5 w-5" />
                </button>
              </div>
            </div>
            
            <div className="flex-grow overflow-auto p-4 bg-gray-100 flex items-center justify-center">
              {cvLoading ? (
                <div className="flex flex-col items-center justify-center">
                  <RefreshCw className="animate-spin h-8 w-8 text-gray-500 mb-2" />
                  <span className="text-gray-600">Loading CV...</span>
                </div>
              ) : cvError ? (
                <div className="bg-red-50 p-4 rounded-md text-red-700">
                  <p className="font-medium">Error loading CV</p>
                  <p>{cvError}</p>
                </div>
              ) : viewingCV.type === 'pdf' ? (
                <embed src={viewingCV.path} type="application/pdf" width="100%" height="600px" />
              ) : viewingCV.type === 'image' ? (
                <img src={viewingCV.path} alt={`CV for ${viewingCV.name}`} className="max-w-full max-h-full object-contain" />
              ) : (
                <div className="text-center">
                  <p className="text-gray-600">This document format cannot be displayed directly in the browser.</p>
                  <button 
                    onClick={() => handleDownloadCV(viewingCV.path)} 
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-md flex items-center justify-center"
                    disabled={actionLoading.downloadCV}
                  >
                    {actionLoading.downloadCV ? 
                      <><RefreshCw className="h-4 w-4 animate-spin mr-2" /> Downloading...</> : 
                      <><Download className="h-4 w-4 mr-2" /> Download CV</>}
                  </button>
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="mb-6">
              Are you sure you want to delete the application from <span className="font-semibold">{deleteConfirmation.fullName}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                disabled={actionLoading[deleteConfirmation._id]}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteApplication(deleteConfirmation._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center"
                disabled={actionLoading[deleteConfirmation._id]}
              >
                {actionLoading[deleteConfirmation._id] ? 
                  <><RefreshCw className="h-4 w-4 animate-spin mr-2" /> Deleting...</> : 
                  'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Status Update Modal */}
      {statusUpdateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <h3 className="text-lg font-medium mb-4">Update Application Status</h3>
            <p className="mb-4">
              Change status for <span className="font-semibold">{statusUpdateModal.fullName}</span>
            </p>
            <div className="space-y-2 mb-6">
              {['pending', 'reviewed', 'interviewed', 'rejected', 'hired'].map(status => (
                <button
                  key={status}
                  onClick={() => handleUpdateApplicationStatus(statusUpdateModal._id, status)}
                  className={`w-full px-4 py-3 rounded-md flex items-center justify-between border ${
                    statusUpdateModal.status === status ? 'border-blue-500 bg-blue-50' : 'hover:bg-gray-50'
                  }`}
                  disabled={actionLoading[statusUpdateModal._id]}
                >
                  <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(status)} mr-2`}>
                    {status.charAt(0).toUpperCase() + status.slice(1)}
                  </span>
                  {statusUpdateModal.status === status && <Check className="h-4 w-4 text-blue-500" />}
                </button>
              ))}
            </div>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setStatusUpdateModal(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                disabled={actionLoading[statusUpdateModal._id]}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header and Filters */}
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Job Applications</h1>
        
        <div className="flex space-x-2">
          <div className="relative">
            <button 
              className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
              onClick={() => setFilterMenuOpen(!filterMenuOpen)}
            >
              <Filter className="h-4 w-4 mr-2" />
              {statusFilter === 'all' ? 'All Statuses' : statusFilter.charAt(0).toUpperCase() + statusFilter.slice(1)}
              <ChevronDown className="h-4 w-4 ml-2" />
            </button>
            
            {filterMenuOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                {['all', 'pending', 'reviewed', 'interviewed', 'rejected', 'hired'].map(status => (
                  <button
                    key={status}
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      setStatusFilter(status);
                      setFilterMenuOpen(false);
                    }}
                  >
                    {statusFilter === status && <Check className="h-4 w-4 mr-2" />}
                    {status === 'all' ? 'All Statuses' : status.charAt(0).toUpperCase() + status.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
          
          <div className="relative">
            <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
            <input
              type="text"
              placeholder="Search applications..."
              className="pl-10 pr-4 py-2 border rounded-md"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            {searchTerm && (
              <button 
                className="absolute right-3 top-3"
                onClick={() => setSearchTerm('')}
              >
                <X className="h-4 w-4 text-gray-400" />
              </button>
            )}
          </div>
          
          <button 
            onClick={fetchApplications}
            className="p-2 border rounded-md hover:bg-gray-50"
            title="Refresh"
          >
            <RefreshCw className="h-5 w-5" />
          </button>
        </div>
      </div>

      {/* Applications List */}
      {sortedApplications.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm || statusFilter !== 'all' ? 'No applications match your search criteria' : 'No applications have been submitted yet'}
        </div>
      ) : (
        <div className="overflow-x-auto">
          <table className="min-w-full bg-white">
            <thead className="bg-gray-50">
              <tr>
                <th className="py-3 px-4 text-left">
                  <button 
                    className="font-medium text-sm text-gray-500 flex items-center"
                    onClick={() => handleSort('fullName')}
                  >
                    Applicant
                    {sortConfig.key === 'fullName' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 text-left">
                  <button 
                    className="font-medium text-sm text-gray-500 flex items-center"
                    onClick={() => handleSort('job.title')}
                  >
                    Position
                    {sortConfig.key === 'job.title' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 text-left">
                  <button 
                    className="font-medium text-sm text-gray-500 flex items-center"
                    onClick={() => handleSort('createdAt')}
                  >
                    Date Applied
                    {sortConfig.key === 'createdAt' && (
                      sortConfig.direction === 'asc' ? 
                        <ChevronUp className="h-4 w-4 ml-1" /> : 
                        <ChevronDown className="h-4 w-4 ml-1" />
                    )}
                  </button>
                </th>
                <th className="py-3 px-4 text-left">Status</th>
                <th className="py-3 px-4 text-left">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y">
              {sortedApplications.map(application => (
                <React.Fragment key={application._id}>
                  <tr className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{application.fullName}</div>
                      <div className="text-sm text-gray-500">{application.email}</div>
                    </td>
                    <td className="py-3 px-4">
                      {application.job?.title || 'Unknown Position'}
                    </td>
                    <td className="py-3 px-4">
                      {new Date(application.createdAt).toLocaleString()}
                    </td>
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 rounded-full text-xs ${getStatusClass(application.status)}`}>
                        {application.status.charAt(0).toUpperCase() + application.status.slice(1)}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex space-x-2">
                        <button
                          onClick={() => setExpandedApplication(expandedApplication === application._id ? null : application._id)}
                          className="p-1 text-gray-500 hover:text-gray-700"
                          title={expandedApplication === application._id ? "Hide details" : "Show details"}
                        >
                          {expandedApplication === application._id ? 
                            <ChevronUp className="h-5 w-5" /> : 
                            <ChevronDown className="h-5 w-5" />}
                        </button>
                        
                        <button
                          onClick={() => setStatusUpdateModal(application)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="Update status"
                          disabled={actionLoading[application._id]}
                        >
                          {actionLoading[application._id] ? 
                            <RefreshCw className="h-5 w-5 animate-spin" /> : 
                            <Edit className="h-5 w-5" />}
                        </button>
                        
                        {application.cvPath && (
                          <>
                            <button
                              onClick={() => handleViewCV(application.cvPath, application.fullName)}
                              className="p-1 text-blue-500 hover:text-blue-700"
                              title="View CV"
                              disabled={cvLoading}
                            >
                              {cvLoading ? 
                                <RefreshCw className="h-5 w-5 animate-spin" /> : 
                                <Eye className="h-5 w-5" />}
                            </button>
                            <button
                              onClick={() => handleDownloadCV(application.cvPath)}
                              className="p-1 text-gray-500 hover:text-gray-700"
                              title="Download CV"
                              disabled={actionLoading.downloadCV}
                            >
                              {actionLoading.downloadCV ? 
                                <RefreshCw className="h-5 w-5 animate-spin" /> : 
                                <Download className="h-5 w-5" />}
                            </button>
                          </>
                        )}
                        
                        <button
                          onClick={() => setDeleteConfirmation(application)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Delete application"
                          disabled={actionLoading[application._id]}                        >
                          <Trash2 className="h-5 w-5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                  {expandedApplication === application._id && (
                    <tr className="bg-gray-50">
                      <td colSpan="5" className="py-3 px-4">
                        <div className="p-4 border rounded-md">
                          <h4 className="font-medium">Application Details</h4>
                          <p><strong>Cover Letter:</strong> {application.coverLetter || 'No cover letter provided.'}</p>
                          <p><strong>Job Description:</strong> {application.job?.description || 'No job description provided.'}</p>
                          {/* Additional application details can be displayed here */}
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
};

export default AdminJobApplications;