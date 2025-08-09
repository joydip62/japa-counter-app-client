import React, { useEffect, useState } from 'react';
import axios from 'axios';
import LogoutButton from '../components/Logout';

const AdminDashboard = () => {
  const [users, setUsers] = useState([]);
  const [rounds, setRounds] = useState([]);
  const [loading, setLoading] = useState(true);

  const [userPage, setUserPage] = useState(1);
  const [roundPage, setRoundPage] = useState(1);
  const itemsPerPage = 5;

  const [searchTerm, setSearchTerm] = useState('');
  const [dateFrom, setDateFrom] = useState('');
  const [dateTo, setDateTo] = useState('');



  const token = localStorage.getItem('token');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [usersRes, roundsRes] = await Promise.all([
          axios.get('http://localhost:5000/api/admin/users', {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get('http://localhost:5000/api/admin/rounds', {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);
        setUsers(usersRes.data);
        setRounds(roundsRes.data);
        setLoading(false);
      } catch (err) {
        console.error('Error fetching admin data:', err);
      }
    };

    fetchData();
  }, []);

  const changeRole = async (id, newRole) => {
    try {
      const res = await axios.put(
        `http://localhost:5000/api/admin/user/${id}/role`,
        { role: newRole },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setUsers(users.map((u) => (u._id === id ? res.data : u)));
    } catch (err) {
      console.error('Role update failed:', err);
    }
  };

  // Pagination logic
  const paginatedUsers = users.slice(
    (userPage - 1) * itemsPerPage,
    userPage * itemsPerPage
  );

  // const filteredRounds = rounds.filter((r) => {
  //   const email = r.userId?.email?.toLowerCase() || '';

  //   // Normalize date to YYYY-MM-DD by stripping time
  //   const recordDate = new Date(r.date);
  //   recordDate.setHours(0, 0, 0, 0);

  //   const fromDate = dateFrom ? new Date(dateFrom) : null;
  //   const toDate = dateTo ? new Date(dateTo) : null;

  //   if (fromDate) fromDate.setHours(0, 0, 0, 0);
  //   if (toDate) toDate.setHours(0, 0, 0, 0);

  //   const matchesSearch = email.includes(searchTerm.toLowerCase());
  //   const inRange =
  //     (!fromDate || recordDate >= fromDate) &&
  //     (!toDate || recordDate <= toDate);

  //   return matchesSearch && inRange;
  // });

  const filteredRounds = rounds
    .filter((r) => {
      const email = r.userId?.email?.toLowerCase() || '';

      const recordDate = new Date(r.date);
      recordDate.setHours(0, 0, 0, 0);

      const fromDate = dateFrom ? new Date(dateFrom) : null;
      const toDate = dateTo ? new Date(dateTo) : null;

      if (fromDate) fromDate.setHours(0, 0, 0, 0);
      if (toDate) toDate.setHours(0, 0, 0, 0);

      const matchesSearch = email.includes(searchTerm.toLowerCase());
      const inRange =
        (!fromDate || recordDate >= fromDate) &&
        (!toDate || recordDate <= toDate);

      return matchesSearch && inRange;
    })

    // 🔽 Sort by date descending (latest first)
    .sort((a, b) => new Date(b.date) - new Date(a.date));

  const paginatedRounds = filteredRounds.slice(
    (roundPage - 1) * itemsPerPage,
    roundPage * itemsPerPage
  );

  const totalRoundPages = Math.ceil(filteredRounds.length / itemsPerPage);
  const totalUserPages = Math.ceil(users.length / itemsPerPage);

  // search
  const handleExport = () => {
    const header = ['User Email', 'Date', 'Rounds', 'Duration (hh:mm:ss)'];
    const rows = filteredRounds.map((r) => {
      const hours = String(Math.floor(r.duration / 3600)).padStart(2, '0');
      const minutes = String(Math.floor((r.duration % 3600) / 60)).padStart(
        2,
        '0'
      );
      const seconds = String(r.duration % 60).padStart(2, '0');
      const formattedDuration = `${hours}:${minutes}:${seconds}`;

      return [
        r.userId?.email || 'Unknown',
        new Date(r.date).toLocaleDateString(),
        r.roundCount,
        formattedDuration,
      ];
    });

    const csv = [header, ...rows].map((row) => row.join(',')).join('\n');
    const blob = new Blob([csv], { type: 'text/csv' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'japa-records.csv';
    link.click();
    URL.revokeObjectURL(url);
  };

  const styles = {
    container: {
      padding: '20px',
      textAlign: 'center',
    },
    heading: {
      fontSize: '24px',
      marginBottom: '10px',
    },
    table: {
      width: '100%',
      borderCollapse: 'collapse',
      marginBottom: '20px',
    },
    th: {
      border: '1px solid #ccc',
      padding: '8px',
      background: 'inherit',
      color: 'inherit',
    },
    td: {
      border: '1px solid #ccc',
      padding: '8px',
    },
    buttonContainer: {
      display: 'flex',
      justifyContent: 'center',
      gap: '10px',
      marginTop: '10px',
    },
    roleButton: (role) => ({
      padding: '6px 10px',
      border: 'none',
      cursor: 'pointer',
      color: role === 'admin' ? 'white' : 'white',
      backgroundColor: role === 'admin' ? '#d9534f' : '#5cb85c',
      borderRadius: '4px',
    }),
    paginationBtn: {
      padding: '4px 8px',
      margin: '0 4px',
      border: '1px solid #ccc',
      cursor: 'pointer',
      background: 'inherit',
      color: 'inherit',
    },
  };

  // if (loading) return <div style={{ padding: '20px' }}>Loading...</div>;
   if (loading)
     return (
       <div
         style={{
           height: '100vh',
           display: 'flex',
           justifyContent: 'center',
           alignItems: 'center',
           background: '#f7f9fc',
           flexDirection: 'column',
           fontFamily: 'Arial, sans-serif',
         }}
       >
         <div className="spinner" />
         <p
           style={{
             marginTop: '20px',
             fontSize: '18px',
             color: '#333',
           }}
         >
           Checking authentication...
         </p>
       </div>
     );

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>Admin Dashboard</h2>
      <LogoutButton />

      {/* Users Section */}
      <section>
        <h3>Users</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>Email</th>
              <th style={styles.th}>Role</th>
              <th style={styles.th}>Change Role</th>
            </tr>
          </thead>
          <tbody>
            {paginatedUsers.map((u) => (
              <tr key={u._id}>
                <td style={styles.td}>{u.email}</td>
                <td style={styles.td}>{u.role}</td>
                <td style={styles.td}>
                  <button
                    style={styles.roleButton(u.role)}
                    onClick={() =>
                      changeRole(u._id, u.role === 'admin' ? 'user' : 'admin')
                    }
                  >
                    {u.role === 'admin' ? 'Demote to User' : 'Promote to Admin'}
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={styles.buttonContainer}>
          <button
            style={styles.paginationBtn}
            disabled={userPage === 1}
            onClick={() => setUserPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span>
            Page {userPage} of {totalUserPages}
          </span>
          <button
            style={styles.paginationBtn}
            disabled={userPage === totalUserPages}
            onClick={() => setUserPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </section>

      {/* Rounds Section */}
      {/* --- Filters & Export for Japa Records --- */}
      <div style={{ marginTop: '40px' }}>
        <h3>Filter Japa Records</h3>
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '10px',
            marginBottom: '20px',
          }}
        >
          <input
            type="text"
            placeholder="Search by email"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            style={{
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            style={{
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            style={{
              padding: '6px',
              border: '1px solid #ccc',
              borderRadius: '4px',
            }}
          />
          <button
            onClick={() => {
              setDateFrom('');
              setDateTo('');
            }}
            style={{ marginLeft: '10px' }}
          >
            Clear Filter
          </button>
          <button
            onClick={handleExport}
            style={{
              padding: '6px 10px',
              background: '#3498db',
              color: '#fff',
              border: 'none',
              borderRadius: '4px',
              cursor: 'pointer',
            }}
          >
            Export to Excel
          </button>
        </div>
      </div>

      <section>
        <h3>Japa Records</h3>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>User Email</th>
              <th style={styles.th}>Date</th>
              <th style={styles.th}>Rounds</th>
              <th style={styles.th}>Duration (hh:mm:ss)</th>
            </tr>
          </thead>
          <tbody>
            {paginatedRounds.map((r) => (
              <tr key={r._id}>
                <td style={styles.td}>{r.userId?.email || 'Unknown'}</td>
                <td style={styles.td}>
                  {new Date(r.date).toLocaleDateString()}
                </td>
                <td style={styles.td}>{r.roundCount}</td>
                <td style={styles.td}>
                  {String(Math.floor(r.duration / 3600)).padStart(2, '0')}:
                  {String(Math.floor((r.duration % 3600) / 60)).padStart(
                    2,
                    '0'
                  )}
                  :{String(r.duration % 60).padStart(2, '0')}
                </td>
              </tr>
            ))}
          </tbody>
        </table>

        {/* Pagination */}
        <div style={styles.buttonContainer}>
          <button
            style={styles.paginationBtn}
            disabled={roundPage === 1}
            onClick={() => setRoundPage((prev) => prev - 1)}
          >
            Previous
          </button>
          <span>
            Page {roundPage} of {totalRoundPages}
          </span>
          <button
            style={styles.paginationBtn}
            disabled={roundPage === totalRoundPages}
            onClick={() => setRoundPage((prev) => prev + 1)}
          >
            Next
          </button>
        </div>
      </section>
    </div>
  );
};

export default AdminDashboard;
