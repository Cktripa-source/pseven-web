import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart')) || [];
    return savedCart;
  });

  useEffect(() => {
    // Sync cart state with localStorage
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]);

  const addToCart = (product) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      // Use both `id` and `selectedColor` for uniqueness
      const existingProductIndex = newCart.findIndex(
        (item) => item.id === product.id && item.selectedColor === product.selectedColor
      );

      if (existingProductIndex !== -1) {
        // If the product exists, increment the quantity
        newCart[existingProductIndex].quantity += 1;
      } else {
        // Add the product to cart with initial quantity of 1
        newCart.push({
          ...product,
          quantity: 1,
        });
      }

      return newCart;
    });
  };

  const removeFromCart = (productId) => {
    setCart((prevCart) => prevCart.filter(item => item.id !== productId));
  };

  const clearCart = () => {
    setCart([]); // Empty the cart
  };

  const getCartCount = () => {
    // Return the total quantity of items in the cart
    return cart.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => React.useContext(CartContext);
