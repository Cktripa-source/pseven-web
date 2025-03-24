import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, AtSign, FileText, Phone, MapPin, Clock, Briefcase, ArrowRight,LoaderCircle } from 'lucide-react';
import Loading from './loading';
import ViewMore from './viewmorejob';
import { useAuth } from './AuthContext';

const JobEmployers = () => {
  const { user, isAuthenticated } = useAuth();
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
    cvLink: null,
    personPhone: '',
    coverLetter: '',
  });
  const [isOffline, setIsOffline] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [viewingJobId, setViewingJobId] = useState(null);

  // New state variables for loading indicators
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  // Network status listeners
  useEffect(() => {
    const handleOffline = () => setIsOffline(true);
    const handleOnline = () => setIsOffline(false);

    window.addEventListener('offline', handleOffline);
    window.addEventListener('online', handleOnline);

    return () => {
      window.removeEventListener('offline', handleOffline);
      window.removeEventListener('online', handleOnline);
    };
  }, []);

  // Fetch jobs
  useEffect(() => {
    const fetchJobs = async () => {
      if (isOffline) {
        setLoading(false);
        return;
      }

      try {
        const response = await axios.get('https://api.psevenrwanda.com/api/jobs');
        setJobs(response.data);
      } catch (err) {
        setError('Error fetching job data');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, [isOffline]);

  // Handle job application
  const handleApplyClick = (job) => {
    if (!isAuthenticated) {
      alert("Please log in to apply for a job.");
      return;
    }
    setSelectedJob(job);
    setIsFormOpen(true);
  };
  const handleImageError = (e) => {
    e.target.src = 'https://via.placeholder.com/150?text=Job+Image'; // Default placeholder image
  };

  // Handle form input changes
  const handleFormChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  // Handle file upload
  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true); // Set loading state for file upload
      setApplicationData(prev => ({
        ...prev,
        cvLink: file,
      }));
      setIsUploading(false); // Reset loading state after file is set
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  // Submit application
  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    
    const formData = new FormData();
    formData.append('fullName', applicationData.fullName);
    formData.append('email', applicationData.email);
    formData.append('personPhone', applicationData.personPhone);
    formData.append('coverLetter', applicationData.coverLetter || "No cover letter provided");
    
    if (applicationData.cvLink) {
      formData.append('cvFile', applicationData.cvLink); 
    } else {
      alert('Please upload a CV file');
      return;
    }
    
    try {
      setIsSubmitting(true); // Set loading state for submission
      const url = `https://api.psevenrwanda.com/api/applications/${selectedJob._id}/apply?fileType=cv`;
      const response = await axios.post(url, formData, {
        headers: { 'Content-Type': 'multipart/form-data' },
      });
      alert('Application submitted successfully');
      setIsFormOpen(false);
    } catch (err) {
      console.error("Application error:", err);
      alert('Failed to submit application: ' + (err.response?.data?.message || err.message));
    } finally {
      setIsSubmitting(false); // Reset loading state after submission
    }
  };

  // Format date
  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'short', day: 'numeric' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  // Show loading state
  if (loading) return <Loading />;
  
  // Show error state
  if (error) return <div className="text-center text-red-500 font-semibold text-lg">{error}</div>;
  
  // Show offline state
  if (isOffline) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600 font-medium">You are offline. Please check your internet connection.</p>
        </div>
      </div>
    );
  }

  // Show job details view
  if (viewingJobId) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6 pt-20 mt-20">
        <div className="max-w-4xl mx-auto">
          <ViewMore 
            jobId={viewingJobId} 
            onBack={() => setViewingJobId(null)} 
            onApply={handleApplyClick} 
          />
        </div>

        {/* Application Form Modal */}
        {isFormOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black bg-opacity-50 backdrop-blur-sm flex items-center justify-center z-50 p-4"
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              className="bg-white rounded-2xl shadow-2xl w-full max-w-lg p-6"
            >
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-bold text-gray-900">Apply for {selectedJob.title}</h3>
                <button onClick={() => setIsFormOpen(false)} className="p-1 hover:bg-gray-100 rounded-full">
                  <span className="text-gray-500 text-xl">×</span>
                </button>
              </div>

              <form onSubmit={handleSubmitApplication} className="space-y-4">
                <div className="space-y-4">
                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
                    <div className="flex items-center">
                      <User className="absolute left-3 text-gray-400" size={18} />
                      <input
                        type="text"
                        name="fullName"
                        value={applicationData.fullName}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="John Doe"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
                    <div className="flex items-center">
                      <AtSign className="absolute left-3 text-gray-400" size={18} />
                      <input
                        type="email"
                        name="email"
                        value={applicationData.email}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        placeholder="john@example.com"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
                    <div className="flex items-center">
                      <Phone className="absolute left-3 text-gray-400" size={18} />
                      <input
                        type="tel"
                        name="personPhone"
                        value={applicationData.personPhone}
                        onChange={handleFormChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                    </div>
                  </div>

                  <div className="relative">
                    <label className="text-sm font-medium text-gray-700 mb-1 block">Upload CV (PDF only)</label>
                    <div className="flex items-center">
                      <FileText className="absolute left-3 text-gray-400" size={18} />
                      <input
                        type="file"
                        accept="application/pdf"
                        onChange={handleFileChange}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg"
                        required
                      />
                      {isUploading && <span className="ml-2 text-green-500">Uploading...</span>}
                    </div>
                  </div>
                </div>
                <div className="relative">
                  <label className="text-sm font-medium text-gray-700 mb-1 block">Cover Letter</label>
                  <textarea
                    name="coverLetter"
                    value={applicationData.coverLetter}
                    onChange={handleFormChange}
                    className="w-full pl-4 pr-4 py-2 border border-gray-300 rounded-lg"
                    placeholder="Why you're interested in this position..."
                    required
                  />
                </div>
                <div className="flex justify-end space-x-4 mt-6">
                  <button type="button" onClick={() => setIsFormOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50">Cancel</button>
                  <button 
  type="submit" 
  className="px-4 py-2 bg-black text-white rounded-lg hover:bg-green-500 transition duration-300 flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
  disabled={isSubmitting}
>
  {isSubmitting ? (
    <>
      <LoaderCircle className="animate-spin" /> Submitting...
    </>
  ) : (
    "Submit Application"
  )}
</button>

                </div>
              </form>
            </motion.div>
          </motion.div>
        )}
      </div>
    );
  }

  // Jobs listing view
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6 pt-20 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <Briefcase className="text-black mr-3" size={32} />
          <h1 className="text-4xl font-extrabold text-gray-900 tracking-tight">Available Positions</h1>
        </div>

        {/* Job Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-8">
          {jobs.map((job) => (
            <motion.div
              key={job._id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="bg-white rounded-xl shadow-lg overflow-hidden border border-gray-100 hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
            >
              <div className="h-48 w-full bg-gray-100 overflow-hidden">
                <img 
                  src={`${job.image}` || 'https://via.placeholder.com/150?text=Job+Image'}
                  alt={job.title} 
                  className="w-full h-full object-cover"
                  onError={handleImageError}
                />
              </div>

              <div className="p-6">
                <h3 className="text-2xl font-bold text-gray-900 capitalize">{job.title}</h3>
                <div className="flex items-center text-gray-500 mb-4">
                  <Clock size={16} className="mr-1" />
                  <span className="text-sm">Posted: {job.createdAt ? formatDate(job.createdAt) : 'Recently'}</span>
                </div>
                <p className="text-gray-600 mb-6 line-clamp-3">{job.description}</p>
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2" size={18} />
                    <span className="capitalize">{job.location}</span>
                  </div>
                  {job.employmentType && (
                    <div className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm inline-block">{job.employmentType}</div>
                  )}
                </div>

                <div className="flex justify-between items-center mt-4">
                  <button 
                    onClick={() => setViewingJobId(job._id)} 
                    className="text-blue-600 hover:text-blue-800 flex items-center transition duration-300"
                  >
                    <span>View Details</span>
                    <ArrowRight size={16} className="ml-1" />
                  </button>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default JobEmployers;