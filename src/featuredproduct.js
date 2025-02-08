import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Minus, X, MenuIcon } from "lucide-react";
import Navbar from "./nav";
import { useCart } from "./CartContext";
import { Link } from "react-router-dom";  // Import Link for navigation

const API_URL = "https://pseven-api-test.onrender.com/api"; // Change this if hosted on Railway

function ShoppingSection() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); // Empty initially to show all products
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [quantities, setQuantities] = useState({});
  const [favorites, setFavorites] = useState({});
  const [selectedColors, setSelectedColors] = useState({});
  const [currentPage, setCurrentPage] = useState(1);
  const [isLoading, setIsLoading] = useState(true); // Loading state
  const productsPerPage = 6;

  const { cart, setCart, removeFromCart, getCartCount } = useCart(); // Access setCart here

  const addToCart = (product) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];

      // Check if the product already exists in the cart using _id
      const existingProductIndex = newCart.findIndex(
        (item) => item._id === product._id // Compare using _id instead of name
      );

      if (existingProductIndex !== -1) {
        // If the product already exists, increase its quantity
        newCart[existingProductIndex].quantity += product.quantity || 1;
      } else {
        // Otherwise, add the product with quantity 1
        newCart.push({ ...product, quantity: product.quantity || 1 });
      }

      return newCart;
    });
  };

  const removeFromCartHandler = (product) => {
    setCart((prevCart) => prevCart.filter(item => item._id !== product._id));
  };

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(["All", ...data]); // Add "All" as the first category
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products whenever category or page changes
  useEffect(() => {
    const fetchProducts = async () => {
      setIsLoading(true); // Set loading to true when starting to fetch
      try {
        const categoryQuery = selectedCategory && selectedCategory !== "All" 
          ? `?category=${selectedCategory}` 
          : ""; // Only add category filter if it's not "All"
          
        const res = await fetch(`${API_URL}/products${categoryQuery}`);
        const data = await res.json();
        setProducts(data);
      } catch (error) {
        console.error("Error fetching products:", error);
      } finally {
        setIsLoading(false); // Set loading to false after fetching
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

  // Fallback image if the product image is not available
  const handleImageError = (e) => {
    e.target.src = "https://via.placeholder.com/300"; // Fallback to placeholder image
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6 relative">
      <Navbar cartCount={getCartCount()} />

      <button className="bg-black text-white p-2 rounded-lg mb-4 flex items-center space-x-2 max-w-7xl m-auto"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}>
        <MenuIcon size={24} />
        <span>Open Categories</span>
      </button>

      {/* Sidebar */}
      {isSidebarOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-white z-50 flex flex-col items-center justify-center space-y-4"
        >
          <button onClick={() => setIsSidebarOpen(false)}
            className="absolute top-4 right-4 p-2">
            <X size={24} />
          </button>
          <h2 className="text-2xl font-semibold">Categories</h2>
          {categories.map((category) => (
            <button
              key={category}
              className={`text-lg p-2 rounded-lg ${selectedCategory === category ? "bg-green-600" : "bg-black"} text-white w-48 text-center`}
              onClick={() => {
                setSelectedCategory(category);
                setCurrentPage(1);
                setIsSidebarOpen(false);
              }}>
              {category}
            </button>
          ))}
        </motion.div>
      )}

      {/* Loading Indicator */}
      {isLoading ? (
        <div className="flex justify-center items-center py-8">
          <span className="text-xl font-semibold">Loading Products...</span>
        </div>
      ) : (
        // Product Grid
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-5xl m-auto">
          {currentProducts.map((product) => (
            <motion.div key={product._id} whileHover={{ scale: 1.05 }}
              className="relative bg-white p-4 rounded-2xl shadow-md transition-all transform hover:bg-green-100 hover:border-green-500 hover:shadow-xl hover:scale-105 overflow-hidden border border-gray-300">
              {/* Link to Product Detail Page */}
              <Link to={`/product/${product._id}`} className="block">
                <div className="relative w-full h-56 overflow-hidden rounded-xl">
                  <img 
                    src={`https://pseven-api-test.onrender.com/api/${product.image}`} 
                    alt={product.name} 
                    className="w-full h-full object-cover rounded-xl" 
                    onError={handleImageError} // Handle image error
                  />
                </div>
                <h3 className="text-xl font-semibold text-gray-900 mt-3">{product.name}</h3>
                <p className="text-sm text-gray-500 mb-3">{product.description}</p>
                <p className="text-lg font-semibold text-orange-600">${product.price}</p> {/* Changed Price Color */}
              </Link>

              <div className="mt-3 flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <button onClick={() => setQuantities(prev => ({ ...prev, [product._id]: Math.max((prev[product._id] || 0) - 1, 0) }))} className="bg-gray-300 p-2 rounded-full">
                    <Minus size={16} />
                  </button>
                  <span className="text-lg">{quantities[product._id] || 1}</span>
                  <button onClick={() => setQuantities(prev => ({ ...prev, [product._id]: (prev[product._id] || 0) + 1 }))} className="bg-gray-300 p-2 rounded-full">
                    <Plus size={16} />
                  </button>
                </div>

                {/* Conditional Button: Add or Remove */}
                <button
                  className="bg-green-600 text-white px-4 py-2 rounded-full hover:bg-green-700"
                  onClick={() => {
                    const isProductInCart = cart.some(item => item._id === product._id);
                    if (isProductInCart) {
                      removeFromCartHandler(product);
                    } else {
                      addToCart(product);
                    }
                  }}
                >
                  {cart.some(item => item._id === product._id) ? "Remove from Cart" : "Add to Cart"}
                </button>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between mt-6">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-black text-white px-4 py-2 rounded-full"
            disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="bg-black text-white px-4 py-2 rounded-full"
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ShoppingSection;
