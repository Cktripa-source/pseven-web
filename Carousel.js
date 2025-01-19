import React, { useState, useEffect } from 'react';

// Import images
import cameraImage from './images/camera.jpg';
import gimbalImage from './images/gimbal.webp';

const Carousel = () => {
  const [currentSlide, setCurrentSlide] = useState(0);

  // Array of images (doubled as requested)
  const images = [
    { src: cameraImage, caption: "Camera", p: "Welcome here you can buy the digital camera you want" },
    { src: gimbalImage, caption: "Gimbal", p: "Welcome here you can buy the digital gimbal you want" },
    { src: cameraImage, caption: "Camera", p: "Welcome here you can buy the digital camera you want" },
    { src: gimbalImage, caption: "Gimbal", p: "Welcome here you can buy the digital gimbal you want" },
  ];

  // Handle the previous slide click
  const handlePrev = () => {
    setCurrentSlide((prev) => (prev === 0 ? images.length - 1 : prev - 1));
  };

  // Handle the next slide click
  const handleNext = () => {
    setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
  };

  // Handle indicator click
  const handleIndicatorClick = (index) => {
    setCurrentSlide(index);
  };

  // Auto-slide functionality using setInterval
  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentSlide((prev) => (prev === images.length - 1 ? 0 : prev + 1));
    }, 10000); // Change slide every 3 seconds

    // Clean up the interval when the component is unmounted
    return () => clearInterval(interval);
  }, [images.length]);

  return (
    <div id="default-carousel" className="relative w-full h-svh md:mt-40 mt-64">
      {/* Carousel wrapper */}
      <div className="relative w-full h-full overflow-hidden">
        {images.map((image, index) => (
          <div
            key={index}
            className={`${
              index === currentSlide ? 'block' : 'hidden'
            } duration-700 ease-in-out h-full`}
          >
            <img
              src={image.src}
              className="absolute block w-full h-full object-cover"
              alt={`Slide ${index + 1}`}
            />
            {/* Overlay with caption */}
            <div className="absolute top-0 left-0 w-full h-full bg-black/50 flex flex-col items-center justify-center">
              <h1 className="text-blue-400 mb-8 text-5xl font-bold">{image.caption}</h1>
              <p className="text-white text-2xl capitalize text-center">{image.p}</p>
            </div>
          </div>
        ))}
      </div>
      {/* Slider indicators */}
      <div className="absolute z-30 flex -translate-x-1/2 bottom-5 left-1/2 space-x-3 rtl:space-x-reverse">
        {images.map((_, index) => (
          <button
            key={index}
            type="button"
            className={`w-3 h-3 rounded-full ${index === currentSlide ? 'bg-white' : 'bg-gray-400'}`}
            aria-label={`Slide ${index + 1}`}
            onClick={() => handleIndicatorClick(index)}
          />
        ))}
      </div>
      {/* Slider controls */}
      <button
        type="button"
        className="absolute top-0 start-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handlePrev}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 1 1 5l4 4"/>
          </svg>
          <span className="sr-only">Previous</span>
        </span>
      </button>
      <button
        type="button"
        className="absolute top-0 end-0 z-30 flex items-center justify-center h-full px-4 cursor-pointer group focus:outline-none"
        onClick={handleNext}
      >
        <span className="inline-flex items-center justify-center w-10 h-10 rounded-full bg-white/30 dark:bg-gray-800/30 group-hover:bg-white/50 dark:group-hover:bg-gray-800/60 group-focus:ring-4 group-focus:ring-white dark:group-focus:ring-gray-800/70 group-focus:outline-none">
          <svg className="w-4 h-4 text-white dark:text-gray-800 rtl:rotate-180" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 6 10">
            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 9 4-4-4-4"/>
          </svg>
          <span className="sr-only">Next</span>
        </span>
      </button>
    </div>
  );
};

export default Carousel;
