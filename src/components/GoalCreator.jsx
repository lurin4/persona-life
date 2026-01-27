import React, { useState } from "react";
import PersonaSelect from "./PersonaSelect";

export default function GoalCreator({ addCustomGoal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [stat, setStat] = useState("knowledge");
  const [rank, setRank] = useState("1");

  if (!isOpen)
    return (
      <div style={{ textAlign: "center", marginTop: "60px" }}>
        <button onClick={() => setIsOpen(true)} style={addBtnStyle}>
          + INFILTRATE NEW PALACE
        </button>
      </div>
    );

  return (
    <div style={formWrapper}>
      <div style={blackShadow} />
      <div style={redAccent} />
      <div style={whiteCardFace} />

      <div style={contentLayer}>
        <h3 style={headerStyle}>MISSION PARAMETERS</h3>
        <form
          onSubmit={(e) => {
            e.preventDefault();
            addCustomGoal(title, date, stat, rank);
            setIsOpen(false);
          }}
          style={{ overflow: "visible" }}
        >
          <div style={inputGroup}>
            <label style={labelStyle}>TARGET OBJECTIVE</label>
            <input
              style={inputStyle}
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Midterms"
            />
          </div>
          <div style={inputGroup}>
            <label style={labelStyle}>DEADLINE</label>
            <input
              style={inputStyle}
              type="date"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>
          <div style={rowStyle}>
            <div style={{ flex: 2, position: "relative" }}>
              <label style={labelStyle}>REQUIRED STAT</label>
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
            <div style={{ flex: 1, position: "relative" }}>
              <label style={labelStyle}>LVL</label>
              <PersonaSelect
                value={rank}
                options={["1", "2", "3", "4", "5"]}
                onChange={setRank}
              />
            </div>
          </div>
          <div style={buttonArea}>
            <button type="submit" style={submitBtn}>
              SEND CALLING CARD
            </button>
            <button
              type="button"
              onClick={() => setIsOpen(false)}
              style={cancelBtn}
            >
              ABORT
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

const formWrapper = {
  position: "relative",
  width: "95%",
  maxWidth: "440px",
  margin: "140px auto 100px auto",
  zIndex: 100,
};
const blackShadow = {
  position: "absolute",
  top: "15px",
  left: "15px",
  width: "100%",
  height: "100%",
  backgroundColor: "#000",
  transform: "rotate(1.5deg)",
  zIndex: 1,
  clipPath: "polygon(0% 0%, 100% 5%, 95% 50%, 100% 95%, 0% 100%)",
};
const redAccent = {
  position: "absolute",
  top: "8px",
  left: "8px",
  width: "100%",
  height: "100%",
  backgroundColor: "#d32f2f",
  transform: "rotate(-1deg)",
  zIndex: 2,
  clipPath: "polygon(0% 0%, 100% 5%, 95% 50%, 100% 95%, 0% 100%)",
};
const whiteCardFace = {
  position: "absolute",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "#fff",
  border: "3px solid #000",
  transform: "rotate(-2deg)",
  zIndex: 3,
  clipPath: "polygon(0% 0%, 100% 5%, 95% 50%, 100% 95%, 0% 100%)",
};
const contentLayer = {
  position: "relative",
  zIndex: 4,
  padding: "30px",
  transform: "rotate(-1.5deg)",
};
const headerStyle = {
  margin: "0 0 20px 0",
  fontFamily: "'Permanent Marker', cursive",
  fontSize: "1.6rem",
  color: "#000",
  borderBottom: "3px solid #d32f2f",
};
const inputGroup = { marginBottom: "18px" };
const labelStyle = {
  display: "block",
  fontSize: "0.75rem",
  fontWeight: "900",
  color: "#d32f2f",
  marginBottom: "5px",
};
const inputStyle = {
  width: "100%",
  padding: "12px",
  border: "2px solid #000",
  backgroundColor: "#f0f0f0",
  fontWeight: "bold",
  clipPath: "polygon(0% 0%, 100% 2%, 98% 100%, 0% 98%)",
};
const rowStyle = {
  display: "flex",
  gap: "15px",
  marginBottom: "35px",
  overflow: "visible",
};
const buttonArea = { display: "flex", gap: "10px" };
const submitBtn = {
  flex: 2,
  background: "#000",
  color: "#fff",
  border: "none",
  padding: "14px",
  fontFamily: "'Permanent Marker', cursive",
  cursor: "pointer",
  clipPath: "polygon(5% 0%, 100% 4%, 95% 100%, 0% 96%)",
};
const cancelBtn = {
  flex: 1,
  background: "#ccc",
  color: "#000",
  border: "none",
  padding: "14px",
  fontFamily: "'Permanent Marker', cursive",
  cursor: "pointer",
  clipPath: "polygon(0% 4%, 95% 0%, 100% 100%, 5% 96%)",
};
const addBtnStyle = {
  padding: "14px 28px",
  background: "none",
  color: "#d32f2f",
  border: "3px dashed #d32f2f",
  cursor: "pointer",
  fontFamily: "'Permanent Marker', cursive",
  fontSize: "1.2rem",
};
