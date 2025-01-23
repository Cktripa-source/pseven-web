import React, { useState, useEffect } from 'react';
import cameraImage from './images/camera.jpg';
import gimbalImage from './images/gimbal.webp';
import appleWatchImage from './images/apple-watch.jpg';

const BuySell = ({ setCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [notification, setNotification] = useState('');

  const products = [
    { id: 1, name: 'Apple Watch Series 7', image: appleWatchImage, price: '$599', description: 'A sleek smartwatch with cutting-edge features.', discount: '20%' },
    { id: 2, name: 'Camera', image: cameraImage, price: '$699', description: 'High-definition camera for stunning photos.', discount: '15%' },
    { id: 3, name: 'Gimbal Stabilizer', image: gimbalImage, price: '$399', description: 'Stabilize your shots with this portable gimbal.', discount: '10%' },
    { id: 4, name: 'Tripod', image: cameraImage, price: '$199', description: 'A sturdy tripod for stable photography.', discount: '5%' },
    { id: 5, name: 'Drone', image: gimbalImage, price: '$899', description: 'Capture aerial shots with this high-tech drone.', discount: '25%' },
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
    <div className="w-11/12 px-4 overflow-hidden md:mt-56 mt-72 m-auto">
      {notification && (
        <div className="fixed inset-0 flex items-center justify-center z-50 bg-black bg-opacity-50">
          <div className="bg-green-500 text-white px-8 py-4 rounded-lg shadow-lg text-center">
            <h3 className="text-xl font-semibold">{notification}</h3>
          </div>
        </div>
      )}
      <h2 className="text-3xl font-bold text-gray-900 mb-6 text-center">Top Featured Products</h2>
      <div className="relative w-full">
        <div className="flex gap-6 overflow-x-auto transition-all">
          {products.map((product, index) => (
            <div
              key={index}
              className="w-[90%] md:w-[23.5%] transition-all duration-500 ease-in-out transform hover:scale-95 flex-shrink-0 border border-gray-300 rounded-lg shadow-xl hover:shadow-2xl cursor-pointer"
            >
              <a href="#" className="block">
                <img className="w-full h-56 object-cover rounded-t-lg border-b" src={product.image} alt={product.name} />
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
                    className={`text-white ${isProductInCart(product) ? 'bg-red-600 hover:bg-red-700 text-md' : 'bg-black hover:bg-red-600'}  text-white px-4 py-1 rounded-full shadow-md transition-transform transform hover:scale-105`}
                  >
                    {isProductInCart(product) ? 'Remove ' : 'Add to cart'}
                  </button>
                </div>
              </div>
              
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default BuySell;
