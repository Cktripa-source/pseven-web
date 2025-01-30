import React, { useState, useEffect } from "react";
import axios from "axios";

const FeaturedProduct = ({ setCartCount }) => {
  const [products, setProducts] = useState([]);
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await axios.get(
          "https://pseven-api-test.onrender.com/api/products"
        );
        setProducts(response.data);
      } catch (error) {
        console.error("Error fetching products:", error);
      }
    };

    fetchProducts();

    const savedCartItems = localStorage.getItem("cart");
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  const handleAddToCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const existingProductIndex = cart.findIndex(
      (item) => item.name === product.name
    );

    if (existingProductIndex !== -1) {
      cart[existingProductIndex].quantity += 1;
    } else {
      cart.push({ ...product, quantity: 1 });
    }

    localStorage.setItem("cart", JSON.stringify(cart));
    localStorage.setItem("cartCount", cart.length);
    setCartCount(cart.length);
    setCartItems(cart);

    showNotification(`${product.name} added to cart!`);
  };

  const handleRemoveFromCart = (product) => {
    let cart = JSON.parse(localStorage.getItem("cart")) || [];
    const updatedCart = cart.filter((item) => item.name !== product.name);

    localStorage.setItem("cart", JSON.stringify(updatedCart));
    localStorage.setItem("cartCount", updatedCart.length);
    setCartCount(updatedCart.length);
    setCartItems(updatedCart);

    showNotification(`${product.name} removed from cart.`);
  };

  const isProductInCart = (product) => {
    return cartItems.some((item) => item.name === product.name);
  };

  const showNotification = (message) => {
    setNotification(message);
    setTimeout(() => setNotification(""), 1000);
  };

  const handleCategoryChange = (category) => {
    setSelectedCategory(category);
  };

  const filteredProducts = selectedCategory
    ? products.filter((product) => product.category === selectedCategory)
    : products;

  return (
    <div className="flex">
      {/* Sidebar */}
      <div className="w-64 p-4 bg-gray-800 text-white h-screen">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <ul>
          <li
            onClick={() => handleCategoryChange("electronics")}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded mb-2"
          >
            Electronics
          </li>
          <li
            onClick={() => handleCategoryChange("fashion")}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded mb-2"
          >
            Fashion
          </li>
          <li
            onClick={() => handleCategoryChange("home")}
            className="cursor-pointer hover:bg-gray-700 p-2 rounded mb-2"
          >
            Home
          </li>
        </ul>
      </div>

      {/* Main Product Display */}
      <div className="w-full p-4 bg-gray-50">
        {notification && (
          <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
            <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg text-center">
              <h3 className="text-xl font-semibold">{notification}</h3>
            </div>
          </div>
        )}

        <h2 className="text-3xl font-bold text-gray-900 my-2 text-center">
          Featured Products
        </h2>
        <p className="text-blue-500 text-center p-2 font-bold mb-6 text-2xl">
          Our list of Top Featured Products
        </p>

        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-6">
          {filteredProducts.length > 0 ? (
            filteredProducts.map((product, index) => (
              <div
                key={index}
                className="relative border border-gray-200 rounded-lg shadow-xl hover:shadow-2xl transition-all duration-500 ease-in-out transform hover:scale-95 overflow-hidden"
              >
                {/* Product Image */}
                <img
                  className="w-full h-56 object-cover rounded-t-lg"
                  src={`https://pseven-api-test.onrender.com/${product.image}`}
                  alt={product.name}
                />

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 transition-opacity flex items-center justify-center">
                  <button
                    onClick={() =>
                      isProductInCart(product)
                        ? handleRemoveFromCart(product)
                        : handleAddToCart(product)
                    }
                    className={`text-white ${
                      isProductInCart(product)
                        ? "bg-red-600 hover:bg-red-700"
                        : "bg-indigo-600 hover:bg-indigo-700"
                    } focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-lg px-6 py-2`}
                  >
                    {isProductInCart(product) ? "Remove" : "Add to Cart"}
                  </button>
                </div>

                {/* Product Details */}
                <div className="px-6 pb-4">
                  <h5 className="text-xl font-semibold text-gray-900 mb-2">
                    {product.name}
                  </h5>
                  <p className="text-sm text-gray-600 mb-2">{product.description}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xl font-bold text-gray-900">
                      ${product.price}
                    </span>
                    {product.discount && (
                      <span className="text-xs font-medium text-red-500 bg-yellow-100 px-2 py-0.5 rounded">
                        {product.discount} OFF
                      </span>
                    )}
                  </div>
                </div>
              </div>
            ))
          ) : (
            <div className="w-full text-center py-8 text-gray-600">
              Loading products...
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default FeaturedProduct;
