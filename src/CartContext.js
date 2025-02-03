import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState(() => {
    // Load cart from localStorage only once on mount
    const savedCart = localStorage.getItem('cart');
    return savedCart ? JSON.parse(savedCart) : [];
  });

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [cart]); // ✅ This ensures the cart is stored correctly on changes

  const addToCart = (product) => {
    setCart((prevCart) => {
      const newCart = [...prevCart];
      const existingProductIndex = newCart.findIndex(
        (item) =>
          item.id === product.id && item.selectedColor === product.selectedColor
      );

      if (existingProductIndex !== -1) {
        newCart[existingProductIndex].quantity += product.quantity || 1;
      } else {
        newCart.push({ ...product, quantity: product.quantity || 1 });
      }

      return newCart;
    });
  };

  const removeFromCart = (productId, selectedColor) => {
    setCart((prevCart) =>
      prevCart.filter(
        (item) =>
          !(item.id === productId && item.selectedColor === selectedColor)
      )
    );
  };

  const clearCart = () => {
    setCart([]);
    localStorage.removeItem('cart'); // ✅ Ensures localStorage is cleared
  };

  const getCartCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, setCart, addToCart, removeFromCart, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => React.useContext(CartContext);
