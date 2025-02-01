import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { motion } from 'framer-motion';
import { User, AtSign, FileText, Edit3, Phone, MapPin, DollarSign,PenSquare } from 'lucide-react';
import Loading from './loading';
const JobEmployers = () => {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedJob, setSelectedJob] = useState(null);
  const [applicationData, setApplicationData] = useState({
    fullName: '',
    email: '',
    cvLink: '',
    coverLetter: '',
    personFullName: '',
    personEmail: '',
    personPhone: '',
    personRelationship: '',
  });
  const [isOffline, setIsOffline] = useState(false);
  const [isFormOpen, setIsFormOpen] = useState(false);

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

  useEffect(() => {
    if (isOffline) return;

    const fetchJobs = async () => {
      try {
        const response = await axios.get('https://pseven-api-test.onrender.com/api/jobs');
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

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    const { fullName, email, cvLink, coverLetter, personFullName, personEmail, personPhone, personRelationship } = applicationData;

    if (!fullName || !email || !cvLink || !coverLetter || !personFullName || !personEmail || !personPhone || !personRelationship) {
      alert('Please fill all fields.');
      return;
    }

    try {
      await axios.post(`https://pseven-api-test.onrender.com/api/applications/${selectedJob._id}/apply`, {
        fullName,
        email,
        cvLink,
        coverLetter,
        personFullName,
        personEmail,
        personPhone,
        personRelationship,
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
        <div className="w-16 h-16 border-4 border-t-4 border-white border-solid rounded-full animate-spin"></div>
      </div>
    );
  }

  if (loading) {
    return (
      <div className="min-h-screen flex justify-center items-center bg-gray-50">
        <Loading />
      </div>
    );
  }

  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-transparent text-white py-16 px-6 pt-20 mt-20">
      <h1 className="text-3xl md:text-4xl font-extrabold w-full p-2 border-black border-2 border-opacity-30 text-center text-black mb-4">
        Our Jobs
      </h1>

      {/* Job Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 px-4 sm:px-6 lg:px-8 py-8">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white text-gray-900 rounded-lg shadow-lg p-6 hover:shadow-2xl transform transition duration-300 hover:scale-105 border-black border-2 border-opacity-20"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-gray-950 capitalize mb-2 bg-gray-50 p-2 rounded-full text-center">{job.title}</h3>
              <p className="text-gray-700 leading-relaxed capitalize font-mono font-semibold">{job.description}</p>
            </div>
            <div className="text-sm mb-6">
              <p className="flex items-center mb-2">
                <MapPin className="text-gray-600 mr-2" size={20} />
                <span className="font-semibold text-gray-600 capitalize">Location:</span>{" "}
                <span className="text-orange-500 capitalize font-mono font-semibold">{job.location}</span>
              </p>
              <p className="flex items-center mb-2">
                <DollarSign className="text-gray-600 mr-2" size={20} />
                <span className="font-semibold text-gray-600 capitalize">Salary:</span>{" "}
                <span className="text-green-500 capitalize font-mono font-semibold">${job.salary}</span>
              </p>
              <p className="flex items-center mb-2">
                <PenSquare className="text-gray-600 mr-2" size={20} />
                <span className="font-semibold text-gray-600 capitalize">Skills:</span>{" "}
                <span className="text-blue-500 capitalize font-mono font-semibold">
                  {(job.skillsRequired || []).join(", ")}
                </span>
              </p>
            </div>
            <button
              onClick={() => handleApplyClick(job)}
              className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-red-500 transition duration-300 shadow-md"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {/* Apply Form (conditional rendering) */}
      {isFormOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 bg-black bg-opacity-70 flex flex-col items-center justify-center space-y-4 z-50"
        >
          <button
            onClick={() => setIsFormOpen(false)} // Close form when clicked
            className="absolute top-4 right-4 p-2 bg-red-500 rounded-md"
          >
            <span className="text-white text-xl">X</span>
          </button>
          <motion.div
            className="bg-white rounded-lg shadow-lg w-full max-w-4xl p-8 overflow-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4 }}
          >
            <h3 className="text-3xl font-bold mb-4 text-center text-gray-950">
              Apply for {selectedJob.title}
            </h3>
            <form onSubmit={handleSubmitApplication}>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Full Name */}
                <div className="flex items-center space-x-3 mb-4">
                  <User className="text-gray-950" size={24} />
                  <input
                    type="text"
                    name="fullName"
                    value={applicationData.fullName}
                    onChange={handleFormChange}
                    placeholder="Full Name"
                    className="w-full p-2 border rounded bg-gray-50 text-gray-950"
                    required
                  />
                </div>

                {/* Email */}
                <div className="flex items-center space-x-3 mb-4">
                  <AtSign className="text-gray-950" size={24} />
                  <input
                    type="email"
                    name="email"
                    value={applicationData.email}
                    onChange={handleFormChange}
                    placeholder="Email"
                    className="w-full p-2 border rounded bg-gray-50 text-gray-950"
                    required
                  />
                </div>

                {/* CV Link */}
                <div className="flex items-center space-x-3 mb-4">
                  <FileText className="text-gray-950" size={24} />
                  <input
                    type="text"
                    name="cvLink"
                    value={applicationData.cvLink}
                    onChange={handleFormChange}
                    placeholder="CV Link (PDF)"
                    className="w-full p-2 border rounded bg-gray-50 text-gray-950"
                    required
                  />
                </div>

                {/* Cover Letter */}
                <div className="flex items-center space-x-3 mb-4">
                  <Edit3 className="text-gray-950" size={24} />
                  <textarea
                    name="coverLetter"
                    value={applicationData.coverLetter}
                    onChange={handleFormChange}
                    placeholder="Cover Letter"
                    className="w-full p-2 border rounded bg-gray-50 text-gray-950"
                    rows="4"
                    required
                  ></textarea>
                </div>

                {/* Additional Person's Full Name */}
                <div className="flex items-center space-x-3 mb-4">
                  <User className="text-gray-950" size={24} />
                  <input
                    type="text"
                    name="personFullName"
                    value={applicationData.personFullName}
                    onChange={handleFormChange}
                    placeholder="Additional Person Full Name"
                    className="w-full p-2 border rounded bg-gray-50 text-gray-950"
                    required
                  />
                </div>

                {/* Additional Person's Email */}
                <div className="flex items-center space-x-3 mb-4">
                  <AtSign className="text-gray-950" size={24} />
                  <input
                    type="email"
                    name="personEmail"
                    value={applicationData.personEmail}
                    onChange={handleFormChange}
                    placeholder="Additional Person Email"
                    className="w-full p-2 border rounded bg-gray-50 text-gray-950"
                    required
                  />
                </div>

                {/* Additional Person's Phone */}
                <div className="flex items-center space-x-3 mb-4">
                  <Phone className="text-gray-950" size={24} />
                  <input
                    type="text"
                    name="personPhone"
                    value={applicationData.personPhone}
                    onChange={handleFormChange}
                    placeholder="Additional Person Phone"
                    className="w-full p-2 border rounded bg-gray-50 text-gray-950"
                    required
                  />
                </div>

                {/* Additional Person's Relationship */}
                <div className="flex items-center space-x-3 mb-4">
                  <Edit3 className="text-gray-950" size={24} />
                  <input
                    type="text"
                    name="personRelationship"
                    value={applicationData.personRelationship}
                    onChange={handleFormChange}
                    placeholder="Relationship with Person"
                    className="w-full p-2 border rounded bg-gray-50 text-gray-950"
                    required
                  />
                </div>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-gray-950 text-gray-50 font-bold py-2 px-4 rounded-lg hover:bg-orange-500 transition duration-300"
                >
                  Submit Application
                </button>
                <button
                  type="button"
                  onClick={() => setIsFormOpen(false)}
                  className="bg-red-600 text-gray-50 font-bold py-2 px-4 rounded-lg hover:bg-gray-600 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default JobEmployers;
