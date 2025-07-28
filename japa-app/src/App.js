import { useEffect, useState } from 'react';
import {
  Navigate,
  Route,
  HashRouter as Router,
  Routes,
  useNavigate,
} from 'react-router-dom';

import ShortcutSettings from './components/ShortcutSettings';
import UpdateBanner from './components/UpdateBanner';
import AdminDashboard from './pages/AdminDashboard';
import ForgotPassword from './pages/ForgotPassword';
import JapaCounter from './pages/JapaCounter';
import Login from './pages/Login';
import Register from './pages/Register';
import ResetPassword from './pages/ResetPassword';
import UserDashboard from './pages/UserDashboard';
import ResetRedirect from './pages/ResetRedirect';
import StartupPopup from './components/StartupPopup';
import Credit from './components/Credit';
import { ThemeProvider } from './context/ThemeContext';
import ThemeToggle from './components/ThemeToggle';
import AutoLogout from './components/AutoLogout';
import ProtectedRoute from './components/ProtectedRoute';

function DeepLinkHandler({ setPendingToken }) {
  const navigate = useNavigate();

  useEffect(() => {
    window.electronAPI?.onDeepLink((url) => {
      try {
        const parsed = new URL(url);

        if (parsed.hostname === 'login') {
          navigate('/login');
        } else if (parsed.hostname === 'reset-password') {
          const token = parsed.searchParams.get('token');
          if (token) {
            setPendingToken(token);
            navigate(`/reset-password?token=${token}`);
          }
        }
      } catch (e) {
        console.error('Invalid deep link:', url, e);
      }
    });
  }, [navigate, setPendingToken]);

  return null;
}

export default function App() {
  const [user, setUser] = useState(null);
  const [checkingAuth, setCheckingAuth] = useState(true);
  const [pendingToken, setPendingToken] = useState(null);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const role = localStorage.getItem('role');
    if (token && role) {
      setUser({ token, role });
    }
    setCheckingAuth(false);
  }, []);

  if (checkingAuth) return <div>Loading...</div>;

  return (
    <ThemeProvider>
      <Router>
        <AutoLogout />
        <DeepLinkHandler setPendingToken={setPendingToken} />
        <StartupPopup />
        <UpdateBanner />
        <Credit />
        <ThemeToggle />
        <Routes>
          <Route
            path="/"
            element={
              user ? (
                user.role === 'admin' ? (
                  <Navigate to="/admin-dashboard" />
                ) : (
                  <Navigate to="/user-dashboard" />
                )
              ) : pendingToken ? (
                <Navigate to={`/reset-password?token=${pendingToken}`} />
              ) : (
                <Login setUser={setUser} />
              )
            }
          />
          <Route path="/login" element={<Login setUser={setUser} />} />
          <Route path="/register" element={<Register />} />
          <Route path="/forgot-password" element={<ForgotPassword />} />
          <Route path="/reset-password" element={<ResetPassword />} />
          <Route path="/reset-redirect" element={<ResetRedirect />} />

          <Route
            path="/japaCounter"
            element={
              user && user.role === 'user' ? (
                <ProtectedRoute>
                  <JapaCounter setUser={setUser} />
                </ProtectedRoute>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/shortCutKey"
            element={
              user && user.role === 'user' ? (
                <ProtectedRoute>
                  <ShortcutSettings />
                </ProtectedRoute>
              ) : (
                <Navigate to="/login" />
              )
            }
          />
          <Route
            path="/user-dashboard"
            element={
              user && user.role === 'user' ? (
                <ProtectedRoute>
                  <UserDashboard setUser={setUser} />
                </ProtectedRoute>
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
    </ThemeProvider>
  );
}
