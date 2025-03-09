import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Heart, Plus, Minus, X, MenuIcon, ChevronLeft, ChevronRight, ShoppingCart, Filter, Search, Star, StarHalf, Eye, BookmarkPlus } from "lucide-react";
import Navbar from "./nav";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

const API_URL = "https://api.psevenrwanda.com/api";

function ShoppingSection() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [favoriteProducts, setFavoriteProducts] = useState([]);
  const [sortOption, setSortOption] = useState("default");
  const productsPerPage = 6;

  const { cart, setCart, removeFromCart, getCartCount } = useCart();

  const addToCart = (product) => {
    const quantity = quantities[product._id] || 1;
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const existingProductIndex = newCart.findIndex(
        (item) => item._id === product._id
      );

      if (existingProductIndex !== -1) {
        newCart[existingProductIndex].quantity += quantity;
      } else {
        newCart.push({ ...product, quantity });
      }

      // Open cart when adding item
      setIsCartOpen(true);
      return newCart;
    });
  };

  const removeFromCartHandler = (product) => {
    removeFromCart(product._id);
  };

  const updateCartQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
      return;
    }
    
    setCart(prevCart => 
      prevCart.map(item => 
        item._id === productId ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const toggleFavorite = (productId) => {
    setFavoriteProducts(prev => 
      prev.includes(productId) 
        ? prev.filter(id => id !== productId)
        : [...prev, productId]
    );
  };

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(["All", ...data]);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true);
      try {
        const categoryQuery = selectedCategory && selectedCategory !== "All" 
          ? `?category=${selectedCategory}` 
          : "";
        const res = await fetch(`${API_URL}/products${categoryQuery}`);
        const data = await res.json();
        setProducts(data);
        setFilteredProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Search and filter logic
  useEffect(() => {
    // Apply search filter
    let results = products;
    if (searchQuery) {
      results = products.filter(product => 
        product.name.toLowerCase().includes(searchQuery.toLowerCase()) || 
        product.description.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }
    
    // Apply sorting
    if (sortOption === "price-low-high") {
      results = [...results].sort((a, b) => a.price - b.price);
    } else if (sortOption === "price-high-low") {
      results = [...results].sort((a, b) => b.price - a.price);
    } else if (sortOption === "name-a-z") {
      results = [...results].sort((a, b) => a.name.localeCompare(b.name));
    } else if (sortOption === "name-z-a") {
      results = [...results].sort((a, b) => b.name.localeCompare(a.name));
    }
    
    setFilteredProducts(results);
    setCurrentPage(1); // Reset to first page when filtering
  }, [searchQuery, products, sortOption]);

  // Pagination Logic
  const totalPages = Math.ceil(filteredProducts.length / productsPerPage);
  const currentProducts = filteredProducts.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleImageError = (e) => {
    e.target.src = "";
  };

  const calculateCartTotal = () => {
    return cart.reduce((total, item) => total + (item.price * item.quantity), 0);
  };

  // Generate random ratings for demo purposes
  const getRandomRating = (productId) => {
    // Use productId as seed for consistent ratings
    const seed = productId.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    return (3.5 + (seed % 15) / 10).toFixed(1); // Rating between 3.5 and 5.0
  };

  return (
    <div className="flex min-h-screen mb-32 relative">
      <Navbar cartCount={getCartCount()} onCartClick={() => setIsCartOpen(true)} />

      {/* Main content - Container with max width */}
      <div className="flex-1 flex justify-center px-4 pt-6">
        <div className="w-full max-w-6xl">
          {/* Categories chips above search bar */}
          <div className="mb-6 overflow-x-auto scrollbar-hide">
            <div className="flex space-x-2 pb-2">
              {categories.map((category) => (
                <motion.button
                  key={category}
                  whileHover={{ y: -2 }}
                  whileTap={{ scale: 0.95 }}
                  className={`px-4 py-2 rounded-full text-sm font-medium whitespace-nowrap transition-all ${
                    selectedCategory === category 
                      ? "bg-green-600 text-white shadow-md" 
                      : "bg-white text-gray-700 border border-gray-200 hover:border-green-400 hover:shadow-sm"
                  }`}
                  onClick={() => {
                    setSelectedCategory(category);
                    setCurrentPage(1);
                  }}
                >
                  {category}
                </motion.button>
              ))}
            </div>
          </div>

          {/* Search and filter bar - Improved styling */}
          <div className="flex flex-col md:flex-row items-center justify-between mb-8 gap-4">
            <div className="relative w-full md:w-2/3">
              <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                <Search size={18} className="text-gray-400" />
              </div>
              <input
                type="text"
                className="block w-full pl-12 pr-4 py-3 border-0 rounded-xl bg-white shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
            <div className="flex items-center gap-4 w-full md:w-auto">
              <select 
                className="flex-1 md:flex-none bg-white border-0 rounded-xl py-3 px-4 shadow-sm focus:ring-2 focus:ring-green-500 focus:border-transparent"
                value={sortOption}
                onChange={(e) => setSortOption(e.target.value)}
              >
                <option value="default">Sort by: Default</option>
                <option value="price-low-high">Price: Low to High</option>
                <option value="price-high-low">Price: High to Low</option>
                <option value="name-a-z">Name: A to Z</option>
                <option value="name-z-a">Name: Z to A</option>
              </select>
              <motion.button 
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-green-600 text-white p-3 rounded-xl flex items-center gap-2 hover:bg-green-700 shadow-sm"
                onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              >
                <Filter size={18} />
                <span className="hidden md:inline">Categories</span>
              </motion.button>
            </div>
          </div>

          {/* Selected category indicator */}
          {selectedCategory && selectedCategory !== "All" && (
            <div className="mb-6">
              <div className="inline-flex items-center bg-green-100 text-green-800 rounded-full px-4 py-1">
                <span className="font-medium">{selectedCategory}</span>
                <button 
                  onClick={() => setSelectedCategory("All")}
                  className="ml-2 text-green-600 hover:text-green-800"
                >
                  <X size={16} />
                </button>
              </div>
            </div>
          )}

          {isLoading ? (
            <div className="flex justify-center items-center py-16">
              <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
            </div>
          ) : filteredProducts.length === 0 ? (
            <div className="text-center py-16 bg-white rounded-2xl shadow-sm">
              <div className="text-5xl mb-4">🔍</div>
              <h2 className="text-2xl font-bold text-gray-800 mb-2">No products found</h2>
              <p className="text-gray-600">Try changing your search or filter criteria</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {currentProducts.map((product) => (
                <motion.div 
                  key={product._id} 
                  layout
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: 20 }}
                  transition={{ duration: 0.3 }}
                  className="group bg-white rounded-xl shadow-sm hover:shadow-lg transition-all duration-300 overflow-hidden border-0"
                >
                  <div className="relative">
                    <Link to={`/product/${product._id}`}>
                      <div className="relative w-full h-52 overflow-hidden">
                        <img 
                          src={`https://api.psevenrwanda.com/api/${product.image}`} 
                          alt={product.name} 
                          className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                          onError={handleImageError}
                        />
                        <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                      </div>
                    </Link>
                    
                    {/* Product quick actions */}
                    <div className="absolute top-3 right-3 flex flex-col gap-2">
                      <motion.button 
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className={`p-2 rounded-full shadow-md ${
                          favoriteProducts.includes(product._id) 
                            ? "bg-red-500 text-white" 
                            : "bg-white text-gray-700 hover:bg-gray-100"
                        }`}
                        onClick={() => toggleFavorite(product._id)}
                      >
                        <Heart size={16} fill={favoriteProducts.includes(product._id) ? "white" : "none"} />
                      </motion.button>
                      <Link to={`/product/${product._id}`}>
                        <motion.button 
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full bg-white text-gray-700 shadow-md hover:bg-gray-100"
                        >
                          <Eye size={16} />
                        </motion.button>
                      </Link>
                    </div>
                    
                    {/* Category tag */}
                    {product.category && (
                      <div className="absolute top-3 left-3">
                        <span className="bg-black/70 text-white text-xs px-3 py-1 rounded-full backdrop-blur-sm">
                          {product.category}
                        </span>
                      </div>
                    )}
                  </div>
                  
                  {/* Product info */}
                  <div className="p-4">
                    <Link to={`/product/${product._id}`}>
                      <h3 className="text-base font-bold text-gray-800 mb-1 hover:text-green-600 transition-colors line-clamp-1">
                        {product.name}
                      </h3>
                    </Link>
                    
                    {/* Ratings */}
                    <div className="flex items-center mb-2">
                      {[1, 2, 3, 4, 5].map((star) => {
                        const rating = parseFloat(getRandomRating(product._id));
                        return star <= Math.floor(rating) ? (
                          <Star key={star} size={14} className="text-yellow-400 fill-current" />
                        ) : star === Math.ceil(rating) && !Number.isInteger(rating) ? (
                          <StarHalf key={star} size={14} className="text-yellow-400 fill-current" />
                        ) : (
                          <Star key={star} size={14} className="text-gray-300" />
                        );
                      })}
                      <span className="text-xs text-gray-500 ml-2">
                        {getRandomRating(product._id)}
                      </span>
                    </div>
                    
                    <p className="text-gray-700 text-sm mb-3 line-clamp-2">
                      {product.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-3">
                      <p className="text-lg font-bold text-orange-600">RWF {product.price.toLocaleString()}</p>
                    </div>
                    
                    {/* Add to cart section */}
                    <div className="flex items-center gap-2">
                      <div className="flex items-center bg-gray-100 rounded-lg p-1">
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuantities(prev => ({ ...prev, [product._id]: Math.max((prev[product._id] || 1) - 1, 1) }))}
                          className="bg-white p-1 rounded-md shadow-sm hover:bg-gray-50"
                        >
                          <Minus size={14} />
                        </motion.button>
                        <span className="text-xs font-medium w-6 text-center">
                          {quantities[product._id] || 1}
                        </span>
                        <motion.button 
                          whileTap={{ scale: 0.9 }}
                          onClick={() => setQuantities(prev => ({ ...prev, [product._id]: (prev[product._id] || 1) + 1 }))}
                          className="bg-white p-1 rounded-md shadow-sm hover:bg-gray-50"
                        >
                          <Plus size={14} />
                        </motion.button>
                      </div>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className={`flex-1 py-2 px-2 rounded-lg font-medium text-xs text-white shadow-sm transition-all duration-200 flex items-center justify-center gap-1 ${
                          cart.some(item => item._id === product._id)
                            ? "bg-green-600 hover:bg-green-700"
                            : "bg-black hover:bg-gray-900"
                        }`}
                        onClick={() => {
                          const isProductInCart = cart.some(item => item._id === product._id);
                          if (isProductInCart) {
                            removeFromCartHandler(product);
                          } else {
                            addToCart(product);
                          }
                        }}
                      >
                        {cart.some(item => item._id === product._id) ? (
                          <>
                            <X size={14} />
                            <span>Remove</span>
                          </>
                        ) : (
                          <>
                            <ShoppingCart size={14} />
                            <span>Add to Cart</span>
                          </>
                        )}
                      </motion.button>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          )}
          
          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex justify-center items-center mt-10 mb-6">
              <nav className="flex items-center gap-1 bg-white p-2 rounded-xl shadow-sm">
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === 1}
                >
                  <ChevronLeft size={16} />
                </motion.button>
                
                {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                  // Calculate which page numbers to show
                  let pageNum;
                  if (totalPages <= 5) {
                    pageNum = i + 1;
                  } else if (currentPage <= 3) {
                    pageNum = i + 1;
                  } else if (currentPage >= totalPages - 2) {
                    pageNum = totalPages - 4 + i;
                  } else {
                    pageNum = currentPage - 2 + i;
                  }
                  
                  return (
                    <motion.button
                      key={i}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`flex items-center justify-center w-8 h-8 rounded-lg text-sm ${
                        currentPage === pageNum
                          ? "bg-green-600 text-white font-medium"
                          : "bg-white border border-gray-200 text-gray-600 hover:bg-gray-50"
                      }`}
                      onClick={() => setCurrentPage(pageNum)}
                    >
                      {pageNum}
                    </motion.button>
                  );
                })}
                
                <motion.button 
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                  className="flex items-center justify-center w-8 h-8 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                  disabled={currentPage === totalPages}
                >
                  <ChevronRight size={16} />
                </motion.button>
              </nav>
            </div>
          )}
        </div>
      </div>

      {/* Category sidebar overlay */}
      <AnimatePresence>
        {isSidebarOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-30"
            onClick={() => setIsSidebarOpen(false)}
          >
            <motion.div
              initial={{ x: -300, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -300, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute left-0 top-0 h-full w-72 bg-white shadow-2xl overflow-y-auto"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="p-6">
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-gray-900">Categories</h2>
                  <button 
                    onClick={() => setIsSidebarOpen(false)}
                    className="p-2 rounded-full hover:bg-gray-100"
                  >
                    <X size={18} />
                  </button>
                </div>
                
                <div className="flex flex-col gap-2">
                  {categories.map((category) => (
                    <motion.button
                      key={category}
                      whileHover={{ x: 4 }}
                      whileTap={{ scale: 0.98 }}
                      className={`py-3 px-4 rounded-lg text-left font-medium transition-all ${
                        selectedCategory === category 
                          ? "bg-green-600 text-white" 
                          : "bg-gray-50 text-gray-700 hover:bg-gray-100"
                      }`}
                      onClick={() => {
                        setSelectedCategory(category);
                        setCurrentPage(1);
                        setIsSidebarOpen(false);
                      }}
                    >
                      {category}
                    </motion.button>
                  ))}
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Cart sidebar */}
      <AnimatePresence>
        {isCartOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
            className="fixed inset-0 bg-black/50 backdrop-blur-sm z-40"
            onClick={() => setIsCartOpen(false)}
          >
            <motion.div
              initial={{ x: 400, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: 400, opacity: 0 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="absolute right-0 top-0 h-full w-full sm:w-80 bg-white shadow-2xl overflow-hidden"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex flex-col h-full">
                <div className="p-5 border-b">
                  <div className="flex items-center justify-between mb-2">
                    <h2 className="text-xl font-bold text-gray-900">Your Cart</h2>
                    <button 
                      onClick={() => setIsCartOpen(false)}
                      className="p-2 rounded-full hover:bg-gray-100"
                    >
                      <X size={18} />
                    </button>
                  </div>
                  <div className="flex items-center text-gray-500 text-sm">
                    <ShoppingCart size={14} className="mr-2" />
                    <span>{getCartCount()} items</span>
                  </div>
                </div>
                
                <div className="flex-1 overflow-y-auto p-5">
                  {cart.length === 0 ? (
                    <div className="flex flex-col items-center justify-center h-full text-center">
                      <div className="bg-gray-100 p-5 rounded-full mb-4">
                        <ShoppingCart size={28} className="text-gray-400" />
                      </div>
                      <h3 className="text-lg font-medium text-gray-700 mb-2">Your cart is empty</h3>
                      <p className="text-gray-500 mb-6 text-sm">Looks like you haven't added any products to your cart yet.</p>
                      <motion.button
                        whileHover={{ scale: 1.05 }}
                        whileTap={{ scale: 0.95 }}
                        className="bg-green-600 text-white px-5 py-2 rounded-xl font-medium hover:bg-green-700 text-sm"
                        onClick={() => setIsCartOpen(false)}
                      >
                        Continue Shopping
                      </motion.button>
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {cart.map((item) => (
                        <motion.div 
                          key={item._id}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          exit={{ opacity: 0, y: -10 }}
                          className="flex gap-3 bg-gray-50 p-3 rounded-xl"
                        >
                          <div className="w-16 h-16 flex-shrink-0 bg-white rounded-lg overflow-hidden">
                            <img 
                              src={`https://api.psevenrwanda.com/api/${item.image}`} 
                              alt={item.name} 
                              className="w-full h-full object-cover" 
                              onError={handleImageError}
                            />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="font-medium text-gray-800 text-sm mb-1 truncate">{item.name}</h4>
                            <p className="text-orange-600 font-medium mb-2 text-sm">RWF {item.price.toLocaleString()}</p>
                            <div className="flex items-center">
                              <button 
                                onClick={() => updateCartQuantity(item._id, item.quantity - 1)}
                                className="p-1 bg-white rounded border border-gray-200 text-gray-500 hover:bg-gray-50"
                              >
                                <Minus size={12} />
                              </button>
                              <span className="mx-2 min-w-6 text-center text-xs">{item.quantity}</span>
                              <button 
                                onClick={() => updateCartQuantity(item._id, item.quantity + 1)}
                                className="p-1 bg-white rounded border border-gray-200 text-gray-500 hover:bg-gray-50"
                              >
                                <Plus size={12} />
                              </button>
                              <button 
                                onClick={() => removeFromCartHandler(item)}
                                className="ml-auto p-1 text-gray-400 hover:text-red-500"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  )}
                </div>
                
                {cart.length > 0 && (
                  <div className="p-5 border-t bg-gray-50">
                    <div className="space-y-3 mb-6">
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Subtotal</span>
                        <span>RWF {calculateCartTotal().toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between text-gray-600 text-sm">
                        <span>Shipping</span>
                        <span>Calculated at checkout</span>
                      </div>
                      <div className="flex justify-between font-bold text-base">
                        <span>Total</span>
                        <span>RWF {calculateCartTotal().toLocaleString()}</span>
                      </div>
                    </div>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-green-600 text-white py-2 rounded-xl font-medium hover:bg-green-700 mb-3"
                    >
                      Proceed to Checkout
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="w-full bg-white border border-gray-200 text-gray-800 py-2 rounded-xl font-medium hover:bg-gray-50 text-sm"
                      onClick={() => setIsCartOpen(false)}
                    >
                      Continue Shopping
                    </motion.button>
                  </div>
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default ShoppingSection;