import React, { useEffect, useState } from 'react';

const UpdateBanner = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloadReady, setDownloadReady] = useState(false);

  useEffect(() => {
    window.electronAPI.receive('update-available', () => {
      setUpdateAvailable(true);
    });

    window.electronAPI.receive('update-downloaded', () => {
      setDownloadReady(true);
    });
  }, []);

  return (
    <>
      {updateAvailable && !downloadReady && (
        <div style={styles.banner}>🔄 Update available... downloading...</div>
      )}
      {downloadReady && (
        <div style={styles.banner}>
          ✅ Update ready!{' '}
          <button onClick={() => window.electronAPI.send('install-update')}>
            Restart & Install
          </button>
        </div>
      )}
    </>
  );
};

const styles = {
  banner: {
    backgroundColor: '#ffdf00',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
  },
};

export default UpdateBanner;
