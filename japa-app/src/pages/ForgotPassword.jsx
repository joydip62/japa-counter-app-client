import React, { useState } from 'react';
import axios from '../utils/axios';
import { Link } from 'react-router-dom';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [msg, setMsg] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMsg('');
    setError('');
    try {
      const res = await axios.post('/auth/forgot-password', { email });
      setMsg(res.data.message);
    } catch (err) {
      setError(err.response?.data?.error || 'Something went wrong');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={styles.container}>
      <form onSubmit={handleSubmit} style={styles.form}>
        <h2 style={styles.title}>Forgot Password</h2>
        <input
          type="email"
          value={email}
          placeholder="Enter your email"
          onChange={(e) => setEmail(e.target.value)}
          required
          style={styles.input}
        />
        <button type="submit" style={styles.button} disabled={loading}>
          {loading ? 'Sending...' : 'Send Reset Link'}
        </button>
        {msg && <p style={styles.success}>{msg}</p>}
        {error && <p style={styles.error}>{error}</p>}

        <div style={{ marginTop: '15px', fontSize: '0.9rem' }}>
          Back to{' '}
          <Link to="/login" style={styles.linkStyle}>
            Login
          </Link>
        </div>
      </form>
    </div>
  );
};

const styles = {
  container: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#f5f7fa',
  },
  form: {
    width: '320px',
    padding: '30px',
    backgroundColor: '#fff',
    borderRadius: '12px',
    boxShadow: '0 4px 20px rgba(0,0,0,0.1)',
    display: 'flex',
    flexDirection: 'column',
  },
  title: {
    marginBottom: '20px',
    color: '#222',
    textAlign: 'center',
  },
  input: {
    padding: '12px 15px',
    marginBottom: '15px',
    borderRadius: '8px',
    border: '1px solid #ccc',
    fontSize: '1rem',
  },
  button: {
    padding: '12px',
    borderRadius: '8px',
    backgroundColor: '#007bff',
    color: '#fff',
    border: 'none',
    cursor: 'pointer',
    fontWeight: '600',
    fontSize: '1rem',
  },
  success: {
    color: 'green',
    marginTop: '10px',
    textAlign: 'center',
  },
  error: {
    color: 'red',
    marginTop: '10px',
    textAlign: 'center',
    },
  linkStyle: {
        color: "#007bff",
        textDecoration: "none",
        fontWeight: "500",
      },
};

export default ForgotPassword;
