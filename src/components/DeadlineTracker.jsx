import React from "react";

export default function DeadlineTracker({ goals, getDaysRemaining }) {
  // 1. Safety check: If there are no goals, don't show the red box
  if (!goals || goals.length === 0) return null;

  // 2. Logic: Find all active goals, calculate days left, and pick the closest one
  const activeMissions = goals
    .map((g) => ({
      ...g,
      daysLeft: getDaysRemaining(g.deadline),
    }))
    .filter((g) => g.daysLeft >= 0) // Only show goals that haven't passed yet
    .sort((a, b) => a.daysLeft - b.daysLeft); // Sort by most urgent first

  // If no future goals exist, hide the tracker
  if (activeMissions.length === 0) return null;

  const urgentMission = activeMissions[0];

  // 3. Formatting: Add a leading zero for single digits (e.g., 05 instead of 5)
  const displayDays =
    urgentMission.daysLeft < 10
      ? `0${urgentMission.daysLeft}`
      : urgentMission.daysLeft;

  return (
    <div style={containerStyle}>
      <div style={labelStyle}>
        DAYS UNTIL {urgentMission.title.toUpperCase()}
      </div>
      <div style={numberContainer}>
        <span style={dotStyle}>.</span>
        <span style={numberStyle}>{displayDays}</span>
      </div>
    </div>
  );
}

// --- PHANTOM THIEF STYLING ---

const containerStyle = {
  position: "fixed",
  top: "25px",
  right: "25px",
  backgroundColor: "#d32f2f",
  color: "#fff",
  padding: "8px 18px",
  transform: "rotate(2.5deg)",
  boxShadow: "8px 8px 0px #000",
  border: "3px solid #fff",
  zIndex: 1000,
  textAlign: "center",
  minWidth: "160px",
  transition: "all 0.5s ease",
};

const labelStyle = {
  fontSize: "0.75rem",
  fontWeight: "900",
  letterSpacing: "1.5px",
  borderBottom: "2px solid #fff",
  marginBottom: "4px",
  fontFamily: "sans-serif",
  paddingBottom: "2px",
};

const numberContainer = {
  display: "flex",
  alignItems: "baseline",
  justifyContent: "center",
  fontFamily: "'Permanent Marker', cursive",
};

const dotStyle = {
  fontSize: "1.8rem",
  marginRight: "2px",
  lineHeight: "1",
};

const numberStyle = {
  fontSize: "3.8rem",
  fontWeight: "900",
  lineHeight: "0.9",
  letterSpacing: "-2px",
};
