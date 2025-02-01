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
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://pseven-api-test.onrender.com/api/products');
      if (!response.ok) throw new Error('Failed to fetch products');
      const data = await response.json();
      setProducts(data);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Error fetching products!');
    }
  };

  const handleDeleteProduct = async (productId) => {
    try {
      const response = await fetch(`https://pseven-api-test.onrender.com/api/products/${productId}`, {
        method: 'DELETE',
      });
      if (!response.ok) throw new Error('Failed to delete product');
      setProducts((prevProducts) => prevProducts.filter((product) => product._id !== productId));
      toast.success('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Error deleting product!');
    }
  };

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
                onChange={(e) => setSearchQuery(e.target.value)}
                className="p-2 bg-gray-700 text-white rounded w-full"
                placeholder="Search by name or category..."
              />
              <FaSearch className="text-white text-3xl p-1 border rounded-full" />
            </div>
            <button
              onClick={() => setIsAddingProduct(true)}
              className="flex items-center bg-green-500 text-white px-4 py-2 rounded-lg"
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
                {products.map((product) => (
                  <tr key={product._id} className="border-b bg-gray-800 border-gray-700 hover:bg-gray-600">
                    <td className="px-3 py-4">{product.name}</td>
                    <td className="px-3 py-4">${product.price}</td>
                    <td className="px-3 py-4">{product.description}</td>
                    <td className="px-3 py-4">{product.category}</td>
                    <td className="px-3 py-4">{product.stock}</td>
                    <td className="px-3 py-4">
                      {product.image && (
                        <img src={`https://pseven-api-test.onrender.com/${product.image}`} alt={product.name} className="w-16 h-16" />
                      )}
                    </td>
                    <td className="px-3 py-4 flex items-center space-x-2">
                      <button
                        onClick={() => setEditingProductId(product._id)}
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
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProductManagement;
