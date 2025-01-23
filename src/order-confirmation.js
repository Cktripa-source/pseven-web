import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const OrderConfirmation = () => {
  const { state } = useLocation();
  const [orderDetails, setOrderDetails] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (state) {
      setOrderDetails(state);
    } else {
      // If there's no state, redirect to homepage or another relevant page
      navigate("/");
    }
  }, [state, navigate]);

  if (!orderDetails) {
    return <div>Loading...</div>; // Show a loading state while we wait for the order details
  }

  const { shippingDetails, cartItems, totalPrice } = orderDetails;

  return (
    <div className="container mx-auto p-4 mt-40">
      <h2 className="text-center mb-4 font-extrabold text-2xl">Order Confirmation</h2>
      <div className="text-lg font-semibold mb-4">
        <p>Thank you for your order, {shippingDetails.name}!</p>
        <p>Your order has been successfully placed, and we will ship it to the following address:</p>
        <p>{shippingDetails.address}</p>
        <p>{shippingDetails.city}, {shippingDetails.zipCode}</p>
        <p>{shippingDetails.email}</p>
      </div>

      <div className="space-y-4">
        <h3 className="text-xl font-semibold">Order Summary</h3>
        {cartItems.map((item, index) => (
          <div key={index} className="flex justify-between">
            <span>{item.name} (x{item.quantity})</span>
            <span>${(parseFloat(item.price.replace("$", "")) * item.quantity).toFixed(2)}</span>
          </div>
        ))}
      </div>

      <div className="mt-4 text-lg font-semibold">
        <p>Total: ${totalPrice}</p>
      </div>

      <div className="mt-6 text-center">
        <p>Your order will be shipped soon. Thank you for shopping with us!</p>
        <button
          onClick={() => navigate("/")}
          className="mt-4 px-6 py-3 bg-blue-600 text-white rounded hover:bg-blue-700 transition duration-300"
        >
          Back to Home
        </button>
      </div>
    </div>
  );
};

export default OrderConfirmation;
