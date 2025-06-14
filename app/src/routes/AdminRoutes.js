import { Routes, Route, Navigate } from "react-router-dom";
import AdminDashboard from "../pages/AdminDashboard";

const AdminRoutes = ({ user }) => {
  if (!user || user.role !== "admin") return <Navigate to="/login" />;

  return (
    <Routes>
      <Route path="/admin-dashboard" element={<AdminDashboard />} />
    </Routes>
  );
};

export default AdminRoutes;
