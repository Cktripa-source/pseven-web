import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, AtSign, FileText, Edit3, Phone, MapPin, DollarSign, PenSquare, Briefcase } from 'lucide-react';
import Loading from './loading';

const JobEmployers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    cvLink: null, // Change to null for file upload
    personPhone:''
  });
  const [isOffline, setIsOffline] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

  // Network status handlers remain the same
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

  // Fetch jobs logic remains the same
  useEffect(() => {
    if (isOffline) return;

    const fetchJobs = async () => {
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

  const handleApplyClick = (job) => {
    setSelectedJob(job);
    setIsFormOpen(true);
  };

  const handleFormChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file && file.type === 'application/pdf') {
      setApplicationData({
        ...applicationData,
        cvLink: file,
      });
    } else {
      alert('Please upload a valid PDF file.');
    }
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    const { fullName, email, cvLink, personPhone } = applicationData;

    if (!fullName || !email || !cvLink || !personPhone ) {
      alert('Please fill all fields.');
      return;
    }

    const formData = new FormData();
    formData.append('fullName', fullName);
    formData.append('email', email);
    formData.append('cvLink', cvLink);
    formData.append('personPhone', personPhone);

    try {
      await axios.post(`https://api.psevenrwanda.com/api/applications/${selectedJob._id}/apply`, formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      alert('Application submitted successfully');
      setIsFormOpen(false);
    } catch (err) {
      alert('Failed to submit application');
    }
  };

  if (isOffline) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <div className="w-16 h-16 border-4 border-t-4 border-blue-500 border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loading) return <div className="min-h-screen flex justify-center items-center bg-gray-50"><Loading /></div>;
  if (error) return <div className="text-center text-red-500 font-semibold text-lg">{error}</div>;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 py-16 px-6 pt-20 mt-20">
      <div className="max-w-7xl mx-auto">
        <div className="flex items-center justify-center mb-12">
          <Briefcase className="text-black mr-3" size={32} />
          <h1 className="text-4xl md:text-5xl font-extrabold text-gray-900 tracking-tight">
            Available Positions
          </h1>
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
              <div className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-2xl font-bold text-gray-900 capitalize">{job.title}</h3>
                  <span className="px-4 py-1 bg-blue-100 text-blue-800 rounded-full text-sm font-semibold">
                    ${job.salary}
                  </span>
                </div>
                
                <p className="text-gray-600 mb-6 line-clamp-3">{job.description}</p>
                
                <div className="space-y-3 mb-6">
                  <div className="flex items-center text-gray-600">
                    <MapPin className="mr-2" size={18} />
                    <span className="capitalize">{job.location}</span>
                  </div>
                  
                  <div className="flex flex-wrap gap-2">
                    {(job.skillsRequired || []).map((skill, index) => (
                      <span key={index} className="px-3 py-1 bg-gray-100 text-gray-700 rounded-full text-sm">
                        {skill}
                      </span>
                    ))}
                  </div>
                </div>

                <button
                  onClick={() => handleApplyClick(job)}
                  className="w-full bg-black text-white font-semibold py-3 rounded-lg hover:bg-green-500 transition duration-300 flex items-center justify-center space-x-2"
                >
                  <span>Apply Now</span>
                  <PenSquare size={18} />
                </button>
              </div>
            </motion.div>
          ))}
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
              className="bg-white rounded-2xl shadow-2xl w-full max-w-4xl max-h-[90vh] overflow-y-auto"
            >
              <div className="p-8">
                <div className="flex justify-between items-center mb-8">
                  <h3 className="text-3xl font-bold text-gray-900">
                    Apply for {selectedJob.title}
                  </h3>
                  <button
                    onClick={() => setIsFormOpen(false)}
                    className="p-2 hover:bg-gray-100 rounded-full transition-colors"
                  >
                    <span className="text-gray-500 text-xl">×</span>
                  </button>
                </div>

                <form onSubmit={handleSubmitApplication} className="space-y-6">
  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
    {/* Full Name */}
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mb-1 block">Full Name</label>
      <div className="flex items-center">
        <User className="absolute left-3 text-gray-400" size={18} />
        <input
          type="text"
          name="fullName"
          value={applicationData.fullName}
          onChange={handleFormChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="John Doe"
          required
        />
      </div>
    </div>

    {/* Email */}
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mb-1 block">Email</label>
      <div className="flex items-center">
        <AtSign className="absolute left-3 text-gray-400" size={18} />
        <input
          type="email"
          name="email"
          value={applicationData.email}
          onChange={handleFormChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="john@example.com"
          required
        />
      </div>
    </div>

    {/* Phone Number */}
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mb-1 block">Phone Number</label>
      <div className="flex items-center">
        <Phone className="absolute left-3 text-gray-400" size={18} />
        <input
          type="tel"
          name="personPhone"
          value={applicationData.personPhone}
          onChange={handleFormChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          placeholder="079******/072(3)******"
          required
        />
      </div>
    </div>

    {/* Upload CV */}
    <div className="relative">
      <label className="text-sm font-medium text-gray-700 mb-1 block">Upload CV (PDF only)</label>
      <div className="flex items-center">
        <FileText className="absolute left-3 text-gray-400" size={18} />
        <input
          type="file"
          accept="application/pdf"
          onChange={handleFileChange}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-colors"
          required
        />
      </div>
    </div>
  </div>

  {/* Submit & Cancel Buttons */}
  <div className="flex justify-end space-x-4 mt-8">
    <button
      type="button"
      onClick={() => setIsFormOpen(false)}
      className="px-6 py-2 border border-gray-300 rounded-lg text-gray-700 hover:bg-gray-50 transition-colors"
    >
      Cancel
    </button>
    <button
      type="submit"
      className="px-6 py-2 bg-black text-white rounded-lg hover:bg-green-500 transition-colors"
    >
      Submit Application
    </button>
  </div>
</form>

              </div>
            </motion.div>
          </motion.div>
        )}
      </div>
    </div>
  );
};

export default JobEmployers;