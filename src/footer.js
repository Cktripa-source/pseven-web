import React from 'react';
import { Link } from "react-router-dom";
import { Facebook, Twitter, Instagram, Youtube, Home, HelpCircle, Info, Phone, Mail, MapPin, Clock } from "lucide-react";

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
    <footer className="bg-gradient-to-b from-gray-900 to-black text-white pt-16 pb-8">
      <div className="container mx-auto px-4 lg:px-8">
        {/* Main Footer Content */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 mb-12">
          {/* Brand Section */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="bg-white p-2 rounded-lg">
                <span className="text-2xl font-bold text-gray-900">P7</span>
              </div>
              <span className="text-xl font-bold">Pseven Rwanda</span>
            </div>
            <p className="text-gray-400 leading-relaxed">
              Your premier destination for cutting-edge electronic devices and exceptional service in Rwanda.
            </p>
          </div>

          {/* Quick Links Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Quick Links</h3>
            <nav>
              <ul className="space-y-2">
                {quickLinks.map(({ path, label, icon: Icon }) => (
                  <li key={path}>
                    <Link 
                      to={path}
                      className="group flex items-center text-gray-400 hover:text-green-500 transition-colors duration-200"
                    >
                      <Icon className="w-4 h-4 mr-2 transition-transform duration-200 group-hover:translate-x-1" />
                      {label}
                    </Link>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          {/* Contact Info Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Contact Info</h3>
            <ul className="space-y-3">
              {contactInfo.map(({ icon: Icon, text }, index) => (
                <li key={index} className="flex items-center text-gray-400">
                  <Icon className="w-4 h-4 mr-2 flex-shrink-0" />
                  <span>{text}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Newsletter Section */}
          <div className="space-y-4">
            <h3 className="text-lg font-semibold border-b border-gray-700 pb-2">Newsletter</h3>
            <p className="text-gray-400">Stay updated with our latest products and offers.</p>
            <form className="space-y-2">
              <input
                type="email"
                placeholder="Enter your email"
                className="w-full px-4 py-2 bg-gray-800 border border-gray-700 rounded-lg focus:outline-none focus:border-white transition-colors duration-200"
              />
              <button
                type="submit"
                className="w-full px-4 py-2 bg-white text-gray-900 rounded-lg font-semibold hover:bg-gray-200 transition-colors duration-200"
              >
                Subscribe
              </button>
            </form>
          </div>
        </div>

        {/* Social Links */}
        <div className="border-t border-gray-800 pt-8 pb-4">
          <div className="flex flex-wrap justify-center space-x-6">
            {socialLinks.map(({ href, icon: Icon, label }) => (
              <a
                key={label}
                href={href}
                aria-label={label}
                className="text-gray-400 hover:text-green-500 transition-colors duration-200"
              >
                <Icon className="w-6 h-6" />
              </a>
            ))}
          </div>
        </div>

        {/* Copyright */}
        <div className="text-center text-gray-500 text-sm mt-8">
          <p>&copy; {new Date().getFullYear()} Pseven Rwanda. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;