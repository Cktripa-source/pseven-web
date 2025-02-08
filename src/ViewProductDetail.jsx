import React, { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Star, Truck, ShieldCheck, ShoppingCart } from "lucide-react";
import { useCart } from "./CartContext";

const API_URL = "https://pseven-api-test.onrender.com/api";

function ViewProductDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [selectedColor, setSelectedColor] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [cleanedColors, setCleanedColors] = useState([]); // Added state for colors
  const { cart, setCart } = useCart();

  useEffect(() => {
    const fetchProductDetail = async () => {
      setIsLoading(true);
      try {
        const res = await fetch(`${API_URL}/products/${id}`);
        if (!res.ok) throw new Error("Product not found");
        const data = await res.json();
        console.log("Product Data:", data);

        // Fixing the color issue: clean and parse the colors
        const colorsString = data.colors[0]; // Get the color string
        const cleanedColorsArray = cleanAndParseColors(colorsString); // Clean the string before parsing

        setProduct(data);
        setCleanedColors(cleanedColorsArray); // Store cleaned colors in state
        if (cleanedColorsArray && cleanedColorsArray.length > 0) {
          setSelectedColor(cleanedColorsArray[0]); // Set the first color as selected by default
        }
      } catch (error) {
        console.error("Error fetching product details:", error);
        // Optionally, set an error state to display a message to the user
      } finally {
        setIsLoading(false);
      }
    };

    fetchProductDetail();
  }, [id]);

  const cleanAndParseColors = (colorsString) => {
    // Clean the colors string before parsing
    const cleanedString = colorsString
      .replace(/["\[\]]/g, "") // Remove quotes and square brackets
      .split(",") // Split by commas to get individual colors
      .map((color) => color.trim()) // Remove any extra spaces
      .map((color) => color.replace(/"/g, "")); // Remove extra quotes
    return cleanedString;
  };

  const addToCart = () => {
    setCart([...cart, { ...product, quantity, selectedColor }]);
  };

  const buyViaWhatsApp = () => {
    const message = `Hello, I would like to buy ${quantity} unit(s) of ${product.name} in ${selectedColor}.`;
    const whatsappURL = `https://wa.me/?text=${encodeURIComponent(message)}`;
    window.open(whatsappURL, "_blank");
  };

  if (isLoading) return <div className="text-center py-20">Loading...</div>;
  if (!product) return <div className="text-center py-20">Product not found</div>;

  return (
    <div className="container mx-auto p-6 grid grid-cols-1 md:grid-cols-2 gap-8 mt-32">
      {/* Product Images */}
      <div className="bg-white p-4 rounded-lg shadow-md">
        <img
          src={`https://pseven-api-test.onrender.com/api/${product.image}`}
          alt={product.name}
          className="w-full object-cover rounded-md"
        />
      </div>

      {/* Product Details */}
      <div className="bg-white p-6 rounded-lg shadow-md">
        <h1 className="text-3xl font-bold mb-2">{product.name}</h1>
        <p className="text-gray-600 mb-2">{product.description}</p>

        {/* Pricing */}
        <div className="flex items-center text-2xl font-bold text-red-500 mb-4">
          ${product.price} <span className="text-sm text-gray-500 ml-2">per unit</span>
        </div>

        {/* Rating */}
        <div className="flex items-center gap-1 text-yellow-400">
          {[...Array(5)].map((_, i) => (
            <Star key={i} className={i < product.rating ? "fill-current" : "stroke-current"} />
          ))}
          <span className="text-gray-600 ml-2">{product.rating} ({product.reviews} reviews)</span>
        </div>

        {/* Color Selection */}
        {cleanedColors && cleanedColors.length > 0 && (
          <div className="mt-4">
            <h3 className="text-lg font-semibold mb-2">Choose Color:</h3>
            <div className="flex gap-2">
              {cleanedColors.map((color, index) => (
                <button
                  key={index}
                  onClick={() => setSelectedColor(color)}
                  className={`w-10 h-10 rounded-full border-2 transition-all ${selectedColor === color ? "border-black scale-110" : "border-gray-300"}`}
                  style={{ backgroundColor: color }}
                />
              ))}
            </div>
          </div>
        )}

        {/* Quantity Selector */}
        <div className="mt-4 flex items-center gap-4">
          <button
            onClick={() => setQuantity(Math.max(1, quantity - 1))}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            -
          </button>
          <span className="text-lg">{quantity}</span>
          <button
            onClick={() => setQuantity(quantity + 1)}
            className="bg-gray-300 px-3 py-1 rounded"
          >
            +
          </button>
        </div>

        {/* Seller & Shipping Info */}
        <div className="mt-6 space-y-3">
          <div className="flex items-center text-gray-700">
            <ShieldCheck className="text-green-500 mr-2" /> Verified Seller: {product.seller}
          </div>
          <div className="flex items-center text-gray-700">
            <Truck className="text-blue-500 mr-2" /> Ships within {product.shippingTime} days
          </div>
        </div>

        {/* Buttons */}
        <div className="mt-6 flex gap-4">
          <button
            onClick={addToCart}
            className="flex items-center gap-2 bg-yellow-500 text-white px-6 py-3 rounded-lg hover:bg-yellow-600"
          >
            <ShoppingCart /> Add to Cart
          </button>
          <button
            onClick={buyViaWhatsApp}
            className="bg-green-500 text-white px-6 py-3 rounded-lg hover:bg-green-600"
          >
            Buy via WhatsApp
          </button>
        </div>
      </div>
    </div>
  );
}

export default ViewProductDetail;
