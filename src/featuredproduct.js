import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Minus, X, MenuIcon, ChevronLeft, ChevronRight } from "lucide-react";
import Navbar from "./nav";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";

const API_URL = "https://pseven-api-test.onrender.com/api";

function ShoppingSection() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [favorites, setFavorites] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true);
  const productsPerPage = 6;

  const { cart, setCart, removeFromCart, getCartCount } = useCart();

  const addToCart = (product) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const existingProductIndex = newCart.findIndex(
        (item) => item._id === product._id
      );

      if (existingProductIndex !== -1) {
        newCart[existingProductIndex].quantity += product.quantity || 1;
      } else {
        newCart.push({ ...product, quantity: product.quantity || 1 });
      }

      return newCart;
    });
  };

  const removeFromCartHandler = (product) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== product._id));
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
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProducts();
  }, [selectedCategory]);

  // Pagination Logic
  const totalPages = Math.ceil(products.length / productsPerPage);
  const currentProducts = products.slice(
    (currentPage - 1) * productsPerPage,
    currentPage * productsPerPage
  );

  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300";
  };

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 p-6 relative">
      <Navbar cartCount={getCartCount()} />

      {/* Enhanced Category Button */}
      <button 
        className="bg-black text-white p-4 rounded-xl mb-6 flex items-center space-x-3 max-w-7xl mx-auto hover:bg-gray-800 transition-all duration-300 shadow-lg hover:shadow-xl"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
      >
        <MenuIcon size={24} className="text-green-400" />
        <span className="text-lg font-semibold">Browse Categories</span>
      </button>

      {/* Enhanced Sidebar */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0, x: -100 }}
          animate={{ opacity: 1, x: 0 }}
          exit={{ opacity: 0, x: -100 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-white/95 backdrop-blur-sm z-50 flex flex-col items-center justify-center space-y-6"
        >
          <button 
            onClick={() => setIsSidebarOpen(false)}
            className="absolute top-6 right-6 p-3 bg-black rounded-full text-white hover:bg-gray-800 transition-colors"
          >
            <X size={24} />
          </button>
          <h2 className="text-4xl font-bold mb-8 text-gray-800">Categories</h2>
          <div className="flex flex-col space-y-4 w-64">
            {categories.map((category) => (
              <motion.button
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`text-lg p-4 rounded-xl ${
                  selectedCategory === category 
                    ? "bg-green-600 shadow-lg shadow-green-200" 
                    : "bg-black hover:bg-gray-800"
                } text-white w-full text-center font-semibold transition-all duration-300`}
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
        </motion.div>
      )}

      {/* Enhanced Loading Indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center py-16">
          <div className="animate-spin rounded-full h-16 w-16 border-t-4 border-b-4 border-green-600"></div>
        </div>
      ) : (
        // Enhanced Product Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 max-w-7xl mx-auto">
          {currentProducts.map((product) => (
            <motion.div 
              key={product._id} 
              whileHover={{ y: -8 }}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="group relative bg-white p-6 rounded-3xl shadow-lg hover:shadow-2xl transition-all duration-300 border-2 border-transparent hover:border-green-400"
            >
              <Link to={`/product/${product._id}`} className="block">
                <div className="relative w-full h-64 overflow-hidden rounded-2xl mb-4">
                  <img 
                    src={`https://pseven-api-test.onrender.com/api/${product.image}`} 
                    alt={product.name} 
                    className="w-full h-full object-cover transform group-hover:scale-110 transition-transform duration-500" 
                    onError={handleImageError}
                  />
                  <div className="absolute inset-0 bg-black/10 group-hover:bg-black/20 transition-colors duration-300"></div>
                </div>
                <h3 className="text-2xl font-bold text-gray-800 mb-2 group-hover:text-green-600 transition-colors">{product.name}</h3>
                <p className="text-gray-600 mb-4 line-clamp-2">{product.description}</p>
                <p className="text-2xl font-bold text-orange-600 mb-4">${product.price}</p>
              </Link>

              <div className="flex items-center justify-between space-x-4">
                <div className="flex items-center space-x-3 bg-gray-100 rounded-xl p-2">
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantities(prev => ({ ...prev, [product._id]: Math.max((prev[product._id] || 0) - 1, 0) }))}
                    className="bg-white p-2 rounded-lg shadow hover:bg-gray-50"
                  >
                    <Minus size={18} />
                  </motion.button>
                  <span className="text-lg font-semibold w-8 text-center">{quantities[product._id] || 1}</span>
                  <motion.button 
                    whileTap={{ scale: 0.9 }}
                    onClick={() => setQuantities(prev => ({ ...prev, [product._id]: (prev[product._id] || 0) + 1 }))}
                    className="bg-white p-2 rounded-lg shadow hover:bg-gray-50"
                  >
                    <Plus size={18} />
                  </motion.button>
                </div>

                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className={`flex-1 py-3 px-6 rounded-xl font-semibold text-white shadow-lg transition-all duration-300 ${
                    cart.some(item => item._id === product._id)
                      ? "bg-green-500 hover:bg-green-600"
                      : "bg-black hover:bg-black/90"
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
                  {cart.some(item => item._id === product._id) ? "Remove" : "Add to Cart"}
                </motion.button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Enhanced Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-center items-center space-x-6 mt-12 max-w-xl mx-auto">
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={currentPage === 1}
          >
            <ChevronLeft size={20} />
            <span>Previous</span>
          </motion.button>
          
          <span className="text-lg font-semibold">
            Page {currentPage} of {totalPages}
          </span>
          
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="bg-black text-white px-6 py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
            disabled={currentPage === totalPages}
          >
            <span>Next</span>
            <ChevronRight size={20} />
          </motion.button>
        </div>
      )}
    </div>
  );
}

export default ShoppingSection;