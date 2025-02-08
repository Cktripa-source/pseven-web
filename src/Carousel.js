import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import axios from 'axios';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [services, setServices] = useState([]);

  useEffect(() => {
    const fetchServices = async () => {
      try {
        const response = await axios.get('https://pseven-api-test.onrender.com/api/services'); // Update with your backend URL
        setServices(response.data);
      } catch (error) {
        console.error('Error fetching services:', error);
      }
    };

    fetchServices();
  }, []);

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? services.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === services.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === services.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [services.length]);

  return (
    <div className="relative max-w-7xl m-auto h-96 flex items-center justify-center overflow-hidden md:mt-28 mt-24">
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button className="bg-black/50 p-3 rounded-full text-white hover:bg-black/70" onClick={handlePrev}>
          <ChevronLeft size={30} />
        </button>
        <button className="bg-black/50 p-3 rounded-full text-white hover:bg-black/70" onClick={handleNext}>
          <ChevronRight size={30} />
        </button>
      </div>

      <AnimatePresence>
        {services.map((service, index) => (
          index === currentSlide && (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.8 }}
              className="absolute w-full h-full flex items-center justify-center p-4"
            >
              <img src={`https://pseven-api-test.onrender.com/${service.image}`} className="w-full h-full object-cover" alt={service.name} />
              <div className="absolute top-0 left-0 w-full h-full bg-black/90 flex flex-col items-center justify-center text-center">
                <h1 className="text-green-400 mb-4 text-2xl md:text-5xl font-bold">{service.name}</h1>
                <p className="text-white text-lg md:text-2xl w-2/3">{service.description}</p>
                <a href="#" className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-700">View Details</a>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 mt-12">
        {services.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-400'}`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;
