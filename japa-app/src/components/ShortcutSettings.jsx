// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ShortcutSettings = () => {
//   const navigate = useNavigate();

//   const [shortcuts, setShortcuts] = useState({
//     increment: 'F7',
//     decrement: 'F8',
//     reset: 'F9',
//   });

//   useEffect(() => {
//     const email = localStorage.getItem('email');
//     const shortcutKey = `japa_shortcuts_${email}`;
//     const saved = localStorage.getItem(shortcutKey);

//     if (email && saved && window.electron) {
//       const shortcuts = JSON.parse(saved);

//       // Send shortcuts to Electron main process
//       window.electron.send('update-shortcuts', { email, shortcuts });
//     }
//   }, []);
  

//   const handleChange = (e) => {
//     setShortcuts({
//       ...shortcuts,
//       [e.target.name]: e.target.value.toUpperCase(),
//     });
//   };

//   const handleSave = () => {
//     const email = localStorage.getItem('email');
//     if (!email) {
//       alert('User email not found.');
//       return;
//     }

//     const userShortcutKey = `japa_shortcuts_${email}`;
//     localStorage.setItem(userShortcutKey, JSON.stringify(shortcuts));

//     if (window.electronAPI?.send) {
//       window.electronAPI.send('update-shortcuts', { email, shortcuts });
//     }

//     alert('Shortcuts updated successfully!');
//     navigate('/japaCounter');
//   };
  

//   return (
//     <div style={styles.container}>
//       <button
//         onClick={() => navigate('/japaCounter')}
//         style={styles.goToButton}
//       >
//         🧘 Go to Japa Counter
//       </button>

//       <h2 style={styles.heading}>Shortcut Settings</h2>

//       {['increment', 'decrement', 'reset'].map((key) => (
//         <div key={key} style={styles.field}>
//           <label style={styles.label}>
//             {key.charAt(0).toUpperCase() + key.slice(1)} Key:
//           </label>
//           <input
//             type="text"
//             name={key}
//             value={shortcuts[key]}
//             onChange={handleChange}
//             style={styles.input}
//           />
//         </div>
//       ))}

//       <button onClick={handleSave} style={styles.button}>
//         Save Shortcuts
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '400px',
//     margin: '40px auto',
//     padding: '20px',
//     backgroundColor: '#f8f9fa',
//     borderRadius: '12px',
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//     fontFamily: 'Arial, sans-serif',
//   },
//   heading: {
//     textAlign: 'center',
//     color: '#333',
//     marginBottom: '20px',
//   },
//   field: {
//     marginBottom: '15px',
//   },
//   label: {
//     display: 'block',
//     fontWeight: 'bold',
//     marginBottom: '5px',
//     color: '#555',
//   },
//   input: {
//     width: '100%',
//     padding: '8px',
//     fontSize: '16px',
//     borderRadius: '6px',
//     border: '1px solid #ccc',
//   },
//   button: {
//     width: '100%',
//     padding: '10px',
//     backgroundColor: '#28a745',
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: '16px',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//   },
//   goToButton: {
//     width: '100%',
//     padding: '10px 20px',
//     fontSize: '16px',
//     fontWeight: '600',
//     borderRadius: '8px',
//     border: 'none',
//     cursor: 'pointer',
//     backgroundColor: '#007bff',
//     color: 'white',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//     transition: 'background-color 0.3s ease',
//   },
// };

// export default ShortcutSettings;


