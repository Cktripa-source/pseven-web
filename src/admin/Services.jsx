import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaSearch, FaPlus } from 'react-icons/fa';
import Dashboard from './dashboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ServiceManagement = () => {
  const [services, setServices] = useState([]);
  const [editingServiceId, setEditingServiceId] = useState(null);
  const [editedService, setEditedService] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [servicesPerPage] = useState(3);
  const [isAddingService, setIsAddingService] = useState(false);

  useEffect(() => {
    fetchServices();
  }, []);

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/services');
      if (!response.ok) {
        throw new Error('Failed to fetch services');
      }
      const data = await response.json();
      setServices(data);
    } catch (err) {
      console.error('Error fetching services:', err);
      toast.error('Error fetching services!');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  const handleEditService = (service) => {
    setEditingServiceId(service._id);
    setEditedService({ ...service });
  };

  const handleSaveEditedService = async () => {
    try {
      toast.dismiss();
  
      // Ensure all required fields exist
      if (!editedService.name || !editedService.price || !editedService.description) {
        toast.error("All fields are required!");
        return;
      }
  
      const formData = new FormData();
      formData.append('name', editedService.name);
      formData.append('price', editedService.price);
      formData.append('description', editedService.description);
      formData.append('pricePerTime', editedService.pricePerTime);
      if (editedService.image) formData.append('image', editedService.image);
  
      // Debug: Log the FormData values
      for (let pair of formData.entries()) {
        console.log(pair[0], pair[1]);
      }
  
      const response = await fetch(
        `http://localhost:5000/api/services/${editedService._id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );
  
      if (!response.ok) {
        const errorMessage = await response.text();
        throw new Error(`Failed to update service: ${errorMessage}`);
      }
  
      const updatedService = await response.json();
      setServices((prevServices) =>
        prevServices.map((service) =>
          service._id === editedService._id ? updatedService : service
        )
      );
  
      setEditingServiceId(null);
      toast.success('Service updated successfully!');
    } catch (err) {
      console.error('Error saving service:', err);
      toast.error(`Error saving service: ${err.message}`);
    }
  };
  
  const handleDeleteService = async (id) => {
    try {
      toast.dismiss();

      const response = await fetch(
        `http://localhost:5000/api/services/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete service');

      setServices(services.filter((service) => service._id !== id));
      toast.success('Service deleted successfully!');
    } catch (err) {
      console.error('Error deleting service:', err);
      toast.error('Error deleting service!');
    }
  };

  const handleAddService = () => {
    setIsAddingService(true);
    setEditedService({}); // Clear any existing data when starting a new service
  };

  const handleSaveNewService = async () => {
    try {
      toast.dismiss();

      const formData = new FormData();
      formData.append('name', editedService.name);
      formData.append('price', editedService.price);
      formData.append('description', editedService.description);
      formData.append('pricePerTime', editedService.pricePerTime);
      if (editedService.image) formData.append('image', editedService.image);

      const response = await fetch('http://localhost:5000/api/services', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add new service');

      const newService = await response.json(); // Get the added service
      setServices((prevServices) => [newService, ...prevServices]);

      setIsAddingService(false); // Hide the adding form after saving
      toast.success('Service added successfully!');
    } catch (err) {
      console.error('Error adding service:', err);
      toast.error('Error adding service!');
    }
  };

  const handleCancelEdit = () => {
    setEditingServiceId(null);
    setEditedService({});
  };

  const handleCancelAdd = () => {
    setIsAddingService(false);
    setEditedService({});
  };

  const handleFileChange = (e) => {
    setEditedService({ ...editedService, image: e.target.files[0] });
  };

  const filteredServices = services.filter(
    (service) =>
      service.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      service.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const totalPages = Math.ceil(filteredServices.length / servicesPerPage);
  const currentServices = filteredServices.slice(
    (currentPage - 1) * servicesPerPage,
    currentPage * servicesPerPage
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
                placeholder="Search by name or description"
              />
              <FaSearch className="text-white text-3xl p-1 border rounded-full" />
            </div>
            <button
              onClick={handleAddService}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              <FaPlus className="mr-2" /> Add New Service
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-white">Service Management</h2>

          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-400">
            <thead className="text-xs uppercase bg-gray-700 text-gray-400">
  <tr>
    <th className="px-3 py-2 text-xs">Service Name</th>
    <th className="px-3 py-2 text-xs">Price</th> 
    <th className="px-3 py-2 text-xs">Description</th>
    <th className="px-3 py-2 text-xs">Price Per Time</th>
    <th className="px-3 py-2 text-xs">Created At</th>
    <th className="px-3 py-2 text-xs">Image</th> 
    <th className="px-3 py-2 text-xs">Actions</th>
  </tr>
</thead>

              <tbody>
                {isAddingService && (
                  <tr className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                    <td className="px-3 py-4">
                      <input
                        type="text"
                        value={editedService.name || ''}
                        onChange={(e) =>
                          setEditedService({ ...editedService, name: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <input
                        type="number"
                        value={editedService.price || ''}
                        onChange={(e) =>
                          setEditedService({ ...editedService, price: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <input
                        type="text"
                        value={editedService.description || ''}
                        onChange={(e) =>
                          setEditedService({ ...editedService, description: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4">
  <input
    type="text"
    value={editedService.pricePerTime || ''}
    onChange={(e) => setEditedService({ ...editedService, pricePerTime: e.target.value })}
    className="p-2 bg-gray-700 text-white rounded"
    placeholder="Per hour, Per day, etc."
  />
</td>

                    <td className="px-3 py-4 flex items-center space-x-2">
                      <input
                        type="file"
                        onChange={handleFileChange}
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                      <button
                        onClick={handleSaveNewService}
                        className="bg-blue-500 p-2 rounded-full text-white"
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

                {!isAddingService &&
                  currentServices.map((service) => (
                    <tr
                      key={service._id}
                      className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
                    >
                      <td className="px-3 py-4">
                        {editingServiceId === service._id ? (
                          <input
                            type="text"
                            value={editedService.name || service.name}
                            onChange={(e) =>
                              setEditedService({ ...editedService, name: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          service.name
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingServiceId === service._id ? (
                          <input
                            type="number"
                            value={editedService.price || service.price}
                            onChange={(e) =>
                              setEditedService({ ...editedService, price: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          service.price
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingServiceId === service._id ? (
                          <input
                            type="text"
                            value={editedService.description || service.description}
                            onChange={(e) =>
                              setEditedService({ ...editedService, description: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          service.description
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingServiceId === service._id ? (
                          <input
                            type="text"
                            value={editedService.pricePerTime || service.pricePerTime}
                            onChange={(e) =>
                              setEditedService({ ...editedService, pricePerTime: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          service.pricePerTime
                        )}
                      </td>
                      <td className="px-3 py-4">
                      {new Date(service.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-3 py-4">
                        {editingServiceId === service._id ? (
                          <input
                            type="text"
                            value={editedService.image || service.image}
                            onChange={(e) =>
                              setEditedService({ ...editedService, image: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          <img
                            src={`http://localhost:5000/${service.image}`}
                            alt={service.name}
                            className="w-16 h-16 object-cover"
                          />
                        )}
                      </td>

                      <td className="px-3 py-4 flex items-center space-x-2">
                        {editingServiceId === service._id ? (
                          <>
                            <input
                              type="file"
                              onChange={handleFileChange}
                              className="p-2 bg-gray-700 text-white rounded"
                            />
                            <button
                              onClick={handleSaveEditedService}
                              className="bg-blue-500 p-2 rounded-full text-white"
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
                              onClick={() => handleEditService(service)}
                              className="bg-yellow-500 p-2 rounded-full text-white"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteService(service._id)}
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

            <div className="flex justify-between items-center mt-4">
              <button
                onClick={() => setCurrentPage(currentPage - 1)}
                disabled={currentPage === 1}
                className="bg-red-500 text-white p-2 rounded"
              >
                Previous
              </button>
              <span className="text-white">
                Page {currentPage} of {totalPages}
              </span>
              <button
                disabled={currentPage === totalPages}
                className="bg-blue-500 text-white p-2 rounded"
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

export default ServiceManagement;
