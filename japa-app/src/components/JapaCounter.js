// import { useEffect, useRef, useState } from "react";
// import { jwtDecode } from "jwt-decode";
// import axios from "../utils/axios";
// import { useNavigate } from "react-router-dom";


// export default function JapaCounter() {
//   const [count, setCount] = useState(0);
//   const [round, setRound] = useState(0);
//   const [darkMode, setDarkMode] = useState(false);
//   const [startTime, setStartTime] = useState(null);
//   const [lastRoundDuration, setLastRoundDuration] = useState(null);
//   const [roundDurations, setRoundDurations] = useState([]);
//   const navigate = useNavigate();


//   const [dailyData, setDailyData] = useState(
//     JSON.parse(localStorage.getItem("dailyJapaData")) || {
//       date: new Date().toLocaleDateString(),
//       totalCount: 0,
//       totalDuration: 0,
//     }
//   );

//   const [submittedToday, setSubmittedToday] = useState(() => {
//     return (
//       localStorage.getItem("submittedToday") === new Date().toLocaleDateString()
//     );
//   });

//   const countRef = useRef(0);
//   const startTimeRef = useRef(null);

//   const formatDuration = (ms) => {
//     const minutes = Math.floor(ms / 60000);
//     const seconds = Math.floor((ms % 60000) / 1000);
//     return `${minutes}m ${seconds}s`;
//   };

//   const increment = () => {
//     countRef.current += 1;

//     if (countRef.current === 1 && !startTimeRef.current) {
//       const now = Date.now();
//       startTimeRef.current = now;
//       setStartTime(now);
//     }

//     setCount((prev) => {
//       const newCount = prev + 1;

//       if (newCount === 108) {
//         setRound((r) => r + 1);

//         if (startTimeRef.current) {
//           const duration = Date.now() - startTimeRef.current;
//           setLastRoundDuration(formatDuration(duration));
//           setRoundDurations((prev) => [...prev, duration]);

//           const updatedDaily = {
//             ...dailyData,
//             totalCount: dailyData.totalCount + 108,
//             totalDuration: dailyData.totalDuration + duration,
//           };

//           setDailyData(updatedDaily);
//           localStorage.setItem("dailyJapaData", JSON.stringify(updatedDaily));
//         }

//         startTimeRef.current = null;
//         setStartTime(null);
//         countRef.current = 0;
//         return 0;
//       }

//       return newCount;
//     });
//   };

//   const decrement = () => {
//     countRef.current = Math.max(countRef.current - 1, 0);
//     setCount((prev) => (prev > 0 ? prev - 1 : 0));
//   };

//   const reset = () => {
//     countRef.current = 0;
//     setCount(0);
//     setRound(0);
//     setStartTime(null);
//     setLastRoundDuration(null);
//     setRoundDurations([]);
//   };

//   const toggleTheme = () => setDarkMode(!darkMode);

//   // const getUserIdFromToken = () => {
//   //   const token = localStorage.getItem("token");
//   //   if (!token) return null;

//   //   try {
//   //     const decoded = jwtDecode(token);
//   //     return decoded.userId || decoded._id;
//   //   } catch (error) {
//   //     console.error("Invalid token:", error);
//   //     return null;
//   //   }
//   // };

//   // const handleSubmitDayData = async () => {
//   //   if (submittedToday) return alert("Already submitted today's data.");

//   //   const userId = getUserIdFromToken();
//   //   if (!userId) return alert("User not authenticated.");

//   //   const dailyDataToSend = {
//   //     userId,
//   //     date: new Date().toISOString(),
//   //     roundCount: dailyData.totalCount / 108,
//   //     duration: Math.floor(dailyData.totalDuration / 1000),
//   //   };

//   //   try {
//   //     await axios.post("/api/rounds/daily", dailyDataToSend, {
//   //       headers: {
//   //         Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //       },
//   //     });
//   //     // const res = await axios.post("/rounds/daily", dailyDataToSend, {
//   //     //   headers: {
//   //     //     Authorization: `Bearer ${localStorage.getItem("token")}`,
//   //     //   },
//   //     // });

//   //     alert("Daily data submitted successfully.");
//   //     setSubmittedToday(true);
//   //     localStorage.setItem("submittedToday", new Date().toLocaleDateString());
//   //   } catch (error) {
//   //     console.error("Submit error:", error);
//   //     alert("Failed to submit daily data.");
//   //   }
//   // };

//   // useEffect(() => {
//   //   window.electronAPI?.onIncrement(() => {
//   //     console.log("F7 Shortcut Triggered");
//   //     increment();
//   //   });

//   //   window.electronAPI?.onDecrement(() => {
//   //     console.log("F8 Shortcut Triggered");
//   //     decrement();
//   //   });

//   //   window.electronAPI?.onReset(() => {
//   //     console.log("F9 Shortcut Triggered");
//   //     reset();
//   //   });

//   //   return () => {
//   //     window.electronAPI?.removeAllListeners();
//   //   };
//   // }, []);

//   const handleSubmitDayData = async () => {
//     if (submittedToday) return alert("Already submitted today's data.");

//     const dailyDataToSend = {
//       date: new Date().toISOString(),
//       roundCount: dailyData.totalCount / 108,
//       duration: Math.floor(dailyData.totalDuration / 1000),
//     };

