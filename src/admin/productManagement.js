import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaSearch, FaPlus } from 'react-icons/fa';
import Dashboard from './dashboard';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [searchQuery, setSearchQuery] = useState('');
  const [currentPage, setCurrentPage] = useState(1);
  const [productsPerPage] = useState(3);
  const [isAddingProduct, setIsAddingProduct] = useState(false); // Track adding a new product

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://pseven-api-test.onrender.com/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Error fetching products!');
    }
  };

  const handleSearchChange = (e) => {
    setSearchQuery(e.target.value);
    setCurrentPage(1); // Reset to the first page when search changes
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setEditedProduct({ ...product });
  };

  const handleSaveEditedProduct = async () => {
    try {
      toast.dismiss();

      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('price', editedProduct.price);
      formData.append('description', editedProduct.description);
      formData.append('category', editedProduct.category);
      formData.append('stock', editedProduct.stock);
      if (editedProduct.image) {
        formData.append('image', editedProduct.image);
      }

      const response = await fetch(
        `https://pseven-api-test.onrender.com/api/products/${editedProduct._id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Failed to update product');

      // Update the product in the list
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editedProduct._id ? editedProduct : product
        )
      );

      setEditingProductId(null); // Hide the editing form after save
      toast.success('Product updated successfully!');
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error('Error saving product!');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      toast.dismiss();

      const response = await fetch(
        `https://pseven-api-test.onrender.com/api/products/${id}`,
        {
          method: 'DELETE',
        }
      );

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(products.filter((product) => product._id !== id));
      toast.success('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Error deleting product!');
    }
  };

  const handleAddProduct = () => {
    setIsAddingProduct(true);
    setEditedProduct({}); // Clear any existing data when starting a new product
  };

  const handleSaveNewProduct = async () => {
    try {
      toast.dismiss();

      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('price', editedProduct.price);
      formData.append('description', editedProduct.description);
      formData.append('category', editedProduct.category);
      formData.append('stock', editedProduct.stock);
      if (editedProduct.image) {
        formData.append('image', editedProduct.image);
      }

      const response = await fetch('https://pseven-api-test.onrender.com/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add new product');

      const newProduct = await response.json(); // Get the added product

      // Add the new product to the start of the product list
      setProducts((prevProducts) => [newProduct, ...prevProducts]);

      setIsAddingProduct(false); // Hide the adding form after saving
      toast.success('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Error adding product!');
    }
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProduct({});
  };

  const handleCancelAdd = () => {
    setIsAddingProduct(false);
    setEditedProduct({});
  };

  // Filter products based on search query
  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      product.category.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Pagination logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
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
                placeholder="Search by name or category ........................"
              />
              <FaSearch className="text-white text-3xl p-1 border rounded-full" />
            </div>
            <button
              onClick={handleAddProduct}
              className="flex items-center bg-blue-500 text-white px-4 py-2 rounded-lg"
            >
              <FaPlus className="mr-2" /> Add New Product
            </button>
          </div>

          <h2 className="text-2xl font-semibold mb-6 text-white">Product Management</h2>

          <div className="overflow-x-auto shadow-md sm:rounded-lg">
            <table className="w-full text-sm text-left text-gray-400">
              <thead className="text-xs uppercase bg-gray-700 text-gray-400">
                <tr>
                  <th className="px-3 py-2 text-xs">Product Name</th>
                  <th className="px-3 py-2 text-xs">Price</th>
                  <th className="px-3 py-2 text-xs">Description</th>
                  <th className="px-3 py-2 text-xs">Category</th>
                  <th className="px-3 py-2 text-xs">Stock</th>
                  <th className="px-3 py-2 text-xs">Image</th>
                  <th className="px-3 py-2 text-xs">Actions</th>
                </tr>
              </thead>
              <tbody>
                {/* If adding a new product */}
                {isAddingProduct && (
                  <tr className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                    <td className="px-3 py-4">
                      <input
                        type="text"
                        value={editedProduct.name || ''}
                        onChange={(e) =>
                          setEditedProduct({ ...editedProduct, name: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <input
                        type="number"
                        value={editedProduct.price || ''}
                        onChange={(e) =>
                          setEditedProduct({ ...editedProduct, price: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <input
                        type="text"
                        value={editedProduct.description || ''}
                        onChange={(e) =>
                          setEditedProduct({ ...editedProduct, description: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <input
                        type="text"
                        value={editedProduct.category || ''}
                        onChange={(e) =>
                          setEditedProduct({ ...editedProduct, category: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <input
                        type="number"
                        value={editedProduct.stock || ''}
                        onChange={(e) =>
                          setEditedProduct({ ...editedProduct, stock: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4">
                      <input
                        type="file"
                        onChange={(e) =>
                          setEditedProduct({ ...editedProduct, image: e.target.files[0] })
                        }
                        className="p-1 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4 flex items-center space-x-2">
                      <button
                        onClick={handleSaveNewProduct}
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

                {/* If editing an existing product */}
                {!isAddingProduct &&
                  currentProducts.map((product) => (
                    <tr
                      key={product._id}
                      className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600"
                    >
                      <td className="px-3 py-4">
                        {editingProductId === product._id ? (
                          <input
                            type="text"
                            value={editedProduct.name || product.name}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, name: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          product.name
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingProductId === product._id ? (
                          <input
                            type="number"
                            value={editedProduct.price || product.price}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, price: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          `$${product.price}`
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingProductId === product._id ? (
                          <input
                            type="text"
                            value={editedProduct.description || product.description}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, description: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          product.description
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingProductId === product._id ? (
                          <input
                            type="text"
                            value={editedProduct.category || product.category}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, category: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          product.category
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingProductId === product._id ? (
                          <input
                            type="number"
                            value={editedProduct.stock || product.stock}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, stock: e.target.value })
                            }
                            className="p-2 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          product.stock
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingProductId === product._id && editedProduct.image ? (
                          <input
                            type="file"
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, image: e.target.files[0] })
                            }
                            className="p-1 bg-gray-700 text-white rounded"
                          />
                        ) : (
                          product.image && <img src={`https://pseven-api-test.onrender.com/${product.image}`} alt={product.name} className="w-16 h-16" />
                        )}
                      </td>
                      <td className="px-3 py-4 flex items-center space-x-2">
                        {editingProductId === product._id ? (
                          <>
                            <button
                              onClick={handleSaveEditedProduct}
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
                              onClick={() => handleEditProduct(product)}
                              className="bg-yellow-500 p-2 rounded-full text-white"
                            >
                              <FaEdit />
                            </button>
                            <button
                              onClick={() => handleDeleteProduct(product._id)}
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
          </div>

          {/* Pagination */}
          <div className="flex justify-between items-center mt-4">
            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              className="bg-red-500 text-white px-4 py-2 rounded"
            >
              Previous
            </button>
            <div className="text-white">
              Page {currentPage} of {totalPages}
            </div>
            <button
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
              className="bg-blue-500 text-white px-4 py-2 rounded"
            >
              Next
            </button>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProductManagement;
