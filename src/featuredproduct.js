import React from 'react';

// Import images
import cameraImage from './images/camera.jpg';
import gimbalImage from './images/gimbal.webp';
import appleWatchImage from './images/apple-watch.jpg';

const FeaturedProduct = ({ setCartCount }) => {
  const products = [
    { name: 'Apple Watch Series 7', image: appleWatchImage, price: '$599', description: 'A sleek smartwatch with cutting-edge features.', discount: '20%' },
    { name: 'Camera', image: cameraImage, price: '$699', description: 'High-definition camera for stunning photos.', discount: '15%' },
    { name: 'Gimbal Stabilizer', image: gimbalImage, price: '$399', description: 'Stabilize your shots with this portable gimbal.', discount: '10%' },
    { name: 'Tripod', image: cameraImage, price: '$199', description: 'A sturdy tripod for stable photography.', discount: '5%' },
    { name: 'Drone', image: gimbalImage, price: '$899', description: 'Capture aerial shots with this high-tech drone.', discount: '25%' },
  ];

  const handleAddToCart = () => {
    // Retrieve the current cart count from localStorage
    let currentCount = localStorage.getItem('cartCount') || 0;
    currentCount = parseInt(currentCount, 10) + 1; // Increment by 1
    localStorage.setItem('cartCount', currentCount); // Store the updated count in localStorage

    setCartCount(currentCount); // Update the cart count in the Navbar
  };

  return (
    <div className="w-full px-4 overflow-hidden bg-gray-50">
      <h2 className="text-3xl font-bold text-gray-900 my-2 text-center">
        Featured Products
      </h2>
      <p className="text-blue-500 text-center p-2 font-bold mb-6 text-2xl">Our list of Top Featured Products</p>

      <div className="relative w-full">
        <div className="flex gap-6 overflow-x-auto transition-all">
          {products.map((product, index) => (
            <div key={index} className="w-[90%] md:w-[23.5%] transition-all duration-500 ease-in-out transform hover:scale-95 flex-shrink-0 border border-gray-200 rounded-lg shadow-xl hover:shadow-2xl cursor-pointer">
              <a href="#" className="block">
                <img className="w-full h-56 object-cover rounded-t-lg" src={product.image} alt={product.name} />
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
                    onClick={handleAddToCart}
                    className="text-white bg-indigo-600 hover:bg-indigo-700 focus:ring-4 focus:outline-none focus:ring-indigo-300 font-medium rounded-lg text-xs px-4 py-2 text-center"
                  >
                    Add to cart
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

export default FeaturedProduct;
