import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, MessageCircle, MapPin, Mail, Phone } from "lucide-react";

const Checkout = ({ setCartCount }) => {
  const [cartItems, setCartItems] = useState([]);
  const [shippingDetails, setShippingDetails] = useState({
    name: "",
    address: "",
    city: "",
    email: "",
    phoneNumber: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const savedCartItems = localStorage.getItem("cart");
    if (savedCartItems) {
      setCartItems(JSON.parse(savedCartItems));
    }
  }, []);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setShippingDetails((prev) => ({ ...prev, [name]: value }));
  };

  const formatCurrency = (price) => {
    return parseFloat(String(price).replace("FRW", "")).toFixed(2);
  };

  const calculateTotalPrice = () => {
    return cartItems.reduce((total, item) => {
      const itemPrice = parseFloat(String(item.price).replace("FRW", "")) || 0;
      return total + itemPrice * item.quantity;
    }, 0).toFixed(2);
  };

  const handleWhatsAppOrder = (e) => {
    e.preventDefault();
    
    // Get current date and time
    const orderDate = new Date().toLocaleDateString();
    const orderTime = new Date().toLocaleTimeString();
  
    // Format order items
    const orderItems = cartItems.map(item => {
        const price = formatCurrency(item.price);
        const total = (price * item.quantity).toFixed(2);
        return `• *${item.name}*%0A  Quantity: ${item.quantity}%0A  Price: *FRW ${price}*%0A  Subtotal: *$${total}*%0A`;
    }).join('%0A%0A');
  
    // Construct the message
    const message = `🛍️ NEW ORDER%0A` +
        `-----------------------------%0A` +
        `📅 *Date:* ${orderDate}%0A` +
        `⏰ *Time:* ${orderTime}%0A` +
        `📦 *ORDER DETAILS*%0A` +
        `------------------------------------------------------------------%0A` +
        `${orderItems}%0A` +
        `------------------------------------------------------------------%0A` +
        `💰 *TOTAL AMOUNT: $${calculateTotalPrice()}*%0A` +
        `👤 *CUSTOMER DETAILS*%0A` +
        `-------------------%0A` +
        `Name: *${shippingDetails.name}*%0A` +
        `📍 Address: *${shippingDetails.address}*%0A` +
        `🏢 City: *${shippingDetails.city}*%0A` +
        `📧 Email: *${shippingDetails.email}*%0A` +
        `📱 Phone: *${shippingDetails.phoneNumber}*%0A` +
        `Thank you for your order! 🙏%0A` +
        `-------------------`;
  
    // Send the message via WhatsApp
    const phoneNumber = "+250791855396";
    window.open(`https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`, "_blank");
};

  if (cartItems.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center p-2">
        <div className="w-full max-w-md text-center bg-white rounded-lg shadow-lg p-6">
          <ShoppingCart className="mx-auto h-12 w-12 text-gray-400 mb-4" />
          <h2 className="text-2xl font-semibold text-gray-700 mb-2">Your cart is empty</h2>
          <p className="text-gray-500">Please add items to your cart to continue shopping.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-green-50 py-12 px-4 sm:px-6 lg:px-8 mt-16 md:mt-32">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl font-bold text-center mb-2 bg-gradient-to-r from-black to-indigo-600 bg-clip-text text-transparent">
          Checkout
        </h1>
        <p className="text-center text-gray-600 mb-8">Complete your order via WhatsApp</p>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Order Summary */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
            <div className="p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-indigo-50">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-black">
                <ShoppingCart className="h-5 w-5" />
                Order Summary
              </h2>
            </div>
            <div className="p-6">
              <div className="grid gap-4 sm:grid-cols-1 md:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex flex-col sm:flex-row items-center gap-4 p-4 bg-white rounded-xl shadow-sm border border-green-100 hover:shadow-md transition-all duration-300"
                  >
                    <div className="relative h-32 w-32 sm:h-24 sm:w-24 rounded-lg overflow-hidden">
                      <img
                        src={`https://api.psevenrwanda.com/api/${item.image}`}
                        alt={item.name}
                        className="object-cover w-full h-full transform hover:scale-110 transition-transform duration-300"
                      />
                    </div>
                    <div className="flex-1 text-center sm:text-left">
                      <h3 className="font-medium text-gray-900 text-lg">{item.name}</h3>
                      <p className="text-black">Quantity: {item.quantity}</p>
                      <p className="font-semibold text-indigo-600 text-lg mt-2">
                        FRW {(parseFloat(String(item.price).replace("FRW", "")) * item.quantity).toFixed(2)}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
              <div className="pt-6 mt-6 border-t border-green-100">
                <div className="flex justify-between items-center text-xl font-semibold">
                  <span className="text-gray-800">Total</span>
                  <span className="text-indigo-600">FRW {calculateTotalPrice()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="bg-white rounded-2xl shadow-xl overflow-hidden border border-green-100">
            <div className="p-6 border-b border-green-100 bg-gradient-to-r from-green-50 to-indigo-50">
              <h2 className="text-xl font-semibold flex items-center gap-2 text-black">
                <MessageCircle className="h-5 w-5" />
                Contact Details
              </h2>
            </div>
            <div className="p-6">
              <form onSubmit={handleWhatsAppOrder} className="space-y-6">
                <div className="space-y-4">
                  <div className="relative">
                    <input
                      type="text"
                      name="name"
                      value={shippingDetails.name}
                      onChange={handleInputChange}
                      placeholder="Full Name"
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-10"
                      required
                    />
                    <ShoppingCart className="h-5 w-5 text-black absolute left-3 top-3.5" />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="address"
                      value={shippingDetails.address}
                      onChange={handleInputChange}
                      placeholder="Shipping Address"
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-10"
                      required
                    />
                    <MapPin className="h-5 w-5 text-black absolute left-3 top-3.5" />
                  </div>
                  <div className="relative">
                    <input
                      type="text"
                      name="city"
                      value={shippingDetails.city}
                      onChange={handleInputChange}
                      placeholder="City"
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-10"
                      required
                    />
                    <MapPin className="h-5 w-5 text-black absolute left-3 top-3.5" />
                  </div>
                  <div className="relative">
                    <input
                      type="email"
                      name="email"
                      value={shippingDetails.email}
                      onChange={handleInputChange}
                      placeholder="Email Address"
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-10"
                      required
                    />
                    <Mail className="h-5 w-5 text-black absolute left-3 top-3.5" />
                  </div>
                  <div className="relative">
                    <input
                      type="tel"
                      name="phoneNumber"
                      value={shippingDetails.phoneNumber}
                      onChange={handleInputChange}
                      placeholder="Phone Number"
                      className="w-full px-4 py-3 rounded-xl border border-green-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-10"
                      required
                    />
                    <Phone className="h-5 w-5 text-black absolute left-3 top-3.5" />
                  </div>
                </div>

                <button
                  type="submit"
                  className="w-full flex items-center justify-center gap-2 px-6 py-4 bg-gradient-to-r from-gray-500 to-emerald-500 text-white rounded-xl hover:from-gray-600 hover:to-emerald-600 transition-all transform hover:scale-[1.02] shadow-lg"
                >
                  <MessageCircle className="h-5 w-5" />
                  Complete Order via WhatsApp
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;