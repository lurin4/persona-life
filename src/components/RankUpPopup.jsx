import React, { useEffect, useState } from "react";

export default function RankUpPopup({ statName, rank, onComplete }) {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    // Auto-hide the popup after 3 seconds
    const timer = setTimeout(() => {
      setVisible(false);
      onComplete();
    }, 3000);
    return () => clearTimeout(timer);
  }, [onComplete]);

  if (!visible) return null;

  return (
    <div style={overlayStyle}>
      <div style={popupStyle}>
        <h2 style={rankTextStyle}>RANK UP!</h2>
        <div style={statNameStyle}>{statName.toUpperCase()}</div>
        <div style={rankNumberStyle}>{rank}</div>
      </div>
    </div>
  );
}

// --- PERSONA STYLE ANIMATION CSS ---
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0,0,0,0.8)",
  zIndex: 1000,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
};

const popupStyle = {
  background: "#d32f2f",
  color: "#fff",
  padding: "40px",
  transform: "skewX(-15deg)",
  border: "5px solid #fff",
  textAlign: "center",
  boxShadow: "20px 20px 0px #000",
};

const rankTextStyle = {
  fontSize: "4rem",
  margin: 0,
  fontStyle: "italic",
  fontWeight: "900",
};
const statNameStyle = { fontSize: "1.5rem", letterSpacing: "5px" };
const rankNumberStyle = {
  fontSize: "6rem",
  fontWeight: "bold",
  color: "#fdd835",
  textShadow: "5px 5px 0px #000",
};
