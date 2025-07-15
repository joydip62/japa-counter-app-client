// src/pages/ResetRedirect.jsx

import { useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';

export default function ResetRedirect() {
  const [searchParams] = useSearchParams();
  const token = searchParams.get('token');

  useEffect(() => {
    if (token) {
      window.location.href = `japa://reset-password?token=${token}`;
    }
  }, [token]);

  return (
    <div style={{ padding: '40px', textAlign: 'center' }}>
      <h2>Redirecting you to the app…</h2>
      <p>If nothing happens, make sure the Japa app is installed.</p>
      <p>
        Or copy this link into your browser: <br />
        <code>japa://reset-password?token={token}</code>
      </p>
    </div>
  );
}
