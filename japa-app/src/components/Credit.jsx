import React, { useState } from 'react';

const Credit = () => {
  const [showPopup, setShowPopup] = useState(false);

  const togglePopup = () => setShowPopup(!showPopup);

  return (
    <>
      {/* Floating icon */}
      <div
        onClick={togglePopup}
        style={{
          position: 'fixed',
          bottom: '20px',
          right: '20px',
          backgroundColor: '#1976d2',
          color: 'white',
          borderRadius: '50%',
          width: '40px',
          height: '40px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          boxShadow: '0 0 10px rgba(0,0,0,0.3)',
          zIndex: 1000,
        }}
        title="Credits"
      >
        ℹ️
      </div>

      {/* Popup */}
      {showPopup && (
        <div
          style={{
            position: 'fixed',
            bottom: '80px',
            right: '20px',
            backgroundColor: '#fff',
            color: '#333',
            padding: '20px',
            borderRadius: '8px',
            boxShadow: '0 0 12px rgba(0, 0, 0, 0.2)',
            zIndex: 1001,
            width: '280px',
            maxWidth: '90%',
          }}
        >
          <h4 style={{ marginTop: 0 }}>App Credits</h4>
          <p style={{ fontSize: '14px', lineHeight: '1.4' }}>
            Developed by <strong>JPS Archives</strong>.<br />©{' '}
            {new Date().getFullYear()} All rights reserved.
          </p>
          <button
            onClick={togglePopup}
            style={{
              marginTop: '10px',
              backgroundColor: '#1976d2',
              color: 'white',
              border: 'none',
              padding: '6px 12px',
              borderRadius: '4px',
              cursor: 'pointer',
              float: 'right',
            }}
          >
            Close
          </button>
        </div>
      )}
    </>
  );
};

export default Credit;