// above is old

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ShortcutSettings = () => {
//   const navigate = useNavigate();
//   const [shortcuts, setShortcuts] = useState({
//     increment: '',
//     decrement: '',
//     reset: '',
//   });

//   const [currentKey, setCurrentKey] = useState(null);

//   const email = localStorage.getItem('email');
//   const shortcutKey = `japa_shortcuts_${email}`;

//   useEffect(() => {
//     // Load from localStorage on mount
//     const saved = localStorage.getItem(shortcutKey);
//     if (saved) {
//       setShortcuts(JSON.parse(saved));
//     }
//   }, []);

//   const handleKeyCapture = (action) => {
//     const handleKeyDown = (e) => {
//       e.preventDefault();

//       let combo = '';
//       if (e.ctrlKey) combo += 'Ctrl+';
//       if (e.altKey) combo += 'Alt+';
//       if (e.shiftKey) combo += 'Shift+';
//       if (e.metaKey) combo += 'Meta+';

//       combo += e.code || e.key;

//       // Check if already assigned to another action
//       const isDuplicate = Object.entries(shortcuts).some(
//         ([key, value]) => key !== action && value === combo
//       );

//       if (isDuplicate) {
//         alert(`"${combo}" is already assigned to another action.`);
//       } else {
//         setShortcuts((prev) => ({
//           ...prev,
//           [action]: combo,
//         }));
//       }

//       window.removeEventListener('keydown', handleKeyDown);
//       setCurrentKey(null);
//     };

//     setCurrentKey(action);
//     window.addEventListener('keydown', handleKeyDown);
//   };


//   const handleSave = () => {
//     localStorage.setItem(shortcutKey, JSON.stringify(shortcuts));

//     if (window.electronAPI?.send) {
//       window.electronAPI.send('update-shortcuts', { email, shortcuts });
//     }

//     alert('Shortcuts saved!');
//     navigate('/japaCounter');
//   };

//   return (
//     <div style={styles.container}>
//       <button
//         onClick={() => navigate('/japaCounter')}
//         style={styles.goToButton}
//       >
//         🧘 Go to Japa Counter
//       </button>

//       <h2 style={styles.heading}>Shortcut Settings</h2>

//       {['increment', 'decrement', 'reset'].map((action) => (
//         <div key={action} style={styles.field}>
//           <label style={styles.label}>
//             {action.charAt(0).toUpperCase() + action.slice(1)} Key:
//           </label>
//           <input
//             type="text"
//             value={shortcuts[action]}
//             readOnly
//             onClick={() => handleKeyCapture(action)}
//             placeholder="Click and press shortcut"
//             style={styles.input}
//           />
//           {currentKey === action && (
//             <p style={{ fontSize: '12px', color: '#666' }}>
//               Press desired key combo now...
//             </p>
//           )}
//         </div>
//       ))}

//       <button onClick={handleSave} style={styles.button}>
//         Save Shortcuts
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '400px',
//     margin: '40px auto',
//     padding: '20px',
//     // backgroundColor: '#f8f9fa',
//     borderRadius: '12px',
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//     fontFamily: 'Arial, sans-serif',
//   },
//   heading: {
//     textAlign: 'center',
//     // color: '#333',
//     marginBottom: '20px',
//   },
//   field: {
//     marginBottom: '15px',
//   },
//   label: {
//     display: 'block',
//     fontWeight: 'bold',
//     marginBottom: '5px',
//     // color: '#555',
//   },
//   input: {
//     width: '100%',
//     padding: '8px',
//     fontSize: '16px',
//     borderRadius: '6px',
//     border: '1px solid #ccc',
//     // backgroundColor: '#fff',
//     cursor: 'pointer',
//   },
//   button: {
//     width: '100%',
//     padding: '10px',
//     backgroundColor: '#28a745',
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: '16px',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//   },
//   goToButton: {
//     width: '100%',
//     padding: '10px 20px',
//     fontSize: '16px',
//     fontWeight: '600',
//     borderRadius: '8px',
//     border: 'none',
//     cursor: 'pointer',
//     backgroundColor: '#007bff',
//     color: 'white',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//     transition: 'background-color 0.3s ease',
//   },
// };

// export default ShortcutSettings;

// import React, { useState, useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const ShortcutSettings = () => {
//   const navigate = useNavigate();
//   const [shortcuts, setShortcuts] = useState({
//     increment: '',
//     decrement: '',
//     reset: '',
//   });

//   const [currentKey, setCurrentKey] = useState(null);

//   const email = localStorage.getItem('email');
//   const shortcutKey = `japa_shortcuts_${email}`;

//   useEffect(() => {
//     const saved = localStorage.getItem(shortcutKey);
//     if (saved) {
//       setShortcuts(JSON.parse(saved));
//     }
//   }, []);

//   const handleKeyCapture = (action) => {
//     const handleKeyDown = (e) => {
//       e.preventDefault();

//       let combo = '';
//       if (e.ctrlKey) combo += 'Ctrl+';
//       if (e.altKey) combo += 'Alt+';
//       if (e.shiftKey) combo += 'Shift+';
//       if (e.metaKey) combo += 'Meta+';

//       const key = e.key;

//       if (
//         key === 'Control' ||
//         key === 'Shift' ||
//         key === 'Alt' ||
//         key === 'Meta'
//       ) {
//         if (combo) {
//           combo = combo.slice(0, -1); // remove trailing '+'
//         } else {
//           return; // pressed a single modifier key alone, skip
//         }
//       } else {
//         combo += key.toUpperCase();
//       }
     
//       const isDuplicate = Object.entries(shortcuts).some(
//         ([key, value]) => key !== action && value === combo
//       );

//       if (isDuplicate) {
//         alert(`"${combo}" is already assigned to another action.`);
//       } else {
//        setShortcuts((prev) => ({
//          ...prev,
//          [action]: combo,
//        }));
//       }

//       window.removeEventListener('keydown', handleKeyDown);
//       setCurrentKey(null);
//     };

//     setCurrentKey(action);
//     window.addEventListener('keydown', handleKeyDown);
//   };

//   const handleSave = () => {
//     localStorage.setItem(shortcutKey, JSON.stringify(shortcuts));

//     if (window.electronAPI?.send) {
//       window.electronAPI.send('update-shortcuts', { email, shortcuts });
//     }

//     alert('Shortcuts saved!');
//     navigate('/japaCounter');
//   };

//   return (
//     <div style={styles.container}>
//       <button
//         onClick={() => navigate('/japaCounter')}
//         style={styles.goToButton}
//       >
//         🧘 Go to Japa Counter
//       </button>

//       <h2 style={styles.heading}>Shortcut Settings</h2>

//       {['increment', 'decrement', 'reset'].map((action) => (
//         <div key={action} style={styles.field}>
//           <label style={styles.label}>
//             {action.charAt(0).toUpperCase() + action.slice(1)} Key:
//           </label>
//           <input
//             type="text"
//             value={shortcuts[action]}
//             readOnly
//             onClick={() => handleKeyCapture(action)}
//             placeholder="Click and press shortcut"
//             style={styles.input}
//           />
//           {currentKey === action && (
//             <p style={{ fontSize: '12px', color: '#666' }}>
//               Press desired key combo now...
//             </p>
//           )}
//         </div>
//       ))}

//       <button onClick={handleSave} style={styles.button}>
//         Save Shortcuts
//       </button>
//     </div>
//   );
// };

// const styles = {
//   container: {
//     maxWidth: '400px',
//     margin: '40px auto',
//     padding: '20px',
//     borderRadius: '12px',
//     boxShadow: '0 0 10px rgba(0,0,0,0.1)',
//     fontFamily: 'Arial, sans-serif',
//   },
//   heading: {
//     textAlign: 'center',
//     marginBottom: '20px',
//   },
//   field: {
//     marginBottom: '15px',
//   },
//   label: {
//     display: 'block',
//     fontWeight: 'bold',
//     marginBottom: '5px',
//   },
//   input: {
//     width: '100%',
//     padding: '8px',
//     fontSize: '16px',
//     borderRadius: '6px',
//     border: '1px solid #ccc',
//     cursor: 'pointer',
//   },
//   button: {
//     width: '100%',
//     padding: '10px',
//     backgroundColor: '#28a745',
//     color: 'white',
//     fontWeight: 'bold',
//     fontSize: '16px',
//     border: 'none',
//     borderRadius: '6px',
//     cursor: 'pointer',
//   },
//   goToButton: {
//     width: '100%',
//     padding: '10px 20px',
//     fontSize: '16px',
//     fontWeight: '600',
//     borderRadius: '8px',
//     border: 'none',
//     cursor: 'pointer',
//     backgroundColor: '#007bff',
//     color: 'white',
//     boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
//     transition: 'background-color 0.3s ease',
//     marginBottom: '20px',
//   },
// };

// export default ShortcutSettings;

// ====================== update one ===========================
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const ShortcutSettings = () => {
  const navigate = useNavigate();
  const [shortcuts, setShortcuts] = useState({
    increment: '',
    decrement: '',
    reset: '',
  });

  const [currentKey, setCurrentKey] = useState(null);

  const email = localStorage.getItem('email');
  const shortcutKey = `japa_shortcuts_${email}`;

  useEffect(() => {
    const saved = localStorage.getItem(shortcutKey);
    if (saved) {
      setShortcuts(JSON.parse(saved));
    }
  }, [shortcutKey]);

  const handleKeyCapture = (action) => {
    const handleKeyDown = (e) => {
      e.preventDefault(); // Prevent default behavior of the key

      let combo = '';
      if (e.ctrlKey) combo += 'Ctrl+';
      if (e.altKey) combo += 'Alt+';
      if (e.shiftKey) combo += 'Shift+';
      if (e.metaKey) combo += 'Meta+';

      const key = e.key;

      // Ignore modifier keys alone
      if (
        key === 'Control' ||
        key === 'Shift' ||
        key === 'Alt' ||
        key === 'Meta'
      ) {
        return;
      }

      combo += key.toUpperCase(); // Add the main key to the combination

      // Check for duplicate shortcuts
      const isDuplicate = Object.entries(shortcuts).some(
        ([key, value]) => key !== action && value === combo
      );

      if (isDuplicate) {
        alert(`"${combo}" is already assigned to another action.`);
      } else {
        setShortcuts((prev) => ({
          ...prev,
          [action]: combo,
        }));
      }

      // Clean up the event listener
      window.removeEventListener('keydown', handleKeyDown);
      setCurrentKey(null);
    };

    setCurrentKey(action);
    window.addEventListener('keydown', handleKeyDown);
  };

  const handleSave = () => {
    localStorage.setItem(shortcutKey, JSON.stringify(shortcuts));

    if (window.electronAPI?.send) {
      window.electronAPI.send('update-shortcuts', { email, shortcuts });
    }

    alert('Shortcuts saved!');
    navigate('/japaCounter');
  };

  useEffect(() => {
    const fetchShortcuts = async () => {
      if (window.electronAPI?.getUserShortcuts && email) {
        const storedShortcuts = await window.electronAPI.getUserShortcuts(
          email
        );
        setShortcuts(storedShortcuts);
      }
    };

    fetchShortcuts();
  }, [email]);

  
  return (
    <div style={styles.container}>
      <button
        onClick={() => navigate('/japaCounter')}
        style={styles.goToButton}
      >
        🧘 Go to Japa Counter
      </button>

      <h2 style={styles.heading}>Shortcut Settings</h2>
      <p
        style={{
          backgroundColor: '#f9f9f9',
          padding: '16px',
          borderRadius: '8px',
          fontSize: '16px',
          lineHeight: '1.6',
          color: '#333',
          border: '1px solid #ddd',
        }}
      >
        <strong>Dear Devotee,</strong>
        <br />
        Please set your desired shortcut keys to enhance your Japa experience.
        <br />
        You may choose single keys like <strong>F7, F8, or F9</strong>, or
        combination keys like<strong> Ctrl + Shift + Q</strong>, <strong>Ctrl + Shift + W</strong>,etc., for Increment, Decrement, and Reset actions.
        <br />
        Once set, you can chant and count Japa using these shortcut keys — even
        when the app is minimized or running in the background.
        <br />
        Kindly ensure that the keys you select are not commonly used in other
        applications to avoid interference.
        <br />
        <strong>Hare Krishna!</strong>
      </p>

      {['increment', 'decrement', 'reset'].map((action) => (
        <div key={action} style={styles.field}>
          <label style={styles.label}>
            {action.charAt(0).toUpperCase() + action.slice(1)} Key:
          </label>
          <input
            type="text"
            value={shortcuts[action]}
            readOnly
            onClick={() => handleKeyCapture(action)}
            placeholder="Click and press shortcut"
            style={styles.input}
          />
          {currentKey === action && (
            <p style={{ fontSize: '12px', color: '#666' }}>
              Press desired key combo now...
            </p>
          )}
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
    borderRadius: '12px',
    boxShadow: '0 0 10px rgba(0,0,0,0.1)',
    fontFamily: 'Arial, sans-serif',
  },
  heading: {
    textAlign: 'center',
    marginBottom: '20px',
  },
  field: {
    marginBottom: '15px',
  },
  label: {
    display: 'block',
    fontWeight: 'bold',
    marginBottom: '5px',
  },
  input: {
    width: '100%',
    padding: '8px',
    fontSize: '16px',
    borderRadius: '6px',
    border: '1px solid #ccc',
    cursor: 'pointer',
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
    marginBottom: '20px',
  },
};

export default ShortcutSettings;
