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
  Trash2,
  AlertTriangle,
  FileText,
  Plus,
  Edit,
  Eye,
  ArrowUpDown,
  Calendar,
  Printer,
  MoreHorizontal,
  ExternalLink
} from 'lucide-react';
import { toast } from 'react-toastify';
import { getAuthToken } from '../utils/auth';
import { CSVLink } from 'react-csv';

const API_BASE_URL = 'https://api.psevenrwanda.com';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');
  const [sortConfig, setSortConfig] = useState({ key: 'createdAt', direction: 'desc' });
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [editingService, setEditingService] = useState(null);
  const [viewingService, setViewingService] = useState(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [newService, setNewService] = useState({
    name: '',
    description: '',
    status: 'active'
  });
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const [dateFilter, setDateFilter] = useState({ startDate: '', endDate: '' });

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    setLoading(true);
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      const response = await axios.get(`${API_BASE_URL}/api/services`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      setServices(response.data);
      toast.success('Services loaded successfully');
    } catch (error) {
      console.error('Error fetching services:', error);
      if (error.response) {
        setError(`Error: ${error.response.status} - ${error.response.data.message || error.message}`);
      } else if (error.request) {
        setError('Error: No response received from the server.');
      } else {
        setError('Error: ' + error.message);
      }
      toast.error('Failed to load services');
    } finally {
      setLoading(false);
    }
  };

  const handleAddService = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      const response = await axios.post(
        `${API_BASE_URL}/api/services`,
        newService,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServices([...services, response.data]);
      setShowAddModal(false);
      resetNewService();
      toast.success('Service added successfully');
    } catch (err) {
      toast.error('Failed to add service');
      console.error(err);
    }
  };

  const resetNewService = () => {
    setNewService({
      name: '',
      description: '',
      status: 'active'
    });
  };

  const handleUpdateService = async () => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      const response = await axios.put(
        `${API_BASE_URL}/api/services/${editingService._id}`,
        editingService,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      setServices(
        services.map((service) =>
          service._id === editingService._id ? response.data : service
        )
      );
      setEditingService(null);
      toast.success('Service updated successfully');
    } catch (err) {
      toast.error('Failed to update service');
      console.error(err);
    }
  };

  const handleDeleteService = async (serviceId) => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      await axios.delete(`${API_BASE_URL}/api/services/${serviceId}`, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      setServices(services.filter((service) => service._id !== serviceId));
      setDeleteConfirmation(null);
      toast.success('Service deleted successfully');
    } catch (err) {
      toast.error('Failed to delete service');
      console.error(err);
    }
  };

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const handleBulkDelete = async (selectedIds) => {
    try {
      const token = getAuthToken();
      if (!token) {
        setError('Authentication token not found. Please log in again.');
        return;
      }

      // In a real app, this would be a bulk delete API endpoint
      for (const id of selectedIds) {
        await axios.delete(`${API_BASE_URL}/api/services/${id}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
      }

      setServices(services.filter((service) => !selectedIds.includes(service._id)));
      toast.success(`${selectedIds.length} services deleted successfully`);
    } catch (err) {
      toast.error('Failed to delete services');
      console.error(err);
    }
  };

  const getSortedAndFilteredServices = () => {
    // Start with filtering
    let filtered = services.filter((service) => {
      // Text search
      const textMatch = 
        service.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        (service.description && service.description.toLowerCase().includes(searchTerm.toLowerCase()));
      
      // Status filter
      const statusMatch = statusFilter === 'all' || service.status === statusFilter;
      
      // Date filter
      let dateMatch = true;
      if (dateFilter.startDate && dateFilter.endDate) {
        const serviceDate = new Date(service.createdAt);
        const startDate = new Date(dateFilter.startDate);
        const endDate = new Date(dateFilter.endDate);
        endDate.setHours(23, 59, 59); // Set end date to end of day
        dateMatch = serviceDate >= startDate && serviceDate <= endDate;
      }
      
      return textMatch && statusMatch && dateMatch;
    });

    // Then sort
    return [...filtered].sort((a, b) => {
      if (sortConfig.key === 'createdAt') {
        return sortConfig.direction === 'asc'
          ? new Date(a.createdAt) - new Date(b.createdAt)
          : new Date(b.createdAt) - new Date(a.createdAt);
      }

      const aVal = a[sortConfig.key] || '';
      const bVal = b[sortConfig.key] || '';

      if (aVal < bVal) {
        return sortConfig.direction === 'asc' ? -1 : 1;
      }
      if (aVal > bVal) {
        return sortConfig.direction === 'asc' ? 1 : -1;
      }
      return 0;
    });
  };

  // Get sorted and filtered services
  const filteredServices = getSortedAndFilteredServices();
  
  // Pagination
  const indexOfLastItem = currentPage * itemsPerPage;
  const indexOfFirstItem = indexOfLastItem - itemsPerPage;
  const currentServices = filteredServices.slice(indexOfFirstItem, indexOfLastItem);
  const totalPages = Math.ceil(filteredServices.length / itemsPerPage);

  // Prepare data for CSV export
  const csvData = filteredServices.map(service => ({
    Name: service.name,
    Description: service.description || '',
    Status: service.status || '',
    Created: new Date(service.createdAt).toLocaleDateString()
  }));

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-600">Loading services...</span>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 p-4 rounded-md text-red-700 border border-red-200">
        <p className="font-medium">Error</p>
        <p>{error}</p>
        <button
          onClick={fetchServices}
          className="mt-2 px-4 py-2 bg-red-100 hover:bg-red-200 rounded-md flex items-center"
        >
          <RefreshCw className="h-4 w-4 mr-2" /> Try Again
        </button>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-semibold text-gray-800">Services</h1>

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
                {['all', 'active', 'inactive', 'pending'].map(status => (
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
              placeholder="Search services..."
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

          <CSVLink
            data={csvData}
            filename="services-export.csv"
            className="px-4 py-2 border rounded-md hover:bg-gray-50 flex items-center"
            target="_blank"
          >
            <Download className="h-4 w-4 mr-2" />
            Export
          </CSVLink>

          <button
            onClick={() => setShowAddModal(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center"
          >
            <Plus className="h-4 w-4 mr-2" />
            Add Service
          </button>
        </div>
      </div>

      <div className="mb-4 flex flex-wrap gap-4">
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">From:</span>
          <input
            type="date"
            className="border rounded-md px-3 py-1"
            value={dateFilter.startDate}
            onChange={(e) => setDateFilter({ ...dateFilter, startDate: e.target.value })}
          />
        </div>
        <div className="flex items-center">
          <span className="text-sm text-gray-500 mr-2">To:</span>
          <input
            type="date"
            className="border rounded-md px-3 py-1"
            value={dateFilter.endDate}
            onChange={(e) => setDateFilter({ ...dateFilter, endDate: e.target.value })}
          />
        </div>
        {(dateFilter.startDate || dateFilter.endDate) && (
          <button
            onClick={() => setDateFilter({ startDate: '', endDate: '' })}
            className="text-xs py-1 px-2 bg-gray-100 hover:bg-gray-200 rounded-md flex items-center"
          >
            <X className="h-3 w-3 mr-1" /> Clear Date Filter
          </button>
        )}
      </div>

      {filteredServices.length === 0 ? (
        <div className="text-center py-8 text-gray-500">
          {searchTerm || statusFilter !== 'all' || dateFilter.startDate || dateFilter.endDate
            ? 'No services match your search criteria'
            : 'No services have been added yet'}
        </div>
      ) : (
        <>
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">
                    <button
                      className="font-medium text-sm text-gray-500 flex items-center"
                      onClick={() => handleSort('name')}
                    >
                      Service Name
                      {sortConfig.key === 'name' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <button
                      className="font-medium text-sm text-gray-500 flex items-center"
                      onClick={() => handleSort('description')}
                    >
                      Description
                      {sortConfig.key === 'description' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                 
                  <th className="py-3 px-4 text-left">
                    <button
                      className="font-medium text-sm text-gray-500 flex items-center"
                      onClick={() => handleSort('status')}
                    >
                      Status
                      {sortConfig.key === 'status' && (
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
                      Created
                      {sortConfig.key === 'createdAt' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-center">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {currentServices.map((service) => (
                  <tr key={service._id} className="hover:bg-gray-50">
                    <td className="py-3 px-4">
                      <div className="font-medium">{service.name}</div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-600 max-w-xs truncate">
                        {service.description || 'No description'}
                      </div>
                    </td>
                   
                    <td className="py-3 px-4">
                      <span className={`px-2 py-1 text-xs rounded-full ${
                        service.status === 'active' ? 'bg-green-100 text-green-800' :
                        service.status === 'inactive' ? 'bg-gray-100 text-gray-800' :
                        'bg-yellow-100 text-yellow-800'
                      }`}>
                        {service.status || 'Active'}
                      </span>
                    </td>
                    <td className="py-3 px-4">
                      <div className="text-sm text-gray-500">
                        {new Date(service.createdAt).toLocaleDateString()}
                      </div>
                    </td>
                    <td className="py-3 px-4">
                      <div className="flex justify-center space-x-2">
                        <button
                          onClick={() => setViewingService(service)}
                          className="p-1 text-blue-500 hover:text-blue-700"
                          title="View Service"
                        >
                          <Eye className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setEditingService({ ...service })}
                          className="p-1 text-gray-500 hover:text-gray-700"
                          title="Edit Service"
                        >
                          <Edit className="h-5 w-5" />
                        </button>
                        <button
                          onClick={() => setDeleteConfirmation(service)}
                          className="p-1 text-red-500 hover:text-red-700"
                          title="Delete Service"
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

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4 px-4">
            <div className="text-sm text-gray-500">
              Showing {indexOfFirstItem + 1} to {Math.min(indexOfLastItem, filteredServices.length)} of {filteredServices.length} entries
            </div>
            <div className="flex space-x-1">
              <button
                onClick={() => setCurrentPage(1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                First
              </button>
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className={`px-3 py-1 rounded ${
                  currentPage === 1 ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Previous
              </button>
              
              {/* Page numbers */}
              {Array.from({ length: Math.min(totalPages, 5) }).map((_, idx) => {
                let pageNumber;
                
                if (totalPages <= 5) {
                  pageNumber = idx + 1;
                } else if (currentPage <= 3) {
                  pageNumber = idx + 1;
                } else if (currentPage >= totalPages - 2) {
                  pageNumber = totalPages - 4 + idx;
                } else {
                  pageNumber = currentPage - 2 + idx;
                }
                
                if (pageNumber > 0 && pageNumber <= totalPages) {
                  return (
                    <button
                      key={pageNumber}
                      onClick={() => setCurrentPage(pageNumber)}
                      className={`px-3 py-1 rounded ${
                        currentPage === pageNumber ? 'bg-blue-600 text-white' : 'bg-gray-200 hover:bg-gray-300'
                      }`}
                    >
                      {pageNumber}
                    </button>
                  );
                }
                return null;
              })}
              
              <button
                onClick={() => setCurrentPage(currentPage + 1)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Next
              </button>
              <button
                onClick={() => setCurrentPage(totalPages)}
                disabled={currentPage === totalPages}
                className={`px-3 py-1 rounded ${
                  currentPage === totalPages ? 'bg-gray-100 text-gray-400 cursor-not-allowed' : 'bg-gray-200 hover:bg-gray-300'
                }`}
              >
                Last
              </button>
            </div>
          </div>
        </>
      )}

      {/* Add Service Modal */}
      {showAddModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex justify-between items-center mb-4">
              <h3 className="text-lg font-medium">Add New Service</h3>
              <button onClick={() => setShowAddModal(false)} className="text-gray-400 hover:text-gray-500">
                <X className="h-5 w-5" />
              </button>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  className="w-full p-2 border rounded-md"
                  value={newService.name}
                  onChange={(e) => setNewService({ ...newService, name: e.target.value })}
                  placeholder="Service name"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  className="w-full p-2 border rounded-md"
                  value={newService.description}
                  onChange={(e) => setNewService({ ...newService, description: e.target.value })}
                  placeholder="Describe the service"
                  rows={3}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
                <select
                  className="w-full p-2 border rounded-md"
                  value={newService.status}
                  onChange={(e) => setNewService({ ...newService, status: e.target.value })}
                >
                  <option value="active">Active</option>
                  <option value="inactive">Inactive</option>
                  <option value="pending">Pending</option>
                </select>
              </div>
            </div>
            <div className="mt-6 flex justify-end gap-3">
              <button
                onClick={() => setShowAddModal(false)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
              >
                Cancel
              </button>
              <button
                onClick={handleAddService}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
              >
                Add Service
              </button>
            </div>
          </div>
        </div>
      )}
{editingService && (
  <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
    <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h3 className="text-lg font-medium">Edit Service</h3>
        <button onClick={() => setEditingService(null)} className="text-gray-400 hover:text-gray-500">
          <X className="h-5 w-5" />
        </button>
      </div>
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
          <input
            type="text"
            className="w-full p-2 border rounded-md"
            value={editingService.name}
            onChange={(e) => setEditingService({ ...editingService, name: e.target.value })}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
          <textarea
            className="w-full p-2 border rounded-md"
            value={editingService.description || ''}
            onChange={(e) => setEditingService({ ...editingService, description: e.target.value })}
            rows={3}
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
          <select
            className="w-full p-2 border rounded-md"
            value={editingService.status}
            onChange={(e) => setEditingService({ ...editingService, status: e.target.value })}
          >
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
            <option value="pending">Pending</option>
          </select>
        </div>
      </div>
      <div className="mt-6 flex justify-end gap-3">
        <button
          onClick={() => setEditingService(null)}
          className="px-4 py-2 border rounded-md hover:bg-gray-50"
        >
          Cancel
        </button>
        <button
          onClick={handleUpdateService}
          className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700"
        >
          Update Service
        </button>
      </div>
    </div>
  </div>
)}
  
        {/* Delete Confirmation Modal */}
        {deleteConfirmation && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
              <h3 className="text-lg font-medium mb-4">Confirm Deletion</h3>
              <p>Are you sure you want to delete the service <strong>{deleteConfirmation.name}</strong>? This action cannot be undone.</p>
              <div className="mt-6 flex justify-end gap-3">
                <button
                  onClick={() => setDeleteConfirmation(null)}
                  className="px-4 py-2 border rounded-md hover:bg-gray-50"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteService(deleteConfirmation._id)}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    );
  };
  
  export default ServiceManagement;
