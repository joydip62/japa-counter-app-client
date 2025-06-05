// // src/utils/axios.js
// import axios from "axios";

// const instance = axios.create({
//   baseURL: "http://localhost:5000/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });

// // Add token to every request
// instance.interceptors.request.use((config) => {
//   const token = localStorage.getItem("token");
//   if (token) {
//     config.headers.Authorization = `Bearer ${token}`;
//   }
//   return config;
// });

// export default instance;
import axios from "axios";

const instance = axios.create({
  baseURL: (`${process.env.REACT_APP_API_URL}/api`),
  headers: {
    "Content-Type": "application/json",
  },
});
// const instance = axios.create({
//   baseURL:
//     process.env.NODE_ENV === "production"
//       ? "https://japa-count-app.onrender.com/api" // or use an env var like import.meta.env.VITE_API_URL
//       : "https://japa-count-app.onrender.com/api",
//   headers: {
//     "Content-Type": "application/json",
//   },
// });


instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");

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
