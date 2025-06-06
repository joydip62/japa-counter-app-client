// import React, { useState, useEffect } from "react";
// import axios from "axios";

// const Countdown = () => {
//   const [count, setCount] = useState(0);
//   const [round, setRound] = useState(0);
//   const [startTime, setStartTime] = useState(null);

//   useEffect(() => {
//     const handleKeyDown = (e) => {
//       if (e.code === "ArrowUp") handleIncrement();
//       if (e.code === "ArrowDown") handleDecrement();
//       if (e.code === "Space") handleReset();
//     };

//     window.addEventListener("keydown", handleKeyDown);
//     return () => window.removeEventListener("keydown", handleKeyDown);
//   }, [count]);

//   const handleIncrement = () => {
//     if (count === 0) setStartTime(Date.now());
//     const newCount = count + 1;
//     setCount(newCount);

//     if (newCount === 108) {
//       const endTime = Date.now();
//       const duration = Math.floor((endTime - startTime) / 1000);
//       saveRound(round + 1, startTime, endTime, duration);
//       setRound((prev) => prev + 1);
//       setCount(0);
//       setStartTime(null);
//       if (window.electronAPI) {
//         window.electronAPI.showRoundCompletePopup();
//       } else {
//         alert("🎉 Round Complete!");
//       }
//     }
//   };

//   const handleDecrement = () => {
//     if (count > 0) setCount(count - 1);
//   };

//   const handleReset = () => {
//     setCount(0);
//     setStartTime(null);
//   };

//   const saveRound = async (roundNumber, start, end, duration) => {
//     try {
//       const token = localStorage.getItem("token");
//       await axios.post(
//         "/rounds",
//         {
//           roundNumber,
//           startTime: new Date(start),
//           endTime: new Date(end),
//           durationSeconds: duration,
//         },
//         { headers: { Authorization: `Bearer ${token}` } }
//       );
//     } catch (err) {
//       console.error("Error saving round", err);
//     }
//   };

//   return (
//     <div style={{ textAlign: "center", paddingTop: 50 }}>
//       <h1>🔢 Count: {count}</h1>
//       <h2>🔁 Rounds: {round}</h2>
//       <div style={{ marginTop: 20 }}>
//         <button onClick={handleIncrement}>➕ Increment (↑)</button>
//         <button onClick={handleDecrement}>➖ Decrement (↓)</button>
//         <button onClick={handleReset}>🔄 Reset (Space)</button>
//       </div>
//     </div>
//   );
// };

// export default Countdown;
