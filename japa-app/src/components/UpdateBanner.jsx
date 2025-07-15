import React, { useEffect, useState } from 'react';
import { isElectron } from '../utils/electron';

const UpdateBanner = () => {
  const [updateAvailable, setUpdateAvailable] = useState(false);
  const [downloadProgress, setDownloadProgress] = useState(0);
  const [downloadReady, setDownloadReady] = useState(false);
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
        // const local = await window.appVersion.get();
        const local = window?.appVersion?.get
          ? await window.appVersion.get()
          : '0.0.0';

        setLatestVersion(latest);
        setCurrentVersion(local);
      } catch (error) {
        console.error('Error checking update:', error);
      }
    };

    checkForUpdate();

    if (isElectron()) {
      window.electronAPI.receive('update-available', () => {
        setUpdateAvailable(true);
      });

      window.electronAPI.receive('download-progress', (progress) => {
        setDownloadProgress(Math.round(progress.percent));
      });

      window.electronAPI.receive('update-downloaded', () => {
        setDownloadReady(true);
      });
    }
  }, []);

  if (!updateAvailable) return null;

  return (
    <div style={styles.banner}>
      {downloadReady ? (
        <>
          ✅ Update downloaded!
          <br />
          <button onClick={() => window.electronAPI.installUpdate()}>
            🔁 Restart and Install
          </button>
        </>
      ) : (
        <>
          🔔 A new version ({latestVersion}) is available! You are using{' '}
          {currentVersion}.
          <br />
          🔄 Update version downloading...
          <br />
          📥 Download Progress: {downloadProgress}%
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
};

export default UpdateBanner;
