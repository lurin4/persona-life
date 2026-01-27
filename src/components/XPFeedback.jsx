import React, { useEffect, useState } from "react";

export default function XPFeedback({ stat, amount, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 1000); // Remove after 1 second
    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div style={feedbackContainer}>
      <div style={xpTextStyle}>
        {stat.toUpperCase()} +{amount} XP
      </div>
    </div>
  );
}

const feedbackContainer = {
  position: "fixed",
  top: "40%",
  left: "50%",
  transform: "translateX(-50%)",
  pointerEvents: "none",
  zIndex: 2000,
  animation: "floatUpAndFade 1s ease-out forwards",
};

const xpTextStyle = {
  backgroundColor: "#fdd835",
  color: "#000",
  padding: "10px 20px",
  fontWeight: "bold",
  fontSize: "1.5rem",
  transform: "skewX(-15deg)",
  border: "3px solid #fff",
  boxShadow: "10px 10px 0px #d32f2f",
};

const styleSheet = document.createElement("style");
styleSheet.innerText = `
  @keyframes floatUpAndFade {
    0% { opacity: 0; transform: translate(-50%, 0); }
    20% { opacity: 1; transform: translate(-50%, -20px); }
    100% { opacity: 0; transform: translate(-50%, -100px); }
  }
`;
document.head.appendChild(styleSheet);
