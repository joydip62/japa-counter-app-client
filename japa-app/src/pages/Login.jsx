import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

export default function Login({ setUser }) {
  const [form, setForm] = useState(() => {
    const saved = JSON.parse(localStorage.getItem('rememberMeData'));
    return saved || { email: '', password: '', remember: false };
  });

  const [remember, setRemember] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // Pre-fill form if "Remember Me" is enabled
  // useEffect(() => {
  //   const saved = localStorage.getItem('rememberMeData');
  //   if (saved) {
  //     const parsed = JSON.parse(saved);
  //     setForm({ email: parsed.email, password: parsed.password });
  //     setRemember(true);
  //   }
  // }, []);

  // Auto-fill saved credentials if "Remember Me" was checked
  useEffect(() => {
    const saved = localStorage.getItem('rememberMeData');
    if (saved) {
      const parsed = JSON.parse(saved);
      setForm((prev) => ({
        ...prev,
        email: parsed.email || '',
        password: parsed.password || '',
      }));
      setRemember(true);
    }
  }, []);

  // Handle login submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post('/auth/login', form);
      const { token, role, email } = res.data;

      localStorage.setItem('token', token);
      localStorage.setItem('role', role);
      localStorage.setItem('email', email);

      if (window.electronAPI?.send) {
        window.electronAPI.send('set-user-email', res.data.email);
      }

      if (remember) {
        localStorage.setItem('rememberMeData', JSON.stringify(form));
      } else {
        localStorage.removeItem('rememberMeData');
      }


      setUser({ token, role });
      setForm({ email: '', password: '' });

      // if (res.data.role === 'admin') {
      //   setForm({ email: '', password: '' });
      //   navigate('/admin-dashboard');
      // } else {
      //   setForm({ email: '', password: '' });
      //   navigate('/user-dashboard');
      // }
      navigate(role === 'admin' ? '/admin-dashboard' : '/user-dashboard');
    } catch (err) {
      console.error('Login error:', err);
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ marginBottom: '20px', color: '#222' }}>Login</h2>

        {/* <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={inputStyle}
        /> */}

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) =>
            setForm((prev) => ({ ...prev, email: e.target.value }))
          }
          required
          style={inputStyle}
        />

        <div style={styles.inputWrapper}>
          <input
            name="password"
            type={showPassword ? 'text' : 'password'}
            placeholder="Password"
            value={form.password}
            onChange={(e) =>
              setForm((prev) => ({ ...prev, password: e.target.value }))
            }
            required
            style={styles.inputWithIcon}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            style={styles.icon}
            title={showPassword ? 'Hide password' : 'Show password'}
          >
            {showPassword ? '🙈' : '👁️'}
          </span>
        </div>

        <div style={{ marginBottom: '15px' }}>
          <input
            type="checkbox"
            checked={remember}
            onChange={() => setRemember(!remember)}
          />{' '}
          Remember Me
        </div>

        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? 'Logging in...' : 'Login'}
        </button>

        <div style={{ marginTop: '10px', fontSize: '0.9rem' }}>
          <Link to="/forgot-password" style={linkStyle}>
            Forgot password?
          </Link>
        </div>

        <div style={{ marginTop: '15px', fontSize: '0.9rem', color: '#555' }}>
          Don’t have an account?{' '}
          <Link to="/register" style={linkStyle}>
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f5f7fa",
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
  transition: "border-color 0.3s",
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
  transition: "background-color 0.3s ease",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "500",
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#f5f7fa',
    fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
  },
  form: {
    display: 'flex',
    flexDirection: 'column',
    width: '320px',
    padding: '30px',
    borderRadius: '12px',
    backgroundColor: '#fff',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
  },
  input: {
    padding: '12px 15px',
    marginBottom: '15px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
    width: '100%'
  },
  inputWrapper: {
    position: 'relative',
    marginBottom: '15px',
  },
  inputWithIcon: {
    width: '90%',
    padding: '12px 15px',
    fontSize: '1rem',
    borderRadius: '8px',
    border: '1px solid #ccc',
    outline: 'none',
  },
  icon: {
    position: 'absolute',
    top: '50%',
    right: '15px',
    transform: 'translateY(-50%)',
    cursor: 'pointer',
    fontSize: '18px',
    userSelect: 'none',
  },
  button: {
    padding: '12px 0',
    fontSize: '1.1rem',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: '#fff',
    boxShadow: '0 4px 10px rgba(0,123,255,0.4)',
    transition: 'background-color 0.3s ease',
  },
  link: {
    color: '#007bff',
    textDecoration: 'none',
    fontWeight: '500',
  },
};