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

  useEffect(() => {
    const savedCartItems = localStorage.getItem("cart");
    if (savedCartItems) {
      const parsedCart = JSON.parse(savedCartItems);
      setCartItems(parsedCart);
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
    setPaymentDetails({ ...paymentDetails, paymentStatus: "success" });
    navigate("/payment", { state: { shippingDetails, cartItems, totalPrice: calculateTotalPrice() } });
  };

  const handleWhatsAppOrder = () => {
    const orderDetails = cartItems.map(item => `${item.name} (x${item.quantity}): $${(parseFloat(String(item.price).replace("$", "")) * item.quantity).toFixed(2)}`).join('%0A');
    const totalPrice = calculateTotalPrice();
    const message = `*Order Details*%0A${orderDetails}%0A*Total:* $${totalPrice}%0A*Shipping Details*%0AName: ${shippingDetails.name}%0AAddress: ${shippingDetails.address}%0ACity: ${shippingDetails.city}%0AEmail: ${shippingDetails.email}%0APhone: ${paymentDetails.phoneNumber}`;
    
    const phoneNumber = "YOUR_WHATSAPP_NUMBER"; // Replace with your WhatsApp number
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    
    window.open(url, '_blank');
  };

  return (
    <div className="container mx-auto p-8 bg-white shadow-lg rounded-lg mt-32">
      <h2 className="text-center text-4xl font-bold mb-8 text-gray-800">Checkout</h2>

      {cartItems.length === 0 ? (
        <div className="text-center mt-10">
          <p className="text-xl text-gray-500">Your cart is empty. Please add items to your cart.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-10">
          {/* Products Column */}
          <div className="space-y-6">
            <h3 className="text-2xl font-semibold mb-4 text-gray-700">Order Summary</h3>
            <div className="space-y-4 mb-4">
              {cartItems.map((item, index) => (
                <div
                  key={index}
                  className="flex justify-between items-center py-3 px-5 bg-gray-50 rounded-lg shadow-md hover:bg-gray-100 transition duration-300"
                >
                  <img src={`https://api.psevenrwanda.com/api/${item.image}`} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                  <span className="text-lg">{item.name} (x{item.quantity})</span>
                  <span className="font-semibold text-green-600 text-lg">
                    ${(parseFloat(String(item.price).replace("$", "")) * item.quantity).toFixed(2)}
                  </span>
                </div>
              ))}
            </div>

            <div className="mt-4 text-xl font-semibold text-gray-700">
              <p>Total: <span className="text-green-600">${calculateTotalPrice()}</span></p>
            </div>
          </div>

          {/* Form Column */}
          <div>
            <form onSubmit={handleSubmit} className="space-y-8">
              <div className="space-y-6">
                <input
                  type="text"
                  name="name"
                  value={shippingDetails.name}
                  onChange={handleInputChange}
                  placeholder="Full Name"
                  className="w-full px-4 py-3 border border-black bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                  required
                />
                <input
                  type="text"
                  name="address"
                  value={shippingDetails.address}
                  onChange={handleInputChange}
                  placeholder="Shipping Address"
                  className="w-full px-4 py-3 border border-black bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                  required
                />
                <input
                  type="text"
                  name="city"
                  value={shippingDetails.city}
                  onChange={handleInputChange}
                  placeholder="City"
                  className="w-full px-4 py-3 border border-black bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                  required
                />
                <input
                  type="email"
                  name="email"
                  value={shippingDetails.email}
                  onChange={handleInputChange}
                  placeholder="Email Address"
                  className="w-full px-4 py-3 border border-black bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                  required
                />
              </div>

              <div className="space-y-4">
                <label className="block text-sm font-semibold text-gray-700">MTN Rwanda Mobile Money Number</label>
                <input
                  type="text"
                  name="phoneNumber"
                  value={paymentDetails.phoneNumber}
                  onChange={handlePaymentChange}
                  placeholder="Enter your MTN number"
                  className="w-full px-4 py-3 border border-black bg-gray-100 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 transition duration-300"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full px-6 py-3 bg-black text-white rounded-md hover:bg-gray-800 transition duration-300 transform hover:scale-105 shadow-md"
              >
                Confirm Order & Pay with MTN
              </button>

              <button
                type="button"
                onClick={handleWhatsAppOrder}
                className="w-full px-6 py-3 bg-green-600 text-white rounded-md hover:bg-green-700 transition duration-300 transform hover:scale-105 shadow-md"
              >
                Buy via WhatsApp
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Checkout;