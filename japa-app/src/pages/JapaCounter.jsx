import { useEffect, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import ShortcutDisplay from "../components/ShortcutDisplay";
import axios from "../utils/axios";
import NavButton from "../components/NavButton";

export default function JapaCounter({ setUser }) {
  const [count, setCount] = useState(0);
  const [round, setRound] = useState(0);
  const [rounds, setRounds] = useState([]);
  const loggedInUserEmail = localStorage.getItem("email");

  const [lastRoundDuration, setLastRoundDuration] = useState(null);
  const navigate = useNavigate();

  const [dailyData, setDailyData] = useState(
    JSON.parse(localStorage.getItem("dailyJapaData")) || {
      date: new Date().toLocaleDateString(),
      totalCount: 0,
      totalDuration: 0,
    }
  );

  const [submittedToday, setSubmittedToday] = useState(false);

  useEffect(() => {
    const checkSubmission = async () => {
      try {
        const token = localStorage.getItem("token");
        const res = await axios.get("/rounds/check-today", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        setSubmittedToday(res.data.submitted);
      } catch (error) {
        console.error("Error checking today's submission:", error);
      }
    };

    checkSubmission();
  }, []);

  const roundStartTimeRef = useRef(null);

  // const increment = () => {
  //   const today = new Date().toLocaleDateString();
  //   const email = loggedInUserEmail;
  //   const dailyKey = `dailyJapaData_${email}`;

  //   setDailyData((prev) => {
  //     const newCount = prev.totalCount + 1;

  //     let newDuration = prev.totalDuration;

  //     if (newCount % 108 === 1 || roundStartTimeRef.current === null) {
  //       roundStartTimeRef.current = Date.now();
  //     }
  //     if (newCount % 108 === 0 && roundStartTimeRef.current) {
  //       const roundDuration = Math.floor(
  //         (Date.now() - roundStartTimeRef.current) / 1000
  //       ); // ✅ fixed
  //       newDuration += roundDuration;

  //       const newRound = {
  //         date: today,
  //         email,
  //         roundCount: 1,
  //         duration: roundDuration,
  //       };

  //       const roundsKey = `japaRounds_${email}`;
  //       const allRounds = JSON.parse(localStorage.getItem(roundsKey)) || [];
  //       allRounds.push(newRound);
  //       localStorage.setItem(roundsKey, JSON.stringify(allRounds));

  //       setRounds(allRounds);

  //       const todaysRounds = allRounds.filter(
  //         (r) => r.date === today && r.email === loggedInUserEmail
  //       );
  //       setRound(todaysRounds.length);

  //       const last = todaysRounds[todaysRounds.length - 1];
  //       const minutes = Math.floor(last.duration / 60);
  //       const seconds = last.duration % 60;
  //       setLastRoundDuration(`${minutes}m ${seconds}s`);

  //       roundStartTimeRef.current = null;
  //     }

  //     const updated = {
  //       ...prev,
  //       email,
  //       totalCount: newCount,
  //       totalDuration: newDuration,
  //       date: today,
  //     };

      
  //     localStorage.setItem(dailyKey, JSON.stringify(updated));
  //     return updated;
  //   });
  // };

  // const decrement = () => {
  //   const email = loggedInUserEmail;
  //   const dailyKey = `dailyJapaData_${email}`;

  //   setDailyData((prev) => {
  //     if (!prev || prev.totalCount <= 0) return prev;

  //     if (prev.totalCount % 108 === 0) return prev;

  //     const updated = {
  //       ...prev,
  //       email,
  //       totalCount: prev.totalCount - 1,
  //     };

  //     localStorage.setItem(dailyKey, JSON.stringify(updated));
  //     return updated;
  //   });
  // };

  // const reset = () => {
  //   const today = new Date().toLocaleDateString();
  //   const email = loggedInUserEmail;
  //   const dailyKey = `dailyJapaData_${email}`;

  //   const resetData = {
  //     date: today,
  //     email,
  //     totalCount: 0,
  //     totalDuration: 0,
  //   };

  //   setDailyData(resetData);
  //   localStorage.setItem(dailyKey, JSON.stringify(resetData));
  //   roundStartTimeRef.current = null;
  // };


  const increment = () => {
    const today = new Date().toLocaleDateString();
    const email = loggedInUserEmail;
    const dailyKey = `dailyJapaData_${email}`;

    const existing = JSON.parse(localStorage.getItem(dailyKey)) || [];
    const index = existing.findIndex((entry) => entry.date === today);

    let totalCount = 0;
    let totalDuration = 0;

    if (index !== -1) {
      totalCount = existing[index].totalCount + 1;
      totalDuration = existing[index].totalDuration;
    } else {
      totalCount = 1;
      totalDuration = 0;
    }

    if (totalCount % 108 === 1 || roundStartTimeRef.current === null) {
      roundStartTimeRef.current = Date.now();
    }

    if (totalCount % 108 === 0 && roundStartTimeRef.current) {
      const roundDuration = Math.floor(
        (Date.now() - roundStartTimeRef.current) / 1000
      );
      totalDuration += roundDuration;

      const newRound = {
        date: today,
        email,
        roundCount: 1,
        duration: roundDuration,
      };

      const roundsKey = `japaRounds_${email}`;
      const allRounds = JSON.parse(localStorage.getItem(roundsKey)) || [];
      allRounds.push(newRound);
      localStorage.setItem(roundsKey, JSON.stringify(allRounds));
      setRounds(allRounds);

      const todaysRounds = allRounds.filter(
        (r) => r.date === today && r.email === email
      );
      setRound(todaysRounds.length);

      const last = todaysRounds[todaysRounds.length - 1];
      const minutes = Math.floor(last.duration / 60);
      const seconds = last.duration % 60;
      setLastRoundDuration(`${minutes}m ${seconds}s`);

      roundStartTimeRef.current = null;
    }

    const updatedToday = {
      date: today,
      email,
      totalCount,
      totalDuration,
    };

    if (index !== -1) {
      existing[index] = updatedToday;
    } else {
      existing.push(updatedToday);
    }

    localStorage.setItem(dailyKey, JSON.stringify(existing));
    setDailyData(updatedToday);
  };


  const decrement = () => {
    const email = loggedInUserEmail;
    const today = new Date().toLocaleDateString();
    const dailyKey = `dailyJapaData_${email}`;

    const existing = JSON.parse(localStorage.getItem(dailyKey)) || [];
    const index = existing.findIndex((entry) => entry.date === today);

    if (index === -1 || existing[index].totalCount <= 0) return;

    if (existing[index].totalCount % 108 === 0) return; // block decrementing completed round

    existing[index].totalCount -= 1;
    localStorage.setItem(dailyKey, JSON.stringify(existing));
    setDailyData(existing[index]);
  };


  const reset = () => {
    const email = loggedInUserEmail;
    const today = new Date().toLocaleDateString();
    const dailyKey = `dailyJapaData_${email}`;

    const existing = JSON.parse(localStorage.getItem(dailyKey)) || [];
    const index = existing.findIndex((entry) => entry.date === today);

    if (index !== -1) {
      existing[index] = {
        date: today,
        email,
        totalCount: 0,
        totalDuration: 0,
      };
      localStorage.setItem(dailyKey, JSON.stringify(existing));
      setDailyData(existing[index]);
    } else {
      const resetData = {
        date: today,
        email,
        totalCount: 0,
        totalDuration: 0,
      };
      existing.push(resetData);
      localStorage.setItem(dailyKey, JSON.stringify(existing));
      setDailyData(resetData);
    }

    roundStartTimeRef.current = null;
  };



  const handleSubmitDayData = async () => {
    const today = new Date().toLocaleDateString();
    const email = loggedInUserEmail;
    const roundsKey = `japaRounds_${email}`;
    const dailyKey = `dailyJapaData_${email}`;
    const submittedKey = `submittedToday_${email}`;

    if (localStorage.getItem(submittedKey) === today) {
      return alert("Already submitted today's data.");
    }

    const savedRounds = JSON.parse(localStorage.getItem(roundsKey)) || [];
    const todaysRounds = savedRounds.filter((r) => r.date === today);

    let totalRounds = 0;
    let totalDuration = 0;

    if (todaysRounds.length > 0) {
      totalRounds = todaysRounds.reduce((sum, r) => sum + r.roundCount, 0);
      totalDuration = todaysRounds.reduce((sum, r) => sum + r.duration, 0);
    } else {
      const daily = JSON.parse(localStorage.getItem(dailyKey));
      if (daily?.totalCount > 0) {
        totalRounds = daily.totalCount / 108;
        totalDuration = Math.floor(daily.totalDuration / 1000);
      } else {
        alert("No data to submit.");
        return;
      }
    }

    const dailyDataToSend = {
      date: new Date().toISOString(),
      email,
      roundCount: totalRounds,
      duration: Math.floor(totalDuration),
    };

    try {
      await axios.post("/rounds/daily", dailyDataToSend);
      const hours = Math.floor(totalDuration / 3600);
      const minutes = Math.floor((totalDuration % 3600) / 60);
      const seconds = totalDuration % 60;

      alert(
        `Today you completed ${totalRounds} round(s) and spent ${String(
          hours
        ).padStart(2, '0')}:${String(minutes).padStart(2, '0')}:${String(
          seconds
        ).padStart(2, '0')} (hh:mm:ss).`
      );
      localStorage.setItem(submittedKey, today);
      localStorage.removeItem(dailyKey);
      navigate("/user-dashboard");

      // Optional: Clear today's entries from localStorage if needed
      const remainingRounds = savedRounds.filter((r) => r.date !== today);
      localStorage.setItem(roundsKey, JSON.stringify(remainingRounds));
    } catch (error) {
      console.error("❌ Submit error:", error);
      alert("Failed to submit daily data.");
    }
  };

  useEffect(() => {
    const today = new Date().toLocaleDateString();
    const currentUser = loggedInUserEmail;

    if (!currentUser) return;

    const dailyKey = `dailyJapaData_${currentUser}`;
    const roundsKey = `japaRounds_${currentUser}`;
    const submittedKey = `submittedToday_${currentUser}`;

    const storedDate = localStorage.getItem(submittedKey);

    if (storedDate === today) {
      setSubmittedToday(true);
      alert("You already submitted your Japa today.");
    }
    const savedDaily = JSON.parse(localStorage.getItem(dailyKey));
    if (savedDaily && savedDaily.date === today) {
      setDailyData(savedDaily);
    }

    const storedRounds = JSON.parse(localStorage.getItem(roundsKey)) || [];
    const todaysRounds = storedRounds.filter((r) => r.date === today);
    setRound(todaysRounds.length);

    if (todaysRounds.length > 0) {
      const last = todaysRounds[todaysRounds.length - 1];
      const minutes = Math.floor(last.duration / 60);
      const seconds = last.duration % 60;
      setLastRoundDuration(`${minutes}m ${seconds}s`);
    }

    if (storedDate && storedDate !== today) {
      localStorage.removeItem(dailyKey);
      localStorage.removeItem(submittedKey);
    }
    setCount(dailyData.totalCount % 108);

    // window.electronAPI?.onIncrement(() => increment());
    // window.electronAPI?.onDecrement(() => decrement());
    // window.electronAPI?.onReset(() => reset());

    if (window.electronAPI) {
      window.electronAPI.onIncrement(() => increment());
      window.electronAPI.onDecrement(() => decrement());
      window.electronAPI.onReset(() => reset());
    }
    
    return () => window.electronAPI?.removeAllListeners();
  }, [loggedInUserEmail, dailyData.totalCount]);


  useEffect(() => {
    const email = loggedInUserEmail;
    const key = `japaRounds_${email}`;
    const storedData = localStorage.getItem(key);

    if (storedData) {
      try {
        const parsed = JSON.parse(storedData);
        setRounds(parsed);
      } catch (error) {
        console.error("Error parsing round data:", error);
      }
    }
  }, [loggedInUserEmail]);

  // const totalDuration = rounds.reduce((sum, r) => sum + (r?.duration || 0), 0);
  
  const today = new Date().toLocaleDateString(); // e.g. "7/19/2025"
  const email = loggedInUserEmail;
  const storageKey = `japaRounds_${email}`;

// Get the full round data for the user
const allRounds = JSON.parse(localStorage.getItem(storageKey)) || [];

// Filter only today's records
const todayRounds = allRounds.filter((round) => round.date === today);

  
  useEffect(() => {
    const email = localStorage.getItem('email');
    const dailyKey = `dailyJapaData_${email}`;
    const today = new Date().toLocaleDateString(); 

    const data = JSON.parse(localStorage.getItem(dailyKey)) || [];

    const todayEntry = data.find((entry) => entry.date === today);

    if (todayEntry) {
      setDailyData(todayEntry);
    } else {
      const freshEntry = {
        date: today,
        email,
        totalCount: 0,
        totalDuration: 0,
      };
      setDailyData(freshEntry);
      localStorage.setItem(dailyKey, JSON.stringify([...data, freshEntry]));
    }
  }, []);

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '0',
      }}
    >
      <h1>Japa Count App</h1>

      <NavButton
        setUser={setUser}
        label="📜 Go to Dashboard"
        path="/user-dashboard"
      />

      <div style={styles.mantraWrapper}>
        <em style={styles.line}>
          śrī-kṛṣṇa-caitanya prabhu-nityānanda <br />
          śrī-advaita gadādhara śrīvāsādi-gaura-bhakta-vṛnda
        </em>
        <em style={styles.line}>
          <b>MAHĀ-MANTRA:</b> <br />
          Hare Kṛṣṇa, Hare Kṛṣṇa, Kṛṣṇa Kṛṣṇa, Hare Hare <br />
          Hare Rāma, Hare Rāma, Rāma Rāma, Hare Hare
        </em>
      </div>

      <div
        style={{
          fontSize: '5rem',
          marginBottom: '20px',
          fontWeight: 'bold',
        }}
      >
        {count}
      </div>
      <div style={{ fontSize: '2rem', marginBottom: '10px' }}>
        Round: {round}
      </div>
      {lastRoundDuration && (
        <div style={{ marginBottom: '20px', fontSize: '1.2rem' }}>
          Last Round Time: {lastRoundDuration}
        </div>
      )}

      {submittedToday ? (
        <h1>Already Submitted Today's Japa</h1>
      ) : (
        <div style={{ display: 'flex', gap: '15px', marginBottom: '20px' }}>
          <button onClick={increment} style={buttonStyle} title="F7">
            Increment
          </button>
          <button onClick={decrement} style={buttonStyle} title="F8">
            Decrement
          </button>
          <button onClick={reset} style={buttonStyle} title="F9">
            Reset
          </button>
        </div>
      )}

      <div
        style={{
          marginTop: '30px',
          fontSize: '1rem',
          color: '#666',
        }}
      >
        <ShortcutDisplay />
      </div>

      <div style={{ marginTop: '40px', width: '100%', maxWidth: '500px' }}>
        <h2
          style={{
            fontSize: '1.5rem',
            marginBottom: '10px',
          }}
        >
          Round Durations
        </h2>

        {todayRounds.length === 0 ? (
          <h3>No data found</h3>
        ) : (
          <>
            <table
              style={{
                width: '100%',
                borderCollapse: 'collapse',
              }}
            >
              <thead>
                <tr style={{ backgroundColor: '#ccc' }}>
                  <th style={{ border: '1px solid #999', padding: '10px' }}>
                    Round
                  </th>
                  <th style={{ border: '1px solid #999', padding: '10px' }}>
                    Duration
                  </th>
                </tr>
              </thead>
              <tbody>
                {todayRounds.map((round, index) => {
                  const minutes = Math.floor(round.duration / 60);
                  const seconds = round.duration % 60;

                  return (
                    <tr key={index}>
                      <td
                        style={{
                          border: '1px solid #999',
                          padding: '8px',
                          textAlign: 'center',
                        }}
                      >
                        {index + 1}
                      </td>
                      <td
                        style={{
                          border: '1px solid #999',
                          padding: '8px',
                          textAlign: 'center',
                        }}
                      >
                        {minutes}m {seconds}s
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>

            <div style={{ textAlign: 'center' }}>
              <button
                onClick={handleSubmitDayData}
                style={{
                  backgroundColor: 'green',
                  color: 'white',
                  marginTop: '20px',
                  padding: '10px 20px',
                  fontWeight: 'bold',
                  border: 'none',
                  borderRadius: '6px',
                  cursor: 'pointer',
                }}
              >
                Submit Today's Data to Cloud
              </button>
            </div>

            <div
              style={{
                marginTop: '10px',
                fontSize: '1rem',
                textAlign: 'center',
              }}
            >
              <p>
                Total Time Today:{' '}
                {String(Math.floor(dailyData.totalDuration / 3600)).padStart(
                  2,
                  '0'
                )}
                :
                {String(
                  Math.floor((dailyData.totalDuration % 3600) / 60)
                ).padStart(2, '0')}
                :{String(dailyData.totalDuration % 60).padStart(2, '0')}
              </p>
            </div>
          </>
        )}
      </div>
    </div>
  );
}

const buttonStyle = {
  padding: "12px 25px",
  fontSize: "1.1rem",
  fontWeight: "600",
  borderRadius: "8px",
  border: "none",
  cursor: "pointer",
  backgroundColor: "#007bff",
  color: "white",
  boxShadow: "0 4px 6px rgba(0,0,0,0.1)",
  transition: "background-color 0.3s ease",
};
const styles = {
  mantraWrapper: {
    textAlign: 'center',
    padding: '30px 20px',
    backgroundColor: '#fdf6e3',
    borderRadius: '10px',
    fontFamily: "'Georgia', serif",
    color: '#4a3f35',
    margin: '30px 0',
    boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
  },
  line: {
    display: 'block',
    fontSize: '18px',
    lineHeight: '1.8',
    marginBottom: '15px',
  },
};


