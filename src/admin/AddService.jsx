import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddService = ({ onServiceAdded, editingService, onEditComplete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [pricePerTime, setPricePerTime] = useState('');
  const [image, setImage] = useState(null);
  const [message, setMessage] = useState('');

  useEffect(() => {
    if (editingService) {
      setName(editingService.name);
      setDescription(editingService.description);
      setPrice(editingService.price);
      setPricePerTime(editingService.pricePerTime);
      setMessage('');
    }
  }, [editingService]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('pricePerTime', pricePerTime);
    if (image) formData.append('image', image);

    try {
      if (editingService) {
        await axios.put(`http://localhost:5000/api/services/${editingService._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Service updated successfully!');
        onEditComplete();
      } else {
        await axios.post('http://localhost:5000/api/services', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Service added successfully!');
        if (onServiceAdded) onServiceAdded();
      }

      setName('');
      setDescription('');
      setPrice('');
      setPricePerTime('');
      setImage(null);
    } catch (error) {
      setMessage('Error submitting service');
      console.error('Error submitting service:', error.response?.data || error.message);
    }
  };

  return (
    <div className="p-4 bg-gray-800 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-gray-700 p-4 rounded-lg shadow-xl border border-gray-600">
        <h2 className="text-3xl font-semibold text-white mb-6 text-center">
          {editingService ? 'Edit Service' : 'Add New Service'}
        </h2>

        {message && <div className="text-center text-green-500 mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-white font-medium mb-2">
              Service Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-black bg-gray-800 text-white"
              placeholder="Enter service name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block  text-white font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-black bg-gray-800 text-white"
              placeholder="Enter service description"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block  text-white font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-black bg-gray-800 text-white"
              placeholder="Enter service price"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="pricePerTime" className="block  text-white font-medium mb-2">
              Price Per Time
            </label>
            <input
              type="text"
              id="pricePerTime"
              value={pricePerTime}
              onChange={(e) => setPricePerTime(e.target.value)}
              className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-black bg-gray-800 text-white"
              placeholder="e.g., per hour, per day"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block  text-white font-medium mb-2">
              Service Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-600 rounded-md focus:ring-2 focus:ring-black bg-gray-800"
              required={!editingService} // Image is required only for new services
            />
          </div>

          <div className="col-span-2 text-center">
            <button
              type="submit"
              className="w-3/4 mb-4 px-6 py-3 text-white font-semibold rounded-md transition duration-300 bg-black hover:bg-red-600"
            >
              {editingService ? 'Update Service' : 'Add Service'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddService;
