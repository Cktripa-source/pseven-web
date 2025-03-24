import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { toast } from 'react-hot-toast';
import {
  Search,
  Filter,
  Star,
  StarOff,
  Trash2,
  Archive,
  RefreshCw,
  CheckCircle,
  XCircle,
  ChevronRight,
  Mail,
  Clock,
  Tag,
  MoreHorizontal,
  AlertCircle,
  MessageSquare
} from 'lucide-react';

// Mock data for the inbox messages
const mockMessages = [
  {
    id: 1,
    sender: "John Doe",
    email: "john.doe@example.com",
    subject: "Product Inquiry - Premium Package",
    message: "Hello, I'm interested in your premium package but I have some questions about the features. Could you provide more details?",
    timestamp: "2025-03-20T09:30:00",
    read: false,
    flagged: true,
    category: "inquiry",
    avatar: "https://randomuser.me/api/portraits/men/1.jpg"
  },
  {
    id: 2,
    sender: "Sarah Williams",
    email: "sarah.w@company.org",
    subject: "Job Application Follow-up",
    message: "I submitted my application last week and wanted to follow up on the status. Could you let me know if you've received it and when I might hear back?",
    timestamp: "2025-03-19T16:45:00",
    read: true,
    flagged: false,
    category: "application",
    avatar: "https://randomuser.me/api/portraits/women/2.jpg"
  },
  {
    id: 3,
    sender: "Tech Support",
    email: "support@pseven.com",
    subject: "URGENT: System Maintenance Notification",
    message: "We'll be performing scheduled maintenance on our servers tonight from 11PM to 2AM. Some services may be temporarily unavailable during this time.",
    timestamp: "2025-03-19T14:20:00",
    read: true,
    flagged: true,
    category: "system",
    avatar: "/logo.png"
  },
  {
    id: 4,
    sender: "Michael Johnson",
    email: "michael.j@client.net",
    subject: "Problem with my recent order #45678",
    message: "I recently placed order #45678 but haven't received a shipping confirmation yet. It's been over a week now. Could you check on this for me?",
    timestamp: "2025-03-18T10:15:00",
    read: false,
    flagged: false,
    category: "support",
    avatar: "https://randomuser.me/api/portraits/men/3.jpg"
  },
  {
    id: 5,
    sender: "Emily Davis",
    email: "emily.d@partner.co",
    subject: "Partnership Opportunity",
    message: "Our company is looking to establish strategic partnerships in your industry. We believe there could be excellent synergy between our businesses. Would you be interested in discussing this further?",
    timestamp: "2025-03-17T13:50:00",
    read: true,
    flagged: false,
    category: "business",
    avatar: "https://randomuser.me/api/portraits/women/4.jpg"
  }
];

// Category color mapping
const categoryColors = {
  inquiry: "bg-blue-100 text-blue-800",
  application: "bg-green-100 text-green-800",
  system: "bg-red-100 text-red-800",
  support: "bg-amber-100 text-amber-800",
  business: "bg-purple-100 text-purple-800"
};

