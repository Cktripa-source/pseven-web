import React from 'react';
import { BarChart, XAxis, YAxis, CartesianGrid, Tooltip, Legend, Bar } from 'recharts';
import { UserIcon, BriefcaseIcon, ClipboardCheckIcon, CogIcon, PackageIcon } from 'lucide-react';
const DashboardCard = ({ title, icon, content, stats, href }) => (
  <>
  <div className="bg-gray-900 rounded-lg shadow-lg hover:shadow-lg transition-shadow p-6">
    <div className="flex items-center justify-between pb-2">
      <h3 className="text-lg font-medium text-white">{title}</h3>
      {icon}
    </div>
    <div className="text-2xl font-bold mb-4 text-green-50">{stats}</div>
    <div className="h-[200px] w-full flex items-center justify-center">
      {content}
    </div>
    <a 
      href={href}
      className="mt-4 inline-block text-sm text-green-600 hover:text-green-400 font-semibold"
    >
      View Details →
    </a>
  </div>
  </>
);

const DashboardOverview = () => {
  const [data, setData] = React.useState({
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

  React.useEffect(() => {
    const fetchDashboardData = async () => {
      try {
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
      } catch (error) {
        console.error('Failed to fetch dashboard data:', error);
      }
    };

    fetchDashboardData();
  }, []);

  const cards = [
    {
      title: 'Applications Overview',
      icon: <ClipboardCheckIcon className="h-8 w-8 text-green-500" />,
      content: (
        <BarChart width={300} height={200} data={[
          { name: 'Applications', 
            Pending: data.applicationsByStatus.Pending,
            Reviewed: data.applicationsByStatus.Reviewed,
            Accepted: data.applicationsByStatus.Accepted,
            Rejected: data.applicationsByStatus.Rejected 
          }
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Pending" fill="#FFB020" />
          <Bar dataKey="Reviewed" fill="#14B8A6" />
          <Bar dataKey="Accepted" fill="#10B981" />
          <Bar dataKey="Rejected" fill="#F43F5E" />
        </BarChart>
      ),
      stats: `${data.totalApplications} Total`,
      href: "../admin/jobapplication"
    },
    {
      title: 'Jobs Status',
      icon: <BriefcaseIcon className="h-8 w-8 text-blue-500" />,
      content: (
        <BarChart width={300} height={200} data={[
          { name: 'Jobs',
            Open: data.jobsByStatus.Open,
            Closed: data.jobsByStatus.Closed
          }
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Open" fill="#10B981" />
          <Bar dataKey="Closed" fill="#F43F5E" />
        </BarChart>
      ),
      stats: `${data.totalJobs} Total`,
      href: "../admin/jobs"
    },
    {
      title: 'Products Overview',
      icon: <PackageIcon className="h-8 w-8 text-orange-500" />,
      content: (
        <BarChart width={300} height={200} data={[
          { name: 'Products',
            Total: data.totalProducts,
            'Low Stock': data.lowStockProducts
          }
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Total" fill="#10B981" />
          <Bar dataKey="Low Stock" fill="#F43F5E" />
        </BarChart>
      ),
      stats: `${data.totalProducts} Total`,
      href: "../admin/productmanagement"
    },
    {
      title: 'Service Requests',
      icon: <CogIcon className="h-8 w-8 text-purple-500" />,
      content: (
        <BarChart width={300} height={200} data={[
          { name: 'Requests',
            Pending: data.serviceRequestsByStatus.Pending,
            'In Progress': data.serviceRequestsByStatus.InProgress,
            Completed: data.serviceRequestsByStatus.Completed
          }
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Pending" fill="#FFB020" />
          <Bar dataKey="In Progress" fill="#14B8A6" />
          <Bar dataKey="Completed" fill="#10B981" />
        </BarChart>
      ),
      stats: `${data.totalServiceRequests} Total`,
      href: "../admin/services"
    },
    {
      title: 'Users Overview',
      icon: <UserIcon className="h-8 w-8 text-yellow-500" />,
      content: (
        <BarChart width={300} height={200} data={[
          { name: 'Users',
            Active: data.totalUsers - data.burnedUsers,
            Burned: data.burnedUsers
          }
        ]}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip />
          <Legend />
          <Bar dataKey="Active" fill="#10B981" />
          <Bar dataKey="Burned" fill="#F43F5E" />
        </BarChart>
      ),
      stats: `${data.totalUsers} Total`,
      href: "../admin/users"
    }
  ];

  return (
    <div className="p-8 space-y-8 bg-gray-900 min-h-screen">
     <div className="bg-gray-800 p-4 border-2 border-dashed rounded-lg shadow-md border-green-200 w-full">
      <div className="grid grid-cols-1 gap-6 md:grid-cols-2 2xl:grid-cols-3">
        {cards.map((card, index) => (
          <DashboardCard key={index} {...card} />
        ))}
      </div>
    </div>
    </div>
  );
};

export default DashboardOverview;