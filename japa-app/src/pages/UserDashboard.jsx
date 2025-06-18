import React, { useEffect, useState } from "react";
import axios from "../utils/axios";
import ButtonLink from "../components/ButtonLink";

const UserDashboard = ({ setUser }) => {
  const [records, setRecords] = useState([]);


  
  // useEffect(() => {
  //   const fetchRecords = async () => {
  //     try {
  //       const res = await axios.get("/api/rounds/history");
  //       setRecords(res.data);
  //     } catch (error) {
  //       console.error("Error fetching records:", error);
  //     }
  //   };

  //   fetchRecords();
  // }, []);

  useEffect(() => {
    const fetchRecords = async () => {
      try {
        const res = await axios.get("/rounds/history");
        setRecords(res.data);
      } catch (error) {
        console.error("Error fetching records:", error);
      }
    };

    fetchRecords();
  }, []);

  return (
    <div style={styles.container}>
      <h2 style={styles.title}>📜 Your Past Japa Records</h2>

      <ButtonLink />

      <div style={styles.tableWrapper}>
        <table style={styles.table}>
          <thead>
            <tr>
              <th style={styles.th}>📅 Date</th>
              <th style={styles.th}>🔁 Rounds</th>
              <th style={styles.th}>⏱ Time Spent (min)</th>
            </tr>
          </thead>
          <tbody>
            {records.length > 0 ? (
              records.map((rec) => (
                <tr key={rec._id} style={styles.tr}>
                  <td style={styles.td}>
                    {new Date(rec.date).toLocaleDateString()}
                  </td>
                  <td style={styles.td}>{rec.roundCount}</td>
                  <td style={styles.td}>{Math.round(rec.duration / 60)}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan="3" style={styles.noData}>
                  No records found.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
};


const styles = {
  container: {
    padding: "40px",
    maxWidth: "800px",
    margin: "0 auto",
    fontFamily: "Arial, sans-serif",
    backgroundColor: "#f8f9fa",
    borderRadius: "10px",
    boxShadow: "0 0 10px rgba(0,0,0,0.1)",
  },
  title: {
    textAlign: "center",
    marginBottom: "30px",
    color: "#333",
  },
  button: {
    // display: "block",
    padding: "10px 20px",
    fontSize: "16px",
    fontWeight: "600",
    borderRadius: "8px",
    border: "none",
    cursor: "pointer",
    backgroundColor: "#007bff",
    color: "white",
    boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
    transition: "background-color 0.3s ease",
  },
  tableWrapper: {
    overflowX: "auto",
  },
  table: {
    width: "100%",
    borderCollapse: "collapse",
    backgroundColor: "#ffffff",
    borderRadius: "8px",
    overflow: "hidden",
  },
  th: {
    backgroundColor: "#007bff",
    color: "#fff",
    padding: "12px",
    textAlign: "left",
  },
  td: {
    padding: "12px",
    borderBottom: "1px solid #ddd",
  },
  tr: {
    transition: "background-color 0.2s",
  },
  noData: {
    padding: "20px",
    textAlign: "center",
    color: "#777",
  },
};


export default UserDashboard;
