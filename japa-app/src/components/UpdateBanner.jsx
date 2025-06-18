import React, { useEffect, useState } from 'react';

const UpdateBanner = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [isUpdateReady, setIsUpdateReady] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');
  const [currentVersion, setCurrentVersion] = useState('');

  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const res = await fetch(
          'https://api.github.com/repos/joydip62/japa-counter-app-client/releases/latest'
        );
        const data = await res.json();

        const latest = data.tag_name.replace(/^v/, '');
        const local = await window.electronAPI?.getAppVersion?.();

        setLatestVersion(latest);
        setCurrentVersion(local);

        if (latest !== local) {
          setIsUpdateAvailable(true);
        }
      } catch (error) {
        console.error('Error checking update:', error);
      }
    };

    checkForUpdate();

    // Listen for update downloaded event
    window.electronAPI?.onUpdateDownloaded?.(() => {
      setIsUpdateReady(true);
    });
  }, []);

  if (!isUpdateAvailable) return null;

  return (
    <div style={styles.banner}>
      🔔 A new version ({latestVersion}) is available! You are using{' '}
      {currentVersion}.
      <br />
      {isUpdateReady ? (
        <>
          ✅ Update downloaded. Please restart to install.
          <br />
          <button
            style={styles.button}
            onClick={() => window.electronAPI.installUpdate()}
          >
            🔄 Restart and Install Update
          </button>
        </>
      ) : (
        <>
          👉 It will be downloaded automatically. Restart prompt will appear
          once ready.
        </>
      )}
    </div>
  );
};

const styles = {
  banner: {
    backgroundColor: '#ffd966',
    padding: '10px',
    textAlign: 'center',
    fontWeight: 'bold',
    color: '#000',
  },
  button: {
    marginTop: '10px',
    padding: '8px 16px',
    fontSize: '14px',
    backgroundColor: '#007bff',
    color: 'white',
    border: 'none',
    borderRadius: '6px',
    cursor: 'pointer',
  },
};

export default UpdateBanner;
