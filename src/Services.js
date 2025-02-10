import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./loading";
import { AArrowUpIcon, X, ExternalLink, ZoomIn } from "lucide-react";

const Services = () => {
  const [services, setServices] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedService, setSelectedService] = useState(null);
  const [imageModalOpen, setImageModalOpen] = useState(false);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get("https://api.psevenrwanda.com/api/services");
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
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-br from-gray-50 to-gray-100">
        <Loading />
      </div>
    );
  }

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-red-50 rounded-2xl shadow-lg">
        <div className="text-red-500 text-xl font-semibold mb-2">Error Loading Services</div>
        <div className="text-red-400">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-20 px-6 md:mt-24 mt-20">
      <div className="max-w-7xl mx-auto">
        <h1 className="text-4xl md:text-5xl font-extrabold text-center text-gray-800 mb-4">
          Our Services
        </h1>
        <p className="text-center text-gray-600 text-lg mb-12 max-w-2xl mx-auto">
          Discover our comprehensive range of professional services tailored to meet your needs
        </p>

        <div className="grid md:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-2xl shadow-lg overflow-hidden transition-all duration-500 hover:shadow-2xl hover:translate-y--2"
            >
              <div className="flex flex-col md:flex-row h-full">
                {/* Image Section */}
                <div className="relative w-full md:w-1/2 h-64 md:h-auto overflow-hidden">
                  <img
                    src={`https://api.psevenrwanda.com/${service.image}`}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-gradient-to-b from-black/60 to-black/20 flex flex-col justify-center items-center p-6 transition-opacity duration-300">
                    <span className="text-white text-3xl mb-2">{service.icon}</span>
                    <h3 className="text-white text-2xl font-bold text-center">{service.name}</h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 p-6 flex flex-col justify-between bg-white">
                  <div>
                    <p className="text-gray-600 text-lg leading-relaxed mb-6">
                      {service.description}
                    </p>
                  </div>
                  <button
                    onClick={() => openModal(service)}
                     className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-green-500 transition duration-300 flex items-center justify-center space-x-2"
                  >
                    <span>Learn More</span>
                    <ExternalLink size={18} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/80 backdrop-blur-sm flex justify-center items-center z-50 p-4">
            <div className="bg-white rounded-2xl w-full max-w-4xl max-h-[90vh] overflow-auto relative">
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-100 rounded-full transition-colors duration-200 group"
              >
                <X size={24} className="text-gray-600 group-hover:text-red-600" />
              </button>

              <div className="flex flex-col md:flex-row p-6 gap-8">
                {/* Image Section */}
                <div className="w-full md:w-1/2">
                  <div
                    className="relative rounded-xl overflow-hidden cursor-pointer group"
                    onClick={() => setImageModalOpen(true)}
                  >
                    <img
                      src={`https://api.psevenrwanda.com/${selectedService.image}`}
                      alt={selectedService.name}
                      className="w-full h-[300px] md:h-[400px] object-cover transition-transform duration-500 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-black/40 group-hover:bg-black/60 flex items-center justify-center transition-all duration-300">
                      <div className="bg-white/20 backdrop-blur-sm px-4 py-2 rounded-lg flex items-center space-x-2">
                        <ZoomIn size={20} className="text-white" />
                        <span className="text-white font-medium">View Full Image</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-1/2 flex flex-col">
                  <h2 className="text-3xl font-bold text-gray-800 mb-4 flex items-center gap-3">
                    {selectedService.icon}
                    <span>{selectedService.name}</span>
                  </h2>
                  <p className="text-gray-600 text-lg mb-6 leading-relaxed">
                    {selectedService.description}
                  </p>
                  <p className="text-gray-700 mb-8 leading-relaxed">
                    {selectedService.details}
                  </p>
                  <button className="mt-auto bg-gradient-to-r from-green-500 to-green-600 text-white font-semibold py-3 px-8 rounded-xl hover:from-green-600 hover:to-green-700 transition-all duration-300 hover:shadow-lg transform hover:scale-[1.02] flex items-center justify-center space-x-2">
                    <span>Request Service</span>
                    <AArrowUpIcon size={18} />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Image Modal */}
        {imageModalOpen && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-60 p-4">
            <div className="relative max-w-5xl w-full">
              <img
                src={`https://api.psevenrwanda.com/${selectedService.image}`}
                alt={selectedService.name}
                className="w-full h-auto max-h-[85vh] object-contain rounded-xl"
              />
              <button
                onClick={() => setImageModalOpen(false)}
                className="absolute top-4 right-4 p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-200"
              >
                <X size={24} className="text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;