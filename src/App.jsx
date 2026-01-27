import { useState, useEffect } from "react";
import { Routes, Route } from "react-router-dom";

// Components
import Daily from "./pages/Daily";
import Stats from "./pages/Stats";
import Goals from "./pages/Goals";
import NavBar from "./components/NavBar";
import RankUpPopup from "./components/RankUpPopup";
import XPFeedback from "./components/XPFeedback";
import Calendar from "./components/Calendar";
import DeadlineTracker from "./components/DeadlineTracker";

// Data
import { initialStats } from "./data/stats";
import { initialActivities } from "./data/activities";
import { initialGoals } from "./data/goals";

function App() {
  // --- SAVE/LOAD ENGINE ---
  const getSavedData = (key, defaultValue) => {
    try {
      const saved = localStorage.getItem(key);
      if (!saved || saved === "undefined") return defaultValue;
      return JSON.parse(saved);
    } catch (e) {
      console.warn(`Memory Corrupted for ${key}, resetting to defaults.`);
      return defaultValue;
    }
  };

  // --- PERSISTENT STATE ---
  const [stats, setStats] = useState(() =>
    getSavedData("p5_stats", initialStats),
  );
  const [goals, setGoals] = useState(() =>
    getSavedData("p5_goals", initialGoals),
  );
  const [activities, setActivities] = useState(() =>
    getSavedData("p5_activities", initialActivities),
  );
  const [lastActionBlock, setLastActionBlock] = useState(() =>
    getSavedData("p5_lastAction", null),
  );

  // UI Feedbacks
  const [rankUpData, setRankUpData] = useState(null);
  const [feedback, setFeedback] = useState(null);

  // --- REAL-TIME TIME SYSTEM ---
  const timeBlocks = [
    "Morning",
    "Lunch",
    "After School",
    "Evening",
    "Night",
    "Late Night",
  ];

  const getRealTimeIndex = () => {
    const hour = new Date().getHours();
    if (hour >= 6 && hour < 12) return 0; // Morning
    if (hour >= 12 && hour < 14) return 1; // Lunch
    if (hour >= 14 && hour < 18) return 2; // After School
    if (hour >= 18 && hour < 21) return 3; // Evening
    if (hour >= 21 && hour < 24) return 4; // Night
    return 5; // 12am - 6am (Late Night)
  };

  const [timeIndex, setTimeIndex] = useState(getRealTimeIndex());

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeIndex(getRealTimeIndex());
    }, 60000);
    return () => clearInterval(timer);
  }, []);

  // --- AUTO-SAVE SYSTEM ---
  useEffect(
    () => localStorage.setItem("p5_stats", JSON.stringify(stats)),
    [stats],
  );
  useEffect(
    () => localStorage.setItem("p5_goals", JSON.stringify(goals)),
    [goals],
  );
  useEffect(
    () => localStorage.setItem("p5_activities", JSON.stringify(activities)),
    [activities],
  );
  useEffect(
    () =>
      localStorage.setItem("p5_lastAction", JSON.stringify(lastActionBlock)),
    [lastActionBlock],
  );

  // --- GAME LOGIC HANDLERS ---
  const addXP = (statName, amount) => {
    if (lastActionBlock === timeIndex) return;

    setFeedback({ statName, amount });
    setLastActionBlock(timeIndex);

    setStats((prev) => {
      let { xp, rank } = prev[statName];
      let newXP = xp + amount;
      let newRank = rank;

      if (newXP >= 100 && rank < 5) {
        newXP -= 100;
        newRank += 1;
        setRankUpData({ statName, rank: newRank });
      } else if (rank >= 5) {
        newXP = 100;
      }

      return {
        ...prev,
        [statName]: { ...prev[statName], xp: newXP, rank: newRank },
      };
    });
  };

  const resetAction = () => setLastActionBlock(null);

  const addCustomActivity = (name, stat) => {
    const newAct = { id: Date.now().toString(), name, stat, xp: 15 };
    setActivities((prev) => [...prev, newAct]);
  };

  const deleteActivity = (id) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  const addCustomGoal = (title, deadline, targetStat, targetRank) => {
    const newGoal = {
      id: Date.now().toString(),
      title,
      deadline,
      targetStat,
      targetRank: parseInt(targetRank),
      status: "active",
    };
    setGoals((prev) => [...prev, newGoal]);
  };

  const deleteGoal = (id) =>
    setGoals((prev) => prev.filter((g) => g.id !== id));

  const getDaysRemaining = (deadline) => {
    const now = new Date();
    const target = new Date(deadline);
    now.setHours(0, 0, 0, 0);
    target.setHours(0, 0, 0, 0);
    const diff = target - now;
    return Math.ceil(diff / (1000 * 60 * 60 * 24));
  };

  return (
    <div style={appWrapperStyle}>
      <Calendar timeLabel={timeBlocks[timeIndex]} />
      <DeadlineTracker goals={goals} getDaysRemaining={getDaysRemaining} />

      {feedback && (
        <XPFeedback
          stat={feedback.statName}
          amount={feedback.amount}
          onComplete={() => setFeedback(null)}
        />
      )}

      {rankUpData && (
        <RankUpPopup
          statName={rankUpData.statName}
          rank={rankUpData.rank}
          onComplete={() => setRankUpData(null)}
        />
      )}

      <div style={contentAreaStyle}>
        <Routes>
          <Route
            path="/"
            element={
              <Daily
                addXP={addXP}
                timeIndex={timeIndex}
                lastActionBlock={lastActionBlock}
                activities={activities}
                addCustomActivity={addCustomActivity}
                deleteActivity={deleteActivity}
                resetAction={resetAction}
              />
            }
          />
          <Route path="/stats" element={<Stats stats={stats} />} />
          <Route
            path="/goals"
            element={
              <Goals
                stats={stats}
                goals={goals}
                addCustomGoal={addCustomGoal}
                deleteGoal={deleteGoal}
              />
            }
          />
        </Routes>
      </div>
      <NavBar />
    </div>
  );
}

const appWrapperStyle = {
  backgroundColor: "#000",
  minHeight: "100vh",
  color: "#fff",
  fontFamily: "'Permanent Marker', cursive",
  position: "relative",
  overflowX: "hidden",
};

const contentAreaStyle = {
  paddingTop: "220px",
  paddingBottom: "100px",
  paddingLeft: "20px",
  paddingRight: "20px",
};

export default App;
