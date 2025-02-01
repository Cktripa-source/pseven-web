import { Link } from "react-router-dom";
import { motion } from "framer-motion";
import { Facebook, Twitter, Instagram, Youtube, Home, HelpCircle, Info, Phone } from "lucide-react";
import Logo from "./images/logo.png";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-8 mt-12">
      <motion.div 
        className="container mx-auto px-6 grid grid-cols-1 sm:grid-cols-3 gap-8 border-b pb-6"
        initial={{ opacity: 0, y: 20 }} 
        animate={{ opacity: 1, y: 0 }} 
        transition={{ duration: 0.6 }}
      >
        {/* About Section */}
        <motion.div whileHover={{ scale: 1.05 }} transition={{ duration: 0.3 }}>
          <img src={Logo} alt="Web Logo" className="h-12 mb-3 rounded-full" />
          <h2 className="text-xl font-bold">Pseven Rwanda</h2>
          <p className="text-gray-400 mt-2">
            Your go-to destination for the latest electronic devices.
          </p>
        </motion.div>

        {/* Quick Links */}
        <motion.div>
          <h2 className="text-lg font-semibold">Quick Links</h2>
          <ul className="mt-3 space-y-3">
            {[ 
              { path: "/", label: "Home", icon: Home },
              { path: "/faq", label: "FAQ", icon: HelpCircle },
              { path: "/about", label: "About Us", icon: Info },
              { path: "/contact", label: "Contact Us", icon: Phone },
            ].map(({ path, label, icon: Icon }, idx) => (
              <motion.li 
                key={idx} 
                whileHover={{ x: 5 }} 
                transition={{ duration: 0.3 }}
              >
                <Link to={path} className="flex items-center space-x-2 p-1 rounded-md text-gray-400 hover:text-green-500 hover:bg-gray-800 hover:border-l-8 border-gray-950 transition duration-300">
                  <Icon className="h-5 w-5" />
                  <span>{label}</span>
                </Link>
              </motion.li>
            ))}
          </ul>
        </motion.div>

        {/* Contact Section */}
        <motion.div>
          <h2 className="text-lg font-semibold">Contact Us</h2>
          <p className="text-gray-400 mt-2">Email: psevenrwanda@gmail.com</p>
          <div className="flex mt-4 space-x-6">
            {[ 
              { href: "#", icon: Facebook },
              { href: "#", icon: Twitter },
              { href: "#", icon: Instagram },
              { href: "#", icon: Youtube },
            ].map(({ href, icon: Icon }, idx) => (
              <motion.a 
                key={idx} 
                href={href} 
                className="text-gray-400 hover:text-green-500 transition duration-300"
                whileHover={{ scale: 1.2 }} 
              >
                <Icon className="w-6 h-6" />
              </motion.a>
            ))}
          </div>
        </motion.div>
      </motion.div>

      {/* Copyright Section */}
      <motion.div 
        className="text-center text-gray-500 text-sm mt-6"
        initial={{ opacity: 0 }} 
        animate={{ opacity: 1 }} 
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        &copy; {new Date().getFullYear()} Pseven Rwanda. All rights reserved.
      </motion.div>
    </footer>
  );
};

export default Footer;
