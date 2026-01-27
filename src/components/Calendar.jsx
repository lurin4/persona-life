import React from "react";

export default function Calendar({ timeLabel }) {
  // 1. Get real-time data
  const now = new Date();
  const month = now.getMonth() + 1; // Months are 0-indexed (Jan is 0)
  const date = now.getDate();

  // 2. Get the day name
  const dayName = now
    .toLocaleDateString("en-US", { weekday: "long" })
    .toUpperCase();

  return (
    <div style={containerStyle}>
      <div style={dateBox}>
        <span style={monthStyle}>{month}</span>
        <span style={slashStyle}>/</span>
        <span style={dayStyle}>{date}</span>
      </div>
      <div style={dayOfWeekStyle}>{dayName}</div>
      <div style={timeLabelStyle}>{(timeLabel || "MORNING").toUpperCase()}</div>
      <div style={weatherIconStyle}>☁️</div>
    </div>
  );
}

// --- STYLES ---
const containerStyle = {
  position: "fixed",
  top: "20px",
  left: "20px",
  display: "flex",
  flexDirection: "column",
  alignItems: "flex-start",
  zIndex: 100,
  transform: "rotate(-5deg)",
  filter: "drop-shadow(4px 4px 0px rgba(0,0,0,0.5))",
};

const dateBox = {
  backgroundColor: "#fff",
  color: "#000",
  padding: "5px 15px",
  fontWeight: "900",
  display: "flex",
  alignItems: "center",
  clipPath: "polygon(0 0, 100% 0, 90% 100%, 10% 100%)",
  border: "2px solid #000",
};

const monthStyle = {
  fontSize: "2.5rem",
  fontFamily: "'Permanent Marker', cursive",
};
const slashStyle = { color: "#d32f2f", margin: "0 5px", fontSize: "2rem" };
const dayStyle = {
  fontSize: "3rem",
  fontFamily: "'Permanent Marker', cursive",
};

const dayOfWeekStyle = {
  backgroundColor: "#000",
  color: "#fff",
  padding: "2px 12px",
  marginTop: "-8px",
  fontWeight: "bold",
  fontSize: "1.5rem",
  border: "2px solid #fff",
  alignSelf: "flex-end",
  transform: "rotate(2deg)",
};

const timeLabelStyle = {
  fontSize: "3rem",
  color: "#fff",
  fontWeight: "900",
  fontStyle: "italic",
  marginTop: "8px",
  textShadow: "3px 3px 0px #d32f2f",
  transform: "translateX(15px)",
  fontFamily: "'Permanent Marker', cursive",
};

const weatherIconStyle = {
  fontSize: "2rem",
  marginTop: "5px",
  marginLeft: "10px",
  filter: "drop-shadow(2px 2px 0px #000)",
};
