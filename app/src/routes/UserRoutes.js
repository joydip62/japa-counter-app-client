import { Routes, Route, Navigate } from "react-router-dom";
import UserDashboard from "../pages/UserDashboard";
import JapaCounter from "../pages/JapaCounter";

const UserRoutes = ({ user }) => {
  if (!user || user.role !== "user") return <Navigate to="/login" />;

  return (
    <Routes>
      <Route path="/user-dashboard" element={<UserDashboard />} />
      <Route path="/japaCounter" element={<JapaCounter />} />
    </Routes>
  );
};

export default UserRoutes;
