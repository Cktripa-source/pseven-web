import React from "react";
import audioVideo from "./images/audio-video.png";
import eventsPhotography from "./images/events-photography.webp";
import weddingPhotography from "./images/wedding-photography.jpg";
import photoshoot from "./images/photoshoot.webp";
import sonorization from "./images/sonorization.png";
import weddingServices from "./images/wedding-services.jpg";
import irembo from "./images/events-photography.webp";
import designing from "./images/photoshoot.webp";
import cyber from "./images/photoshoot.webp";

function Services() {
  const services = [
    {
      title: "Audio and Video Production",
      description:
        "High-quality audio and video production services to make your vision a reality.",
      image: audioVideo,
      icon: "🎥",
    },
    {
      title: "Events Photography",
      description:
        "Capture unforgettable moments with our professional events photography.",
      image: eventsPhotography,
      icon: "📸",
    },
    {
      title: "Wedding Photography",
      description:
        "Make your special day timeless with stunning wedding photography.",
      image: weddingPhotography,
      icon: "💒",
    },
    {
      title: "Photoshoot (Others)",
      description: "Creative and stylish photoshoots tailored to your needs.",
      image: photoshoot,
      icon: "📷",
    },
    {
      title: "Sonorization",
      description:
        "Professional sound engineering and audio setup for any event.",
      image: sonorization,
      icon: "🎙",
    },
    {
      title: "Wedding Services",
      description:
        "Comprehensive wedding services to make your day stress-free and memorable.",
      image: weddingServices,
      icon: "💍",
    },
    {
      title: "Irembo",
      description:
        "Simplified access to government and online services via Irembo.",
      image: irembo,
      icon: "🌐",
    },
    {
      title: "Designing",
      description:
        "Unique and modern graphic designs for all your creative projects.",
      image: designing,
      icon: "🎨",
    },
    {
      title: "Cyber Services",
      description: "Reliable internet and IT services at your fingertips.",
      image: cyber,
      icon: "💻",
    },
  ];

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
              alt={service.title}
              className="w-full h-60 object-cover rounded-md"
            />
            </div>
            <div className="text-center p-2 ">
              <h2 className="text-2xl md:text-3xl font-bold text-black mb-4 text-center">
                {service.icon} {service.title}
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
