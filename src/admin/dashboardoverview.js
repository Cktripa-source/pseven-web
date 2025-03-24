import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar, ResponsiveContainer } from 'recharts';
import { UserIcon, BriefcaseIcon, ClipboardCheckIcon, CogIcon, PackageIcon, AlertCircleIcon, CheckCircleIcon } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

// Toast Component
const Toast = ({ message, type, onClose }) => {
  const bgColor = type === 'success' ? 'bg-emerald-500' : 'bg-red-500';
  const Icon = type === 'success' ? CheckCircleIcon : AlertCircleIcon;
  
  return (
    <motion.div 
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
      className={`fixed top-4 right-4 ${bgColor} text-white px-4 py-3 rounded-lg shadow-lg flex items-center z-50`}
    >
      <Icon className="h-5 w-5 mr-2" />
      <span>{message}</span>
      <button onClick={onClose} className="ml-4 text-white hover:text-gray-200">
        &times;
      </button>
    </motion.div>
  );
};

// Dashboard Card Component
const DashboardCard = ({ title, icon, content, stats, href, delay }) => (
  <motion.div 
    initial={{ opacity: 0, y: 20 }}
    animate={{ opacity: 1, y: 0 }}
    transition={{ duration: 0.5, delay: delay * 0.1 }}
    whileHover={{ scale: 1.02, transition: { duration: 0.2 } }}
    className="bg-white rounded-xl shadow-md hover:shadow-xl transition-all p-6 border border-gray-100"
  >
    <div className="flex items-center justify-between pb-3">
      <h3 className="text-lg font-semibold text-gray-800">{title}</h3>
      <motion.div 
        whileHover={{ rotate: 10, scale: 1.1 }}
        transition={{ duration: 0.2 }}
      >
        {icon}
      </motion.div>
    </div>
    <div className="text-3xl font-bold mb-4 text-gray-900 flex items-baseline">
      {stats}
      <span className="text-sm text-gray-500 ml-2 font-normal">entries</span>
    </div>
    <div className="h-[220px] w-full">
      {content}
    </div>
    <Link 
      to={href}
      className="mt-5 inline-flex items-center px-4 py-2 bg-emerald-50 text-emerald-600 hover:bg-emerald-100 rounded-lg font-medium text-sm transition-colors"
    >
      View Details
      <svg className="w-4 h-4 ml-1 transition-transform group-hover:translate-x-1" fill="none" viewBox="0 0 24 24" stroke="currentColor">
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
      </svg>
    </Link>
  </motion.div>
);

// Custom Tooltip for Chart
const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-200 shadow-md rounded-md">
        <p className="font-medium">{label}</p>
        {payload.map((entry, index) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }
  return null;
};

