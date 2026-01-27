import React, { useState } from "react";

export default function PersonaSelect({ value, options, onChange }) {
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (e, opt) => {
    e.stopPropagation();
    onChange(opt);
    setIsOpen(false);
  };

  return (
    <div style={containerStyle}>
      {/* SELECT BAR */}
      <div
        onClick={() => setIsOpen(!isOpen)}
        style={{
          ...selectedBoxStyle,
          backgroundColor: isOpen ? "#fdd835" : "#fff",
          zIndex: isOpen ? 2001 : 10,
        }}
      >
        <span style={textStyle}>{(value || "").toString().toUpperCase()}</span>
        <span style={{ fontSize: "0.7rem", color: "#000" }}>
          {isOpen ? "▲" : "▼"}
        </span>
      </div>

      {/* THE SLASHES */}
      {isOpen && (
        <>
          <div style={overlayStyle} onClick={() => setIsOpen(false)} />
          <div style={dropdownListStyle}>
            {options.map((opt, index) => (
              <div
                key={opt}
                onClick={(e) => handleSelect(e, opt)}
                style={{
                  ...optionStyle,
                  backgroundColor: value === opt ? "#fdd835" : "#d32f2f",
                  color: value === opt ? "#000" : "#fff",
                  transform: `rotate(${index % 2 === 0 ? "-1.5deg" : "1.5deg"})`,
                  marginLeft: index % 2 === 0 ? "-8px" : "8px",
                }}
              >
                {opt.toString().toUpperCase()}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}

const containerStyle = { position: "relative", width: "100%" };
const selectedBoxStyle = {
  padding: "10px 15px",
  cursor: "pointer",
  fontFamily: "'Permanent Marker', cursive",
  clipPath: "polygon(0% 0%, 100% 2%, 98% 100%, 0% 98%)",
  display: "flex",
  justifyContent: "space-between",
  alignItems: "center",
  border: "2px solid #000",
  boxShadow: "4px 4px 0px #000",
  position: "relative",
};
const textStyle = { color: "#000", fontSize: "0.9rem", fontWeight: "900" };
const dropdownListStyle = {
  position: "absolute",
  top: "110%",
  left: "-5%",
  width: "110%",
  display: "flex",
  flexDirection: "column",
  gap: "4px",
  zIndex: 5000,
};
const optionStyle = {
  padding: "8px 15px",
  cursor: "pointer",
  fontFamily: "'Permanent Marker', cursive",
  fontSize: "0.85rem",
  clipPath: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)",
  borderLeft: "4px solid #fff",
  boxShadow: "4px 4px 0px #000",
  whiteSpace: "nowrap",
};
const overlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  width: "100vw",
  height: "100vh",
  zIndex: 1500,
};
