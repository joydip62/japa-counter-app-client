import React from "react";
import { useState } from "react";
import axios from "../utils/axios"; 
import { useNavigate, Link } from "react-router-dom";

export default function Register() {
  const [form, setForm] = useState({ username: "", email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [showDelayModal, setShowDelayModal] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const navigate = useNavigate();

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setLoading(true);

    // Show modal if delay exceeds 3 seconds
    const delayTimer = setTimeout(() => {
      setShowDelayModal(true);
    }, 3000);

    try {
      const res = await axios.post('/auth/register', form);
      setSuccess(res.data.message || 'Registration successful!');
      setForm({ username: '', email: '', password: '' });

      setTimeout(() => {
        navigate('/login'); // Redirect after short delay
      }, 1500);
      clearTimeout(delayTimer);
      setShowDelayModal(false);
      setLoading(false);
      
    } catch (err) {
      setError(err.response?.data?.message || 'Registration failed.');
    } finally {
      setLoading(false);
      clearTimeout(delayTimer);
      setShowDelayModal(false);
          
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ marginBottom: '20px', color: '#222' }}>Register</h2>

        {error && <p style={errorStyle}>{error}</p>}
        {success && <p style={successStyle}>{success}</p>}

        <input
          name="username"
          placeholder="Username"
          value={form.username}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          required
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Registering...' : 'Register'}
        </button>

        <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#555' }}>
          Already have an account?{' '}
          <Link to="/login" style={linkStyle}>
            Login here
          </Link>
        </div>
      </form>
      {showDelayModal && (
        <div style={modalOverlay}>
          <div style={modalContent}>
            <p style={{ margin: 0 }}>
              {' '}
              ⏳ Login is taking longer than usual... Please wait.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// Styles
const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  // backgroundColor: "#f5f7fa",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  width: "320px",
  padding: "30px",
  borderRadius: "12px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};

const inputStyle = {
  padding: "12px 15px",
  marginBottom: "15px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
};

const buttonStyle = {
  padding: "12px 0",
  fontSize: "1.1rem",
  fontWeight: "600",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
  boxShadow: "0 4px 10px rgba(0,123,255,0.4)",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "500",
};

const errorStyle = {
  color: "red",
  marginBottom: "10px",
  fontSize: "0.9rem",
};

const successStyle = {
  color: "green",
  marginBottom: "10px",
  fontSize: "0.9rem",
};
// message modal
const modalOverlay = {
  position: 'fixed',
  top: 0,
  left: 0,
  width: '100vw',
  height: '100vh',
  backgroundColor: 'rgba(0,0,0,0.3)',
  display: 'flex',
  justifyContent: 'center',
  alignItems: 'center',
  zIndex: 1000,
};

const modalContent = {
  backgroundColor: '#fff',
  padding: '20px 30px',
  borderRadius: '10px',
  fontSize: '18px',
  boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
};