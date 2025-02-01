import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Heart, Plus, Minus, X, MenuIcon } from "lucide-react";
import Navbar from "./nav";
import { useCart } from "./CartContext";

const API_URL = "http://localhost:5000/api";

function ShoppingSection() {
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(""); 
  const [products, setProducts] = useState([]);
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const [productData, setProductData] = useState({}); // Store per-product data like quantities and colors
  const [currentPage, setCurrentPage] = useState(1);
  const productsPerPage = 6;

  const { cart, addToCart, removeFromCart, getCartCount } = useCart();

  // Fetch categories from backend
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const res = await fetch(`${API_URL}/categories`);
        const data = await res.json();
        setCategories(data);
        setSelectedCategory(data[0]); // Set first category by default
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  // Fetch products whenever category or page changes
  useEffect(() => {
    if (!selectedCategory) return;
    const fetchProducts = async () => {
      try {
        const res = await fetch(`${API_URL}/products?category=${selectedCategory}`);
        const data = await res.json();
        setProducts(data);
        const initialData = data.reduce((acc, product) => {
          acc[product._id] = {
            quantity: 1, 
            selectedColor: product.colors[0], // Set default color to first color
          };
          return acc;
        }, {});
        setProductData(initialData); // Initialize product data state
      } catch (error) {
        console.error("Error fetching products:", error);
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

  // Update quantity of specific product
  const updateQuantity = (productId, delta) => {
    setProductData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        quantity: Math.max(prev[productId].quantity + delta, 1), // Ensure quantity is at least 1
      },
    }));
  };

  // Update selected color of a specific product
  const updateColor = (productId, color) => {
    setProductData((prev) => ({
      ...prev,
      [productId]: {
        ...prev[productId],
        selectedColor: color,
      },
    }));
  };

  return (
    <div className="flex flex-col min-h-screen bg-gray-100 p-6 relative">
      <Navbar cartCount={getCartCount()} />

      <button className="bg-black text-white p-2 rounded-lg mb-4 flex items-center space-x-2"
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
              className={`text-lg p-2 rounded-lg ${selectedCategory === category ? "bg-blue-600" : "bg-black"} text-white w-48 text-center`}
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

      {/* Product Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {currentProducts.map((product) => (
          <motion.div key={product._id} whileHover={{ scale: 1.05 }}
            className="relative bg-white p-4 rounded-lg shadow-lg transition-all overflow-hidden">
            <img src={product.image} alt={product.name} className="w-full h-40 object-cover rounded-md" />
            <h3 className="text-lg font-semibold mt-2">{product.name}</h3>
            <p className="text-gray-600">{product.description}</p>
            <p className="text-gray-900 font-bold">${product.price}</p>

            <div className="flex items-center mt-3 space-x-2">
              <button onClick={() => updateQuantity(product._id, -1)} className="bg-gray-300 px-2 py-1 rounded">
                <Minus size={16} />
              </button>
              <span className="text-lg">{productData[product._id]?.quantity}</span>
              <button onClick={() => updateQuantity(product._id, 1)} className="bg-gray-300 px-2 py-1 rounded">
                <Plus size={16} />
              </button>
            </div>

            {/* Colors */}
            <div className="mt-3 flex space-x-2">
              {product.colors.map((color) => (
                <button
                  key={color}
                  className={`w-6 h-6 rounded-full border-2 ${productData[product._id]?.selectedColor === color ? "border-black" : "border-transparent"}`}
                  style={{ backgroundColor: color }}
                  onClick={() => updateColor(product._id, color)}
                ></button>
              ))}
            </div>

            <button
              className={`mt-3 px-4 py-2 rounded-lg w-full ${cart.some((item) => item.id === product._id && item.selectedColor === productData[product._id]?.selectedColor)
                ? "bg-red-600 hover:bg-red-700 text-white"
                : "bg-black hover:bg-gray-950 text-white"
              }`}
              onClick={() => {
                if (cart.some((item) => item.id === product._id && item.selectedColor === productData[product._id]?.selectedColor)) {
                  removeFromCart(product._id);
                } else {
                  addToCart({ ...product, selectedColor: productData[product._id]?.selectedColor, quantity: productData[product._id]?.quantity });
                }
              }}
            >
              {cart.some((item) => item.id === product._id && item.selectedColor === productData[product._id]?.selectedColor)
                ? "Remove from Cart"
                : "Add to Cart"
              }
            </button>
          </motion.div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex justify-between mt-6">
          <button onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
            className="bg-black text-white px-4 py-2 rounded-lg"
            disabled={currentPage === 1}>
            Previous
          </button>
          <span>Page {currentPage} of {totalPages}</span>
          <button onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))}
            className="bg-black text-white px-4 py-2 rounded-lg"
            disabled={currentPage === totalPages}>
            Next
          </button>
        </div>
      )}
    </div>
  );
}

export default ShoppingSection;
