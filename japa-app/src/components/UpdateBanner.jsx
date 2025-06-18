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

        const latest = data.tag_name.replace(/^v/, ''); // remove 'v' prefix
        const local = await window.appVersion.get();

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
  }, []);

  if (!isUpdateAvailable) return null;

  return (
    <div style={styles.banner}>
      🔔 A new version ({latestVersion}) is available! You are using{' '}
      {currentVersion}.
      <br />
      👉 Please visit{' '}
      <a
        href="https://github.com/joydip62/japa-counter-app-client/releases/latest"
        target="_blank"
        rel="noopener noreferrer"
        style={styles.link}
      >
        this page
      </a>{' '}
      to download the latest version.
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
  link: {
    textDecoration: 'underline',
    color: '#0000ee',
  },
};

export default UpdateBanner;
