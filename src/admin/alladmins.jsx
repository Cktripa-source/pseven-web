import { Routes, Route } from "react-router-dom";
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
import Logout from "./Logout";
import Signup from "./Signup";

function AdminPages() {
    return (
        <DashboardLayout>
            <Routes>
                <Route path="dashboardoverview" element={<DashboardOverview />} />
                <Route path="inbox" element={<Inbox />} />
                <Route path="users" element={<UserManagement />} />
                <Route path="productmanagement" element={<ProductManagement />} />
                <Route path="jobs" element={<Jobs />} />
                <Route path="services" element={<ServiceManagement />} />
                <Route path="settings" element={<Settings />} />
                <Route path="jobapplication" element={<JobApplications />} />
                <Route path="about" element={<AboutAdmin />} />
                <Route path="logout" element={<Logout />} />
                <Route path="signup" element={<Signup />} />
            </Routes>
        </DashboardLayout>
    );
}

export default AdminPages;
