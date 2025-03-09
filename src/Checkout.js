import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { ShoppingCart, MessageCircle, MapPin, Mail, Phone, User, Building, ArrowRight, CreditCard } from "lucide-react";

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
      <div className="min-h-screen flex items-center justify-center p-4 bg-gray-50">
        <div className="w-full max-w-md text-center bg-white rounded-xl shadow-md p-8 border border-gray-100">
          <div className="w-20 h-20 bg-gray-50 rounded-full flex items-center justify-center mx-auto mb-6">
            <ShoppingCart className="h-10 w-10 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-800 mb-3">Your cart is empty</h2>
          <p className="text-gray-500 mb-6">Please add items to your cart to continue shopping.</p>
          <button 
            onClick={() => navigate('/')}
            className="px-6 py-3 bg-black text-white rounded-lg hover:bg-green-600 transition-colors duration-300 flex items-center justify-center mx-auto"
          >
            <span>Continue Shopping</span>
            <ArrowRight className="ml-2 h-4 w-4" />
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-16 px-4 sm:px-6 lg:px-8 mt-16 md:mt-32">
      <div className="max-w-6xl mx-auto">
        <div className="text-center mb-10">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Complete Your Order
          </h1>
          <div className="w-16 h-1 bg-green-500 mx-auto mb-4"></div>
          <p className="text-gray-600">Review your items and provide your details</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Order Summary */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100">
              <div className="p-5 border-b border-gray-100 bg-gray-50 flex justify-between items-center">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <ShoppingCart className="h-5 w-5 text-green-500" />
                  Order Summary
                </h2>
                <span className="text-sm font-medium text-gray-500">{cartItems.length} item(s)</span>
              </div>
              
              <div className="divide-y divide-gray-100">
                {cartItems.map((item, index) => (
                  <div
                    key={index}
                    className="flex p-4 hover:bg-gray-50 transition-colors duration-150"
                  >
                    <div className="h-24 w-24 flex-shrink-0 overflow-hidden rounded-md border border-gray-200">
                      <img
                        src={`https://api.psevenrwanda.com/api/${item.image}`}
                        alt={item.name}
                        className="h-full w-full object-cover object-center"
                      />
                    </div>
                    <div className="ml-4 flex flex-1 flex-col">
                      <div className="flex justify-between">
                        <h3 className="font-medium text-gray-900">{item.name}</h3>
                        <p className="font-medium text-gray-900">
                          FRW {(parseFloat(String(item.price).replace("FRW", "")) * item.quantity).toFixed(2)}
                        </p>
                      </div>
                      <div className="mt-1 flex items-end justify-between text-sm">
                        <p className="text-gray-500">Qty {item.quantity}</p>
                        <p className="text-gray-500">FRW {formatCurrency(item.price)} each</p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              <div className="p-5 bg-gray-50 space-y-3">
                <div className="flex justify-between text-gray-600">
                  <span>Subtotal</span>
                  <span>FRW {calculateTotalPrice()}</span>
                </div>
                <div className="flex justify-between text-gray-600">
                  <span>Shipping</span>
                  <span>Calculated at next step</span>
                </div>
                <div className="border-t border-gray-200 pt-3 flex justify-between items-center">
                  <span className="text-lg font-semibold text-gray-900">Total</span>
                  <span className="text-lg font-semibold text-green-600">FRW {calculateTotalPrice()}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Contact Form */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-xl shadow-sm overflow-hidden border border-gray-100 sticky top-8">
              <div className="p-5 border-b border-gray-100 bg-gray-50">
                <h2 className="text-lg font-semibold flex items-center gap-2 text-gray-900">
                  <User className="h-5 w-5 text-green-500" />
                  Your Details
                </h2>
              </div>
              <div className="p-5">
                <form onSubmit={handleWhatsAppOrder} className="space-y-4">
                  <div className="space-y-3">
                    <div>
                      <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">Full Name</label>
                      <div className="relative">
                        <input
                          id="name"
                          type="text"
                          name="name"
                          value={shippingDetails.name}
                          onChange={handleInputChange}
                          placeholder="Enter your full name"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-10"
                          required
                        />
                        <User className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="address" className="block text-sm font-medium text-gray-700 mb-1">Shipping Address</label>
                      <div className="relative">
                        <input
                          id="address"
                          type="text"
                          name="address"
                          value={shippingDetails.address}
                          onChange={handleInputChange}
                          placeholder="Enter your address"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-10"
                          required
                        />
                        <MapPin className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">City</label>
                      <div className="relative">
                        <input
                          id="city"
                          type="text"
                          name="city"
                          value={shippingDetails.city}
                          onChange={handleInputChange}
                          placeholder="Enter your city"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-10"
                          required
                        />
                        <Building className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">Email Address</label>
                      <div className="relative">
                        <input
                          id="email"
                          type="email"
                          name="email"
                          value={shippingDetails.email}
                          onChange={handleInputChange}
                          placeholder="Enter your email"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-10"
                          required
                        />
                        <Mail className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                      </div>
                    </div>
                    
                    <div>
                      <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">Phone Number</label>
                      <div className="relative">
                        <input
                          id="phone"
                          type="tel"
                          name="phoneNumber"
                          value={shippingDetails.phoneNumber}
                          onChange={handleInputChange}
                          placeholder="Enter your phone number"
                          className="w-full px-4 py-3 rounded-lg border border-gray-200 focus:ring-2 focus:ring-green-500 focus:border-transparent transition-all pl-10"
                          required
                        />
                        <Phone className="h-4 w-4 text-gray-400 absolute left-3 top-3.5" />
                      </div>
                    </div>
                  </div>

                  <div className="pt-4">
                    <button
                      type="submit"
                      className="w-full flex items-center justify-center gap-2 px-6 py-3 bg-black text-white rounded-lg hover:bg-green-600 transition-colors duration-300 font-medium"
                    >
                      <CreditCard className="h-5 w-5" />
                      Complete via WhatsApp
                    </button>
                    <p className="text-xs text-gray-500 text-center mt-3">
                      Your order details will be sent securely via WhatsApp for payment processing.
                    </p>
                  </div>
                </form>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Checkout;