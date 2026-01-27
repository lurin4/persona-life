import React from "react";
import GoalCreator from "../components/GoalCreator";

export default function Goals({ stats, goals, addCustomGoal, deleteGoal }) {
  return (
    <div style={{ padding: "20px", marginTop: "40px" }}>
      <h1
        style={{
          color: "#d32f2f",
          fontSize: "3rem",
          fontStyle: "italic",
          textShadow: "3px 3px 0 #fff",
        }}
      >
        MISSIONS
      </h1>

      {goals.length === 0 && (
        <p style={{ opacity: 0.5 }}>
          No active missions. Add a deadline below.
        </p>
      )}

      {goals
        .sort((a, b) => new Date(a.deadline) - new Date(b.deadline))
        .map((goal) => {
          const currentRank = stats[goal.targetStat].rank;
          const isMet = currentRank >= goal.targetRank;

          return (
            <div key={goal.id} style={goalCardStyle}>
              <button onClick={() => deleteGoal(goal.id)} style={deleteBtn}>
                ×
              </button>
              <h2
                style={{
                  margin: "0 0 10px 0",
                  color: "#fdd835",
                  fontSize: "1.5rem",
                }}
              >
                {goal.title.toUpperCase()}
              </h2>
              <div style={infoRow}>
                <span>DEADLINE: {goal.deadline}</span>
                <span>
                  REQ: {goal.targetStat.toUpperCase()} LV. {goal.targetRank}
                </span>
              </div>
              <div style={progressContainer}>
                <div
                  style={{
                    ...progressBar,
                    width: `${(currentRank / goal.targetRank) * 100}%`,
                    backgroundColor: isMet ? "#4caf50" : "#d32f2f",
                  }}
                />
              </div>
              <p
                style={{
                  fontSize: "0.8rem",
                  textAlign: "right",
                  marginTop: "10px",
                  fontWeight: "bold",
                }}
              >
                {isMet
                  ? "✅ CLEAR: REQUIREMENT MET"
                  : `⚠️ WARNING: NEED ${goal.targetRank - currentRank} MORE RANKS`}
              </p>
            </div>
          );
        })}

      <GoalCreator addCustomGoal={addCustomGoal} />
    </div>
  );
}

const goalCardStyle = {
  position: "relative",
  backgroundColor: "#111",
  border: "2px solid #fff",
  padding: "20px",
  marginBottom: "20px",
  transform: "skewX(-2deg)",
  boxShadow: "8px 8px 0px #333",
};
const deleteBtn = {
  position: "absolute",
  top: "10px",
  right: "10px",
  background: "none",
  border: "none",
  color: "#fff",
  fontSize: "1.5rem",
  cursor: "pointer",
};
const infoRow = {
  display: "flex",
  justifyContent: "space-between",
  fontWeight: "bold",
  fontSize: "0.8rem",
  marginBottom: "10px",
  color: "#aaa",
};
const progressContainer = {
  height: "10px",
  backgroundColor: "#222",
  border: "1px solid #444",
  overflow: "hidden",
};
const progressBar = { height: "100%", transition: "width 1s ease-in-out" };
