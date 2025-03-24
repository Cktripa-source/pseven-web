import React, { useEffect, useState, useRef } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { 
  MapPin, Clock, Briefcase, Share2, Link, Facebook, 
  Twitter, Linkedin, ArrowLeft, Copy, Check, ExternalLink,
  CalendarRange, Globe, Image as ImageIcon
} from 'lucide-react';
import Loading from './loading';

const ViewMore = ({ jobId, onBack, onApply }) => {
  const [job, setJob] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [activeTab, setActiveTab] = useState('description');
  const [isSharingOpen, setIsSharingOpen] = useState(false);
  const [copySuccess, setCopySuccess] = useState(false);
  const [showLargeImage, setShowLargeImage] = useState(false);
  const linkInputRef = useRef(null);
  const shareContainerRef = useRef(null);

  useEffect(() => {
    const fetchJobDetails = async () => {
      try {
        const response = await axios.get(`https://api.psevenrwanda.com/api/jobs/${jobId}`);
        setJob(response.data);
      } catch (err) {
        setError('Error fetching job details');
      } finally {
        setLoading(false);
      }
    };

    if (jobId) fetchJobDetails();
    
    // Close share options when clicking outside
    const handleClickOutside = (event) => {
      if (shareContainerRef.current && !shareContainerRef.current.contains(event.target)) {
        setIsSharingOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, [jobId]);

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  const getJobUrl = () => `${window.location.origin}/job-employers?jobId=${jobId}`;

  const handleShare = (platform) => {
    const url = getJobUrl();
    const title = job?.title || 'Job Opportunity';
    
    switch (platform) {
      case 'facebook':
        window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'twitter':
        window.open(`https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(`Check out this job opportunity: ${title}`)}`, '_blank');
        break;
      case 'linkedin':
        window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank');
        break;
      case 'email':
        window.open(`mailto:?subject=${encodeURIComponent(`Job Opportunity: ${title}`)}&body=${encodeURIComponent(`Check out this job opportunity: ${url}`)}`, '_blank');
        break;
      default:
        break;
    }
  };

  const handleCopyLink = () => {
    if (linkInputRef.current) {
      linkInputRef.current.select();
      navigator.clipboard.writeText(linkInputRef.current.value).then(() => {
        setCopySuccess(true);
        setTimeout(() => setCopySuccess(false), 2000);
      });
    }
  };

  if (loading) return <div className="flex justify-center items-center h-screen"><Loading /></div>;
  if (error) return <div className="text-center text-red-500 font-semibold text-lg">{error}</div>;
  if (!job) return <div className="text-center text-gray-500">Job not found</div>;

  const tabs = [
    { id: 'description', label: 'Description' },
    { id: 'company', label: 'Company' },
    { id: 'requirements', label: 'Requirements' }
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="bg-white min-h-screen"
    >
      {/* Header */}
      <div className="bg-gray-900 text-white sticky top-0 z-10 shadow-lg">
        <div className="px-4 py-3 flex items-center justify-between">
          <button onClick={onBack} className="flex items-center text-gray-300 hover:text-white transition-colors">
            <ArrowLeft size={20} className="mr-2" />
            <span className="hidden xs:inline">Back</span>
          </button>
          
          <h1 className="text-base sm:text-lg font-semibold text-white truncate max-w-xs sm:max-w-md">
            {job.title}
          </h1>
          
          <div className="flex items-center space-x-2 sm:space-x-4">
            <div ref={shareContainerRef} className="relative">
              <button
                onClick={() => setIsSharingOpen(!isSharingOpen)}
                className="flex items-center text-gray-300 hover:text-white transition-colors p-1 sm:p-2"
              >
                <Share2 size={18} />
                <span className="hidden sm:inline ml-1">Share</span>
              </button>
              
              {isSharingOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="absolute right-0 mt-2 w-64 bg-white text-gray-800 rounded-lg shadow-xl border border-gray-200 p-4 z-20"
                >
                  <h3 className="font-semibold mb-3 text-gray-900">Share this job</h3>
                  
                  <div className="relative mb-3 flex">
                    <input
                      ref={linkInputRef}
                      type="text"
                      value={getJobUrl()}
                      readOnly
                      className="w-full pr-10 border border-gray-300 rounded-lg py-2 px-3 text-sm"
                    />
                    <button 
                      onClick={handleCopyLink}
                      className="absolute right-2 top-1/2 transform -translate-y-1/2 text-gray-500 hover:text-gray-700"
                    >
                      {copySuccess ? <Check size={18} className="text-green-500" /> : <Copy size={18} />}
                    </button>
                  </div>
                  
                  <div className="grid grid-cols-4 gap-2">
                    <button onClick={() => handleShare('facebook')} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <Facebook size={20} className="text-blue-600 mb-1" />
                      <span className="text-xs">Facebook</span>
                    </button>
                    <button onClick={() => handleShare('twitter')} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <Twitter size={20} className="text-blue-400 mb-1" />
                      <span className="text-xs">Twitter</span>
                    </button>
                    <button onClick={() => handleShare('linkedin')} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <Linkedin size={20} className="text-blue-700 mb-1" />
                      <span className="text-xs">LinkedIn</span>
                    </button>
                    <button onClick={() => handleShare('email')} className="flex flex-col items-center p-2 bg-gray-50 rounded-lg hover:bg-gray-100">
                      <Link size={20} className="text-gray-600 mb-1" />
                      <span className="text-xs">Email</span>
                    </button>
                  </div>
                </motion.div>
              )}
            </div>
            
            <button
              onClick={() => onApply(job)}
              className="bg-green-500 hover:bg-green-600 text-white py-1.5 px-2 sm:px-4 rounded-lg transition-colors text-sm font-medium"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
      
      {/* Job header */}
      <div className="bg-gray-100 border-b">
        <div className="px-4 py-6">
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between">
            <div className="flex items-center mb-4 sm:mb-0">
              <div 
                className="w-16 h-16 sm:w-20 sm:h-20 bg-white rounded-lg shadow-md overflow-hidden flex items-center justify-center mr-3 sm:mr-4 cursor-pointer hover:opacity-90 transition-opacity flex-shrink-0"
                onClick={() => setShowLargeImage(!showLargeImage)}
              >
                {job.image ? (
                  <img 
                    src={job.image}
                    alt={job.title} 
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <div className="bg-gray-100 w-full h-full flex flex-col items-center justify-center">
                    <ImageIcon size={24} className="text-gray-400" />
                    <span className="text-xs text-gray-400 mt-1">No image</span>
                  </div>
                )}
              </div>
              
              <div className="flex-grow">
                <h1 className="text-xl sm:text-2xl font-bold text-gray-900 break-words">{job.title}</h1>
                <div className="mt-1 flex flex-wrap items-center text-gray-600 text-xs sm:text-sm gap-y-2 gap-x-3 sm:gap-x-4">
                  <div className="flex items-center">
                    <Clock size={14} className="mr-1" />
                    <span>Posted {job.createdAt ? formatDate(job.createdAt) : 'Recently'}</span>
                  </div>
                  <div className="flex items-center">
                    <MapPin size={14} className="mr-1" />
                    <span className="capitalize">{job.location}</span>
                  </div>
                  <div className="flex items-center">
                    <Briefcase size={14} className="mr-1" />
                    <span>{job.employmentType}</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
      
      {/* Tab navigation */}
      <div className="border-b border-gray-200 overflow-x-auto scrollbar-hide">
        <div className="px-4">
          <div className="flex">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`py-3 sm:py-4 px-3 sm:px-4 font-medium text-xs sm:text-sm whitespace-nowrap border-b-2 transition-colors ${
                  activeTab === tab.id 
                    ? 'border-green-500 text-green-600' 
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>
        </div>
      </div>
      
      {/* Main content */}
      <div className="px-4 py-6 sm:py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 sm:gap-8">
          <div className="lg:col-span-2">
            {activeTab === 'description' && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Job Description</h2>
                <div className="prose max-w-none text-gray-700 whitespace-pre-line text-sm sm:text-base">
                  {job.description}
                </div>
              </div>
            )}
            
            {activeTab === 'company' && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">About the Company</h2>
                <div className="prose max-w-none text-gray-700 text-sm sm:text-base">
                  {job.companyDescription || "No company information provided."}
                </div>
                <div className="mt-6">
                  <h3 className="text-md sm:text-lg font-medium text-gray-800 mb-3">Company Logo</h3>
                  <div className="bg-white p-4 border border-gray-200 rounded-lg inline-block">
                    {job.image ? (
                      <img 
                        src={job.image}
                        alt={`${job.title} company logo`} 
                        className="max-h-32 sm:max-h-40 object-contain"
                      />
                    ) : (
                      <div className="w-full h-32 sm:h-40 bg-gray-100 rounded-md flex flex-col items-center justify-center p-4">
                        <ImageIcon size={40} className="text-gray-400 mb-2" />
                        <p className="text-gray-400 text-sm text-center">Company logo not available</p>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            )}
            
            {activeTab === 'requirements' && (
              <div>
                <h2 className="text-lg sm:text-xl font-semibold text-gray-900 mb-3 sm:mb-4">Job Requirements</h2>
                <div className="prose max-w-none text-gray-700 text-sm sm:text-base">
                  {job.requirements || "No specific requirements listed."}
                </div>
              </div>
            )}
          </div>
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-gray-50 rounded-xl p-4 sm:p-6 shadow-sm">
              <h2 className="text-md sm:text-lg font-semibold text-gray-900 mb-4">Job Overview</h2>
              
              <div className="space-y-4">
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3 flex-shrink-0">
                    <CalendarRange size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700">Date Posted</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{job.createdAt ? formatDate(job.createdAt) : 'Recently'}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3 flex-shrink-0">
                    <MapPin size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700">Location</h3>
                    <p className="text-gray-600 text-xs sm:text-sm capitalize">{job.location}</p>
                  </div>
                </div>
                
                <div className="flex items-start">
                  <div className="bg-gray-100 p-2 rounded-lg mr-3 flex-shrink-0">
                    <Briefcase size={18} className="text-gray-600" />
                  </div>
                  <div>
                    <h3 className="text-xs sm:text-sm font-medium text-gray-700">Job Type</h3>
                    <p className="text-gray-600 text-xs sm:text-sm">{job.employmentType}</p>
                  </div>
                </div>
                
                {job.companyWebsite && (
                  <div className="flex items-start">
                    <div className="bg-gray-100 p-2 rounded-lg mr-3 flex-shrink-0">
                      <Globe size={18} className="text-gray-600" />
                    </div>
                    <div className="overflow-hidden">
                      <h3 className="text-xs sm:text-sm font-medium text-gray-700">Company Website</h3>
                      <a 
                        href={job.companyWebsite} 
                        target="_blank" 
                        rel="noopener noreferrer" 
                        className="text-blue-600 hover:underline text-xs sm:text-sm truncate block"
                      >
                        {job.companyWebsite.replace(/(^\w+:|^)\/\//, '')}
                      </a>
                    </div>
                  </div>
                )}
              </div>
              
              <div className="mt-6 pt-6 border-t border-gray-200">
                <button
                  onClick={() => onApply(job)}
                  className="w-full bg-black hover:bg-green-600 text-white font-medium py-2.5 rounded-lg transition-colors flex items-center justify-center"
                >
                  <span>Apply Now</span>
                  <ExternalLink size={18} className="ml-2" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Large image modal */}
      {showLargeImage && (
        <div 
          className="fixed inset-0 bg-black bg-opacity-75 flex items-center justify-center z-50 p-4"
          onClick={() => setShowLargeImage(false)}
        >
          <div className="relative bg-white rounded-lg p-4 max-w-2xl max-h-screen overflow-auto" onClick={e => e.stopPropagation()}>
            <button 
              className="absolute top-2 right-2 text-gray-500 hover:text-gray-700 bg-white rounded-full p-1"
              onClick={() => setShowLargeImage(false)}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
            {job.image ? (
              <img 
                src={job.image}
                alt={job.title} 
                className="max-w-full max-h-full object-contain"
              />
            ) : (
              <div className="w-full h-64 sm:h-96 bg-gray-100 rounded-md flex flex-col items-center justify-center p-8">
                <ImageIcon size={64} className="text-gray-400 mb-4" />
                <p className="text-gray-500 text-center font-medium">Company logo not available</p>
                <p className="text-gray-400 text-sm text-center mt-2">No image has been provided for this job listing</p>
              </div>
            )}
          </div>
        </div>
      )}
    </motion.div>
  );
};

export default ViewMore;