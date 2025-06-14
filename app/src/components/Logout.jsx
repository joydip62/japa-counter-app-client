import React from "react";
import { useNavigate } from "react-router-dom";

const LogoutButton = () => {
  const navigate = useNavigate();

  const handleLogout = () => {
    // Remove token and any user data
    localStorage.removeItem("token");
    localStorage.removeItem("user"); 
    localStorage.removeItem("role"); 
    localStorage.removeItem("email"); 
    navigate('/login');
  };

  return (
    <button onClick={handleLogout} style={logoutStyle}>
      🚪 Logout
    </button>
  );
};

const logoutStyle = {
  padding: "10px 20px",
  fontSize: "16px",
  fontWeight: "600",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#dc3545",
  color: "white",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  transition: "background-color 0.3s ease",
};

export default LogoutButton;
