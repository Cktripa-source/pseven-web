import React, { useState, useEffect } from 'react';
import Dashboard from './dashboard';
import AddProduct from './AddProduct';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [isFormVisible, setIsFormVisible] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch products from the database
  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  // Show form for adding a new product
  const handleAddProductClick = () => {
    setEditingProduct(null); // Clear editing state
    setIsFormVisible(true);
  };

  // Hide form
  const handleCancel = () => {
    setEditingProduct(null); // Clear editing state
    setIsFormVisible(false);
  };

  // Handle Delete Product
  const handleDeleteProduct = async (id) => {
    try {
      const response = await fetch(`http://localhost:5000/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) {
        throw new Error('Failed to delete product');
      }

      setProducts(products.filter((product) => product._id !== id));
      alert('Product deleted successfully');
    } catch (err) {
      console.error(err.message);
      alert('Error deleting product');
    }
  };

  // Handle Edit Product
  const handleEditProduct = (id) => {
    const productToEdit = products.find((product) => product._id === id);
    if (productToEdit) {
      setEditingProduct(productToEdit);
      setIsFormVisible(true); // Show the form with product details pre-filled
    }
  };

  // Callback to refresh products after a new product is added or updated
  const handleProductChange = () => {
    fetchProducts(); // Refresh the product list
    handleCancel(); // Hide the form
  };
  

  return (
    <>
      <Dashboard />
      <div className="p-20 min-h-screen sm:ml-64   bg-gray-900">
        <div className="   bg-gray-800 p-4 border-2  border-dashed rounded-lg shadow-md   border-gray-700">
          <h2 className="text-2xl font-semibold mb-6   text-white">Product Management</h2>

          {/* Buttons Section */}
          <div className="flex justify-between items-center mb-6 gap-4">
            {!isFormVisible && (
              <button
                onClick={handleAddProductClick}
                className="px-6 py-3 bg-black justify-end text-white rounded-lg hover:bg-gray-950 transition duration-300"
              >
                Add New Product
              </button>
            )}
            {isFormVisible && (
              <button
                onClick={handleCancel}
                className="px-6 py-3 bg-red-500 text-white rounded-lg hover:bg-red-600 transition duration-300"
              >
                Cancel
              </button>
            )}
          </div>

          {/* Add/Edit Product Form */}
        {/* Add/Edit Product Form */}
{isFormVisible && (
  <div className="mb-6">
    <AddProduct
      onProductAdded={handleProductChange}
      editingProduct={editingProduct}
      onEditComplete={handleProductChange}
    />
  </div>
)}


          {/* Product Table */}
          {loading ? (
            <p className="text-center    text-gray-300">Loading products...</p>
          ) : error ? (
            <p className="text-center   text-red-400">Error: {error}</p>
          ) : (
            <div className="overflow-x-auto shadow-md sm:rounded-lg mt-8">
              <table className="w-full text-sm text-left    text-gray-400">
                <thead className="text-xs  uppercase   bg-gray-700   text-gray-400">
                  <tr>
                    <th className="px-6 py-3">Product Image</th>
                    <th className="px-6 py-3">Product Name</th>
                    <th className="px-6 py-3">Price</th>
                    <th className="px-6 py-3">Description</th>
                    <th className="px-6 py-3">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {products.map((product) => (
                    <tr
                      key={product._id}
                      className="e border-b   bg-gray-800   border-gray-700   hover:bg-gray-600"
                    >
                      <td className="px-6 py-4">
                        <img
                          src={`http://localhost:5000/${product.image}`}
                          alt={product.name}
                          className="w-16 h-16 object-cover rounded-lg"
                        />
                      </td>
                      <td className="px-6 py-4   text-white">{product.name}</td>
                      <td className="px-6 py-4   text-white">${product.price}</td>
                      <td className="px-6 py-4    text-white">{product.description}</td>
                      <td className="px-6 py-4">
                        <button
                          onClick={() => handleEditProduct(product._id)}
                          className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 transition duration-300 mr-4"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteProduct(product._id)}
                          className=" text-red-400   hover:text-red-300"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default ProductManagement;
