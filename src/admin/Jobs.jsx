import React, { useEffect, useState } from 'react';
import axios from 'axios';
import Dashboard from './dashboard';

const AdminDashboard = () => {
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showApplications, setShowApplications] = useState(false);
  const [newJob, setNewJob] = useState({
    title: '',
    description: '',
    location: '',
    salary: '',
    employmentType: '',
    skillsRequired: '',
  });
  const [editModalOpen, setEditModalOpen] = useState(false);
  const [editJob, setEditJob] = useState({ title: '', location: '', salary: '', description: '' });
  
  const handleEditJob = (job) => {
    setEditJob(job);
    setEditModalOpen(true);
  };
  
  const handleUpdateJob = async (e) => {
    e.preventDefault();
    try {
      await axios.put(`http://localhost:5000/api/jobs/${editJob._id}`, editJob);
      setJobs(jobs.map((job) => (job._id === editJob._id ? editJob : job)));
      setEditModalOpen(false);
    } catch (error) {
      console.error('Failed to update job', error);
    }
  };
  
  // Fetch jobs and applications
  const fetchData = async () => {
    try {
      const jobsResponse = await axios.get('http://localhost:5000/api/jobs');
      const applicationsResponse = await axios.get('http://localhost:5000/api/applications');
      setJobs(jobsResponse.data);
      setApplications(applicationsResponse.data);
    } catch (err) {
      setError('Error fetching data');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData(); // Initial fetch

    // Polling every 10 seconds for data refresh
    const interval = setInterval(() => {
      fetchData();
    }, 10000);

    // Cleanup interval on component unmount
    return () => clearInterval(interval);
  }, []);

  // Handle new job creation
  const handleCreateJob = async (e) => {
    e.preventDefault();

    const jobData = {
      title: newJob.title,
      description: newJob.description,
      location: newJob.location,
      salary: parseFloat(newJob.salary),
      employmentType: newJob.employmentType,
      skillsRequired: newJob.skillsRequired.split(',').map((skill) => skill.trim()),
      postedBy: 'Admin',
    };

    try {
      const response = await axios.post('http://localhost:5000/api/jobs', jobData);
      console.log('Job created:', response.data);
      fetchData(); // Fetch updated data immediately after creating a job
    } catch (err) {
      console.error('Error creating job:', err.response ? err.response.data : err);
      alert('Failed to create job');
    }
  };

  // Handle job deletion
  const handleDeleteJob = async (jobId) => {
    try {
      await axios.delete(`http://localhost:5000/api/jobs/${jobId}`);
      fetchData(); // Fetch updated data after deleting a job
      alert('Job deleted successfully!');
    } catch (err) {
      alert('Failed to delete job');
    }
  };

  if (loading) return <div className="text-center">Loading...</div>;
  if (error) return <div className="text-center text-red-500">{error}</div>;

  return (
    <>
      <Dashboard />
      <div className="p-20 min-h-screen sm:ml-64   bg-gray-900">
        <div className="   bg-gray-800 p-4 border-2  border-dashed rounded-lg shadow-md   border-gray-700">
          <h2 className="text-4xl font-bold text-center text-gray-100 mb-8">Admin Dashboard</h2>

          {/* Job Management Section */}
          <div className="mb-12">
            <h3 className="text-2xl font-semibold text-gray-100 mb-4">Manage Jobs</h3>
            <form
              onSubmit={handleCreateJob}
              className="bg-gray-800 p-6 rounded-lg shadow-lg space-y-4"
            >
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <input
                  type="text"
                  placeholder="Job Title"
                  value={newJob.title}
                  onChange={(e) => setNewJob({ ...newJob, title: e.target.value })}
                  className="p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="text"
                  placeholder="Location"
                  value={newJob.location}
                  onChange={(e) => setNewJob({ ...newJob, location: e.target.value })}
                  className="p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <input
                  type="number"
                  placeholder="Salary"
                  value={newJob.salary}
                  onChange={(e) => setNewJob({ ...newJob, salary: e.target.value })}
                  className="p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                />
                <select
                  value={newJob.employmentType}
                  onChange={(e) => setNewJob({ ...newJob, employmentType: e.target.value })}
                  className="p-3 rounded-lg bg-gray-900 text-gray-400 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                  required
                >
                  <option value="">Select Employment Type</option>
                  <option value="Full-time">Full-time</option>
                  <option value="Part-time">Part-time</option>
                  <option value="Contract">Contract</option>
                  <option value="Internship">Internship</option>
                  <option value="Temporary">Temporary</option>
                </select>
              </div>
              <textarea
                placeholder="Job Description"
                value={newJob.description}
                onChange={(e) => setNewJob({ ...newJob, description: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                required
              ></textarea>
              <input
                type="text"
                placeholder="Skills Required (comma-separated)"
                value={newJob.skillsRequired}
                onChange={(e) => setNewJob({ ...newJob, skillsRequired: e.target.value })}
                className="w-full p-3 rounded-lg bg-gray-900 text-gray-200 border border-gray-700 focus:ring-2 focus:ring-blue-500"
                required
              />
              <button
                type="submit"
                className="w-full bg-blue-500 text-white py-3 rounded-lg hover:bg-blue-600 transition duration-300"
              >
                Create Job
              </button>
            </form>
          </div>
          <div className="mb-12">
  <h3 className="text-2xl font-bold text-gray-100 mb-4">Posted Jobs</h3>
  <table className="table-auto w-full text-gray-300 border-collapse border border-gray-700">
    <thead>
      <tr className="bg-gray-700 rou">
        <th className="px-4 py-2 border-white border border-opacity-20 capitalize">Title</th>
        <th className="px-4 py-2 border-white border border-opacity-20 capitalize">Location</th>
        <th className="px-4 py-2 border-white border border-opacity-20 capitalize">Salary</th>
        <th className="px-4 py-2 border-white border border-opacity-20 capitalize">Description</th>
        <th className="px-4 py-2 border-white border border-opacity-20 capitalize">Actions</th>
      </tr>
    </thead>
    <tbody>
      {jobs.map((job) => (
        <tr key={job._id} className="hover:bg-gray-600">
          <td className="px-4 py-2 border-white border border-opacity-20 capitalize font-bold">{job.title}</td>
          <td className="px-4 py-2 border-white border border-opacity-20 capitalize">{job.location}</td>
          <td className="px-4 py-2 border-white border border-opacity-20 capitalize">${job.salary}</td>
          <td className="px-4 py-2 border-white border border-opacity-20 capitalize">{job.description}</td>
          <td className="px-4 py-2 border-white border border-opacity-20 capitalize flex gap-2">
            <button
              onClick={() => handleEditJob(job)}
              className="bg-blue-500 px-3 py-1 rounded-lg hover:bg-blue-600"
            >
              Edit
            </button>
            <button
              onClick={() => handleDeleteJob(job._id)}
              className="bg-red-500 px-3 py-1 rounded-lg hover:bg-red-600"
            >
              Delete
            </button>
          </td>
        </tr>
      ))}
    </tbody>
  </table>

  {/* Edit Modal */}
  {editModalOpen && (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 p-6 rounded-lg w-96 shadow-lg">
        <h3 className="text-xl font-bold text-gray-100 mb-4">Edit Job</h3>
        <form onSubmit={handleUpdateJob}>
          <div className="mb-4">
            <label htmlFor="title" className="block text-gray-300 mb-2">Title</label>
            <input
              type="text"
              id="title"
              value={editJob.title}
              onChange={(e) => setEditJob({ ...editJob, title: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="location" className="block text-gray-300 mb-2">Location</label>
            <input
              type="text"
              id="location"
              value={editJob.location}
              onChange={(e) => setEditJob({ ...editJob, location: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="salary" className="block text-gray-300 mb-2">Salary</label>
            <input
              type="number"
              id="salary"
              value={editJob.salary}
              onChange={(e) => setEditJob({ ...editJob, salary: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200"
              required
            />
          </div>
          <div className="mb-4">
            <label htmlFor="description" className="block text-gray-300 mb-2">Description</label>
            <textarea
              id="description"
              value={editJob.description}
              onChange={(e) => setEditJob({ ...editJob, description: e.target.value })}
              className="w-full px-3 py-2 rounded-lg bg-gray-700 text-gray-200"
              required
            ></textarea>
          </div>
          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={() => setEditModalOpen(false)}
              className="bg-red-600 px-4 py-2 text-white rounded-lg hover:bg-red-700"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="bg-blue-500 px-4 text-white py-2 rounded-lg hover:bg-blue-600"
            >
              Update
            </button>
          </div>
        </form>
      </div>
    </div>
  )}
</div>


          {/* Applications Section */}
          <button
            onClick={() => setShowApplications(!showApplications)}
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 transition duration-300 mb-4"
          >
            {showApplications ? 'Hide Applications' : 'Show Applications'}
          </button>

          {showApplications && (
            <div className="overflow-auto shadow-lg rounded-lg">
              <table className="table-auto w-full text-gray-400 border-collapse bg-gray-800 border border-gray-700">
                <thead>
                  <tr className="bg-gray-700 text-gray-300">
                    <th className="border border-gray-700 px-4 py-3 text-left">Full Name</th>
                    <th className="border border-gray-700 px-4 py-3 text-left">Email</th>
                    <th className="border border-gray-700 px-4 py-3 text-left">Job</th>
                    <th className="border border-gray-700 px-4 py-3 text-center">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {applications.map((app) => (
                    <tr key={app._id} className="hover:bg-gray-600 transition duration-200">
                      <td className="border border-gray-700 px-4 py-2">{app.fullName}</td>
                      <td className="border border-gray-700 px-4 py-2">{app.email}</td>
                      <td className="border border-gray-700 px-4 py-2">
                        {app.job?.title || 'JOD DISAPEARED'}
                      </td>
                      <td className="border border-gray-700 px-4 py-2 text-center">
                        <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600">
                          View CV
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
        </div>
    </>
  );
};

export default AdminDashboard;
