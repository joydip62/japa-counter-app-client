
import axios from "axios";

const instance = axios.create({
  baseURL:
    process.env.NODE_ENV === "production"
      ? "https://japa-count-app.onrender.com/api" 
      : "https://japa-count-app.onrender.com/api",
  headers: {
    "Content-Type": "application/json",
  },
});


instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
    // console.log('Sending request to:', config.url);
    // console.log('Token in header:', token);

  // Do not attach token for login or register requests
  if (
    token &&
    !config.url.includes("/auth/login") &&
    !config.url.includes("/auth/register")
  ) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default instance;
