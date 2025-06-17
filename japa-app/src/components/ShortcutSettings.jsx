import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShortcutSettings = () => {
  const navigate = useNavigate();
  const email = localStorage.getItem('email');
  const shortcutKey = `japa_shortcuts_${email}`;

  const [shortcuts, setShortcuts] = useState({
    increment: 'F7',
    decrement: 'F8',
    reset: 'F9',
  });

  useEffect(() => {
    const email = localStorage.getItem('email');
    const shortcutKey = `japa_shortcuts_${email}`;
    const saved = localStorage.getItem(shortcutKey);

    if (email && saved && window.electron) {
      const shortcuts = JSON.parse(saved);

      // Send shortcuts to Electron main process
      window.electron.send('update-shortcuts', { email, shortcuts });
    }
  }, []);
  

  const handleChange = (e) => {
    setShortcuts({
      ...shortcuts,
      [e.target.name]: e.target.value.toUpperCase(),
    });
  };

  const handleSave = () => {
    const email = localStorage.getItem('email');
    if (!email) {
      alert('User email not found.');
      return;
    }

    const userShortcutKey = `japa_shortcuts_${email}`;
    localStorage.setItem(userShortcutKey, JSON.stringify(shortcuts));

    if (window.electronAPI?.send) {
      window.electronAPI.send('update-shortcuts', { email, shortcuts });
    }

    alert('Shortcuts updated successfully!');
    navigate('/japaCounter');
  };
  

  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate('/japaCounter')}
        style={styles.goToButton}
      >
        🧘 Go to Japa Counter
      </button>

      <h2 style={styles.heading}>Shortcut Settings</h2>

      {['increment', 'decrement', 'reset'].map((key) => (
        <div key={key} style={styles.field}>
          <label style={styles.label}>
            {key.charAt(0).toUpperCase() + key.slice(1)} Key:
          </label>
          <input
            type="text"
            name={key}
            value={shortcuts[key]}
            onChange={handleChange}
            style={styles.input}
          />
        </div>
      ))}

      <button onClick={handleSave} style={styles.button}>
        Save Shortcuts
      </button>
    </div>
  );
};

const styles = {
  container: {
    maxWidth: '400px',
    margin: '40px auto',
    padding: '20px',
    backgroundColor: '#f8f9fa',
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    color: '#333',
    marginBottom: '20px',
  },
  field: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
    color: '#555',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
  },
  button: {
    width: '100%',
    padding: '10px',
    backgroundColor: '#28a745',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '16px',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
  goToButton: {
    width: '100%',
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
};

export default ShortcutSettings;
