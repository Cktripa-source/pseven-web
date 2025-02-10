import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

const CartItem = ({ item, index, onRemove, onIncrease, onDecrease }) => (
  <div className="bg-white rounded-lg shadow-md overflow-hidden border">
    <div className="p-2 space-y-4">
      <div className="flex items-center gap-2">
        <div className="relative w-20 h-20 rounded-lg overflow-hidden">
          <img 
            src={`https://api.psevenrwanda.com/api/${item.image}`} 
            alt={item.name} 
            className="object-cover w-full h-full"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-medium text-lg">{item.name}</h3>
          <p className="text-sm text-gray-600">${item.price}</p>
        </div>
      </div>
      
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <button
            onClick={() => onDecrease(index)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors border"
            disabled={item.quantity <= 1}
          >
            -
          </button>
          <span className="w-8 text-center">{item.quantity}</span>
          <button
            onClick={() => onIncrease(index)}
            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors border"
          >
            +
          </button>
        </div>
        
        <button
          onClick={() => onRemove(index)}
          className="px-3 py-1 text-red-500 hover:text-red-600 transition-colors"
        >
          Remove
        </button>
      </div>
      
      <div className="pt-2 border-t">
        <p className="text-right font-medium">
          ${(parseFloat(typeof item.price === "string" ? item.price.replace("$", "") : item.price) * item.quantity).toFixed(2)}
        </p>
      </div>
    </div>
  </div>
);

const EmptyCart = ({ onReset }) => (
  <div className="text-center py-12">
    <div className="mb-4">
      <svg className="w-16 h-16 mx-auto text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 11V7a4 4 0 00-8 0v4M5 9h14l1 12H4L5 9z" />
      </svg>
    </div>
    <h3 className="text-lg font-medium text-gray-900 mb-2">Your cart is empty</h3>
    <p className="text-gray-500 mb-6">Add items to your cart to start shopping</p>
    <div className="space-x-4">
      <Link to="/">
        <button className="inline-flex items-center px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 transition-colors">
          Continue Shopping
        </button>
      </Link>
      <button 
        onClick={onReset}
        className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
      >
        Reset Cart
      </button>
    </div>
  </div>
);

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { setCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    const savedCartItems = localStorage.getItem("cart");
    if (savedCartItems) {
      const parsedCart = JSON.parse(savedCartItems).map(item => ({
        ...item,
        price: typeof item.price === "string" ? parseFloat(item.price.replace("$", "")) : item.price
      }));
      setCartItems(parsedCart);
      setCart(parsedCart);
    } else {
      setCartItems([]);
      setCart([]);
    }
  }, [setCart]);

  const updateCart = (updatedCart) => {
    setCartItems(updatedCart);
    localStorage.setItem("cart", JSON.stringify(updatedCart));
    setCart(updatedCart);
  };

  const handleRemoveItem = (index) => {
    updateCart(cartItems.filter((_, i) => i !== index));
  };

  const handleIncreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    updatedCart[index].quantity += 1;
    updateCart(updatedCart);
  };

  const handleDecreaseQuantity = (index) => {
    const updatedCart = [...cartItems];
    if (updatedCart[index].quantity > 1) {
      updatedCart[index].quantity -= 1;
      updateCart(updatedCart);
    }
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(typeof item.price === "string" ? item.price.replace("$", "") : item.price) || 0;
      return total + itemPrice * item.quantity;
    }, 0).toFixed(2);
  };

  const handleCheckout = () => {
    if (cartItems.length === 0) {
      alert("Your cart is empty. Please add items before proceeding to checkout.");
      return;
    }
    navigate("/checkout");
  };

  const handleResetCart = () => {
    localStorage.removeItem("cart");
    setCartItems([]);
    setCart([]);
    localStorage.setItem("cartCount", "0");
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-4xl mt-32">
      <h1 className="text-3xl font-bold text-center">Shopping Cart</h1>
      <p className="text-center text-lg text-gray-700 mt-2 px-4">
  Your shopping cart is the place where you can review, adjust, and finalize your order. Here, you can easily add items, remove them, or adjust the quantity to fit your needs.
</p>

      {cartItems.length === 0 ? (
        <EmptyCart onReset={handleResetCart} />
      ) : (
        <div className="space-y-2">
          <div className="grid gap-4 mt-2">
            {cartItems.map((item, index) => (
              <CartItem
                key={index}
                item={item}
                index={index}
                onRemove={handleRemoveItem}
                onIncrease={handleIncreaseQuantity}
                onDecrease={handleDecreaseQuantity}
              />
            ))}
          </div>
          
          <div className="border-t pt-4">
            <div className="flex justify-between items-center mb-4">
              <span className="text-lg">Total</span>
              <span className="text-2xl font-bold">${calculateTotalPrice()}</span>
            </div>
            
            <button
              onClick={handleCheckout}
              className="w-full py-3 bg-black text-white rounded-md hover:bg-gray-800 transition-colors"
            >
              Proceed to Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCart;