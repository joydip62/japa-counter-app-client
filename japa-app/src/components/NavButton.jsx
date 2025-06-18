import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './Logout';

const NavButton = ({ setUser, label, path }) => {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');

  useEffect(() => {
    const storedEmail = localStorage.getItem('email');
    if (storedEmail) {
      setEmail(storedEmail);
    }
  }, []);

  return (
    <div
      style={{ ...styles.flex, flexDirection: 'column', alignItems: 'center' }}
    >
      <div style={styles.email}>📧 Email: {email}</div>

      <div style={styles.buttonGroup}>
        <button onClick={() => navigate(path)} style={styles.counterButton}>
          {label}
        </button>

        <button
          onClick={() => navigate('/shortCutKey')}
          style={styles.settingButton}
        >
          🛠 Go to Key Setting
        </button>

        <LogoutButton setUser={setUser} />
      </div>
    </div>
  );
};

const styles = {
  flex: {
    display: 'flex',
    justifyContent: 'center',
    gap: '10px',
    margin: '30px',
  },
  buttonGroup: {
    display: 'flex',
    gap: '10px',
    marginTop: '10px',
  },
  counterButton: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: '#007bff',
    color: 'white',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s ease',
  },
  settingButton: {
    padding: '10px 20px',
    fontSize: '16px',
    fontWeight: '600',
    borderRadius: '8px',
    border: 'none',
    cursor: 'pointer',
    backgroundColor: 'black',
    color: 'white',
    boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
    transition: 'background-color 0.3s ease',
  },
  email: {
    fontWeight: 'bold',
    fontSize: '16px',
    marginBottom: '10px',
  },
};

export default NavButton;
