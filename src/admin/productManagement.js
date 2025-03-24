import React, { useState, useEffect } from 'react';
import { toast, ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import {
  Plus,
  Save,
  Pencil,
  Trash2,
  X,
  Image as ImageIcon,
  CirclePlus,
  ChevronDown,
  ChevronUp,
  Filter,
  Search,
  RefreshCw,
  AlertTriangle,
  CheckCircle,
  Loader
} from 'lucide-react';

const ProductManagement = () => {
  const [products, setProducts] = useState([]);
  const [editingProductId, setEditingProductId] = useState(null);
  const [editedProduct, setEditedProduct] = useState({});
  const [isAddingProduct, setIsAddingProduct] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [expandedProduct, setExpandedProduct] = useState(null);
  const [categoryFilter, setCategoryFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: 'name', direction: 'asc' });
  const [filterMenuOpen, setFilterMenuOpen] = useState(false);
  const [deleteConfirmation, setDeleteConfirmation] = useState(null);
  const [categories, setCategories] = useState([]);
  // New loading states for different actions
  const [isAddingLoading, setIsAddingLoading] = useState(false);
  const [isEditingLoading, setIsEditingLoading] = useState(false);
  const [isDeletingLoading, setIsDeletingLoading] = useState(false);
  const [actionLoadingId, setActionLoadingId] = useState(null);

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    setIsLoading(true);
    try {
      const response = await fetch('https://api.psevenrwanda.com/api/products');
      if (!response.ok) {
        throw new Error('Failed to fetch products');
      }
      const data = await response.json();
      setProducts(data);
      
      // Extract unique categories for filtering
      const uniqueCategories = [...new Set(data.map(product => product.category))];
      setCategories(uniqueCategories);
    } catch (err) {
      console.error('Error fetching products:', err);
      toast.error('Error fetching products!');
    } finally {
      setIsLoading(false);
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
      setIsAddingLoading(true);
      
      // Validation
      if (!editedProduct.name || !editedProduct.price || !editedProduct.category) {
        toast.error('Name, price and category are required!');
        setIsAddingLoading(false);
        return;
      }

      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('description', editedProduct.description);
      formData.append('price', editedProduct.price);
      formData.append('category', editedProduct.category);
      formData.append('stock', editedProduct.stock);
      formData.append('colors', JSON.stringify(editedProduct.colors));
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
    } finally {
      setIsAddingLoading(false);
    }
  };

  const handleEditProduct = (product) => {
    setEditingProductId(product._id);
    setEditedProduct({ ...product });
  };

  const handleSaveEditedProduct = async () => {
    try {
      toast.dismiss();
      setIsEditingLoading(true);
      setActionLoadingId(editedProduct._id);
      
      // Validation
      if (!editedProduct.name || !editedProduct.price || !editedProduct.category) {
        toast.error('Name, price and category are required!');
        setIsEditingLoading(false);
        setActionLoadingId(null);
        return;
      }

      const formData = new FormData();
      formData.append('name', editedProduct.name);
      formData.append('description', editedProduct.description);
      formData.append('price', editedProduct.price);
      formData.append('category', editedProduct.category);
      formData.append('stock', editedProduct.stock);
      formData.append('colors', JSON.stringify(editedProduct.colors));
      if (editedProduct.image && editedProduct.image instanceof File) {
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
    } finally {
      setIsEditingLoading(false);
      setActionLoadingId(null);
    }
  };

  const handleDeleteProduct = async (id) => {
    try {
      toast.dismiss();
      setIsDeletingLoading(true);
      setActionLoadingId(id);
  
      const response = await fetch(`https://api.psevenrwanda.com/api/products/${id}`, {
        method: 'DELETE',
      });
  
      // Try to parse the response as JSON
      let errorMessage = 'Failed to delete product';
      try {
        const data = await response.json();
        if (data && data.message) {
          errorMessage = data.message;
        }
      } catch (jsonError) {
        // If response is not JSON, use status text
        errorMessage = response.statusText || errorMessage;
      }
  
      if (!response.ok) {
        throw new Error(errorMessage);
      }
  
      // Only update UI after confirmed successful deletion
      setProducts(prevProducts => prevProducts.filter(product => product._id !== id));
      setDeleteConfirmation(null);
      setExpandedProduct(null);
      toast.success('Product deleted successfully!');
    } catch (err) {
      console.error('Error deleting product:', err);
      toast.error(`Error deleting product: ${err.message}`);
      
      // Refresh product list to ensure UI is in sync with the database
      fetchProducts();
    } finally {
      setIsDeletingLoading(false);
      setActionLoadingId(null);
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

  const handleSort = (key) => {
    let direction = 'asc';
    if (sortConfig.key === key && sortConfig.direction === 'asc') {
      direction = 'desc';
    }
    setSortConfig({ key, direction });
  };

  const getSortedProducts = () => {
    const filtered = products.filter(product => {
      const matchesCategory = categoryFilter === 'all' || product.category === categoryFilter;
      const matchesSearch = 
        product.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.description?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        product.category?.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCategory && matchesSearch;
    });

    return [...filtered].sort((a, b) => {
      if (sortConfig.key === 'price') {
        return sortConfig.direction === 'asc' 
          ? parseFloat(a.price) - parseFloat(b.price)
          : parseFloat(b.price) - parseFloat(a.price);
      }

      if (sortConfig.key === 'stock') {
        return sortConfig.direction === 'asc' 
          ? parseInt(a.stock) - parseInt(b.stock)
          : parseInt(b.stock) - parseInt(a.stock);
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

  const getStockStatusClass = (stock) => {
    const stockNum = parseInt(stock);
    if (stockNum > 10) return 'bg-green-100 text-green-800';
    if (stockNum > 0) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStockStatusText = (stock) => {
    const stockNum = parseInt(stock);
    if (stockNum > 10) return 'In Stock';
    if (stockNum > 0) return 'Low Stock';
    return 'Out of Stock';
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <RefreshCw className="animate-spin h-8 w-8 text-gray-500" />
        <span className="ml-2 text-gray-600">Loading products...</span>
      </div>
    );
  }

  const sortedProducts = getSortedProducts();

  return (
    <>
      {deleteConfirmation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-md p-6">
            <div className="flex items-center text-red-600 mb-4">
              <AlertTriangle className="h-6 w-6 mr-2" />
              <h3 className="text-lg font-medium">Confirm Deletion</h3>
            </div>
            <p className="mb-6">
              Are you sure you want to delete <span className="font-semibold">{deleteConfirmation.name}</span>? 
              This action cannot be undone.
            </p>
            <div className="flex justify-end gap-3">
              <button 
                onClick={() => setDeleteConfirmation(null)}
                className="px-4 py-2 border rounded-md hover:bg-gray-50"
                disabled={isDeletingLoading}
              >
                Cancel
              </button>
              <button 
                onClick={() => handleDeleteProduct(deleteConfirmation._id)}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 flex items-center justify-center min-w-24"
                disabled={isDeletingLoading}
              >
                {isDeletingLoading && actionLoadingId === deleteConfirmation._id ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Deleting...
                  </>
                ) : (
                  'Delete'
                )}
              </button>
            </div>
          </div>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h1 className="text-2xl font-semibold text-gray-800">Product Management</h1>
            <p className="text-gray-500 mt-1">Manage your product inventory</p>
          </div>
          
          <div className="flex space-x-2">
            <div className="relative">
              <button 
                className="flex items-center px-4 py-2 border rounded-md hover:bg-gray-50"
                onClick={() => setFilterMenuOpen(!filterMenuOpen)}
              >
                <Filter className="h-4 w-4 mr-2" />
                {categoryFilter === 'all' ? 'All Categories' : categoryFilter}
                <ChevronDown className="h-4 w-4 ml-2" />
              </button>
              
              {filterMenuOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white rounded-md shadow-lg z-10 border">
                  <button
                    className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                    onClick={() => {
                      setCategoryFilter('all');
                      setFilterMenuOpen(false);
                    }}
                  >
                    {categoryFilter === 'all' && <CheckCircle className="h-4 w-4 mr-2" />}
                    All Categories
                  </button>
                  
                  {categories.map(category => (
                    <button
                      key={category}
                      className="block w-full text-left px-4 py-2 hover:bg-gray-100 flex items-center"
                      onClick={() => {
                        setCategoryFilter(category);
                        setFilterMenuOpen(false);
                      }}
                    >
                      {categoryFilter === category && <CheckCircle className="h-4 w-4 mr-2" />}
                      {category}
                    </button>
                  ))}
                </div>
              )}
            </div>
            
            <div className="relative">
              <Search className="h-4 w-4 absolute left-3 top-3 text-gray-400" />
              <input
                type="text"
                placeholder="Search products..."
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
              onClick={fetchProducts}
              className="p-2 border rounded-md hover:bg-gray-50 relative"
              title="Refresh"
              disabled={isLoading}
            >
              <RefreshCw className={`h-5 w-5 ${isLoading ? 'animate-spin' : ''}`} />
            </button>
            
            <button
              onClick={handleAddProduct}
              className="flex items-center px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-md transition-colors shadow-sm"
              disabled={isAddingProduct}
            >
              <Plus className="mr-2 w-4 h-4" /> Add Product
            </button>
          </div>
        </div>
        
        {isAddingProduct && (
          <div className="mb-6 p-4 border rounded-lg bg-blue-50">
            <div className="flex justify-between items-center mb-4">
              <h2 className="text-lg font-medium text-blue-800">Add New Product</h2>
              <button 
                onClick={handleCancelAdd}
                className="text-gray-500 hover:text-gray-700"
                disabled={isAddingLoading}
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name *</label>
                <input
                  type="text"
                  value={editedProduct.name || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, name: e.target.value })}
                  placeholder="Product name"
                  className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isAddingLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                <input
                  type="text"
                  value={editedProduct.category || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, category: e.target.value })}
                  placeholder="Category"
                  className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isAddingLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Price *</label>
                <input
                  type="number"
                  value={editedProduct.price || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, price: e.target.value })}
                  placeholder="Price"
                  className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isAddingLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Stock</label>
                <input
                  type="number"
                  value={editedProduct.stock || 0}
                  onChange={(e) => setEditedProduct({ ...editedProduct, stock: e.target.value })}
                  className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isAddingLoading}
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Image</label>
                <div className="flex items-center">
                  <label className={`flex items-center cursor-pointer p-2 border border-gray-300 rounded bg-white text-gray-600 hover:bg-gray-50 ${isAddingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}>
                    <ImageIcon className="w-5 h-5 mr-2" />
                    <span>Upload</span>
                    <input
                      type="file"
                      onChange={handleImageChange}
                      className="hidden"
                      disabled={isAddingLoading}
                    />
                  </label>
                  {editedProduct.image && (
                    <span className="ml-2 text-sm text-gray-500 truncate">
                      {editedProduct.image.name}
                    </span>
                  )}
                </div>
              </div>
              
              <div className="md:col-span-2">
                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                <textarea
                  value={editedProduct.description || ''}
                  onChange={(e) => setEditedProduct({ ...editedProduct, description: e.target.value })}
                  placeholder="Product description"
                  className="p-2 border border-gray-300 rounded w-full h-20 focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={isAddingLoading}
                />
              </div>
              
              <div className="md:col-span-3">
                <label className="block text-sm font-medium text-gray-700 mb-1">Colors</label>
                <div className="space-y-2">
                  {editedProduct.colors.map((color, index) => (
                    <div key={index} className="flex items-center">
                      <input
                        type="text"
                        value={color}
                        onChange={(e) => handleColorChange(e, index)}
                        placeholder="Color name"
                        className="p-2 border border-gray-300 rounded flex-1 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        disabled={isAddingLoading}
                      />
                      <button
                        onClick={() => removeColorField(index)}
                        className="ml-2 text-red-500 hover:text-red-700"
                        title="Remove color"
                        disabled={isAddingLoading}
                      >
                        <X className="w-5 h-5" />
                      </button>
                    </div>
                  ))}
                  <button
                    onClick={addColorField}
                    className={`flex items-center text-blue-600 hover:text-blue-800 ${isAddingLoading ? 'opacity-50 cursor-not-allowed' : ''}`}
                    title="Add color"
                    disabled={isAddingLoading}
                  >
                    <CirclePlus className="w-5 h-5 mr-1" /> Add Color
                  </button>
                </div>
              </div>
            </div>
            
            <div className="mt-6 flex justify-end">
              <button
                onClick={handleCancelAdd}
                className="px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 mr-2"
                disabled={isAddingLoading}
              >
                Cancel
              </button>
              <button
                onClick={handleSaveNewProduct}
                className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 flex items-center justify-center min-w-32"
                disabled={isAddingLoading}
              >
                {isAddingLoading ? (
                  <>
                    <Loader className="animate-spin h-4 w-4 mr-2" />
                    Saving...
                  </>
                ) : (
                  <>
                    <Save className="w-4 h-4 mr-2" /> Save Product
                  </>
                )}
              </button>
            </div>
          </div>
        )}

        {sortedProducts.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            {searchTerm || categoryFilter !== 'all' ? 
              'No products match your search criteria' : 
              'No products have been added yet'}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="min-w-full bg-white">
              <thead className="bg-gray-50">
                <tr>
                  <th className="py-3 px-4 text-left">
                    <button 
                      className="font-medium text-sm text-gray-500 flex items-center"
                      onClick={() => handleSort('name')}
                    >
                      Product
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
                      onClick={() => handleSort('category')}
                    >
                      Category
                      {sortConfig.key === 'category' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <button 
                      className="font-medium text-sm text-gray-500 flex items-center"
                      onClick={() => handleSort('price')}
                    >
                      Price
                      {sortConfig.key === 'price' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left">
                    <button 
                      className="font-medium text-sm text-gray-500 flex items-center"
                      onClick={() => handleSort('stock')}
                    >
                      Stock
                      {sortConfig.key === 'stock' && (
                        sortConfig.direction === 'asc' ? 
                          <ChevronUp className="h-4 w-4 ml-1" /> : 
                          <ChevronDown className="h-4 w-4 ml-1" />
                      )}
                    </button>
                  </th>
                  <th className="py-3 px-4 text-left">Image</th>
                  <th className="py-3 px-4 text-left">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y">
                {sortedProducts.map(product => (
                  <React.Fragment key={product._id}>
                    <tr className="hover:bg-gray-50">
                      <td className="py-3 px-4">
                        {editingProductId === product._id ? (
                          <input
                            type="text"
                            value={editedProduct.name || product.name}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, name: e.target.value })
                            }
                            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isEditingLoading && actionLoadingId === product._id}
                          />
                        ) : (
                          <>
                            <div className="font-medium text-gray-800">{product.name}</div>
                            <div className="text-sm text-gray-500 max-w-xs truncate">{product.description}</div>
                          </>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingProductId === product._id ? (
                          <input
                            type="text"
                            value={editedProduct.category || product.category}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, category: e.target.value })
                            }
                            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isEditingLoading && actionLoadingId === product._id}
                          />
                        ) : (
                          <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                            {product.category}
                          </span>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingProductId === product._id ? (
                          <input
                            type="number"
                            value={editedProduct.price || product.price}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, price: e.target.value })
                            }
                            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isEditingLoading && actionLoadingId === product._id}
                          />
                        ) : (
                          <div className="font-medium text-gray-800">${product.price}</div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingProductId === product._id ? (
                          <input
                            type="number"
                            value={editedProduct.stock || product.stock}
                            onChange={(e) =>
                              setEditedProduct({ ...editedProduct, stock: e.target.value })
                            }
                            className="p-2 border border-gray-300 rounded w-full focus:outline-none focus:ring-2 focus:ring-blue-500"
                            disabled={isEditingLoading && actionLoadingId === product._id}
                          />
                        ) : (
                          <div className="flex items-center">
                            <span className={`px-2 py-1 rounded-full text-xs ${getStockStatusClass(product.stock)}`}>
                              {getStockStatusText(product.stock)}
                            </span>
                            <span className="ml-2 text-gray-600">{product.stock}</span>
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        {editingProductId === product._id ? (
                          <div className="flex items-center">
                            <label className={`flex items-center cursor-pointer p-2 border border-gray-300 rounded bg-gray-50 text-gray-600 hover:bg-gray-100 ${(isEditingLoading && actionLoadingId === product._id) ? 'opacity-50 cursor-not-allowed' : ''}`}>
                              <ImageIcon className="w-5 h-5 mr-2" />
                              <span>Upload</span>
                              <input
                                type="file"
                                onChange={handleImageChange}
                                className="hidden"
                                disabled={isEditingLoading && actionLoadingId === product._id}
                              />
                            </label>
                          </div>
                        ) : product.image ? (
                          <img
                            src={product.image}                            alt={product.name}
                            className="w-12 h-12 object-cover rounded-lg border border-gray-200"
                          />
                        ) : (
                          <div className="flex items-center justify-center w-12 h-12 bg-gray-100 rounded-lg border border-gray-200">
                            <ImageIcon className="w-6 h-6 text-gray-400" />
                          </div>
                        )}
                      </td>
                      <td className="py-3 px-4">
                        <div className="flex space-x-2">
                          {editingProductId === product._id ? (
                            <>
                              <button
                                onClick={handleSaveEditedProduct}
                                className="p-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition-colors"
                                title="Save changes"
                                disabled={isEditingLoading && actionLoadingId === product._id}
                              >
                                <Save className="w-5 h-5" />
                              </button>
                              <button
                                onClick={handleCancelEdit}
                                className="p-2 bg-gray-500 text-white rounded-md hover:bg-gray-600 transition-colors"
                                title="Cancel"
                                disabled={isEditingLoading && actionLoadingId === product._id}
                              >
                                <X className="w-5 h-5" />
                              </button>
                            </>
                          ) : (
                            <>
                              <button
                                onClick={() => setExpandedProduct(expandedProduct === product._id ? null : product._id)}
                                className="p-1 text-gray-500 hover:text-gray-700"
                                title={expandedProduct === product._id ? "Hide details" : "Show details"}
                              >
                                {expandedProduct === product._id ? 
                                  <ChevronUp className="h-5 w-5" /> : 
                                  <ChevronDown className="h-5 w-5" />}
                              </button>
                              <button
                                onClick={() => handleEditProduct(product)}
                                className="p-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 transition-colors"
                                title="Edit product"
                              >
                                <Pencil className="w-5 h-5" />
                              </button>
                              <button
                                onClick={() => setDeleteConfirmation(product)}
                                className="p-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition-colors"
                                title="Delete product"
                              >
                                <Trash2 className="w-5 h-5" />
                              </button>
                            </>
                          )}
                        </div>
                      </td>
                    </tr>

                    {/* Detailed view of the product */}
                    {expandedProduct === product._id && (
                      <tr>
                        <td colSpan="6" className="p-4 bg-gray-50">
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <h3 className="font-medium mb-2">Product Details</h3>
                              <p><strong>Name:</strong> {product.name}</p>
                              <p><strong>Description:</strong> {product.description}</p>
                              <p><strong>Category:</strong> {product.category}</p>
                              <p><strong>Price:</strong> ${product.price}</p>
                              <p><strong>Stock:</strong> {product.stock}</p>
                            </div>
                            <div>
                              <h3 className="font-medium mb-2">Color Variants</h3>
                              {product.colors.map((color, index) => (
                                <span key={index} className={`inline-block mr-2 px-3 py-1 text-xs font-medium rounded ${getStockStatusClass(color)}`}>
                                  {color}
                                </span>
                              ))}
                            </div>
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

      <ToastContainer />
    </>
  );
};

export default ProductManagement;