import React, { useEffect, useState } from 'react';

const UpdateBanner = () => {
  const [isUpdateAvailable, setIsUpdateAvailable] = useState(false);
  const [latestVersion, setLatestVersion] = useState('');
  const [currentVersion, setCurrentVersion] = useState('');

  useEffect(() => {
    const checkForUpdate = async () => {
      try {
        const res = await fetch(
          'https://api.github.com/repos/joydip62/japa-counter-app-client/releases/latest'
        );
        const data = await res.json();

        const latest = data.tag_name?.replace(/^v/, '') || '';
        const local = await window.electronAPI?.getAppVersion?.();

        setLatestVersion(latest);
        setCurrentVersion(local);

        if (latest && local && latest !== local) {
          setIsUpdateAvailable(true);
        }
      } catch (error) {
        console.error('Error checking update:', error);
      }
    };

    checkForUpdate();

    // ✅ Listen for autoUpdater update-downloaded event
    const onUpdateDownloaded = () => {
      const confirmInstall = window.confirm(
        'A new version has been downloaded. Do you want to restart and install it now?'
      );
      if (confirmInstall) {
        window.electronAPI?.installUpdate?.(); // Call preload-exposed function
      }
    };

    window.electronAPI?.onUpdateDownloaded?.(onUpdateDownloaded);

    return () => {
      window.electronAPI?.removeUpdateDownloadedListener?.(); // Clean up
    };
  }, []);

  if (!isUpdateAvailable) return null;

  return (
    <div style={styles.banner}>
      🔔 A new version ({latestVersion}) is available! You are using{' '}
      {currentVersion}.
      <br />
      👉 It will be downloaded automatically. Restart prompt will appear once
      ready.
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
};

export default UpdateBanner;
