import React, { createContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const CartProvider = ({ children }) => {
  const [cart, setCart] = useState([]);
  useEffect(() => {
    const savedCart = JSON.parse(localStorage.getItem('cart') || '[]');
    setCart(savedCart);
  }, []);

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  }, [JSON.stringify(cart)]);

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

  const clearCart = () => setCart([]);

  const getCartCount = () =>
    cart.reduce((total, item) => total + item.quantity, 0);

  return (
    <CartContext.Provider value={{ cart, addToCart, removeFromCart, clearCart, getCartCount }}>
      {children}
    </CartContext.Provider>
  );
};

export const useCart = () => React.useContext(CartContext);
