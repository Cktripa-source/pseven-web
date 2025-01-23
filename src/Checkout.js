import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";

const Checkout = ({ setCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    zipCode: "",
    email: "",
  });
  const [paymentDetails, setPaymentDetails] = useState({
    phoneNumber: "",
    paymentStatus: null,
  });

  const navigate = useNavigate();

  // Load cart items from localStorage
  useEffect(() => {
    const savedCartItems = localStorage.getItem("cart");
    if (savedCartItems) {
      const parsedCart = JSON.parse(savedCartItems);
      setCartItems(parsedCart); // Set cart items to state
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentDetails((prevDetails) => ({
      ...prevDetails,
      [name]: value,
    }));
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(String(item.price).replace("$", "")) || 0;
      return total + itemPrice * item.quantity;
    }, 0).toFixed(2);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Here you could add logic to handle payment processing via MTN API

    // For now, just simulate a successful payment
    setPaymentDetails({ ...paymentDetails, paymentStatus: "success" });

    // Redirect to payment confirmation page
    navigate("/payment", { state: { shippingDetails, cartItems, totalPrice: calculateTotalPrice() } });
  };

  return (
    <div className="container mx-auto p-4 mt-40">
      <h2 className="text-center mb-4 font-extrabold text-2xl">Checkout</h2>

      {cartItems.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-xl text-gray-500">Your cart is empty. Please add items to your cart.</p>
        </div>
      ) : (
        <div>
          <h3 className="text-xl font-semibold mb-4">Order Summary</h3 >
          <div className="space-y-4">
            {cartItems.map((item, index) => (
              <div key={index} className="flex justify-between">
                <span>{item.name} (x{item.quantity})</span>
                <span>${(parseFloat(String(item.price).replace("$", "")) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
          <div className="mt-4 text-lg font-semibold">
            <p>Total: ${calculateTotalPrice()}</p>
          </div>

          {/* MTN Rwanda Payment Form */}
          <form onSubmit={handleSubmit} className="mt-6">
            <div className="space-y-4">
              <input
                type="text"
                name="name"
                value={shippingDetails.name}
                onChange={handleInputChange}
                placeholder="Full Name"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="address"
                value={shippingDetails.address}
                onChange={handleInputChange}
                placeholder="Shipping Address"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="city"
                value={shippingDetails.city}
                onChange={handleInputChange}
                placeholder="City"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="text"
                name="zipCode"
                value={shippingDetails.zipCode}
                onChange={handleInputChange}
                placeholder="Zip Code"
                className="w-full px-4 py-2 border rounded"
                required
              />
              <input
                type="email"
                name="email"
                value={shippingDetails.email}
                onChange={handleInputChange}
                placeholder="Email Address"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            {/* MTN Payment Form */}
            <div className="mt-6 space-y-4">
              <label className="block text-sm font-semibold">MTN Rwanda Mobile Money Number</label>
              <input
                type="text"
                name="phoneNumber"
                value={paymentDetails.phoneNumber}
                onChange={handlePaymentChange}
                placeholder="Enter your MTN number"
                className="w-full px-4 py-2 border rounded"
                required
              />
            </div>

            <button
              type="submit"
              className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
            >
              Confirm Order & Pay with MTN
            </button>
          </form>
        </div>
      )}
    </div>
  );
};

export default Checkout;
