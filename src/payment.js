import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";

const Payment = () => {
  const { state } = useLocation();
  const { shippingDetails, cartItems, totalPrice } = state || {};
  const [paymentStatus, setPaymentStatus] = useState(null);
  const navigate = useNavigate();

  const handlePayment = async () => {
    try {
      // Simulate payment request to MTN Rwanda API (mocked)
      const paymentSuccess = true; // Change this to integrate with the MTN API
      if (paymentSuccess) {
        // On successful payment, save order to database
        const orderDetails = { shippingDetails, cartItems, totalPrice };
        await saveOrderToDatabase(orderDetails); // Placeholder function to save order
        setPaymentStatus("success");
        alert("Payment successful! Your order has been placed.");
        navigate("/order-confirmation"); // Redirect to order confirmation page
      } else {
        setPaymentStatus("failure");
        alert("Payment failed! Please try again.");
        navigate("/checkout"); // Redirect back to checkout page if payment fails
      }
    } catch (error) {
      console.error("Payment failed:", error);
      setPaymentStatus("failure");
      alert("Payment error! Please try again later.");
      navigate("/checkout"); // Redirect back to checkout page if an error occurs
    }
  };

  const saveOrderToDatabase = async (orderDetails) => {
    // Here you would send order details to your backend to save it in the database.
    // For example, using fetch or axios:
    // const response = await fetch('/api/orders', {
    //   method: 'POST',
    //   body: JSON.stringify(orderDetails),
    //   headers: { 'Content-Type': 'application/json' }
    // });
    console.log("Order saved:", orderDetails);
  };

  return (
    <div className="container mx-auto p-4 mt-40">
      <h2 className="text-center mb-4 font-extrabold text-2xl">Payment</h2>

      <div className="text-lg font-semibold mb-4">
        <p>Shipping Details:</p>
        <p>{shippingDetails.name}</p>
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

      <button
        onClick={handlePayment}
        className="mt-6 px-6 py-3 bg-green-600 text-white rounded hover:bg-green-700 transition duration-300"
      >
        Pay Now
      </button>

      {paymentStatus === "success" && (
        <div className="mt-6 text-center text-green-600">Payment successful!</div>
      )}
      {paymentStatus === "failure" && (
        <div className="mt-6 text-center text-green-600">Payment failed! Please try again.</div>
      )}
    </div>
  );
};

export default Payment;
