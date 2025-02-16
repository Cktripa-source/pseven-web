import { Routes, Route, Navigate } from "react-router-dom";
import { useAuth } from "../AuthContext";
import DashboardLayout from "./dashboard";
import DashboardOverview from "./dashboardoverview";
import UserManagement from "./Users";
import JobApplications from "./jobapplication";
import ProductManagement from "./productManagement";
import ServiceManagement from "./Services";
import Inbox from "./Inbox";
import Jobs from "./Jobs";
import Settings from "./Settings";
import AboutAdmin from "./About";
import Signup from "./Signup";

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) {
    return <div>Loading...</div>;
  }

  if (!user || user.role !== 'admin') {
    return <Navigate to="/admin" />;
  }

  return children;
};

function AdminPages() {
  return (
    <ProtectedRoute>
      <DashboardLayout>
        <Routes>
          <Route path="/" element={<Navigate to="dashboardoverview" />} />
          <Route path="dashboardoverview" element={<DashboardOverview />} />
          <Route path="inbox" element={<Inbox />} />
          <Route path="users" element={<UserManagement />} />
          <Route path="productmanagement" element={<ProductManagement />} />
          <Route path="jobs" element={<Jobs />} />
          <Route path="services" element={<ServiceManagement />} />
          <Route path="settings" element={<Settings />} />
          <Route path="jobapplication" element={<JobApplications />} />
          <Route path="about" element={<AboutAdmin />} />
          <Route path="signup" element={<Signup />} />
        </Routes>
      </DashboardLayout>
    </ProtectedRoute>
  );
}

export default AdminPages;