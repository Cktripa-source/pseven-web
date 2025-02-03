import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';

// Import images
import cameraImage from './images/camera.jpg';
import gimbalImage from './images/gimbal.webp';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  const images = [
    { src: cameraImage, caption: "Camera", p: "Welcome here you can buy the digital camera you want" },
    { src: gimbalImage, caption: "Gimbal", p: "Welcome here you can buy the digital gimbal you want" },
    { src: cameraImage, caption: "Camera", p: "Welcome here you can buy the digital camera you want" },
    { src: gimbalImage, caption: "Gimbal", p: "Welcome here you can buy the digital gimbal you want" },
  ];

  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  const handleNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 5000);

    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div className="relative w-full md:min-h-screen flex items-center justify-center overflow-hidden">
      {/* Controls at the top center */}
      <div className="absolute top-5 left-1/2 transform -translate-x-1/2 flex space-x-4">
        <button
          className="bg-black/50 p-3 rounded-full text-white hover:bg-black/70"
          onClick={handlePrev}
        >
          <ChevronLeft size={30} />
        </button>
        <button
          className="bg-black/50 p-3 rounded-full text-white hover:bg-black/70"
          onClick={handleNext}
        >
          <ChevronRight size={30} />
        </button>
      </div>
      
      <AnimatePresence>
        {images.map((image, index) => (
          index === currentSlide && (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: -100 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 100 }}
              transition={{ duration: 0.8 }}
              className="absolute w-full h-full flex items-center justify-center"
            >
              <img
                src={image.src}
                className="w-full h-full object-cover"
                alt={image.caption}
              />
              <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col items-center justify-center text-center">
                <h1 className="text-green-400 mb-4 text-5xl font-bold">{image.caption}</h1>
                <p className="text-white text-2xl">{image.p}</p>
                <a href="#" className="mt-4 px-6 py-2 bg-green-500 text-white rounded-full hover:bg-green-700">View Details</a>
              </div>
            </motion.div>
          )
        ))}
      </AnimatePresence>
      
      {/* Indicators */}
      <div className="absolute bottom-5 left-1/2 transform -translate-x-1/2 flex space-x-2 mt-12">
        {images.map((_, index) => (
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