//     try {
//       await axios.post("/rounds/daily", dailyDataToSend);
//       alert(
//         `Today you completed ${
//           dailyDataToSend.roundCount
//         } rounds and spent ${Math.floor(
//           dailyDataToSend.duration / 60
//         )} minutes.`
//       );
//       setSubmittedToday(true);
//       localStorage.setItem("submittedToday", new Date().toLocaleDateString());
//     } catch (error) {
//       console.error("❌ Submit error:", error);
//       alert("Failed to submit daily data.");
//     }
//   };

//   useEffect(() => {
//     const today = new Date().toLocaleDateString();
//     const storedDate = localStorage.getItem("submittedToday");
//     if (storedDate === today) {
//       setSubmittedToday(true);
//       alert("You already submitted your Japa today.");
//     }

//     // Restore today's count/duration
//     const savedDaily = JSON.parse(localStorage.getItem("dailyJapaData"));
//     if (savedDaily && savedDaily.date === today) {
//       setDailyData(savedDaily);
//     }

//     window.electronAPI?.onIncrement(() => increment());
//     window.electronAPI?.onDecrement(() => decrement());
//     window.electronAPI?.onReset(() => reset());

//     return () => window.electronAPI?.removeAllListeners();
//   }, []);

//   const themeStyles = {
//     backgroundColor: darkMode ? "#111" : "#f0f0f0",
//     color: darkMode ? "#fff" : "#333",
//   };

//   return (
//     <div
//       style={{
//         height: "100vh",
//         ...themeStyles,
//         display: "flex",
//         flexDirection: "column",
//         justifyContent: "center",
//         alignItems: "center",
//         fontFamily: "Arial, sans-serif",
//         padding: "20px",
//       }}
//     >
//       <h1>Japa Count App</h1>

//       <button
//         onClick={() => navigate("/dashboard")}
//         style={{ marginTop: "20px" }}
//       >
//         Go to Dashboard
//       </button>

//       <div
//         style={{
//           fontSize: "5rem",
//           marginBottom: "20px",
//           fontWeight: "bold",
//           color: themeStyles.color,
//         }}
//       >
//         {count}
//       </div>

//       <div style={{ fontSize: "2rem", marginBottom: "10px" }}>
//         Round: {round}
//       </div>

//       {lastRoundDuration && (
//         <div style={{ marginBottom: "20px", fontSize: "1.2rem" }}>
//           Last Round Time: {lastRoundDuration}
//         </div>
//       )}

//       <div style={{ display: "flex", gap: "15px", marginBottom: "20px" }}>
//         <button onClick={increment} style={buttonStyle} title="F7">
//           Increment
//         </button>
//         <button onClick={decrement} style={buttonStyle} title="F8">
//           Decrement
//         </button>
//         <button onClick={reset} style={buttonStyle} title="F9">
//           Reset
//         </button>
//       </div>

//       <button
//         onClick={toggleTheme}
//         style={{ ...buttonStyle, backgroundColor: darkMode ? "#444" : "#222" }}
//       >
//         Toggle {darkMode ? "Light" : "Dark"} Mode
//       </button>

//       <div
//         style={{
//           marginTop: "30px",
//           fontSize: "1rem",
//           color: darkMode ? "#aaa" : "#666",
//         }}
//       >
//         Shortcut keys: F7 (Increment), F8 (Decrement), F9 (Reset)
//       </div>

//       {roundDurations.length > 0 && (
//         <div style={{ marginTop: "40px", width: "100%", maxWidth: "500px" }}>
//           <h2 style={{ fontSize: "1.5rem", marginBottom: "10px" }}>
//             Round Durations
//           </h2>
//           <table style={{ width: "100%", borderCollapse: "collapse" }}>
//             <thead>
//               <tr style={{ backgroundColor: darkMode ? "#444" : "#ccc" }}>
//                 <th style={{ border: "1px solid #999", padding: "8px" }}>
//                   Round
//                 </th>
//                 <th style={{ border: "1px solid #999", padding: "8px" }}>
//                   Duration
//                 </th>
//               </tr>
//             </thead>
//             <tbody>
//               {roundDurations.map((ms, index) => (
//                 <tr key={index}>
//                   <td
//                     style={{
//                       border: "1px solid #999",
//                       padding: "8px",
//                       textAlign: "center",
//                     }}
//                   >
//                     {index + 1}
//                   </td>
//                   <td
//                     style={{
//                       border: "1px solid #999",
//                       padding: "8px",
//                       textAlign: "center",
//                     }}
//                   >
//                     {formatDuration(ms)}
//                   </td>
//                 </tr>
//               ))}
//             </tbody>
//           </table>
//         </div>
//       )}

//       <button
//         onClick={handleSubmitDayData}
//         style={{ ...buttonStyle, backgroundColor: "green", marginTop: "20px" }}
//       >
//         Submit Daily Data
//       </button>
//     </div>
//   );
// }

// const buttonStyle = {
//   padding: "12px 25px",
//   fontSize: "1.1rem",
//   fontWeight: "600",
//   borderRadius: "8px",
//   border: "none",
//   cursor: "pointer",
//   backgroundColor: "#007bff",
//   color: "white",
//   boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
//   transition: "background-color 0.3s ease",
// };
