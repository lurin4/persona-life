import React from "react";
import StatsStar from "../components/StatsStar";

export default function Stats({ stats }) {
  return (
    <div style={pageBackground}>
      <div style={redStripe} />

      <div style={contentWrapper}>
        <header style={headerArea}>
          <h1 style={titleStyle}>SOCIAL STATS</h1>
          <div style={subtitleStyle}>PHANTOM THIEF CAPABILITY PROFILE</div>
        </header>

        <main style={starArea}>
          <StatsStar stats={stats} />
        </main>
      </div>
    </div>
  );
}

// --- STYLES ---
const pageBackground = {
  backgroundColor: "#000",
  minHeight: "100vh",
  width: "100%",
  position: "relative",
  overflow: "hidden",
  color: "#fff",
};

const redStripe = {
  position: "absolute",
  top: "45%",
  left: "-10%",
  width: "120%",
  height: "120px",
  backgroundColor: "#d32f2f",
  transform: "rotate(-7deg)",
  zIndex: 0,
  opacity: 0.9,
  boxShadow: "0 0 30px rgba(0, 0, 0, 0.5)",
};

const contentWrapper = {
  position: "relative",
  zIndex: 1,
  paddingTop: "40px",
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
};

const headerArea = {
  textAlign: "center",
  marginBottom: "40px",
  transform: "rotate(-2deg)",
};

const titleStyle = {
  fontFamily: "'Permanent Marker', cursive",
  fontSize: "5rem",
  color: "#d32f2f",
  margin: 0,
  textShadow: "6px 6px 0px #fff",
  lineHeight: "0.8",
  filter: "drop-shadow(5px 5px 15px rgba(0,0,0,0.8))",
};

const subtitleStyle = {
  fontSize: "1rem",
  fontWeight: "900",
  letterSpacing: "6px",
  color: "#fff",
  marginTop: "10px",
  textTransform: "uppercase",
  backgroundColor: "#000",
  padding: "2px 10px",
  display: "inline-block",
};

const starArea = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  width: "100%",
  paddingBottom: "100px",
};
