import React, { useState } from "react";
import PersonaSelect from "./PersonaSelect";

export default function ActivityCreator({ addCustomActivity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [stat, setStat] = useState("knowledge");

  if (!isOpen)
    return (
      <button onClick={() => setIsOpen(true)} style={addBtnStyle}>
        + LOG NEW ACTIVITY
      </button>
    );

  return (
    <div style={formWrapper}>
      <div style={redAccentLayer} />
      <div style={whiteLayer} />
      <div style={contentLayer}>
        <h3 style={headerStyle}>NEW ACTIVITY</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            if (name.trim()) {
              addCustomActivity(name, stat);
              setName("");
              setIsOpen(false);
            }
          }}
          style={{ overflow: "visible" }}
        >
          <div style={inputGroup}>
            <label style={labelStyle}>ACTIVITY NAME</label>
            <input
              style={jaggedInputStyle}
              placeholder="e.g., Study"
              value={name}
              onChange={(e) => setName(e.target.value)}
              autoFocus
            />
          </div>
          <div style={{ ...inputGroup, marginBottom: "25px" }}>
            <label style={labelStyle}>ASSOCIATED STAT</label>
            <PersonaSelect
              value={stat}
              options={[
                "knowledge",
                "guts",
                "proficiency",
                "kindness",
                "charm",
              ]}
              onChange={setStat}
            />
          </div>
          <div style={buttonArea}>
            <button type="submit" style={submitBtn}>
              CONFIRM
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={cancelBtn}
            >
              BACK
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const formWrapper = {
  position: "relative",
  width: "100%",
  maxWidth: "400px",
  margin: "30px auto",
  zIndex: 100,
};
const redAccentLayer = {
  position: "absolute",
  top: "8px",
  left: "8px",
  width: "100%",
  height: "100%",
  backgroundColor: "#d32f2f",
  transform: "rotate(1deg)",
  zIndex: 1,
  clipPath: "polygon(0% 0%, 100% 5%, 95% 50%, 100% 95%, 0% 100%)",
};
const whiteLayer = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "#fff",
  border: "2px solid #000",
  transform: "rotate(-1deg)",
  zIndex: 2,
  clipPath: "polygon(0% 0%, 100% 5%, 95% 50%, 100% 95%, 0% 100%)",
};
const contentLayer = {
  position: "relative",
  zIndex: 3,
  padding: "25px",
  transform: "rotate(-0.5deg)",
};
const headerStyle = {
  margin: "0 0 15px 0",
  fontFamily: "'Permanent Marker', cursive",
  fontSize: "1.5rem",
  color: "#000",
};
const inputGroup = { marginBottom: "15px" };
const labelStyle = {
  display: "block",
  fontSize: "0.65rem",
  fontWeight: "900",
  color: "#d32f2f",
  marginBottom: "5px",
};
const jaggedInputStyle = {
  width: "100%",
  padding: "10px",
  border: "2px solid #000",
  fontWeight: "bold",
  backgroundColor: "#f5f5f5",
  clipPath: "polygon(0% 0%, 100% 2%, 98% 100%, 0% 98%)",
};
const buttonArea = { display: "flex", gap: "10px" };
const submitBtn = {
  flex: 2,
  background: "#000",
  color: "#fff",
  border: "none",
  padding: "12px",
  cursor: "pointer",
  fontFamily: "'Permanent Marker', cursive",
  clipPath: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)",
};
const cancelBtn = {
  flex: 1,
  background: "#ccc",
  color: "#000",
  border: "none",
  padding: "12px",
  cursor: "pointer",
  fontFamily: "'Permanent Marker', cursive",
  clipPath: "polygon(0% 0%, 95% 0%, 100% 100%, 5% 100%)",
};
const addBtnStyle = {
  width: "100%",
  padding: "15px",
  background: "none",
  color: "#888",
  border: "2px dashed #444",
  cursor: "pointer",
  fontFamily: "'Permanent Marker', cursive",
  marginTop: "20px",
};
