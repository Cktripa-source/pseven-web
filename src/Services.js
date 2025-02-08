import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./loading";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("https://pseven-api-test.onrender.com/api/services");
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

  const openModal = (service) => {
    setSelectedService(service);
  };

  const closeModal = () => {
    setSelectedService(null);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-gray-100 py-16 px-6 md:mt-24 mt-20">
      <h1 className="text-3xl md:text-4xl font-extrabold text-center text-gray-800 mb-8">
        Our Services
      </h1>

      <div className="grid md:grid-cols-2 sm:grid-cols-1 grid-cols-1 gap-8">
        {services.map((service, index) => (
          <div
            key={index}
            className="bg-white rounded-xl shadow-lg overflow-hidden transition-all duration-300 hover:scale-105 hover:shadow-2xl"
          >
            <div className="flex">
              {/* Left part - Image with overlay */}
              <div className="relative w-1/2 h-48 md:h-full">
                <img
                  src={`https://pseven-api-test.onrender.com/${service.image}`}
                  alt={service.name}
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black bg-opacity-40 flex justify-center items-center text-white font-bold text-xl">
                  {service.icon} {service.name}
                </div>
              </div>

              {/* Right part - Description and button */}
              <div className="w-1/2 p-6 flex flex-col justify-between">
                <p className="text-gray-600 mb-4 text-lg">{service.description}</p>
                <button
                  onClick={() => openModal(service)}
                  className="bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-semibold py-2 px-6 rounded-full hover:scale-105 transform transition-all hover:bg-green-500"
                >
                  Learn More
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {selectedService && (
        <div className="fixed inset-0 bg-gray-900 bg-opacity-70 flex justify-center items-center z-50 transition-opacity duration-300 opacity-100">
          <div className="bg-white p-6 rounded-lg w-full h-full md:max-w-4xl max-h-full overflow-auto transition-all transform scale-100 md:flex md:flex-row shadow-lg hover:shadow-2xl">
            <button
              onClick={closeModal}
              className="absolute top-4 right-4 text-gray-600 font-bold text-xl hover:text-red-600 transition-colors duration-200"
            >
              X
            </button>

            <div className="flex flex-col md:flex-row justify-center items-center text-center md:text-left h-full space-y-6 md:space-y-0">
              <div className="w-full md:w-1/2 mb-6 md:mb-0 h-full flex justify-center items-center">
                <div
                  className="relative cursor-pointer"
                  onClick={() => setImageModalOpen(true)}
                >
                  <img
                    src={`https://pseven-api-test.onrender.com/${selectedService.image}`}
                    alt={selectedService.name}
                    className="w-full h-64 object-cover rounded-lg transition-all duration-500 transform hover:scale-105 hover:rotate-2"
                  />
                  <div className="absolute inset-0 flex justify-center items-center bg-black bg-opacity-40 rounded-lg hover:bg-opacity-60">
                    <span className="text-white text-lg font-bold">View Full Image</span>
                  </div>
                </div>
              </div>

              <div className="w-full md:w-1/2 pl-6 h-full flex flex-col justify-center items-center md:items-start space-y-4">
                <h2 className="text-3xl font-semibold text-gray-800 mb-4 transition-transform transform hover:scale-105">
                  {selectedService.icon} {selectedService.name}
                </h2>
                <p className="text-gray-600 mb-4 text-lg">{selectedService.description}</p>
                <p className="text-gray-800 mb-6 text-md">{selectedService.details}</p>
                <button
                  className="bg-gray-800 hover:bg-green-600 text-white font-semibold py-3 px-8 rounded-full transition-transform transform hover:scale-110 hover:shadow-xl"
                >
                  Request Service
                </button>
              </div>
            </div>
          </div>

          {imageModalOpen && (
            <div className="fixed inset-0 bg-black bg-opacity-80 flex justify-center items-center z-60">
              <div className="relative max-w-4xl max-h-full">
                <img
                  src={`https://pseven-api-test.onrender.com/${selectedService.image}`}
                  alt={selectedService.name}
                  className="w-auto h-auto max-w-full max-h-[80vh] object-contain rounded-lg"
                />
                <button
                  onClick={() => setImageModalOpen(false)}
                  className="absolute top-4 right-4 text-white font-bold text-xl bg-opacity-60 bg-black hover:bg-red-600 p-2 rounded-full"
                >
                  X
                </button>
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Services;
