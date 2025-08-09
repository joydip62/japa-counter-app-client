import React, { useEffect, useState } from 'react';

const ShortcutDisplay = () => {
  const [shortcuts, setShortcuts] = useState({
    increment: 'F1',
    decrement: 'F2',
    reset: 'F3', 
  });

  // useEffect(() => {
  //   const email = localStorage.getItem('email');
  //   if (email && window.electronAPI) {
  //     window.electronAPI.invoke('get-user-shortcuts', email).then((result) => {
  //       if (result.increment && result.decrement && result.reset) {
  //         setShortcuts(result);
  //       }
  //     });
  //   }
  // }, []);

  // New one
  // useEffect(() => {
  //   const email = localStorage.getItem('email');
  //   if (email) {
  //     const savedShortcuts = localStorage.getItem(`japa_shortcuts_${email}`);
  //     if (savedShortcuts) {
  //       try {
  //         const parsed = JSON.parse(savedShortcuts);
  //         if (parsed.increment && parsed.decrement && parsed.reset) {
  //           setShortcuts(parsed);
  //         }
  //       } catch (e) {
  //         console.error('Invalid shortcut JSON:', e);
  //       }
  //     }
  //   }
  // }, []);

  // if no key then show message
  useEffect(() => {
    const email = localStorage.getItem('email');
    if (email) {
      const savedShortcuts = localStorage.getItem(`japa_shortcuts_${email}`);
      if (savedShortcuts) {
        try {
          const parsed = JSON.parse(savedShortcuts);
          if (parsed.increment && parsed.decrement && parsed.reset) {
            setShortcuts(parsed);
            return;
          }
        } catch (e) {
          console.error('Invalid shortcut JSON:', e);
        }
      }
    }

    // If no valid shortcuts found, set to null
    setShortcuts(null);
  }, []);


  return (
    <div style={styles.container}>
      {/* <p>
        <strong>Shortcut keys:</strong>{' '}
        <span style={styles.key}>{shortcuts.increment}</span> (Increment),{' '}
        <span style={styles.key}>{shortcuts.decrement}</span> (Decrement),{' '}
        <span style={styles.key}>{shortcuts.reset}</span> (Reset)
      </p> */}

      {shortcuts ? (
        <p>
          <strong>Shortcut keys:</strong>{' '}
          <span style={styles.key}>{shortcuts.increment}</span> (Increment),{' '}
          <span style={styles.key}>{shortcuts.decrement}</span> (Decrement),{' '}
          <span style={styles.key}>{shortcuts.reset}</span> (Reset)
        </p>
      ) : (
        <p style={styles.noKeys}>
          <strong>No shortcut Keyboard keys configured.</strong>
          <br />
          Please <strong>Go to Key Settings</strong> and choose your desired key
          combinations for Japa Count.
        </p>
      )}
    </div>
  );
};

const styles = {
  container: {
    marginTop: '20px',
    fontSize: '14px',
    // color: '#444',
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