const DashboardOverview = () => {
  const [data, setData] = useState({
    totalApplications: 0,
    applicationsByStatus: { Pending: 0, Reviewed: 0, Accepted: 5, Rejected: 0 },
    totalJobs: 0,
    jobsByStatus: { Open: 0, Closed: 0 },
    totalProducts: 0,
    lowStockProducts: 0,
    totalServiceRequests: 0,
    serviceRequestsByStatus: { Pending: 0, InProgress: 0, Completed: 0 },
    totalUsers: 0,
    burnedUsers: 0,
  });
  
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState(null);

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        setLoading(true);
        const response = await fetch('https://api.psevenrwanda.com/api/dashboard/overview');
        const dashboardData = await response.json();
        setData({
          totalApplications: dashboardData.totalApplications ?? 0,
          applicationsByStatus: dashboardData.applicationsByStatus ?? { 
            Pending: 0, Reviewed: 0, Accepted: 0, Rejected: 0 
          },
          totalJobs: dashboardData.totalJobs ?? 0,
          jobsByStatus: dashboardData.jobsByStatus ?? { Open: 0, Closed: 0 },
          totalProducts: dashboardData.totalProducts ?? 0,
          lowStockProducts: dashboardData.lowStockProducts ?? 0,
          totalServiceRequests: dashboardData.totalServiceRequests ?? 0,
          serviceRequestsByStatus: dashboardData.serviceRequestsByStatus ?? { 
            Pending: 0, InProgress: 0, Completed: 0 
          },
          totalUsers: dashboardData.totalUsers ?? 0,
          burnedUsers: dashboardData.burnedUsers ?? 0,
        });
        setToast({ message: 'Dashboard data loaded successfully!', type: 'success' });
        setLoading(false);
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
        setToast({ message: 'Failed to load dashboard data!', type: 'error' });
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: 'Applications Overview',
      icon: <ClipboardCheckIcon className="h-8 w-8 text-emerald-500" />,
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { name: 'Applications', 
              Pending: data.applicationsByStatus.Pending,
              Reviewed: data.applicationsByStatus.Reviewed,
              Accepted: data.applicationsByStatus.Accepted,
              Rejected: data.applicationsByStatus.Rejected 
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Pending" fill="#FBBF24" animationDuration={1500} />
            <Bar dataKey="Reviewed" fill="#0EA5E9" animationDuration={1500} />
            <Bar dataKey="Accepted" fill="#10B981" animationDuration={1500} />
            <Bar dataKey="Rejected" fill="#F43F5E" animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      ),
      stats: `${data.totalApplications}`,
      href: "../jobapplication"
    },
    {
      title: 'Jobs Status',
      icon: <BriefcaseIcon className="h-8 w-8 text-blue-500" />,
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { name: 'Jobs',
              Open: data.jobsByStatus.Open,
              Closed: data.jobsByStatus.Closed
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Open" fill="#10B981" animationDuration={1500} />
            <Bar dataKey="Closed" fill="#F43F5E" animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      ),
      stats: `${data.totalJobs}`,
      href: "../jobs"
    },
    {
      title: 'Products Overview',
      icon: <PackageIcon className="h-8 w-8 text-orange-500" />,
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { name: 'Products',
              Total: data.totalProducts,
              'Low Stock': data.lowStockProducts
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Total" fill="#10B981" animationDuration={1500} />
            <Bar dataKey="Low Stock" fill="#F43F5E" animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      ),
      stats: `${data.totalProducts}`,
      href: "./productmanagement"
    },
    {
      title: 'Service Requests',
      icon: <CogIcon className="h-8 w-8 text-purple-500" />,
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { name: 'Requests',
              Pending: data.serviceRequestsByStatus.Pending,
              'In Progress': data.serviceRequestsByStatus.InProgress,
              Completed: data.serviceRequestsByStatus.Completed
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Pending" fill="#FBBF24" animationDuration={1500} />
            <Bar dataKey="In Progress" fill="#0EA5E9" animationDuration={1500} />
            <Bar dataKey="Completed" fill="#10B981" animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      ),
      stats: `${data.totalServiceRequests}`,
      href: "../services"
    },
    {
      title: 'Users Overview',
      icon: <UserIcon className="h-8 w-8 text-amber-500" />,
      content: (
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={[
            { name: 'Users',
              Active: data.totalUsers - data.burnedUsers,
              Burned: data.burnedUsers
            }
          ]}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="Active" fill="#10B981" animationDuration={1500} />
            <Bar dataKey="Burned" fill="#F43F5E" animationDuration={1500} />
          </BarChart>
        </ResponsiveContainer>
      ),
      stats: `${data.totalUsers}`,
      href: "../users"
    }
  ];
  
  return (
    <>
      <AnimatePresence>
        {toast && (
          <Toast 
            message={toast.message} 
            type={toast.type} 
            onClose={() => setToast(null)}
          />
        )}
      </AnimatePresence>
      
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="p-8 space-y-8 bg-gray-50 min-h-screen"
      >
        <motion.div 
          initial={{ y: -20 }}
          animate={{ y: 0 }}
          transition={{ duration: 0.5 }}
          className="flex items-center justify-between mb-6"
        >
          <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>
          <div className="flex space-x-2">
            <button 
              onClick={() => setToast({ message: 'Data refreshed!', type: 'success' })}
              className="bg-white text-gray-700 px-4 py-2 rounded-lg shadow-sm border border-gray-200 hover:bg-gray-50 transition-colors flex items-center"
            >
              <svg className="w-4 h-4 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
              Refresh
            </button>
          </div>
        </motion.div>
        
        {loading ? (
          <div className="flex items-center justify-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-emerald-500"></div>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
            {cards.map((card, index) => (
              <DashboardCard key={index} {...card} delay={index} />
            ))}
          </div>
        )}
      </motion.div>
    </>
  );
};

export default DashboardOverview;