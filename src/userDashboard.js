import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { toast, Toaster } from 'react-hot-toast';
import { 
    User, ShoppingBag, Heart, Bell, Settings, CreditCard, 
    MessageSquare, Calendar, Award, TrendingUp, Activity,
    Package, Gift, FileText, Clock, ChevronRight, Edit,
    X, Check, Info, AlertTriangle 
  } from 'lucide-react';
import { useAuth } from './AuthContext';
import { LineChart, Line, BarChart, Bar, PieChart, Pie, Cell, ResponsiveContainer, XAxis, YAxis, CartesianGrid, Tooltip } from 'recharts';
import ProfileEditForm from './editeprofile';
import PasswordChangeForm from './changepassword';

// Custom Toast Component
const CustomToast = ({ message, type }) => {
  const icons = {
    success: <Check className="w-5 h-5 text-green-600" />,
    error: <X className="w-5 h-5 text-red-600" />,
    info: <Info className="w-5 h-5 text-blue-600" />,
    warning: <AlertTriangle className="w-5 h-5 text-amber-600" />
  };

  return (
    <div className="flex items-center p-4 bg-white rounded-lg shadow-lg border-l-4 border-green-500">
      <div className="flex-shrink-0 mr-3">
        {icons[type]}
      </div>
      <div className="text-sm font-medium text-gray-800">{message}</div>
    </div>
  );
};

// Show toast notification
const showToast = (message, type = 'success') => {
  toast.custom((t) => (
    <motion.div
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -20 }}
    >
      <CustomToast message={message} type={type} />
    </motion.div>
  ));
};

