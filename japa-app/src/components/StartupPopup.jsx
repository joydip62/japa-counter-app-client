import React, { useEffect, useState } from 'react';

const StartupPopup = () => {
  const [show, setShow] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => setShow(false), 3000); // hide after 3 seconds
    return () => clearTimeout(timer);
  }, []);

  if (!show) return null;

  return (
    <div style={styles.overlay}>
      <div style={styles.popup}>
        <div style={styles.topBar}>
          <img
            src="/Srila-Prabhupada.png"
            alt="Srila Prabhupada"
            style={{ maxWidth: '100%', marginBottom: '10px' }}
          />
          <h4 style={{ maxWidth: '100%', lineHeight: '1.5' }}>
            Dedicated to His Divine Grace A.C. Bhaktivedanta Swami Prabhupāda
            <br />
            <em>
              Founder-Ācārya: International Society for Krishna Consciousness
            </em>
            <p style={{ marginTop: '10px' }}>by His grand-disciples.</p>
          </h4>
        </div>
      </div>
    </div>
  );
};

const styles = {
  overlay: {
    position: 'fixed',
    top: 0,
    left: 0,
    height: '100vh',
    width: '100vw',
    backgroundColor: 'rgba(0, 0, 0, 0.4)',
    zIndex: 9999,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
  },
  popup: {
    backgroundColor: '#fff',
    borderRadius: '8px',
    padding: '20px',
    width: '90%',
    maxWidth: '500px',
    boxShadow: '0 4px 12px rgba(0,0,0,0.2)',
  },
  topBar: {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
    backgroundColor: '#f8f9fa',
    marginTop: '10px',
  },
};

export default StartupPopup;
