import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";

const ViewCart = () => {
  const [cartItems, setCartItems] = useState([]);
  const { setCart } = useCart();
  const navigate = useNavigate();

  useEffect(() => {
    console.log("useCart setCart:", setCart); // Debugging line
    if (typeof setCart !== "function") {
      console.error("setCart is not a function", setCart);
      return;
    }

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
    const updatedCart = cartItems.filter((_, i) => i !== index);
    updateCart(updatedCart);
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
    localStorage.setItem("cartCount", 0);
  };

  return (
    <div className="container mx-auto p-4 mt-40">
      <h2 className="text-center mb-4 font-extrabold text-2xl">Welcome to Your Shopping Cart</h2>
      {cartItems.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-xl text-gray-500">Your cart is empty.</p>
          <Link to="/">
            <button className="mt-4 px-6 py-2 bg-black text-white rounded hover:bg-gray-700 transition duration-300">Shop Now</button>
          </Link>
          <button onClick={handleResetCart} className="mt-4 px-6 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">Reset Cart</button>
        </div>
      ) : (
        <>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {cartItems.map((item, index) => (
              <div key={index} className="bg-white shadow-lg p-4 rounded-lg space-y-4 border">
                <div className="flex items-center gap-4">
                  <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <h2 className="text-xl font-semibold">{item.name}</h2>
                    <p className="text-black">${item.price}</p>
                    <p className="text-black">Quantity: {item.quantity}</p>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <button onClick={() => handleDecreaseQuantity(index)} className="px-4 py-2 bg-green-800 text-white rounded hover:bg-green-500 transition duration-300">-</button>
                  <button onClick={() => handleIncreaseQuantity(index)} className="px-4 py-2 text-white bg-black rounded hover:bg-gray-700 transition duration-300">+</button>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">Total: ${(parseFloat(typeof item.price === "string" ? item.price.replace("$", "") : item.price) * item.quantity).toFixed(2)}</p>
                </div>
                <button onClick={() => handleRemoveItem(index)} className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 transition duration-300">Remove</button>
              </div>
            ))}
          </div>
          <div className="mt-6 text-xl font-semibold text-center">
            <p>Total Price: ${calculateTotalPrice()}</p>
          </div>
          <div className="mt-6 flex justify-center">
            <button onClick={handleCheckout} className="px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300">Proceed to Checkout</button>
          </div>
        </>
      )}
    </div>
  );
};

export default ViewCart;
