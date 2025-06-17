import React, { useEffect, useState } from 'react';

const ShortcutDisplay = () => {
  const [shortcuts, setShortcuts] = useState({
    increment: '',
    decrement: '',
    reset: '',
  });

  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email && window.electronAPI) {
      window.electronAPI.invoke('get-user-shortcuts', email).then((result) => {
        if (result.increment && result.decrement && result.reset) {
          setShortcuts(result);
        }
      });
    }
  }, []);

  return (
    <div style={styles.container}>
      <p>
        <strong>Shortcut keys:</strong>{' '}
        <span style={styles.key}>{shortcuts.increment}</span> (Increment),{' '}
        <span style={styles.key}>{shortcuts.decrement}</span> (Decrement),{' '}
        <span style={styles.key}>{shortcuts.reset}</span> (Reset)
      </p>
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
    fontSize: '14px',
    color: '#444',
    textAlign: 'center',
  },
  key: {
    backgroundColor: '#eee',
    padding: '2px 6px',
    borderRadius: '4px',
    fontWeight: 'bold',
    fontFamily: 'monospace',
  },
};

export default ShortcutDisplay;
