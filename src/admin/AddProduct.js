import React, { useState, useEffect } from 'react';
import axios from 'axios';

const AddProduct = ({ onProductAdded, editingProduct, onEditComplete }) => {
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [image, setImage] = useState(null);
  const [category, setCategory] = useState('');
  const [stock, setStock] = useState('');
  const [message, setMessage] = useState('');

  // Pre-fill form fields if editing a product
  useEffect(() => {
    if (editingProduct) {
      setName(editingProduct.name);
      setDescription(editingProduct.description);
      setPrice(editingProduct.price);
      setCategory(editingProduct.category);
      setStock(editingProduct.stock);
      setMessage('');
    }
  }, [editingProduct]);

  const handleImageChange = (e) => {
    setImage(e.target.files[0]);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const formData = new FormData();
    formData.append('name', name);
    formData.append('description', description);
    formData.append('price', price);
    formData.append('category', category);
    formData.append('stock', stock);
    if (image) formData.append('image', image);

    try {
      if (editingProduct) {
        // Update existing product
        await axios.put(`https://pseven-api-test.onrender.com/api/products/${editingProduct._id}`, formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Product updated successfully!');
        onEditComplete(); // Notify parent of edit completion
      } else {
        // Add new product
        await axios.post('https://pseven-api-test.onrender.com/api/products', formData, {
          headers: { 'Content-Type': 'multipart/form-data' },
        });
        setMessage('Product added successfully!');
        if (onProductAdded) {
          onProductAdded(); // Notify parent of new product
        }
      }

      // Reset form fields
      setName('');
      setDescription('');
      setPrice('');
      setImage(null);
      setCategory('');
      setStock('');
    } catch (error) {
      setMessage('Error submitting product');
      console.error('Error submitting product:', error);
    }
  };

  return (
    <div className="p-4 bg-white dark:bg-gray-800 flex items-center justify-center">
      <div className="w-full max-w-4xl bg-white dark:bg-gray-700 p-4 rounded-lg shadow-xl border border-gray-400 dark:border-gray-600">
        <h2 className="text-3xl font-semibold text-black dark:text-white mb-6 text-center">
          {editingProduct ? 'Edit Product' : 'Add New Product'}
        </h2>

        {message && <div className="text-center text-green-500 mb-4">{message}</div>}

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="mb-4">
            <label htmlFor="name" className="block text-black dark:text-white font-medium mb-2">
              Product Name
            </label>
            <input
              type="text"
              id="name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:bg-gray-800 dark:text-white"
              placeholder="Enter product name"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="description" className="block text-black dark:text-white font-medium mb-2">
              Description
            </label>
            <textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:bg-gray-800 dark:text-white"
              placeholder="Enter product description"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="price" className="block text-black dark:text-white font-medium mb-2">
              Price
            </label>
            <input
              type="number"
              id="price"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:bg-gray-800 dark:text-white"
              placeholder="Enter product price"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="category" className="block text-black dark:text-white font-medium mb-2">
              Category
            </label>
            <input
              type="text"
              id="category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:bg-gray-800 dark:text-white"
              placeholder="Enter product category"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="stock" className="block text-black dark:text-white font-medium mb-2">
              Stock
            </label>
            <input
              type="number"
              id="stock"
              value={stock}
              onChange={(e) => setStock(e.target.value)}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:bg-gray-800 dark:text-white"
              placeholder="Enter stock quantity"
              required
            />
          </div>

          <div className="mb-4">
            <label htmlFor="image" className="block text-black dark:text-white font-medium mb-2">
              Product Image
            </label>
            <input
              type="file"
              id="image"
              onChange={handleImageChange}
              className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-black dark:bg-gray-800"
              required={!editingProduct} // Image is required only for new products
            />
          </div>

          <div className="col-span-2 text-center">
            <button
              type="submit"
              className="w-3/4 mb-4 px-6 py-3 text-white font-semibold rounded-md bg-black hover:bg-red-600 transition duration-300 dark:bg-black dark:hover:bg-red-600"
            >
              {editingProduct ? 'Update Product' : 'Add Product'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
