import React, { useState, useEffect } from 'react';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);

  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  const handleRemoveFromCart = (itemName) => {
    const updatedCartItems = cartItems.filter(item => item.name !== itemName);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <h2 className="text-3xl font-bold mb-4">Your Cart</h2>
      {cartItems.length === 0 ? (
        <p>Your cart is empty.</p>
      ) : (
        <div className="space-y-4">
          {cartItems.map((item, index) => (
            <div key={index} className="flex items-center justify-between border p-4 rounded-md shadow-md">
              <div>
                <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                <p className="font-bold">{item.name}</p>
                <p>{item.price}</p>
              </div>
              <button
                onClick={() => handleRemoveFromCart(item.name)}
                className="bg-red-600 text-white px-4 py-2 rounded-md"
              >
                Remove from cart
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default CartPage;
