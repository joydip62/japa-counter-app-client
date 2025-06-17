import React from "react";
import { useEffect, useState } from "react";
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
} from "react-router-dom";

import AdminDashboard from "./pages/AdminDashboard";
import JapaCounter from "./pages/JapaCounter";
import Login from "./pages/Login";
import Register from "./pages/Register";
import UserDashboard from "./pages/UserDashboard";
import ShortcutSettings from "./components/ShortcutSettings";

function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ token, role });
    }
    setCheckingAuth(false);
  }, []);

  useEffect(() => {
    const today = new Date().toLocaleDateString();

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);

      if (key.startsWith('dailyJapaData_') || key.startsWith('japaRounds_')) {
        try {
          const data = JSON.parse(localStorage.getItem(key));

          if (key.startsWith('dailyJapaData_') && data.date !== today) {
            localStorage.removeItem(key);
          }

          if (key.startsWith('japaRounds_')) {
            const isToday = data?.some((item) => item.date === today);
            if (!isToday) {
              localStorage.removeItem(key);
            }
          }
        } catch (e) {
          console.warn(`Failed to parse ${key}:`, e);
        }
      }
    }
  }, []);

  if (checkingAuth) return <div>Loading...</div>; 

  return (
    <Router>
      <Routes>
        {/* <Route path="/" element={<Login setUser={setUser} />} /> */}

        <Route
          path="/"
          element={
            user ? (
              user.role === 'admin' ? (
                <Navigate to="/admin-dashboard" />
              ) : (
                <Navigate to="/user-dashboard" />
              )
            ) : (
              <Login setUser={setUser} />
            )
          }
        />
        <Route path="/login" element={<Login setUser={setUser} />} />
        <Route path="/register" element={<Register />} />

        <Route
          path="/japaCounter"
          element={
            user && user.role === 'user' ? (
              <JapaCounter setUser={setUser} />
            ) : (
              <Navigate to="/login" />
            )
          }
        />
        
        <Route
          path="/shortCutKey"
          element={
            user && user.role === 'user' ? (
              <ShortcutSettings />
            ) : (
              <Navigate to="/login" />
            )
          }
        />


        <Route
          path="/user-dashboard"
          element={
            user && user.role === 'user' ? (
              <UserDashboard setUser={setUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
        <Route
          path="/admin-dashboard"
          element={
            user && user.role === 'admin' ? (
              <AdminDashboard setUser={setUser} />
            ) : (
              <Navigate to="/" />
            )
          }
        />
      </Routes>
    </Router>
  );
}

export default App;
