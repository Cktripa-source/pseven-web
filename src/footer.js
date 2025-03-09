import React from 'react';
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Home, HelpCircle, Info, Phone, Mail, MapPin, Clock, ChevronRight, Send } from "lucide-react";

const Footer = () => {
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
    <footer className="bg-black text-white pt-16 pb-8 border-t-4 border-green-500">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2 mb-4">
              <div className="bg-white p-2 rounded-lg shadow-lg">
                <span className="text-2xl font-bold text-black">P7</span>
              </div>
              <span className="text-xl font-bold text-green-400">Pseven Rwanda</span>
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
                  className="bg-gray-900 p-2 rounded-full text-white hover:bg-green-500 hover:text-white transition-all duration-300 transform hover:scale-110"
                >
                  <Icon className="w-5 h-5" />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-green-500">Quick Links</h3>
            <nav>
              <ul className="space-y-3">
                {quickLinks.map(({ path, label, icon: Icon }) => (
                  <li key={path}>
                    <Link 
                      to={path}
                      className="group flex items-center text-gray-300 hover:text-green-400 transition-colors duration-200"
                    >
                      <ChevronRight className="w-4 h-4 mr-2 text-green-500 transition-transform duration-200 group-hover:translate-x-1" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-green-500">Contact Info</h3>
            <ul className="space-y-4">
              {contactInfo.map(({ icon: Icon, text }, index) => (
                <li key={index} className="flex items-center text-gray-300 group">
                  <div className="w-8 h-8 rounded-full bg-gray-900 flex items-center justify-center mr-3 group-hover:bg-green-500 transition-colors duration-300">
                    <Icon className="w-4 h-4 text-green-400 group-hover:text-white" />
                  </div>
                  <span className="group-hover:text-green-400 transition-colors duration-200">{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold text-green-400 pb-2 relative after:content-[''] after:absolute after:left-0 after:bottom-0 after:h-1 after:w-12 after:bg-green-500">Newsletter</h3>
            <p className="text-gray-300">Stay updated with our latest products and offers.</p>
            <form className="mt-4">
              <div className="flex">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="w-full px-4 py-3 bg-gray-900 border-2 border-gray-800 rounded-l-lg focus:outline-none focus:border-green-500 transition-colors duration-200"
                />
                <button
                  type="submit"
                  className="px-4 py-3 bg-green-500 text-white rounded-r-lg font-semibold hover:bg-green-600 transition-all duration-200 flex items-center justify-center"
                >
                  <Send className="w-5 h-5" />
                </button>
              </div>
              <p className="text-xs text-gray-400 mt-2">We never spam, promised.</p>
            </form>
          </div>
        </div>

        {/* Divider */}
        <div className="border-t border-gray-800 my-8"></div>

        {/* Copyright */}
        <div className="flex flex-col md:flex-row justify-between items-center text-gray-400 text-sm">
          <p>&copy; {new Date().getFullYear()} Pseven Rwanda. All rights reserved.</p>
          <div className="mt-4 md:mt-0">
            <ul className="flex space-x-6">
              <li><a href="#" className="hover:text-green-400 transition-colors duration-200">Privacy Policy</a></li>
              <li><a href="#" className="hover:text-green-400 transition-colors duration-200">Terms of Service</a></li>
            </ul>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;