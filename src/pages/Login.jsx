import React from "react";
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "../utils/axios";

export default function Login({ setUser }) {
  const [form, setForm] = useState({ email: "", password: "" });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  // const handleChange = (e) => {
  //   setForm({ ...form, [e.target.name]: e.target.value });
  // };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await axios.post("/auth/login", form);
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("email", res.data.email);
      // setUser(res.data);
      setUser({ token: res.data.token, role: res.data.role });

      if (res.data.role === "admin") {
        setForm({ email: "", password: "" });
        navigate("/admin-dashboard");
      } else {
        setForm({ email: "", password: "" });
        navigate("/user-dashboard");
      }
    } catch (err) {
      console.error("Login error:", err);
      alert(err.response?.data?.error || "Login failed");
    } finally {
      setLoading(false);
    }
  };
  // const handleSubmit = async (e) => {
  //   e.preventDefault();
  //   setLoading(true);
  //   try {
  //     const res = await axios.post("/auth/login", form);
  //     localStorage.setItem("token", res.data.token);
  //     localStorage.setItem("role", res.data.role); // assuming you send role from backend
  //     if (res.data.role === "admin") {
  //       setForm({ email: "", password: "" });
  //       navigate("/admin");
  //     } else {
  //       setForm({ email: "", password: "" });
  //       navigate("/user-dashboard");
  //     }
  //   } catch (err) {
  //     console.error("Login error:", err); // 🧠 add this
  //     alert(err.response?.data?.error || "Login failed");
  //   } finally {
  //     setLoading(false);
  //   }
  // };

  return (
    <div style={containerStyle}>
      <form onSubmit={handleSubmit} style={formStyle}>
        <h2 style={{ marginBottom: "20px", color: "#222" }}>Login</h2>

        <input
          name="email"
          type="email"
          placeholder="Email"
          value={form.email}
          onChange={(e) => setForm({ ...form, email: e.target.value })}
          required
          style={inputStyle}
        />
        <input
          name="password"
          type="password"
          placeholder="Password"
          value={form.password}
          onChange={(e) => setForm({ ...form, password: e.target.value })}
          required
          style={inputStyle}
        />
        <button type="submit" disabled={loading} style={buttonStyle}>
          {loading ? "Logging in..." : "Login"}
        </button>

        <div style={{ marginTop: "15px", fontSize: "0.9rem", color: "#555" }}>
          Don’t have an account?{" "}
          <Link to="/register" style={linkStyle}>
            Register here
          </Link>
        </div>
      </form>
    </div>
  );
}

const containerStyle = {
  height: "100vh",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  backgroundColor: "#f5f7fa",
  fontFamily: "'Segoe UI', Tahoma, Geneva, Verdana, sans-serif",
};

const formStyle = {
  display: "flex",
  flexDirection: "column",
  width: "320px",
  padding: "30px",
  borderRadius: "12px",
  backgroundColor: "#fff",
  boxShadow: "0 4px 20px rgba(0,0,0,0.1)",
};

const inputStyle = {
  padding: "12px 15px",
  marginBottom: "15px",
  fontSize: "1rem",
  borderRadius: "8px",
  border: "1px solid #ccc",
  outline: "none",
  transition: "border-color 0.3s",
};

const buttonStyle = {
  padding: "12px 0",
  fontSize: "1.1rem",
  fontWeight: "600",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "#fff",
  boxShadow: "0 4px 10px rgba(0,123,255,0.4)",
  transition: "background-color 0.3s ease",
};

const linkStyle = {
  color: "#007bff",
  textDecoration: "none",
  fontWeight: "500",
};