function Dashboard() {
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState('overview');
  const [isLoading, setIsLoading] = useState(true);
  const [recentOrders, setRecentOrders] = useState([]);
  const [savedItems, setSavedItems] = useState([]);
  const [notifications, setNotifications] = useState([]);
  const [statistics, setStatistics] = useState({
    totalOrders: 0,
    savedItems: 0,
    pendingDeliveries: 0,
    totalSpent: 0
  });
  const [monthlyData, setMonthlyData] = useState([]);
  const [categoryData, setCategoryData] = useState([]);
  const [hoverCard, setHoverCard] = useState(null);

  // Simulate loading data
  useEffect(() => {
    // Fetch data from API in a real application
    setTimeout(() => {
      setRecentOrders([
        { id: 'ORD-7281', date: '2025-03-15', items: 3, status: 'Delivered', total: 149.99 },
        { id: 'ORD-6492', date: '2025-03-10', items: 1, status: 'Processing', total: 59.99 },
        { id: 'ORD-5781', date: '2025-03-01', items: 2, status: 'Shipped', total: 89.50 }
      ]);
      
      setSavedItems([
        { id: 1, name: 'Wireless Headphones', price: 79.99, category: 'Electronics' },
        { id: 2, name: 'Premium Laptop Stand', price: 49.99, category: 'Accessories' },
        { id: 3, name: 'Ergonomic Office Chair', price: 199.99, category: 'Furniture' }
      ]);
      
      setNotifications([
        { id: 1, message: 'Your order ORD-7281 has been delivered', time: '2 hours ago', read: false },
        { id: 2, message: 'Order ORD-6492 is now processing', time: '2 days ago', read: true },
        { id: 3, message: 'Special offer: 25% off on electronics', time: '3 days ago', read: true }
      ]);
      
      setStatistics({
        totalOrders: 12,
        savedItems: 3,
        pendingDeliveries: 2,
        totalSpent: 879.95
      });

      // Monthly spending data for charts
      setMonthlyData([
        { name: 'Jan', orders: 4, spending: 320.50 },
        { name: 'Feb', orders: 3, spending: 285.45 },
        { name: 'Mar', orders: 5, spending: 374.00 },
        { name: 'Apr', orders: 2, spending: 190.75 },
        { name: 'May', orders: 6, spending: 425.95 },
        { name: 'Jun', orders: 3, spending: 275.30 }
      ]);

      // Category spending data for pie chart
      setCategoryData([
        { name: 'Electronics', value: 450 },
        { name: 'Clothing', value: 300 },
        { name: 'Home', value: 200 },
        { name: 'Books', value: 100 },
        { name: 'Other', value: 150 }
      ]);
      
      setIsLoading(false);
      
      // Show welcome toast
      showToast('Welcome back to your dashboard!', 'info');
    }, 1500);
  }, []);

  // Effect for tab change toast
  useEffect(() => {
    if (!isLoading && activeTab !== 'overview') {
      showToast(`Switched to ${activeTab} tab`, 'info');
    }
  }, [activeTab, isLoading]);

  // Generate user avatar with first letter
  const getUserAvatar = () => {
    if (user?.avatar) return user.avatar;
    
    const name = user?.fullName || user?.name || 'User';
    const firstLetter = name.charAt(0).toUpperCase();
    const colors = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];
    const colorIndex = name.charCodeAt(0) % colors.length;
    const bgColor = colors[colorIndex];
    
    return (
      <div 
        className="h-20 w-20 rounded-full flex items-center justify-center text-white text-3xl font-bold shadow-md"
        style={{ backgroundColor: bgColor }}
      >
        {firstLetter}
      </div>
    );
  };

  // Dashboard tabs
  const tabs = [
    { id: 'overview', label: 'Overview', icon: Activity },
    { id: 'orders', label: 'Orders', icon: Package },
    { id: 'saved', label: 'Saved Items', icon: Heart },
    { id: 'notifications', label: 'Notifications', icon: Bell },
    { id: 'analytics', label: 'Analytics', icon: TrendingUp },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const COLORS = ['#10B981', '#3B82F6', '#8B5CF6', '#EC4899', '#F59E0B'];

  // Card variants for animation
  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: (i) => ({
      opacity: 1,
      y: 0,
      transition: {
        delay: i * 0.1,
        duration: 0.5,
        ease: "easeOut"
      }
    }),
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
      transition: {
        duration: 0.2
      }
    }
  };

  // Loading skeleton
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 pt-24">
        <div className="container mx-auto px-4 py-8">
          <div className="animate-pulse">
            <div className="bg-white rounded-xl shadow-lg p-8 mb-6 border border-gray-200">
              <div className="flex flex-col md:flex-row items-center">
                <div className="w-20 h-20 bg-gray-200 rounded-full mb-4 md:mb-0 md:mr-6"></div>
                <div className="flex-1">
                  <div className="h-6 bg-gray-200 rounded w-3/4 mb-3"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-4 bg-gray-200 rounded w-1/4"></div>
                </div>
              </div>
            </div>
            <div className="flex overflow-x-auto mb-6 bg-white rounded-xl shadow-lg p-2 border border-gray-200">
              {Array(6).fill().map((_, i) => (
                <div key={i} className="p-3 m-1 w-36 flex-shrink-0">
                  <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                </div>
              ))}
            </div>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
              {Array(4).fill().map((_, i) => (
                <div key={i} className="p-6 bg-white rounded-xl shadow-lg border border-gray-200">
                  <div className="h-5 bg-gray-200 rounded w-1/2 mb-2"></div>
                  <div className="h-8 bg-gray-200 rounded w-3/4"></div>
                </div>
              ))}
            </div>
            <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
              <div className="h-6 bg-gray-200 rounded w-1/4 mb-4"></div>
              <div className="space-y-4">
                {Array(3).fill().map((_, i) => (
                  <div key={i} className="p-4 border border-gray-200 rounded-lg">
                    <div className="h-5 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-4 bg-gray-200 rounded w-1/2"></div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 pt-24">
      <div className="container mx-auto px-4 py-8">
        {/* Toast container */}
        <Toaster position="top-right" />

        {/* Profile section */}
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="bg-white rounded-xl shadow-lg p-6 md:p-8 mb-6 border border-gray-200"
        >
          <div className="flex flex-col md:flex-row items-center">
            <div className="mb-4 md:mb-0 md:mr-6 relative group">
              {typeof user?.avatar === 'string' ? (
                <img 
                  src={user.avatar} 
                  alt="Profile" 
                  className="h-20 w-20 rounded-full object-cover border-2 border-green-500"
                />
              ) : (
                getUserAvatar()
              )}
              <motion.button 
                className="absolute bottom-0 right-0 bg-gray-100 rounded-full p-1.5 shadow-md text-gray-600 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => showToast('Profile photo update coming soon!', 'info')}
              >
                <Edit size={14} />
              </motion.button>
            </div>
            
            <div className="flex-1 text-center md:text-left">
              <h1 className="text-2xl font-bold text-gray-800">{user?.fullName || 'John Doe'}</h1>
              <p className="text-gray-600 mb-2">{user?.email || 'johndoe@example.com'}</p>
              <div className="flex flex-wrap justify-center md:justify-start gap-2 mt-2">
                <span className="bg-green-100 text-green-600 text-xs px-3 py-1 rounded-full font-medium border border-green-200">Premium Member</span>
                <span className="bg-blue-100 text-blue-600 text-xs px-3 py-1 rounded-full font-medium border border-blue-200">Verified</span>
                <span className="bg-purple-100 text-purple-600 text-xs px-3 py-1 rounded-full font-medium border border-purple-200">70 Points</span>
              </div>
            </div>
            
            <div className="mt-4 md:mt-0">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Link 
                  to="/editeprofile" 
                  className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-md text-sm transition-colors flex items-center space-x-2 shadow-md shadow-green-100"
                >
                  <span>Edit Profile</span>
                </Link>
              </motion.div>
            </div>
          </div>
        </motion.div>
        
        {/* Navigation Tabs */}
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="bg-white rounded-xl shadow-lg mb-6 overflow-x-auto border border-gray-200"
        >
          <div className="flex p-2 min-w-max">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <motion.button
                  key={tab.id}
                  className={`flex items-center space-x-2 px-5 py-3 text-sm font-medium rounded-lg m-1 transition-all ${
                    activeTab === tab.id
                      ? 'bg-green-600 text-white shadow-md shadow-green-100'
                      : 'text-gray-600 hover:text-gray-800 hover:bg-gray-100'
                  }`}
                  onClick={() => setActiveTab(tab.id)}
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                >
                  <Icon size={18} className="shrink-0" />
                  <span>{tab.label}</span>
                </motion.button>
              );
            })}
          </div>
        </motion.div>
        
        {/* Stats Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mb-6">
          {[
            { title: 'Total Orders', value: statistics.totalOrders, icon: ShoppingBag, color: 'blue', bgColor: 'blue-100', index: 0 },
            { title: 'Saved Items', value: statistics.savedItems, icon: Heart, color: 'red', bgColor: 'red-100', index: 1 },
            { title: 'Pending Deliveries', value: statistics.pendingDeliveries, icon: Package, color: 'yellow', bgColor: 'yellow-100', index: 2 },
            { title: 'Total Spent', value: `$${statistics.totalSpent.toFixed(2)}`, icon: CreditCard, color: 'green', bgColor: 'green-100', index: 3 }
          ].map((stat, index) => {
            const Icon = stat.icon;
            return (
              <motion.div
                key={stat.title}
                className="bg-white rounded-xl shadow-lg p-5 border border-gray-200 relative overflow-hidden"
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                custom={index}
                whileHover="hover"
                onHoverStart={() => setHoverCard(stat.title)}
                onHoverEnd={() => setHoverCard(null)}
              >
                <motion.div 
                  className={`absolute inset-0 bg-${stat.bgColor} opacity-0`}
                  animate={{ opacity: hoverCard === stat.title ? 0.3 : 0 }}
                  transition={{ duration: 0.3 }}
                />
                <div className="flex justify-between items-start relative z-10">
                  <div>
                    <p className="text-gray-600 text-sm">{stat.title}</p>
                    <h3 className="text-2xl font-bold text-gray-800 mt-1">{stat.value}</h3>
                  </div>
                  <motion.div 
                    className={`p-2 bg-${stat.color}-100 text-${stat.color}-600 rounded-md border border-${stat.color}-200`}
                    animate={{ rotate: hoverCard === stat.title ? [0, -10, 10, -10, 0] : 0 }}
                    transition={{ duration: 0.5, ease: "easeInOut" }}
                  >
                    <Icon size={20} />
                  </motion.div>
                </div>
              </motion.div>
            );
          })}
        </div>
        
        {/* Main Content Area based on active tab */}
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.4 }}
          >
            {/* Overview Tab Content */}
            {activeTab === 'overview' && (
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Recent Orders */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="flex justify-between items-center mb-5">
                    <h2 className="text-lg font-semibold text-gray-800">Recent Orders</h2>
                    <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                      <Link to="/orders" className="text-green-600 hover:text-green-700 text-sm flex items-center">
                        View All <ChevronRight size={16} />
                      </Link>
                    </motion.div>
                  </div>
                  
                  <div className="space-y-4">
                    {recentOrders.map((order, index) => (
                      <motion.div 
                        key={order.id} 
                        className="border border-gray-200 p-4 rounded-lg hover:border-green-300 transition-all bg-gray-50 group"
                        variants={cardVariants}
                        initial="hidden"
                        animate="visible"
                        custom={index}
                        whileHover="hover"
                      >
                        <div className="flex flex-wrap justify-between items-center">
                          <div>
                            <span className="font-medium text-gray-800">{order.id}</span>
                            <div className="text-sm text-gray-600">{formatDate(order.date)}</div>
                          </div>
                          
                          <div className="mt-2 sm:mt-0 flex gap-6">
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Items</div>
                              <div className="font-medium text-gray-800">{order.items}</div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Status</div>
                              <div className="font-medium text-gray-800">
                                <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                  order.status === 'Delivered' ? 'bg-green-100 text-green-600 border border-green-200' :
                                  order.status === 'Shipped' ? 'bg-blue-100 text-blue-600 border border-blue-200' :
                                  'bg-yellow-100 text-yellow-600 border border-yellow-200'
                                }`}>
                                  {order.status}
                                </span>
                              </div>
                            </div>
                            <div className="text-center">
                              <div className="text-xs text-gray-500">Total</div>
                              <div className="font-medium text-gray-800">${order.total.toFixed(2)}</div>
                            </div>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                </div>
                
                {/* Monthly Spending Chart */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Monthly Spending</h2>
                    <p className="text-sm text-gray-600">Last 6 months</p>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <LineChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#FFFFFF', 
                            borderColor: '#E5E7EB',
                            color: '#111827',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Line 
                          type="monotone" 
                          dataKey="spending" 
                          name="Spending"
                          stroke="#10B981" 
                          strokeWidth={2}
                          dot={{ r: 4 }}
                          activeDot={{ r: 6, stroke: '#059669', strokeWidth: 2 }}
                        />
                      </LineChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Category Spending Chart */}
                <div className="lg:col-span-1 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Spending by Category</h2>
                    <p className="text-sm text-gray-600">Current year</p>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <PieChart>
                        <Pie
                          data={categoryData}
                          cx="50%"
                          cy="50%"
                          innerRadius={60}
                          outerRadius={80}
                          paddingAngle={5}
                          dataKey="value"
                          nameKey="name"
                          label
                        >
                          {categoryData.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                          ))}
                        </Pie>
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#FFFFFF', 
                            borderColor: '#E5E7EB',
                            color: '#111827',
                            borderRadius: '0.5rem'
                          }}
                        />
                      </PieChart>
                    </ResponsiveContainer>
                  </div>
                </div>
                
                {/* Order Activity Chart */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                  <div className="mb-5">
                    <h2 className="text-lg font-semibold text-gray-800 mb-1">Order Activity</h2>
                    <p className="text-sm text-gray-600">Last 6 months</p>
                  </div>
                  
                  <div className="h-64">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={monthlyData}>
                        <CartesianGrid strokeDasharray="3 3" stroke="#E5E7EB" />
                        <XAxis dataKey="name" stroke="#6B7280" />
                        <YAxis stroke="#6B7280" />
                        <Tooltip 
                          contentStyle={{ 
                            backgroundColor: '#FFFFFF', 
                            borderColor: '#E5E7EB',
                            color: '#111827',
                            borderRadius: '0.5rem'
                          }}
                        />
                        <Bar dataKey="orders" name="Orders" fill="#3B82F6" radius={[4, 4, 0, 0]} />
                        <Bar dataKey="savings" name="Savings" fill="#10B981" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </div>
            )}

            {/* Orders Tab Content */}
            {activeTab === 'orders' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-5">Your Orders</h2>
                <div className="space-y-4">
                  {recentOrders.map((order, index) => (
                    <motion.div 
                      key={order.id} 
                      className="border border-gray-200 p-4 rounded-lg hover:border-green-300 bg-gray-50 transition-all"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      whileHover="hover"
                      onClick={() => showToast(`Order details for ${order.id} coming soon!`, 'info')}
                    >
                      <div className="flex flex-wrap justify-between items-center">
                        <div>
                          <span className="font-medium text-gray-800">{order.id}</span>
                          <div className="text-sm text-gray-600">{formatDate(order.date)}</div>
                        </div>
                        <div className="flex gap-6">
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Items</div>
                            <div className="font-medium text-gray-800">{order.items}</div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Status</div>
                            <div className="font-medium">
                              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${
                                order.status === 'Delivered' ? 'bg-green-100 text-green-600 border border-green-200' :
                                order.status === 'Shipped' ? 'bg-blue-100 text-blue-600 border border-blue-200' :
                                'bg-yellow-100 text-yellow-600 border border-yellow-200'
                              }`}>
                                {order.status}
                              </span>
                            </div>
                          </div>
                          <div className="text-center">
                            <div className="text-xs text-gray-500">Total</div>
                            <div className="font-medium text-gray-800">${order.total.toFixed(2)}</div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Saved Items Tab Content */}
            {activeTab === 'saved' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-5">Saved Items</h2>
                <div className="space-y-4">
                  {savedItems.map((item, index) => (
                    <motion.div 
                      key={item.id} 
                      className="flex justify-between items-center border border-gray-200 p-4 rounded-lg hover:border-green-300 bg-gray-50 transition-all"
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      whileHover="hover"
                      onClick={() => showToast(`Added ${item.name} to cart!`, 'success')}
                    >
                      <div>
                        <span className="font-medium text-gray-800">{item.name}</span>
                        <div className="text-sm text-gray-600">${item.price.toFixed(2)}</div>
                      </div>
                      <div className="flex items-center">
                        <div className="bg-blue-100 rounded-full px-3 py-1 text-blue-600 text-xs">Category: {item.category}</div>
                        <motion.button 
                          className="ml-4 text-red-500 hover:text-red-600"
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale:                          0.9 }}
                          onClick={() => showToast(`Removed ${item.name} from saved items!`, 'warning')}
                        >
                          <X size={20} />
                        </motion.button>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Notifications Tab Content */}
            {activeTab === 'notifications' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-5">Notifications</h2>
                <div className="space-y-4">
                  {notifications.map((notification, index) => (
                    <motion.div 
                      key={notification.id} 
                      className={`p-4 rounded-lg ${notification.read ? 'bg-gray-100' : 'bg-white border border-gray-200'}`}
                      variants={cardVariants}
                      initial="hidden"
                      animate="visible"
                      custom={index}
                      whileHover="hover"
                      onClick={() => showToast(notification.message, 'info')}
                    >
                      <div className="flex justify-between items-center">
                        <div className="text-sm text-gray-600">{notification.message}</div>
                        <span className="text-xs text-gray-400">{notification.time}</span>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            )}

            {/* Analytics Tab Content */}
            {activeTab === 'analytics' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-5">Analytics Overview</h2>
                <div className="flex flex-col space-y-4">
                  {/* Placeholder for future analytics content */}
                  <p className="text-gray-600">Analytics content will be available here.</p>
                </div>
              </div>
            )}

            {/* Settings Tab Content */}
            {activeTab === 'settings' && (
              <div className="bg-white rounded-xl shadow-lg p-6 border border-gray-200">
                <h2 className="text-lg font-semibold text-gray-800 mb-5">Account Settings</h2>
                <div className="flex flex-col space-y-4">
                  <PasswordChangeForm />
                  <ProfileEditForm />
                </div>
              </div>
            )}
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
}

export default Dashboard;