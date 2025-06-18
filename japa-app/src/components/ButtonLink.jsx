import React from 'react';
import { useNavigate } from 'react-router-dom';
import LogoutButton from './Logout';

const ButtonLink = ({ setUser }) => {
  const navigate = useNavigate();

  return (
    <div style={styles.flex}>
      <button
        onClick={() => navigate('/japaCounter')}
        style={styles.counterButton}
      >
        🧘 Go to Japa Counter
      </button>

      <button
        onClick={() => navigate('/shortCutKey')}
        style={styles.settingButton}
      >
        🛠 Go to Key Setting
      </button>

      <LogoutButton setUser={setUser} />
    </div>
  );
};

const styles = {
  flex: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    gap: '10px',
    margin: '30px',
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
};

export default ButtonLink;
