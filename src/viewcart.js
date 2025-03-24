import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useCart } from "./CartContext";
import { Trash2, Plus, Minus, ShoppingBag, ArrowLeft } from "lucide-react";

const CartItem = ({ item, index, onRemove, onIncrease, onDecrease }) => (
  <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 transition-all hover:shadow-md">
    <div className="p-4">
      <div className="flex items-center gap-4">
        <div className="relative w-24 h-24 rounded-lg overflow-hidden bg-gray-50">
          <img 
            src={`https://api.psevenrwanda.com/api/${item.image}`} 
            alt={item.name} 
            className="object-cover w-full h-full transition-transform hover:scale-105"
          />
        </div>
        <div className="flex-1">
          <h3 className="font-semibold text-lg text-gray-800">{item.name}</h3>
          <p className="text-sm text-gray-500 mt-1">FRW {item.price}</p>
        </div>
        
        <div className="flex flex-col items-end gap-2">
          <div className="flex items-center gap-2 bg-gray-50 rounded-full p-1">
            <button
              onClick={() => onDecrease(index)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
              disabled={item.quantity <= 1}
            >
              <Minus size={16} className={item.quantity <= 1 ? "text-gray-300" : "text-gray-600"} />
            </button>
            <span className="w-8 text-center font-medium">{item.quantity}</span>
            <button
              onClick={() => onIncrease(index)}
              className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-200 transition-colors"
            >
              <Plus size={16} className="text-gray-600" />
            </button>
          </div>
          
          <p className="font-semibold text-lg">
            FRW {(parseFloat(typeof item.price === "string" ? item.price.replace("FRW", "") : item.price) * item.quantity).toFixed(2)}
          </p>
        </div>
      </div>
      
      <div className="mt-4 flex justify-end">
        <button
          onClick={() => onRemove(index)}
          className="flex items-center gap-1 px-3 py-1 text-red-500 hover:text-red-600 transition-colors text-sm"
        >
          <Trash2 size={16} />
          <span>Remove</span>
        </button>
      </div>
    </div>
  </div>
);

const EmptyCart = ({ onReset }) => (
  <div className="text-center py-16 bg-white rounded-xl shadow-sm">
    <div className="mb-6">
      <div className="bg-gray-50 w-24 h-24 rounded-full flex items-center justify-center mx-auto">
        <ShoppingBag className="w-12 h-12 text-gray-400" />
      </div>
    </div>
    <h3 className="text-xl font-semibold text-gray-900 mb-3">Your cart is empty</h3>
    <p className="text-gray-500 mb-8 max-w-md mx-auto">Looks like you haven't added anything to your cart yet. Start exploring our products!</p>
    <div className="space-x-4">
      <Link to="/">
        <button className="inline-flex items-center px-6 py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors shadow-sm">
          <ArrowLeft size={18} className="mr-2" />
          Continue Shopping
        </button>
      </Link>
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
        price: typeof item.price === "string" ? parseFloat(item.price.replace("FRW", "")) : item.price
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
      const itemPrice = parseFloat(typeof item.price === "string" ? item.price.replace("FRW", "") : item.price) || 0;
      return total + itemPrice * item.quantity;
    }, 0).toFixed(2);
  };

  const countItems = () => {
    return cartItems.reduce((count, item) => count + item.quantity, 0);
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
    <div className="container mx-auto px-4 py-12 max-w-4xl mt-24">
      <h1 className="text-3xl font-bold mb-2">Your Shopping Cart</h1>
      {cartItems.length > 0 && (
        <p className="text-gray-500 mb-8">
          You have {countItems()} {countItems() === 1 ? 'item' : 'items'} in your cart
        </p>
      )}

      {cartItems.length === 0 ? (
        <EmptyCart onReset={handleResetCart} />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="md:col-span-2 space-y-4">
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
            
            <div className="flex justify-between items-center pt-4">
              <Link to="/">
                <button className="flex items-center text-gray-600 hover:text-black transition-colors">
                  <ArrowLeft size={18} className="mr-2" />
                  Continue Shopping
                </button>
              </Link>
              
              <button
                onClick={handleResetCart}
                className="text-red-500 hover:text-red-600 transition-colors"
              >
                Clear Cart
              </button>
            </div>
          </div>
          
          <div className="md:col-span-1">
            <div className="bg-white rounded-xl shadow-sm p-6 border border-gray-100 sticky top-32">
              <h3 className="font-semibold text-lg mb-4">Order Summary</h3>
              
              <div className="space-y-3 mb-6">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>FRW {calculateTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at checkout</span>
                </div>
                <div className="border-t pt-3 mt-3">
                  <div className="flex justify-between font-semibold text-lg">
                    <span>Total</span>
                    <span>FRW {calculateTotalPrice()}</span>
                  </div>
                </div>
              </div>
              
              <button
                onClick={handleCheckout}
                className="w-full py-3 bg-black text-white rounded-full hover:bg-gray-800 transition-colors font-medium"
              >
                Proceed to Checkout
              </button>
              
              <div className="mt-4 text-xs text-gray-500 text-center">
                Taxes and shipping calculated at checkout
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default ViewCart;