const InboxPage = () => {
  const [messages, setMessages] = useState([]);
  const [selectedMessage, setSelectedMessage] = useState(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');
  const [isReplying, setIsReplying] = useState(false);
  const [replyText, setReplyText] = useState('');

  // Simulate loading messages from an API
  useEffect(() => {
    const loadMessages = () => {
      setLoading(true);
      setTimeout(() => {
        setMessages(mockMessages);
        setLoading(false);
      }, 800);
    };
    
    loadMessages();
  }, []);

  // Handle message selection
  const handleSelectMessage = (message) => {
    // Mark as read when selected
    if (!message.read) {
      const updatedMessages = messages.map(m => 
        m.id === message.id ? { ...m, read: true } : m
      );
      setMessages(updatedMessages);
    }
    setSelectedMessage(message);
    setIsReplying(false);
  };

  // Handle message flagging
  const handleToggleFlag = (id, event) => {
    event.stopPropagation();
    const updatedMessages = messages.map(message => 
      message.id === id ? { ...message, flagged: !message.flagged } : message
    );
    setMessages(updatedMessages);
    const message = messages.find(m => m.id === id);
    toast.success(message.flagged ? 'Message unflagged' : 'Message flagged');
  };

  // Handle message deletion
  const handleDeleteMessage = (id, event) => {
    event.stopPropagation();
    const updatedMessages = messages.filter(message => message.id !== id);
    setMessages(updatedMessages);
    if (selectedMessage && selectedMessage.id === id) {
      setSelectedMessage(null);
    }
    toast.success('Message deleted');
  };

  // Format date string
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const now = new Date();
    const isToday = date.toDateString() === now.toDateString();
    
    if (isToday) {
      return date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
    }
    
    return date.toLocaleDateString([], {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  // Filter messages based on current filter and search term
  const filteredMessages = messages.filter(message => {
    const matchesFilter = 
      filter === 'all' || 
      (filter === 'unread' && !message.read) || 
      (filter === 'flagged' && message.flagged) ||
      (filter === message.category);
      
    const matchesSearch = 
      message.sender.toLowerCase().includes(searchTerm.toLowerCase()) || 
      message.subject.toLowerCase().includes(searchTerm.toLowerCase()) ||
      message.message.toLowerCase().includes(searchTerm.toLowerCase());
      
    return matchesFilter && matchesSearch;
  });

  // Handle message reply
  const handleReply = () => {
    if (replyText.trim() === '') return;
    
    toast.success('Reply sent');
    setIsReplying(false);
    setReplyText('');
  };

  // Handle refresh
  const handleRefresh = () => {
    setLoading(true);
    toast.promise(
      new Promise(resolve => {
        setTimeout(() => {
          setMessages(mockMessages);
          resolve();
        }, 1000);
      }),
      {
        loading: 'Refreshing...',
        success: 'Inbox updated',
        error: 'Failed to refresh',
      }
    );
    setTimeout(() => setLoading(false), 1000);
  };

  return (
    <>
      <div className="max-w-6xl mx-auto w-full h-full flex flex-col">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 gap-4">
          <motion.h1 
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-2xl font-bold text-gray-800"
          >
            Inbox
            {!loading && (
              <span className="ml-2 text-sm font-normal text-gray-500">
                ({filteredMessages.length} {filteredMessages.length === 1 ? 'message' : 'messages'})
              </span>
            )}
          </motion.h1>
          
          <div className="flex flex-wrap gap-2 w-full md:w-auto">
            <div className="relative flex-grow md:flex-grow-0">
              <input
                type="text"
                placeholder="Search messages..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none transition-all"
              />
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <div className="relative">
              <select
                value={filter}
                onChange={(e) => setFilter(e.target.value)}
                className="pl-9 pr-4 py-2 border border-gray-200 rounded-lg appearance-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none bg-white transition-all"
              >
                <option value="all">All Messages</option>
                <option value="unread">Unread</option>
                <option value="flagged">Flagged</option>
                <option value="inquiry">Inquiries</option>
                <option value="application">Applications</option>
                <option value="support">Support</option>
                <option value="system">System</option>
                <option value="business">Business</option>
              </select>
              <Filter className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
            </div>
            
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={handleRefresh}
              className="p-2 bg-white border border-gray-200 rounded-lg text-gray-600 hover:text-blue-600 hover:border-blue-200 transition-colors"
            >
              <RefreshCw className="h-5 w-5" />
            </motion.button>
          </div>
        </div>
        
        <div className="bg-white rounded-xl shadow-sm border border-gray-200 flex-grow overflow-hidden flex flex-col md:flex-row">
          {/* Messages list */}
          <div className="w-full md:w-2/5 lg:w-1/3 border-r border-gray-200 overflow-hidden flex flex-col">
            <div className="p-3 bg-gray-50 border-b border-gray-200">
              <h2 className="font-medium text-gray-700">Messages</h2>
            </div>
            
            <div className="overflow-y-auto flex-grow">
              {loading ? (
                <div className="flex items-center justify-center h-full">
                  <motion.div
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  >
                    <RefreshCw className="h-8 w-8 text-blue-500" />
                  </motion.div>
                </div>
              ) : filteredMessages.length === 0 ? (
                <div className="flex flex-col items-center justify-center h-full p-4 text-center">
                  <MessageSquare className="h-12 w-12 text-gray-300 mb-2" />
                  <p className="text-gray-500">No messages found</p>
                  <p className="text-gray-400 text-sm">Try a different filter or search term</p>
                </div>
              ) : (
                <AnimatePresence>
                  {filteredMessages.map((message) => (
                    <motion.div
                      key={message.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, height: 0 }}
                      transition={{ duration: 0.2 }}
                      onClick={() => handleSelectMessage(message)}
                      className={`p-3 border-b border-gray-100 hover:bg-blue-50 cursor-pointer transition-colors ${
                        selectedMessage?.id === message.id ? 'bg-blue-50' : ''
                      } ${!message.read ? 'bg-blue-50/30' : ''}`}
                    >
                      <div className="flex items-start gap-3">
                        <img 
                          src={message.avatar} 
                          alt={message.sender} 
                          className="h-10 w-10 rounded-full object-cover"
                          onError={(e) => {
                            e.target.src = '/logo.png';
                          }}
                        />
                        
                        <div className="flex-grow min-w-0">
                          <div className="flex justify-between items-start mb-1">
                            <h3 className={`text-sm font-medium ${!message.read ? 'text-gray-900' : 'text-gray-700'}`}>
                              {message.sender}
                            </h3>
                            <span className="text-xs text-gray-500 whitespace-nowrap ml-2">
                              {formatDate(message.timestamp)}
                            </span>
                          </div>
                          
                          <p className="text-sm text-gray-500 mb-1 truncate">{message.subject}</p>
                          
                          <div className="flex items-center justify-between">
                            <p className="text-xs text-gray-400 truncate flex-grow">{message.message}</p>
                            
                            <div className="flex gap-1 ml-2">
                              <button 
                                onClick={(e) => handleToggleFlag(message.id, e)}
                                className={`p-1 rounded-full transition-colors ${message.flagged ? 'text-amber-500 hover:text-amber-600' : 'text-gray-400 hover:text-gray-500'}`}
                              >
                                {message.flagged ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                              </button>
                              
                              <button 
                                onClick={(e) => handleDeleteMessage(message.id, e)}
                                className="p-1 rounded-full text-gray-400 hover:text-red-500 transition-colors"
                              >
                                <Trash2 className="h-4 w-4" />
                              </button>
                            </div>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              )}
            </div>
          </div>
          
          {/* Message detail view */}
          <div className="w-full md:w-3/5 lg:w-2/3 overflow-hidden flex flex-col">
            {selectedMessage ? (
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="h-full flex flex-col"
              >
                <div className="p-4 border-b border-gray-200 flex justify-between items-center">
                  <h2 className="font-medium text-gray-800 truncate">{selectedMessage.subject}</h2>
                  
                  <div className="flex gap-1">
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleToggleFlag(selectedMessage.id, e)}
                      className={`p-2 rounded-lg transition-colors border ${
                        selectedMessage.flagged 
                          ? 'text-amber-500 border-amber-200 hover:bg-amber-50' 
                          : 'text-gray-400 border-gray-200 hover:bg-gray-50'
                      }`}
                    >
                      {selectedMessage.flagged ? <Star className="h-4 w-4" /> : <StarOff className="h-4 w-4" />}
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      onClick={(e) => handleDeleteMessage(selectedMessage.id, e)}
                      className="p-2 rounded-lg text-gray-400 hover:text-red-500 border border-gray-200 hover:border-red-200 hover:bg-red-50 transition-colors"
                    >
                      <Trash2 className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <Archive className="h-4 w-4" />
                    </motion.button>
                    
                    <motion.button
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className="p-2 rounded-lg text-gray-400 hover:text-gray-600 border border-gray-200 hover:bg-gray-50 transition-colors"
                    >
                      <MoreHorizontal className="h-4 w-4" />
                    </motion.button>
                  </div>
                </div>
                
                <div className="p-4 flex items-start gap-4">
                  <img 
                    src={selectedMessage.avatar} 
                    alt={selectedMessage.sender} 
                    className="h-12 w-12 rounded-full object-cover"
                    onError={(e) => {
                      e.target.src = '/logo.png';
                    }}
                  />
                  
                  <div className="flex-grow">
                    <div className="flex flex-wrap justify-between items-start mb-2">
                      <div>
                        <h3 className="font-medium text-gray-900">{selectedMessage.sender}</h3>
                        <p className="text-sm text-gray-500">{selectedMessage.email}</p>
                      </div>
                      
                      <div className="flex items-center gap-2">
                        <span className="text-sm text-gray-500">
                          {new Date(selectedMessage.timestamp).toLocaleString()}
                        </span>
                        
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${categoryColors[selectedMessage.category]}`}>
                          {selectedMessage.category.charAt(0).toUpperCase() + selectedMessage.category.slice(1)}
                        </span>
                      </div>
                    </div>
                    
                    <div className="bg-gray-50 rounded-lg p-4 mb-4">
                      <p className="text-gray-800 whitespace-pre-line">{selectedMessage.message}</p>
                    </div>
                    
                    <div className="mt-4 flex gap-2">
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        onClick={() => setIsReplying(true)}
                        className="px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors font-medium flex items-center gap-2"
                      >
                        <Mail className="h-4 w-4" />
                        Reply
                      </motion.button>
                      
                      <motion.button
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors font-medium flex items-center gap-2"
                      >
                        <CheckCircle className="h-4 w-4" />
                        Mark as Resolved
                      </motion.button>
                    </div>
                  </div>
                </div>
                
                <AnimatePresence>
                  {isReplying && (
                    <motion.div 
                      initial={{ opacity: 0, height: 0 }}
                      animate={{ opacity: 1, height: 'auto' }}
                      exit={{ opacity: 0, height: 0 }}
                      className="p-4 border-t border-gray-200 mt-auto"
                    >
                      <div className="bg-white rounded-lg border border-gray-300 overflow-hidden">
                        <textarea
                          value={replyText}
                          onChange={(e) => setReplyText(e.target.value)}
                          className="w-full p-3 focus:outline-none resize-none"
                          rows={4}
                          placeholder={`Reply to ${selectedMessage.sender}...`}
                        />
                        
                        <div className="flex justify-between items-center p-2 bg-gray-50 border-t border-gray-200">
                          <div className="flex gap-2">
                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors">
                              <Tag className="h-4 w-4" />
                            </button>
                            <button className="p-2 text-gray-500 hover:text-gray-700 rounded-lg transition-colors">
                              <Clock className="h-4 w-4" />
                            </button>
                          </div>
                          
                          <div className="flex gap-2">
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={() => setIsReplying(false)}
                              className="px-3 py-1 text-gray-500 hover:text-gray-700 rounded-lg transition-colors flex items-center gap-1"
                            >
                              <XCircle className="h-4 w-4" />
                              Cancel
                            </motion.button>
                            
                            <motion.button
                              whileHover={{ scale: 1.05 }}
                              whileTap={{ scale: 0.95 }}
                              onClick={handleReply}
                              className="px-3 py-1 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition-colors flex items-center gap-1"
                            >
                              <Mail className="h-4 w-4" />
                              Send Reply
                            </motion.button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </motion.div>
            ) : (
              <div className="h-full flex flex-col items-center justify-center p-6 text-center">
                <motion.div
                  initial={{ scale: 0.8, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.3 }}
                >
                  <Mail className="h-16 w-16 text-gray-300 mb-4" />
                  <h3 className="text-lg font-medium text-gray-700 mb-2">Select a message</h3>
                  <p className="text-gray-500 max-w-sm">
                    Choose a message from the list to view its details here
                  </p>
                </motion.div>
              </div>
            )}
          </div>
        </div>
      </div>
      </>
  );
};

export default InboxPage;