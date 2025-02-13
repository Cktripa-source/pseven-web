import React, { useState, useEffect } from 'react';
import { FaEdit, FaTrashAlt, FaSave, FaPlus } from 'react-icons/fa';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [isAddingProduct, setIsAddingProduct] = useState(false);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('https://api.psevenrwanda.com/api/products');
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

  const handleAddProduct = () => {
    setIsAddingProduct(true);
    setEditedProduct({
      name: '',
      description: '',
      price: '',
      category: '',
      stock: 0,
      colors: [],
      image: null,
    });
  };

  const handleSaveNewProduct = async () => {
    try {
      toast.dismiss();

      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('description', editedProduct.description);
      formData.append('price', editedProduct.price);
      formData.append('category', editedProduct.category);
      formData.append('stock', editedProduct.stock);
      formData.append('colors', JSON.stringify(editedProduct.colors)); // Convert array to JSON string
      if (editedProduct.image) {
        formData.append('image', editedProduct.image);
      }

      const response = await fetch('https://api.psevenrwanda.com/api/products', {
        method: 'POST',
        body: formData,
      });

      if (!response.ok) throw new Error('Failed to add new product');
      const newProduct = await response.json();

      setProducts((prevProducts) => [newProduct, ...prevProducts]);
      setIsAddingProduct(false);
      toast.success('Product added successfully!');
    } catch (err) {
      console.error('Error adding product:', err);
      toast.error('Error adding product!');
    }
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
      formData.append('description', editedProduct.description);
      formData.append('price', editedProduct.price);
      formData.append('category', editedProduct.category);
      formData.append('stock', editedProduct.stock);
      formData.append('colors', JSON.stringify(editedProduct.colors)); // Convert array to JSON string
      if (editedProduct.image) {
        formData.append('image', editedProduct.image);
      }

      const response = await fetch(
        `https://api.psevenrwanda.com/api/products/${editedProduct._id}`,
        {
          method: 'PUT',
          body: formData,
        }
      );

      if (!response.ok) throw new Error('Failed to update product');
      setProducts((prevProducts) =>
        prevProducts.map((product) =>
          product._id === editedProduct._id ? editedProduct : product
        )
      );
      setEditingProductId(null);
      toast.success('Product updated successfully!');
    } catch (err) {
      console.error('Error saving product:', err);
      toast.error('Error saving product!');
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      toast.dismiss();

      const response = await fetch(`https://api.psevenrwanda.com/api/products/${id}`, {
        method: 'DELETE',
      });

      if (!response.ok) throw new Error('Failed to delete product');

      setProducts(products.filter((product) => product._id !== id));
      toast.success('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error('Error deleting product!');
    }
  };

  const handleCancelAdd = () => {
    setIsAddingProduct(false);
    setEditedProduct({});
  };

  const handleCancelEdit = () => {
    setEditingProductId(null);
    setEditedProduct({});
  };

  const handleImageChange = (e) => {
    setEditedProduct({ ...editedProduct, image: e.target.files[0] });
  };

  const handleColorChange = (e, index) => {
    const newColors = [...editedProduct.colors];
    newColors[index] = e.target.value;
    setEditedProduct({ ...editedProduct, colors: newColors });
  };

  const addColorField = () => {
    setEditedProduct({ ...editedProduct, colors: [...editedProduct.colors, ''] });
  };

  const removeColorField = (index) => {
    const newColors = editedProduct.colors.filter((_, i) => i !== index);
    setEditedProduct({ ...editedProduct, colors: newColors });
  };

  return (
    <>
      <div className="p-8 space-y-8 bg-gray-900 min-h-screen">
      <div className="bg-gray-800 p-4 border-2 border-dashed rounded-lg shadow-md border-green-200 w-full">
          <div className="flex justify-between items-center mb-6">
            <button
              onClick={handleAddProduct}
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
                  <th className="px-3 py-2 text-xs font-semibold text-white">Product Name</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Description</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Price</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Category</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Stock</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Colors</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Image</th>
                  <th className="px-3 py-2 text-xs font-semibold text-white">Actions</th>
                </tr>
              </thead>
              <tbody>
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
                        value={editedProduct.stock || 0}
                        onChange={(e) =>
                          setEditedProduct({ ...editedProduct, stock: e.target.value })
                        }
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4">
                      {editedProduct.colors.map((color, index) => (
                        <div key={index} className="flex items-center mb-2">
                          <input
                            type="text"
                            value={color}
                            onChange={(e) => handleColorChange(e, index)}
                            className="p-2 bg-gray-700 text-white rounded mr-2"
                          />
                          <button
                            onClick={() => removeColorField(index)}
                            className="bg-red-500 p-2 rounded-full text-white"
                          >
                            <FaTrashAlt />
                          </button>
                        </div>
                      ))}
                      <button
                        onClick={addColorField}
                        className="bg-blue-500 p-2 rounded-full text-white"
                      >
                        <FaPlus />
                      </button>
                    </td>
                    <td className="px-3 py-4">
                      <input
                        type="file"
                        onChange={handleImageChange}
                        className="p-2 bg-gray-700 text-white rounded"
                      />
                    </td>
                    <td className="px-3 py-4 flex items-center space-x-2">
                      <button
                        onClick={handleSaveNewProduct}
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

                {!isAddingProduct &&
                  products.map((product) => (
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
                        {editingProductId === product._id ? (
                          <>
                            {editedProduct.colors.map((color, index) => (
                              <div key={index} className="flex items-center mb-2">
                                <input
                                  type="text"
                                  value={color}
                                  onChange={(e) => handleColorChange(e, index)}
                                  className="p-2 bg-gray-700 text-white rounded mr-2"
                                />
                                <button
                                  onClick={() => removeColorField(index)}
                                  className="bg-red-500 p-2 rounded-full text-white"
                                >
                                  <FaTrashAlt />
                                </button>
                              </div>
                            ))}
                            <button
                              onClick={addColorField}
                              className="bg-blue-500 p-2 rounded-full text-white"
                            >
                              <FaPlus />
                            </button>
                          </>
                        ) : (
                          product.colors.join(', ')
                        )}
                      </td>
                      <td className="px-3 py-4">
                        {editingProductId === product._id ? (
                          <>
                            <input
                              type="file"
                              onChange={handleImageChange}
                              className="p-2 bg-gray-700 text-white rounded"
                            />
                          </>
                        ) : product.image ? (
                          <img
                            src={`https://api.psevenrwanda.com/api/${product.image}`}
                            alt={product.name}
                            className="w-16 h-16 object-cover rounded"
                          />
                        ) : (
                          'No Image'
                        )}
                      </td>
                      <td className="px-3 py-4 flex items-center space-x-2">
                        {editingProductId === product._id ? (
                          <>
                            <button
                              onClick={handleSaveEditedProduct}
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
                              onClick={() => handleEditProduct(product)}
                              className="bg-blue-500 p-2 rounded-full text-white"
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
        </div>
      </div>
      <ToastContainer />
    </>
  );
};

export default ProductManagement;