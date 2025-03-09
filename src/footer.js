import React, { useState, useEffect } from 'react';
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Home, HelpCircle, Info, Phone, Mail, MapPin, Clock, ChevronRight, Send } from "lucide-react";

const Footer = () => {
  const [bubbles, setBubbles] = useState([]);
  
  // Generate random bubbles for the background effect
  useEffect(() => {
    const newBubbles = [];
    for (let i = 0; i < 15; i++) {
      newBubbles.push({
        id: i,
        left: Math.random() * 100,
        size: Math.random() * 60 + 20,
        duration: Math.random() * 15 + 10,
        delay: Math.random() * 5
      });
    }
    setBubbles(newBubbles);
  }, []);

  const quickLinks = [
    { path: "/", label: "Home", icon: Home },
    { path: "/about", label: "About Us", icon: Info },
    { path: "/faq", label: "FAQ", icon: HelpCircle },
    { path: "/contact", label: "Contact", icon: Phone },
  ];

  const socialLinks = [
    { href: "#", icon: Facebook, label: "Facebook" },
    { href: "#", icon: Twitter, label: "Twitter" },
    { href: "#", icon: Instagram, label: "Instagram" },
    { href: "#", icon: Youtube, label: "Youtube" },
  ];

  const contactInfo = [
    { icon: Mail, text: "psevenrwanda@gmail.com" },
    { icon: MapPin, text: "Kigali, Rwanda" },
    { icon: Clock, text: "Mon - Fri: 9:00 - 18:00" },
  ];

  return (
    <footer className="bg-gray-800 text-gray-200 pt-16 pb-8 border-t-2 border-green-500 relative overflow-hidden">
      {/* Animated Bubble Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {bubbles.map(bubble => (
          <div 
            key={bubble.id}
            className="absolute rounded-full bg-green-500 opacity-10 animate-float"
            style={{
              left: `${bubble.left}%`,
              width: `${bubble.size}px`,
              height: `${bubble.size}px`,
              animationDuration: `${bubble.duration}s`,
              animationDelay: `${bubble.delay}s`,
              bottom: '-10%',
            }}
          />
        ))}
      </div>
      
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4 transition-all duration-500 hover:translate-y-2">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-green-600 p-2 rounded-lg shadow-lg transform transition-transform duration-300 hover:rotate-6 hover:scale-110">
                <span className="text-2xl font-bold text-white">P7</span>
              </div>
              <span className="text-xl font-bold text-white transition-colors duration-300 hover:text-green-400">Pseven Rwanda</span>
            </div>
            <p className="text-gray-300 leading-relaxed">
              Your premier destination for cutting-edge electronic devices and exceptional service in Rwanda.
            </p>
            <div className="flex space-x-4 pt-4">
              {socialLinks.map(({ href, icon: Icon, label }) => (
                <a
                  key={label}
                  href={href}
                  aria-label={label}
                  className="relative bg-gray-700 p-2 rounded-full text-white hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-125 hover:rotate-6 group"
                >
                  <Icon className="w-5 h-5 transition-transform duration-300 group-hover:animate-pulse" />
                  <span className="absolute -top-8 left-1/2 -translate-x-1/2 bg-green-800 text-white text-xs px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300">{label}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-green-500 after:transition-all after:duration-300 hover:after:w-32">Quick Links</h3>
            <nav>
              <ul className="space-y-3">
                {quickLinks.map(({ path, label, icon: Icon }) => (
                  <li key={path} className="transform transition-transform duration-200 hover:translate-x-2">
                    <Link 
                      to={path}
                      className="group flex items-center text-gray-300 hover:text-green-400 transition-colors duration-200"
                    >
                      <div className="relative mr-2 overflow-hidden rounded-full">
                        <ChevronRight className="w-4 h-4 text-green-500 transition-transform duration-300 group-hover:translate-x-4" />
                        <ChevronRight className="w-4 h-4 absolute top-0 left-0 text-green-500 opacity-0 -translate-x-4 transition-all duration-300 group-hover:opacity-100 group-hover:translate-x-0" />
                      </div>
                      <span className="relative overflow-hidden">
                        <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full">{label}</span>
                        <span className="absolute left-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0">{label}</span>
                      </span>
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-green-500 after:transition-all after:duration-300 hover:after:w-32">Contact Info</h3>
            <ul className="space-y-4">
              {contactInfo.map(({ icon: Icon, text }, index) => (
                <li key={index} className="flex items-center text-gray-300 group transition-transform duration-300 hover:translate-x-2">
                  <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-all duration-300 group-hover:scale-110 overflow-hidden relative">
                    <Icon className="w-4 h-4 text-white transition-all duration-300 group-hover:scale-125" />
                    <div className="absolute inset-0 bg-green-400 opacity-0 scale-0 rounded-full group-hover:scale-100 group-hover:opacity-20 transition-all duration-500"></div>
                  </div>
                  <span className="group-hover:text-green-400 transition-all duration-200 relative overflow-hidden">
                    <span className="block transition-transform duration-300 group-hover:translate-y-full">{text}</span>
                    <span className="absolute left-0 transition-transform duration-300 -translate-y-full group-hover:translate-y-0">{text}</span>
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-white pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-green-500 after:transition-all after:duration-300 hover:after:w-32">Newsletter</h3>
            <p className="text-gray-300">Stay updated with our latest products and offers.</p>
            <form className="mt-4 group">
              <div className="flex overflow-hidden rounded-lg transition-all duration-300 group-hover:shadow-lg group-hover:shadow-green-500/20">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-700 border-2 border-gray-600 text-white rounded-l-lg focus:outline-none focus:border-green-500 transition-all duration-300 placeholder-gray-400 group-hover:bg-gray-600"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-green-500 text-white rounded-r-lg font-semibold hover:bg-green-600 transition-all duration-300 flex items-center justify-center group-hover:bg-green-400 relative overflow-hidden"
                >
                  <Send className="w-5 h-5 transition-all duration-300 group-hover:translate-x-8 group-hover:opacity-0" />
                  <Send className="w-5 h-5 absolute transition-all duration-300 -translate-x-8 opacity-0 group-hover:translate-x-0 group-hover:opacity-100" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2 transition-all duration-300 group-hover:text-green-400">We never spam, promised.</p>
            </form>
          </div>
        </div>

        {/* Divider with animation */}
        <div className="relative h-px bg-gray-700 my-8 overflow-hidden">
          <div className="absolute top-0 left-0 w-full h-full">
            <div className="absolute top-0 left-0 h-full bg-green-500 w-0 animate-pulse-width"></div>
          </div>
        </div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p className="transition-colors duration-300 hover:text-green-400">&copy; {new Date().getFullYear()} Pseven Rwanda. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li>
                <a href="#" className="relative overflow-hidden group">
                  <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full text-gray-400 hover:text-green-400">Privacy Policy</span>
                  <span className="absolute left-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-green-400">Privacy Policy</span>
                </a>
              </li>
              <li>
                <a href="#" className="relative overflow-hidden group">
                  <span className="inline-block transition-transform duration-300 group-hover:-translate-y-full text-gray-400 hover:text-green-400">Terms of Service</span>
                  <span className="absolute left-0 inline-block transition-transform duration-300 translate-y-full group-hover:translate-y-0 text-green-400">Terms of Service</span>
                </a>
              </li>
            </ul>
          </div>
        </div>
      </div>
      
      {/* Add this to your global CSS or add directly in the document */}
      <style jsx>{`
        @keyframes float {
          0% { transform: translateY(0); }
          50% { transform: translateY(-200px); }
          100% { transform: translateY(-400px); }
        }
        
        .animate-float {
          animation-name: float;
          animation-timing-function: ease-in-out;
          animation-iteration-count: infinite;
        }
        
        @keyframes pulse-width {
          0% { width: 0; left: 0; }
          50% { width: 100%; left: 0; }
          100% { width: 0; left: 100%; }
        }
        
        .animate-pulse-width {
          animation: pulse-width 4s ease-in-out infinite;
        }
      `}</style>
    </footer>
  );
};

export default Footer;