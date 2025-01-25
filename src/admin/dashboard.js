import React, { useState } from "react";
import { Link } from "react-router-dom";
import { FaBars, FaUserCircle, FaTachometerAlt, FaInbox, FaUsers, FaProductHunt, FaSignInAlt, FaUserPlus, FaQuestionCircle, FaHome, FaCog, FaClipboardList, FaBox } from 'react-icons/fa';
import Logo from "../images/logo.png";

const Dashboard = () => {
  // State to toggle profile dropdown visibility
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);

  // Toggle function to open/close the dropdown
  const toggleDropdown = () => {
    setIsDropdownOpen(prevState => !prevState);
  };

  return (
    <>
      <nav className="fixed top-0 z-50 w-full  bg-gray-800  border-gray-700">
        <div className="px-3 py-3 lg:px-5 lg:pl-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center justify-start rtl:justify-end">
              <button 
                data-drawer-target="logo-sidebar" 
                data-drawer-toggle="logo-sidebar" 
                aria-controls="logo-sidebar" 
                type="button" 
                className="inline-flex items-center p-2 text-sm text-gray-500 rounded-lg sm:hidden focus:outline-none focus:ring-2  hover:bg-gray-700  focus:ring-gray-600"
              >
                <span className="sr-only">Open sidebar</span>
                <FaBars className="w-6 h-6" />
              </button>
              <Link to="../adminadmin/" className="flex ms-2 md:me-24">
                <img src={Logo} className="h-10 me-3 rounded-full" alt="Pseven" />
                <span className="self-center text-xl font-semibold sm:text-2xl whitespace-nowrap  text-white"> 
                  <span className="font-bold text-xl transition duration-300 hover:text-white">
                    P<span className="text-white">SEVEN</span>
                  </span>
                </span>
              </Link>
            </div>
            <div className="flex items-center">
              <div className="flex items-center ms-3">
                <div>
                  <button 
                    type="button" 
                    className="flex text-sm bg-gray-800 rounded-full focus:ring-4   focus:ring-gray-600"
                    aria-expanded={isDropdownOpen ? "true" : "false"}
                    onClick={toggleDropdown} // Toggle dropdown on click
                  >
                    <span className="sr-only">Open user menu</span>
                    <img className="w-8 h-8 rounded-full" src={Logo} alt="user photo" />
                  </button>
                </div>
                {isDropdownOpen && (
                  <div className="absolute right-0 top-12 z-50 w-48 text-base list-none divide-y rounded-lg shadow  bg-gray-700  divide-gray-600" id="dropdown-user">
                    <div className="px-4 py-3">
                      <p className="text-sm  text-white">Neil Sims</p>
                      <p className="text-sm font-medium truncate  text-gray-300">neil.sims@flowbite.com</p>
                    </div>
                    <ul className="py-1">
                      <li>
                        <Link to="../admin/" className="flex items-center px-4 py-2 text-sm   text-gray-300  hover:bg-gray-600  hover:text-white">
                          <FaTachometerAlt className="w-5 h-5 mr-2" />
                          Dashboard
                        </Link>
                      </li>
                      <li>
                        <Link to="../admin/settings" className="flex items-center px-4 py-2 text-sm   text-gray-300  hover:bg-gray-600  hover:text-white">
                          <FaCog className="w-5 h-5 mr-2" />
                          Settings
                        </Link>
                      </li>
                      <li>
                        <Link to="../admin/earnings" className="flex items-center px-4 py-2 text-sm  text-gray-300  hover:bg-gray-600  hover:text-white">
                          <FaBox className="w-5 h-5 mr-2" />
                          Earnings
                        </Link>
                      </li>
                      <li>
                        <Link to="../admin/jobs" className="flex items-center px-4 py-2 text-sm text-gray-300  hover:bg-gray-600  hover:text-white">
                          <FaSignInAlt className="w-5 h-5 mr-2" />
                          Jobs & Employers
                        </Link>
                      </li>
                      <li>
                        <Link to="../admin/services" className="flex items-center px-4 py-2 text-sm  text-gray-300  hover:bg-gray-600  hover:text-white">
                          <FaBox className="w-5 h-5 mr-2" />
                          Manage Services
                        </Link>
                      </li>
                      <li>
                        <Link to="../admin/sign-out" className="flex items-center px-4 py-2 text-sm   text-gray-300  hover:bg-gray-600  hover:text-white">
                          <FaSignInAlt className="w-5 h-5 mr-2" />
                          Sign Out
                        </Link>
                      </li>
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </nav>

      <aside id="logo-sidebar" className="fixed top-0 left-0 z-40 w-64 h-screen pt-20 transition-transform -translate-x-full border-r  sm:translate-x-0  bg-gray-800  border-gray-700" aria-label="Sidebar">
        <div className="h-full px-3 pb-4 overflow-y-auto  bg-gray-800">
          <ul className="space-y-2 font-medium">
            <li>
              <Link to="../admin/" className="flex items-center p-2  rounded-lg  text-white   hover:bg-gray-700 group">
                <FaTachometerAlt className="w-5 h-5  transition duration-75  text-gray-400   group-hover:text-white" />
                <span className="ms-3">Dashboard</span>
              </Link>
            </li>
            <li>
              <Link to="../admin/inbox" className="flex items-center p-2  rounded-lg  text-white  hover:bg-gray-700 group">
                <FaInbox className="w-5 h-5transition duration-75  text-gray-400   group-hover:text-white" />
                <span className="ms-3">View Inbox</span>
                <span className="inline-flex items-center justify-center px-2 ms-3 text-sm font-medium   rounded-full  bg-gray-700  text-gray-300">3</span>
              </Link>
            </li>
            <li>
              <Link to="../admin/users" className="flex items-center p-2  rounded-lg  text-white   hover:bg-gray-700 group">
                <FaUsers className="w-5 h-5 transition duration-75  text-gray-400  group-hover:text-white" />
                <span className="ms-3">Manage Users</span>
              </Link>
            </li>
            <li>
              <Link to="../admin/productmanagement"className="flex items-center p-2  rounded-lg  text-white   hover:bg-gray-700 group">
                <FaProductHunt className="w-5 h-5 transition duration-75  text-gray-400  group-hover:text-white" />
                <span className="ms-3">Manage Products</span>
              </Link>
            </li>
            <li>
              <Link to="../admin/jobs"className="flex items-center p-2  rounded-lg  text-white   hover:bg-gray-700 group">
                <FaSignInAlt className="w-5 h-5 transition duration-75  text-gray-400  group-hover:text-white" />
                <span className="ms-3">Jobs & Employers</span>
              </Link>
            </li>
            <li>
              <Link to="../admin/services" className="flex items-center p-2  rounded-lg  text-white   hover:bg-gray-700 group">
                <FaBox className="w-5 h-5 transition duration-75  text-gray-400  group-hover:text-white" />
                <span className="ms-3">Manage Services</span>
              </Link>
            </li>
            <li>
              <Link to="../admin/settings" className="flex items-center p-2  rounded-lg  text-white   hover:bg-gray-700 group">
                <FaCog className="w-5 h-5 transition duration-75  text-gray-400  group-hover:text-white" />
                <span className="ms-3">Settings</span>
              </Link>
            </li>
            <li>
              <Link to="../admin/faq"className="flex items-center p-2  rounded-lg  text-white   hover:bg-gray-700 group">
                <FaQuestionCircle className="w-5 h-5 transition duration-75  text-gray-400  group-hover:text-white" />
                <span className="ms-3">FAQ</span>
              </Link>
            </li>
            <li>
              <Link to="../admin/about" className="flex items-center p-2  rounded-lg  text-white   hover:bg-gray-700 group">
                <FaHome className="w-5 h-5 transition duration-75  text-gray-400  group-hover:text-white" />
                <span className="ms-3">About</span>
              </Link>
            </li>
            <li>
              <Link to="../admin/logout" className="flex items-center p-2  rounded-lg  text-white   hover:bg-gray-700 group">
                <FaSignInAlt className="w-5 h-5 transition duration-75  text-gray-400  group-hover:text-white" />
                <span className="ms-3">Sign Out</span>
              </Link>
            </li>
            <li>
              <Link to="../admin/signup" className="flex items-center p-2  rounded-lg  text-white   hover:bg-gray-700 group">
                <FaUserPlus className="w-5 h-5 transition duration-75  text-gray-400  group-hover:text-white" />
                <span className="ms-3">Sign Up</span>
              </Link>
            </li>
          </ul>
        </div>
      </aside>

    </>
  );
};

export default Dashboard;
