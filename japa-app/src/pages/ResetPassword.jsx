import { useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import axios from '../utils/axios';

export default function ResetPassword() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(false);

  const handleReset = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      await axios.post('/auth/reset-password', { token, password });
      setDone(true);
      window.location.href = 'japa://login';
    } catch (err) {
      alert(err.response?.data?.error || '❌ Failed to reset password');
    } finally {
      setLoading(false);
    }
  };

  if (done) {
    return (
      <div style={successStyles.wrapper}>
        <div style={successStyles.container}>
          <h2 style={successStyles.title}>✅ Password Reset Successful!</h2>
          <p style={successStyles.message}>
            Your password has been updated. You can now return to the{' '}
            <strong>Japa Counter App</strong> and log in with your new
            credentials.
          </p>
          <p style={successStyles.redirect}>Opening the app automatically...</p>
        </div>
      </div>
    );
  }

  return (
    <div style={styles.wrapper}>
      <form onSubmit={handleReset} style={styles.form}>
        <h2 style={styles.heading}>Reset Your Password</h2>
        <div style={styles.inputWrapper}>
          <input
            type={showPassword ? 'text' : 'password'}
            value={password}
            placeholder="New Password"
            onChange={(e) => setPassword(e.target.value)}
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

        <button type="submit" disabled={loading} style={styles.button}>
          {loading ? 'Resetting...' : 'Reset Password'}
        </button>
      </form>
    </div>
  );
}

// Main form styles
const styles = {
  inputWrapper: {
    position: 'relative',
    marginBottom: '20px',
  },
  inputWithIcon: {
    width: '100%',
    padding: '12px 45px 12px 15px',
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
};

// Success message styles
const successStyles = {
  wrapper: {
    height: '100vh',
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    background: '#f0f2f5',
  },
  container: {
    maxWidth: '500px',
    padding: '30px',
    textAlign: 'center',
    background: '#e6f9ec',
    border: '1px solid #b5e2c7',
    borderRadius: '8px',
    fontFamily: 'Arial, sans-serif',
    boxShadow: '0 4px 12px rgba(0, 0, 0, 0.1)',
  },
  title: {
    color: '#2e7d32',
    fontSize: '24px',
    marginBottom: '16px',
  },
  message: {
    color: '#1b5e20',
    fontSize: '16px',
    marginBottom: '12px',
  },
  redirect: {
    fontStyle: 'italic',
    color: '#4caf50',
  },
};
