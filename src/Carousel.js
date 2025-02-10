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
        const response = await axios.get('https://api.psevenrwanda.com/api/services');
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
    <div className="relative w-full mx-auto h-[600px] flex items-center justify-center overflow-hidden md:mt-28 mt-24">
      {/* Navigation Buttons */}
      <button 
        onClick={handlePrev}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-20 bg-green-500/80 p-3 rounded-full text-white hover:bg-green-600 transition-colors duration-300"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      
      <button 
        onClick={handleNext}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-20 bg-green-500/80 p-3 rounded-full text-white hover:bg-green-600 transition-colors duration-300"
      >
        <ChevronRight className="w-6 h-6" />
      </button>

      <AnimatePresence>
        {services.map((service, index) => (
          index === currentSlide && (
            <motion.div
              key={service._id}
              initial={{ opacity: 0, scale: 1.1 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.9 }}
              transition={{ duration: 0.8 }}
              className="absolute w-full h-full flex items-center justify-center p-4"
            >
              <img 
               src={`https://api.psevenrwanda.com/${service.image}`}
                className="w-full h-full object-cover rounded-2xl shadow-2xl" 
                alt={service.name} 
              />
              <div className="absolute top-0 left-0 w-full h-full bg-gradient-to-t from-black/95 via-black/80 to-black/70 rounded-2xl flex flex-col items-center justify-center text-center px-6">
                <motion.h1 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.2 }}
                  className="text-green-400 mb-6 text-3xl md:text-6xl font-bold tracking-tight"
                >
                  {service.name}
                </motion.h1>
                <motion.p 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.4 }}
                  className="text-gray-200 text-lg md:text-2xl max-w-3xl leading-relaxed"
                >
                  {service.description}
                </motion.p>
                <motion.a 
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 0.6 }}
                  href="#" 
                  className="mt-8 px-8 py-3 bg-green-500 text-white text-lg font-semibold rounded-full hover:bg-green-600 hover:scale-105 transition-all duration-300 shadow-lg hover:shadow-green-500/25"
                >
                  View Details
                </motion.a>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>

      <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2 flex space-x-3 z-20">
        {services.map((_, index) => (
          <button
            key={index}
            className={`w-3 h-3 rounded-full transition-all duration-300 ${
              index === currentSlide 
                ? 'bg-green-500 w-8' 
                : 'bg-gray-400 hover:bg-green-400'
            }`}
            onClick={() => setCurrentSlide(index)}
          />
        ))}
      </div>
    </div>
  );
};

export default Carousel;