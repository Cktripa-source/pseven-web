import Dashboard from './dashboard';
import { useState, useEffect } from 'react';
import { FaUserAlt, FaBriefcase, FaClipboardList, FaCogs, FaBox } from 'react-icons/fa';
import { toast } from 'react-toastify';
import { Pie, Bar } from 'react-chartjs-2';
import { Chart as ChartJS, Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement } from 'chart.js';
import { Link } from 'react-router-dom';

ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale, LinearScale, BarElement);

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

  const applicationsChartData = {
    labels: ['Pending', 'Reviewed', 'Accepted', 'Rejected'],
    datasets: [
      {
        label: 'Application Status',
        data: [
          data.applicationsByStatus.Pending,
          data.applicationsByStatus.Reviewed,
          data.applicationsByStatus.Accepted,
          data.applicationsByStatus.Rejected,
        ],
        backgroundColor: ['#ffcc00', '#ff8800', '#33cc33', '#ff4444'],
      },
    ],
  };

  const jobsChartData = {
    labels: ['Open', 'Closed'],
    datasets: [
      {
        label: 'Job Status',
        data: [data.jobsByStatus.Open, data.jobsByStatus.Closed],
        backgroundColor: ['#33cc33', '#ff4444'],
      },
    ],
  };

  const serviceRequestsChartData = {
    labels: ['Pending', 'In Progress', 'Completed'],
    datasets: [
      {
        label: 'Service Request Status',
        data: [
          data.serviceRequestsByStatus.Pending,
          data.serviceRequestsByStatus.InProgress,
          data.serviceRequestsByStatus.Completed,
        ],
        backgroundColor: ['#ffcc00', '#ff8800', '#33cc33'],
      },
    ],
  };

  const productChartData = {
    labels: ['Products'],
    datasets: [
      {
        label: 'Total Products',
        data: [data.totalProducts],
        backgroundColor: '#33cc33',
      },
      {
        label: 'Low Stock Products',
        data: [data.lowStockProducts],
        backgroundColor: '#ff4444',
      },
    ],
  };

  const userChartData = {
    labels: ['Users'],
    datasets: [
      {
        label: 'Burned Users',
        data: [data.burnedUsers],
        backgroundColor: '#ff4444',
      },
      {
        label: 'Active Users',
        data: [data.totalUsers - data.burnedUsers],
        backgroundColor: '#33cc33',
      },
    ],
  };

  const cards = [
    { title: 'Total Applications', icon: <FaClipboardList className="text-4xl text-green-500" />, content: 'Applications', data: data.totalApplications, chart: <Pie data={applicationsChartData} />, link: "../admin/jobapplication" },
    { title: 'Total Jobs', icon: <FaBriefcase className="text-4xl text-green-500" />, content: 'Jobs', data: data.totalJobs, chart: <Pie data={jobsChartData} />, link: "../admin/jobs" },
    { title: 'Total Products', icon: <FaBox className="text-4xl text-orange-500" />, content: 'Products', data: data.totalProducts, chart: <Bar data={productChartData} />, link: "../admin/productmanagement" },
    { title: 'Service Requests', icon: <FaCogs className="text-4xl text-yellow-500" />, content: 'Requests', data: data.totalServiceRequests, chart: <Pie data={serviceRequestsChartData} />, link: "../admin/services" },
    { title: 'Users Overview', icon: <FaUserAlt className="text-4xl text-purple-500" />, content: 'Users', data: data.totalUsers, chart: <Bar data={userChartData} />, link: "../admin/users" },
  ];

  useEffect(() => {
    fetchDashboardData();
  }, []);

  const fetchDashboardData = async () => {
    try {
      const res = await fetch('https://pseven-api-test.onrender.com/api/dashboard/overview');
      const dashboardData = await res.json();
      setData({
        totalApplications: dashboardData.totalApplications || 0,
        applicationsByStatus: dashboardData.applicationsByStatus || { Pending: 0, Reviewed: 0, Accepted: 0, Rejected: 0 },
        totalJobs: dashboardData.totalJobs || 0,
        jobsByStatus: dashboardData.jobsByStatus || { Open: 0, Closed: 0 },
        totalProducts: dashboardData.totalProducts || 0,
        lowStockProducts: dashboardData.lowStockProducts || 0,
        totalServiceRequests: dashboardData.totalServiceRequests || 0,
        serviceRequestsByStatus: dashboardData.serviceRequestsByStatus || { Pending: 0, InProgress: 0, Completed: 0 },
        totalUsers: dashboardData.totalUsers || 0,
        burnedUsers: dashboardData.burnedUsers || 0,
      });
    } catch (error) {
      toast.error('Error fetching dashboard data');
      console.error('Error fetching dashboard data:', error);
    }
  };

  return (
    <>
      <Dashboard />
      <div className="p-20 min-h-screen sm:ml-64 bg-gray-900">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-6">
          {cards.map((card, index) => (
            <div
              key={index}
              className={`p-6 rounded-lg shadow-md card-animation ${index === cards.length - 1 ? 'col-span-2' : ''} bg-gray-800`}
            >
              <div className="flex items-center space-x-4">
                {card.icon}
                <div>
                  <h3 className="text-xl font-semibold text-white">{card.title}</h3>
                  <p className="text-white">{card.data} {card.content}</p>
                  <div className="w-64 h-48 mt-4">
                    {card.chart}
                  </div>
                  <Link to={card.link} className="text-green-400 mt-4 inline-block">View Details</Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </>
  );
};

export default DashboardOverview;
