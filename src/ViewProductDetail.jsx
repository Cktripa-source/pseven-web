import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { Star, Truck, ShieldCheck, ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";

const API_URL = "https://pseven-api-test.onrender.com/api";

const COLOR_MAP = {
  "red": "bg-red-500",
  "blue": "bg-blue-500",
  "green": "bg-green-500",
  "yellow": "bg-yellow-500",
  "purple": "bg-purple-500",
  "pink": "bg-pink-500",
  "gray": "bg-gray-500",
  "black": "bg-black",
  "white": "bg-white",
};

function ViewProductDetail() {
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cleanedColors, setCleanedColors] = useState([]);
  const { cart, setCart } = useCart();

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();

        // Ensure reviews property exists
        const processedData = {
          ...data,
          reviews: data.reviews || 0,
          rating: data.rating || 0,
          discount: data.discount || 0,
          originalPrice: data.originalPrice || data.price
        };

        const colorsString = data.colors?.[0] || "";
        const cleanedColorsArray = cleanAndParseColors(colorsString);

        setProduct(processedData);
        setCleanedColors(cleanedColorsArray);
        if (cleanedColorsArray?.length > 0) {
          setSelectedColor(cleanedColorsArray[0]);
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const cleanAndParseColors = (colorsString) => {
    if (!colorsString) return [];
    return colorsString
      .replace(/["[\]]/g, "")
      .split(",")
      .map((color) => color.trim().toLowerCase())
      .map((color) => color.replace(/"/g, ""))
      .filter(Boolean);
  };

  const addToCart = () => {
    const newItem = {
      ...product,
      quantity,
      selectedColor,
      cartId: `${product._id}-${selectedColor}-${Date.now()}`
    };
    setCart([...cart, newItem]);
  };

  const buyViaWhatsApp = () => {
    const message = `Hello, I would like to buy ${quantity} unit(s) of ${product.name} in ${selectedColor}.`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  if (isLoading) {
    return (
      <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mt-32">
        <div className="bg-white p-4 rounded-lg shadow-md">
          <div className="w-full h-96 bg-gray-200 animate-pulse rounded-md"></div>
        </div>
        <div className="bg-white p-6 rounded-lg shadow-md space-y-4">
          <div className="h-8 bg-gray-200 animate-pulse rounded w-3/4"></div>
          <div className="h-20 bg-gray-200 animate-pulse rounded w-full"></div>
          <div className="h-6 bg-gray-200 animate-pulse rounded w-1/4"></div>
          <div className="flex gap-2">
            {[1, 2, 3, 4, 5].map((i) => (
              <div key={i} className="w-10 h-10 bg-gray-200 animate-pulse rounded-full"></div>
            ))}
          </div>
          <div className="flex gap-4 mt-6">
            <div className="h-12 bg-gray-200 animate-pulse rounded w-1/2"></div>
            <div className="h-12 bg-gray-200 animate-pulse rounded w-1/2"></div>
          </div>
        </div>
      </div>
    );
  }

  if (!product) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <h2 className="text-2xl font-bold text-gray-800">Product Not Found</h2>
          <p className="text-gray-600">The product you're looking for doesn't exist or has been removed.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mt-32">
      {/* Product Images */}
      <div className="bg-white p-4 rounded-lg shadow-md group">
        <div className="relative overflow-hidden rounded-md">
          <img
           src={`https://api.psevenrwanda.com/api/${product.image}`} 
            alt={product.name}
            className="w-full object-cover rounded-md transition-transform duration-300 group-hover:scale-105"
          />
          {product.discount > 0 && (
            <div className="absolute top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-full">
              -{product.discount}% OFF
            </div>
          )}
        </div>
      </div>

      {/* Product Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-4 leading-relaxed">{product.description}</p>

        {/* Pricing */}
        <div className="flex items-baseline gap-2 mb-4">
          <span className="text-3xl font-bold text-red-500">${product.price}</span>
          {product.originalPrice > product.price && (
            <span className="text-lg text-gray-400 line-through">${product.originalPrice}</span>
          )}
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 mb-6">
          <div className="flex text-yellow-400">
            {[...Array(5)].map((_, i) => (
              <Star
                key={i}
                className={`w-5 h-5 ${i < Math.round(product.rating) ? "fill-current" : "stroke-current"}`}
              />
            ))}
          </div>
          <span className="text-gray-600 ml-2">
            {product.rating.toFixed(1)} ({product.reviews > 0 ? product.reviews.toLocaleString() : 'No'} reviews)
          </span>
        </div>

        {/* Color Selection */}
        {cleanedColors.length > 0 && (
          <div className="mb-6">
            <h3 className="text-lg font-semibold mb-3">Available Colors:</h3>
            <div className="flex flex-wrap gap-3">
              {cleanedColors.map((color) => (
                <button
                  key={color}
                  onClick={() => setSelectedColor(color)}
                  className={`
                    w-12 h-12 rounded-full border-2 transition-all duration-200
                    ${selectedColor === color ? "border-black scale-110" : "border-gray-300"}
                    ${COLOR_MAP[color] || "bg-gray-200"}
                    hover:shadow-lg relative group
                  `}
                >
                  <span className="absolute -bottom-8 left-1/2 transform -translate-x-1/2 
                    bg-gray-800 text-white px-2 py-1 rounded text-xs opacity-0 
                    group-hover:opacity-100 transition-opacity whitespace-nowrap">
                    {color.charAt(0).toUpperCase() + color.slice(1)}
                  </span>
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mb-6">
          <h3 className="text-lg font-semibold mb-3">Quantity:</h3>
          <div className="flex items-center gap-4">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 
                transition-colors duration-200 flex items-center justify-center text-xl"
            >
              -
            </button>
            <span className="text-xl font-medium w-12 text-center">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-10 h-10 rounded-full bg-gray-100 hover:bg-gray-200 
                transition-colors duration-200 flex items-center justify-center text-xl"
            >
              +
            </button>
          </div>
        </div>

        {/* Additional Info */}
        <div className="space-y-3 mb-6">
          {product.seller && (
            <div className="flex items-center text-gray-700">
              <ShieldCheck className="text-green-500 mr-2" />
              <span>Verified Seller: {product.seller}</span>
            </div>
          )}
          {product.shippingTime && (
            <div className="flex items-center text-gray-700">
              <Truck className="text-blue-500 mr-2" />
              <span>Delivery: {product.shippingTime} days</span>
            </div>
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={addToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-yellow-500 
              text-white px-6 py-3 rounded-lg hover:bg-yellow-600 transition-colors duration-200"
          >
            <ShoppingCart className="w-5 h-5" />
            Add to Cart
          </button>
          <button
            onClick={buyViaWhatsApp}
            className="flex-1 bg-green-500 text-white px-6 py-3 rounded-lg 
              hover:bg-green-600 transition-colors duration-200"
          >
            Buy via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewProductDetail;