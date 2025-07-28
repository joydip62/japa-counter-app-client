import { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const AutoLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    const loginTime = localStorage.getItem('loginTime');

    const logoutUser = () => {
      // Clear storage
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      localStorage.removeItem('role');
      localStorage.removeItem('email');
      localStorage.removeItem('loginTime');

      // Notify Electron to restore/focus the app
      if (window.electronAPI) {
        window.electronAPI.send('force-logout-focus');
      }

      // Navigate to login
      navigate('/login');
    };

    if (loginTime) {
      const loginDate = new Date(Number(loginTime)).toDateString();
      const currentDate = new Date().toDateString();

      if (loginDate !== currentDate) {
        logoutUser();
      } else {
        const timeout = 12 * 60 * 60 * 1000;
        const now = Date.now();
        const diff = now - Number(loginTime);
        const remaining = timeout - diff;

        if (remaining <= 0) {
          logoutUser();
        } else {
          const timer = setTimeout(logoutUser, remaining);
          return () => clearTimeout(timer);
        }
      }
    }
  }, [navigate]);

  return null;
};

export default AutoLogout;

// import { useEffect } from 'react';
// import { useNavigate } from 'react-router-dom';

// const AutoLogout = ({ timeout = 7 * 60 * 60 * 1000 }) => {
//   const navigate = useNavigate();

//   useEffect(() => {
//     const loginTime = localStorage.getItem('loginTime');

//     const logoutUser = () => {
//       localStorage.removeItem('token');
//       localStorage.removeItem('user');
//       localStorage.removeItem('role');
//       localStorage.removeItem('email');
//       localStorage.removeItem('loginTime');
//       navigate('/login');
//     };

//     if (loginTime) {
//       const now = Date.now();
//       const diff = now - Number(loginTime);

//       if (diff >= timeout) {
//         logoutUser();
//       } else {
//         const remaining = timeout - diff;
//         const timer = setTimeout(logoutUser, remaining);
//         return () => clearTimeout(timer); // cleanup
//       }
//     }
//   }, [navigate, timeout]);

//   return null;
// };

// export default AutoLogout;
