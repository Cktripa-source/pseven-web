import React, { useState, useEffect } from 'react';
import tabletImage from './images/tablet.avif';
import smartphoneImage from './images/smartphone.jpg';
import headphonesImage from './images/headphone.webp';

const PopularProduct = ({ setCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState('');

  const products = [
    { id: 1, name: 'Tablet Pro 2025', image: tabletImage, price: '$499', description: 'A powerful tablet with a sleek design.', discount: '10%' },
    { id: 2, name: 'Smartphone X', image: smartphoneImage, price: '$999', description: 'Next-generation smartphone with advanced features.', discount: '20%' },
    { id: 3, name: 'Wireless Headphones', image: headphonesImage, price: '$199', description: 'Noise-cancelling wireless headphones.', discount: '15%' },
    { id: 4, name: 'Tablet Lite', image: tabletImage, price: '$399', description: 'A compact and affordable tablet.', discount: '5%' },
    { id: 5, name: 'Smartphone Y', image: smartphoneImage, price: '$799', description: 'A budget-friendly smartphone.', discount: '15%' },
    { id: 6, name: 'Premium Headphones', image: headphonesImage, price: '$299', description: 'High-quality audio for music enthusiasts.', discount: '20%' },
    { id: 7, name: 'Tablet Ultra', image: tabletImage, price: '$599', description: 'An ultra-performance tablet for professionals.', discount: '12%' },
    { id: 8, name: 'Smartphone Z', image: smartphoneImage, price: '$1099', description: 'Top-tier smartphone with premium features.', discount: '25%' },
    { id: 9, name: 'Noise Cancelling Headphones', image: headphonesImage, price: '$249', description: 'Immersive sound experience.', discount: '18%' },
  ];

  useEffect(() => {
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
    <div className="w-full px-4 bg-gray-50">
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold">{notification}</h3>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-gray-900 my-2 text-center">Popular Products</h2>
      <p className="text-blue-500 text-center p-2 font-bold mb-6 text-2xl">Check out our most popular products</p>

      <div className="flex gap-6 overflow-x-auto scrollbar-hide px-4">
        {products.map((product, index) => (
          <div
            key={index}
            className="w-[80%] md:w-[30%] lg:w-[20%] flex-shrink-0 border border-gray-200 rounded-lg shadow-xl hover:shadow-2xl cursor-pointer transition-all transform hover:scale-95"
          >
            <a href="#" className="block">
              <img className="w-full h-56 object-cover rounded-t-lg" src={product.image} alt={product.name} />
            </a>
            <div className="px-4 pb-4">
              <a href="#0">
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
        ))}
      </div>
    </div>
  );
};

export default PopularProduct;
