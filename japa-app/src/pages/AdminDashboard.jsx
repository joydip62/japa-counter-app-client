import React from "react";

export default function AdminDashboard() {
  return (
    <div style={styles.container}>
      <h2>Admin Dashboard</h2>
      <p>
        This section will display all users’ stats and filters (daily, weekly,
        monthly).
      </p>
    </div>
  );
}

const styles = {
  container: {
    textAlign: "center",
    padding: "50px",
    fontFamily: "Arial, sans-serif",
  },
};
