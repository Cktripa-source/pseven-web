import { Link } from "react-router-dom";
import {
  FaFacebookF,
  FaTwitter,
  FaInstagram,
  FaYoutube, FaQuestionCircle, FaInfoCircle, FaPhoneAlt,FaHome
} from "react-icons/fa";
import Logo from "./images/logo.png";
const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-6 mt-12">
      <div className="container mx-auto px-4 grid grid-cols-1 sm:grid-cols-3 gap-6 border-b mb-10">
        {/* About Section */}
        <div>
          <img src={Logo} alt="Web Logo" className="h-10 mb-2 rounded-full" />
          <h2 className="text-xl font-bold">Pseven Rwanda</h2>
          <p className="text-gray-400 mt-2">
            Your go-to destination for the latest electronic devices.
          </p>
        </div>
        
        {/* Links Section */}
        <div>
          <h2 className="text-lg">Quick Links</h2>
          <ul className="mt-2 space-y-2 ">
            <li>
              <Link to="/"  className="hover:text-red-500 transition text-md duration-300 flex items-center space-x-2">
                    <FaHome className="h-5 w-5" />
                    <span>Home</span>
                  </Link>
            </li>
            <li>
               <Link to="/faq" className="hover:text-red-500 transition text-md duration-300 flex items-center space-x-2">
                    <FaQuestionCircle className="h-5 w-5" />
                    <span>FAQ</span>
                  </Link>
            </li>
            <li>
              <Link to="/about"  className="hover:text-red-500 transition text-md duration-300 flex items-center space-x-2">
                    <FaInfoCircle className="h-5 w-5" />
                    <span>About Us</span>
                  </Link>
            </li>
            <li>
             <Link to="/contact"  className="hover:text-red-500 transition text-md duration-300 flex items-center space-x-2">
                   <FaPhoneAlt className="h-5 w-5" />
                   <span>Contact Us</span>
                 </Link>
            </li>
          </ul>
        </div>
        
        {/* Contact Section */}
        <div>
          <h2 className="text-lg">Contact Us</h2>
          <p className="text-gray-400 mt-2">Email: psevenrwanda@gmail.com</p>
          <div className="flex mt-4 sm:mt-0 space-x-6">
            <a href="#" className="text-gray-400 hover:text-red-500">
              <FaFacebookF className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-red-500">
              <FaTwitter className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-red-500">
              <FaInstagram className="w-5 h-5" />
            </a>
            <a href="#" className="text-gray-400 hover:text-red-500">
              <FaYoutube className="w-5 h-5" />
            </a>
          </div>
        </div>
      </div>
      <div className="text-center text-gray-500 text-sm mt-6">
        &copy; {new Date().getFullYear()} Pseven Rwanda. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;