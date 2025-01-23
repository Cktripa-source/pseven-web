// FeaturedProduct.js
import React, { useState, useEffect } from 'react';
import axios from 'axios'; // You can use axios for easier API calls

const FeaturedProduct = ({ setCartCount }) => {
  const [products, setProducts] = useState([]); // State for storing fetched products
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState('');

  useEffect(() => {
    // Fetch products from backend API
    const fetchProducts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/products'); // Adjust the URL to your backend API
        setProducts(response.data); // Set fetched products to state
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
    
    // Load cart items from localStorage on initial render
    const savedCartItems = localStorage.getItem('cart');
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingProductIndex = cart.findIndex(item => item.name === product.name);

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    localStorage.setItem('cartCount', cart.length);
    setCartCount(cart.length);
    setCartItems(cart);

    showNotification(`${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (product) => {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];
    const updatedCart = cart.filter(item => item.name !== product.name);

    localStorage.setItem('cart', JSON.stringify(updatedCart));
    localStorage.setItem('cartCount', updatedCart.length);
    setCartCount(updatedCart.length);
    setCartItems(updatedCart);

    showNotification(`${product.name} removed from cart.`);
  };

  const isProductInCart = (product) => {
    return cartItems.some(item => item.name === product.name);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(''), 1000);
  };

  return (
    <div className="w-full px-4 overflow-hidden bg-gray-50">
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold">{notification}</h3>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-gray-900 my-2 text-center">Featured Products</h2>
      <p className="text-blue-500 text-center p-2 font-bold mb-6 text-2xl">Our list of Top Featured Products</p>

      <div className="relative w-full">
        <div className="flex gap-6 overflow-x-auto transition-all">
          {products.length > 0 ? products.map((product, index) => (
            <div
              key={index}
              className="w-[90%] md:w-[23.5%] transition-all duration-500 ease-in-out transform hover:scale-95 flex-shrink-0 border border-gray-200 rounded-lg shadow-xl hover:shadow-2xl cursor-pointer"
            >
              <a href="#" className="block">
              <img 
              className="w-full h-56 object-cover rounded-t-lg"
              src={`http://localhost:5000/${product.image}`}
              alt={product.name}
            />


              </a>
              <div className="px-6 pb-4">
                <a href="#">
                  <h5 className="text-xl font-semibold text-gray-900 mb-2">{product.name}</h5>
                </a>
                <p className="text-sm text-gray-600 mb-4">{product.description}</p>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-xl font-bold text-gray-900">{product.price}</span>
                  <span className="text-xs font-medium text-red-500 bg-yellow-100 px-2 py-0.5 rounded">{product.discount} OFF</span>
                  <button
                    onClick={() => isProductInCart(product) ? handleRemoveFromCart(product) : handleAddToCart(product)}
                    className={`text-white ${isProductInCart(product) ? 'bg-red-600 hover:bg-red-700' : 'bg-indigo-600 hover:bg-indigo-700'} focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-xs px-4 py-2 text-center`}
                  >
                    {isProductInCart(product) ? 'Remove from cart' : 'Add to cart'}
                  </button>
                </div>
              </div>
            </div>
          )) : (
            <div className="w-full text-center py-8 text-gray-600">Loading products...</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
