import React, { useState, useEffect } from "react";
import axios from "axios";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Fetch services from the backend
  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("http://localhost:5000/api/services"); // Adjust the URL as needed
        setServices(response.data);
      } catch (err) {
        setError("Error fetching services");
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchServices();
  }, []);

  if (loading) return <div className="text-center text-green-500 bg-green-400 p-2 rounded-md">Loading...</div>;
  if (error) return <div className="text-center text-red-500 bg-red-400 p-2 rounded-md">{error}</div>;

  return (
    <div className="min-h-screen text-white py-16 px-6 md:mt-40 mt-56 ">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold w-full p-2 border-black border border-opacity-30 text-center text-black mb-4">
        Our Services
      </h1>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10">
        {services.map((service, index) => (
          <div
            key={index}
            className="lg:flex   p-4 justify-between  border-black border  border-opacity-20 rounded-md shadow-lg"
          >
            {/* Background Image */}
            <div className="p-2 rounded-md border-black border border-opacity-30">
            <img
              src={service.image} 
              alt={service.name}
              className="w-full h-60 object-cover rounded-md"
            />
            </div>
            <div className="text-center p-2 ">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 text-center">
                {service.icon} {service.name}
              </h2>
              <p className="text-gray-900 text-center max-w-sm mb-6">
                {service.description}
              </p>
              <button className="bg-black hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-full shadow-md transition-transform transform hover:scale-105">
                Learn More
              </button>
            </div>
          </div>
          
        ))}
      </div>
    </div>
  );
}

export default Services;
