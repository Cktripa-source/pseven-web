import React, { useState, useEffect } from "react";
import axios from "axios";
import Loading from "./loading";
import { ArrowUpRight, X, ExternalLink, ZoomIn, ChevronRight } from "lucide-react";

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
    setImageModalOpen(false);
  };

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gradient-to-b from-gray-50 to-white">
        <Loading />
      </div>
    );
  }

  if (error) return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="text-center p-8 bg-red-50 rounded-xl shadow-lg border border-red-100">
        <div className="text-red-500 text-xl font-semibold mb-2">Error Loading Services</div>
        <div className="text-red-400">{error}</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white py-24 px-6 md:mt-24 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-16">
          <div className="inline-block mb-2">
            <span className="bg-green-100 text-green-800 text-sm font-medium px-4 py-1 rounded-full">Our Expertise</span>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Services We Provide
          </h1>
          <div className="w-20 h-1 bg-green-500 mx-auto mb-6"></div>
          <p className="text-gray-600 text-lg max-w-2xl mx-auto">
            Discover our comprehensive range of professional services tailored to meet your technology needs
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {services.map((service, index) => (
            <div
              key={index}
              className="group bg-white rounded-xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 border border-gray-100"
            >
              <div className="flex flex-col h-full">
                {/* Image Section */}
                <div className="relative w-full h-64 overflow-hidden">
                  <img
                    src={`https://api.psevenrwanda.com/${service.image}`}
                    alt={service.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/30 to-transparent flex flex-col justify-end p-6">
                    <div className="bg-white/10 backdrop-blur-md w-12 h-12 rounded-lg flex items-center justify-center mb-3">
                      <span className="text-white text-xl">{service.icon}</span>
                    </div>
                    <h3 className="text-white text-2xl font-bold">{service.name}</h3>
                  </div>
                </div>

                {/* Content Section */}
                <div className="p-6 flex flex-col flex-grow">
                  <p className="text-gray-600 leading-relaxed mb-6 line-clamp-3">
                    {service.description}
                  </p>
                  <button
                    onClick={() => openModal(service)}
                    className="mt-auto flex items-center text-black font-medium group-hover:text-green-600 transition-colors duration-300"
                  >
                    <span>Discover More</span>
                    <ChevronRight size={18} className="ml-2 transition-transform duration-300 group-hover:translate-x-1" />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Service Modal */}
        {selectedService && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50 p-4" onClick={closeModal}>
            <div 
              className="bg-white rounded-xl w-full max-w-4xl max-h-[90vh] overflow-auto relative shadow-2xl"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                onClick={closeModal}
                className="absolute top-4 right-4 p-2 bg-gray-100 hover:bg-red-50 rounded-full transition-colors duration-200 z-10"
              >
                <X size={20} className="text-gray-500 hover:text-red-500" />
              </button>

              <div className="flex flex-col md:flex-row">
                {/* Image Section */}
                <div className="w-full md:w-5/12 md:h-auto">
                  <div
                    className="relative cursor-pointer h-full"
                    onClick={() => setImageModalOpen(true)}
                  >
                    <img
                      src={`https://api.psevenrwanda.com/${selectedService.image}`}
                      alt={selectedService.name}
                      className="w-full h-64 md:h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-black/30 hover:bg-black/50 flex items-center justify-center transition-all duration-300">
                      <div className="bg-white/10 backdrop-blur-sm px-3 py-2 rounded-lg flex items-center space-x-2">
                        <ZoomIn size={16} className="text-white" />
                        <span className="text-white text-sm">View Full Image</span>
                      </div>
                    </div>
                  </div>
                </div>

                {/* Content Section */}
                <div className="w-full md:w-7/12 p-8 flex flex-col">
                  <div className="flex items-center gap-3 mb-2">
                    <div className="bg-green-100 p-2 rounded-lg">
                      <span className="text-green-600">{selectedService.icon}</span>
                    </div>
                    <span className="text-green-600 text-sm font-medium uppercase tracking-wider">Professional Service</span>
                  </div>
                  
                  <h2 className="text-2xl font-bold text-gray-900 mb-4">
                    {selectedService.name}
                  </h2>
                  
                  <div className="bg-gray-50 p-4 rounded-lg mb-6">
                    <p className="text-gray-700 font-medium italic">
                      {selectedService.description}
                    </p>
                  </div>
                  
                  <div className="space-y-4 mb-8">
                    <h3 className="text-lg font-semibold text-gray-800">Service Details</h3>
                    <p className="text-gray-600 leading-relaxed">
                      {selectedService.details}
                    </p>
                  </div>
                  
                  <button className="mt-auto bg-black text-white font-medium py-3 px-6 rounded-lg hover:bg-green-600 transition-all duration-300 flex items-center justify-center space-x-2 group">
                    <span>Request This Service</span>
                    <ArrowUpRight size={18} className="transition-transform duration-300 group-hover:translate-x-1 group-hover:-translate-y-1" />
                  </button>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Full Image Modal */}
        {imageModalOpen && (
          <div 
            className="fixed inset-0 bg-black/90 backdrop-blur-sm flex justify-center items-center z-60 p-4"
            onClick={() => setImageModalOpen(false)}
          >
            <div className="relative max-w-5xl w-full" onClick={(e) => e.stopPropagation()}>
              <img
                src={`https://api.psevenrwanda.com/${selectedService.image}`}
                alt={selectedService.name}
                className="w-full h-auto max-h-[85vh] object-contain rounded-lg"
              />
              <button
                onClick={() => setImageModalOpen(false)}
                className="absolute top-4 right-4 p-2 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-full transition-all duration-200"
              >
                <X size={20} className="text-white" />
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default Services;