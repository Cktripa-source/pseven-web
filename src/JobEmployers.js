import React, { useEffect, useState } from 'react';
import axios from 'axios';

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
  });

  // Fetch jobs from the API
  useEffect(() => {
    const fetchJobs = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/jobs');
        setJobs(response.data);
      } catch (err) {
        setError('Error fetching job data');
      } finally {
        setLoading(false);
      }
    };

    fetchJobs();
  }, []);

  const handleApplyClick = (job) => {
    setSelectedJob(job);
  };

  const handleFormChange = (e) => {
    setApplicationData({
      ...applicationData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmitApplication = async (e) => {
    e.preventDefault();
    const { fullName, email, cvLink, coverLetter } = applicationData;

    if (!fullName || !email || !cvLink || !coverLetter) {
      alert('Please fill all fields.');
      return;
    }

    try {
      await axios.post(`http://localhost:5000/api/applications/${selectedJob._id}/apply`, {
        fullName,
        email,
        cvLink,
        coverLetter,
      });
      alert('Application submitted successfully');
      setSelectedJob(null); // Close the application form after submission
    } catch (err) {
      alert('Failed to submit application');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <div className="min-h-screen bg-transparent text-white py-16 px-6 md:mt-40 mt-56">
      {/* Header */}
      <h1 className="text-3xl md:text-4xl font-extrabold w-full p-2 border-black border-2 border-opacity-30 text-center text-black mb-4">
        Our Jobs
      </h1>

      {/* Service Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-2 gap-10 px-4 sm:px-6 lg:px-8 py-8">
        {jobs.map((job) => (
          <div
            key={job._id}
            className="bg-white text-gray-900 rounded-lg shadow-lg p-6 hover:shadow-2xl transform transition duration-300 hover:scale-105 border-black border-2 border-opacity-20"
          >
            <div className="mb-6">
              <h3 className="text-2xl font-bold text-black capitalize mb-2">{job.title}</h3>
              <p className="text-gray-700 leading-relaxed capitalize font-mono font-semibold">{job.description}</p>
            </div>
            <div className="text-sm mb-6">
              <p className="mb-2">
                <span className="font-semibold text-gray-600 capitalize">Location:</span>{" "}
                <span className="text-orange-500 capitalize font-mono font-semibold0">{job.location}</span>
              </p>
              <p className="mb-2">
                <span className="font-semibold text-gray-600 capitalize">Salary:</span>{" "}
                <span className="text-green-500 capitalize font-mono font-semibold">${job.salary}</span>
              </p>
              <p className="mb-2">
                <span className="font-semibold text-gray-600 capitalize">Skills:</span>{" "}
                <span className="text-blue-500 capitalize font-mono font-semibold">
                  {(job.skillsRequired || []).join(", ")}
                </span>
              </p>
            </div>
            <button
              onClick={() => handleApplyClick(job)}
              className="w-full bg-black text-white font-medium py-3 rounded-lg hover:bg-gray-800 transition duration-300 shadow-md"
            >
              Apply Now
            </button>
          </div>
        ))}
      </div>

      {/* Apply Form (conditional rendering) */}
      {selectedJob && (
        <div className="fixed inset-0 bg-black bg-opacity-70 flex justify-center items-center z-10">
          <div className="bg-gray-900 rounded-lg shadow-lg w-full max-w-lg p-8">
            <h3 className="text-2xl font-bold mb-4 text-center text-white">
              Apply for {selectedJob.title}
            </h3>
            <form onSubmit={handleSubmitApplication}>
              <div className="mb-4">
                <label className="block font-semibold mb-2 text-white">Full Name</label>
                <input
                  type="text"
                  name="fullName"
                  value={applicationData.fullName}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded bg-gray-800 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2 text-white">Email</label>
                <input
                  type="email"
                  name="email"
                  value={applicationData.email}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded bg-gray-800 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2 text-white">CV e.g:pdf </label>
                <input
                  type="text"
                  name="cvLink"
                  value={applicationData.cvLink}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded bg-gray-800 text-white"
                  required
                />
              </div>
              <div className="mb-4">
                <label className="block font-semibold mb-2 text-white">Say Something About You</label>
                <textarea
                  name="coverLetter"
                  value={applicationData.coverLetter}
                  onChange={handleFormChange}
                  className="w-full p-2 border rounded bg-gray-800 text-white"
                  rows="4"
                  required
                ></textarea>
              </div>
              <div className="flex justify-end space-x-4">
                <button
                  type="submit"
                  className="bg-black text-white py-2 px-4 rounded hover:bg-gray-950 transition duration-300"
                >
                  Apply Now
                </button>
                <button
                  type="button"
                  onClick={() => setSelectedJob(null)}
                  className="bg-red-600 text-white py-2 px-4 rounded hover:bg-red-700 transition duration-300"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default JobEmployers;
