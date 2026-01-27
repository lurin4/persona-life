import React from "react";
import ActivityCreator from "../components/ActivityCreator";

const TIME_BLOCKS = [
  "Morning",
  "Lunch",
  "After School",
  "Evening",
  "Night",
  "Late Night",
];
const STAT_ICONS = {
  knowledge: "🎓",
  guts: "👊",
  proficiency: "🛠️",
  kindness: "🍀",
  charm: "💋",
};

export default function Daily({
  addXP,
  timeIndex,
  lastActionBlock,
  activities,
  addCustomActivity,
  deleteActivity,
  resetAction,
}) {
  const hasUsedAction = lastActionBlock === timeIndex;

  return (
    <div style={{ ...containerWrapper, backgroundColor: "#000" }}>
      {/* ACTIVITY GRID */}
      <div
        style={{
          ...gridArea,
          opacity: hasUsedAction ? 0.2 : 1,
          pointerEvents: hasUsedAction ? "none" : "auto",
        }}
      >
        {activities.map((act) => (
          <div
            key={act.id}
            style={cardWrapper}
            onClick={() => addXP(act.stat, act.xp)}
          >
            {/* RED SHADOW */}
            <div style={pentagonShadow} />

            {/* MAIN CARD FACE */}
            <div style={pentagonFace}>
              <span style={statLabel}>{act.stat.toUpperCase()}</span>
              <div style={activityName}>{act.name}</div>

              {/* The Icons */}
              <div style={iconStyle}>{STAT_ICONS[act.stat]}</div>

              {/* The Delete Button */}
              <button
                onClick={(e) => {
                  e.stopPropagation();
                  deleteActivity(act.id);
                }}
                style={deleteBtn}
              >
                ×
              </button>
            </div>
          </div>
        ))}
      </div>

      {/* --- FOOTER / CREATOR --- */}
      <div style={{ marginTop: "50px" }}>
        {hasUsedAction ? (
          <div style={exhaustedBox}>
            <p style={exhaustedText}>GO TO SLEEP.</p>
            <button onClick={resetAction} style={undoBtn}>
              WAKE UP
            </button>
          </div>
        ) : (
          <ActivityCreator addCustomActivity={addCustomActivity} />
        )}
      </div>
    </div>
  );
}

// --- MASTER STYLES ---

const containerWrapper = {
  padding: "160px 20px 100px 20px",
  minHeight: "100vh",
  width: "100%",
  boxSizing: "border-box",
};

const gridArea = {
  display: "grid",
  gridTemplateColumns: "1fr 1fr",
  gap: "35px 15px",
};

const cardWrapper = {
  position: "relative",
  height: "100px",
  cursor: "pointer",
};

const pentagonShadow = {
  position: "absolute",
  top: "8px",
  left: "8px",
  width: "100%",
  height: "100%",
  backgroundColor: "#d32f2f",
  zIndex: 1,
  clipPath: "polygon(0% 0%, 100% 0%, 92% 50%, 100% 100%, 0% 100%)",
};

const pentagonFace = {
  position: "relative",
  width: "100%",
  height: "100%",
  backgroundColor: "#fff",
  border: "2px solid #000",
  zIndex: 2,
  display: "flex",
  flexDirection: "column",
  justifyContent: "center",
  alignItems: "center",
  padding: "10px",
  clipPath: "polygon(0% 0%, 98% 2%, 92% 50%, 98% 98%, 0% 100%)",
  boxSizing: "border-box",
};

const statLabel = {
  fontSize: "0.6rem",
  color: "#d32f2f",
  fontWeight: "900",
  letterSpacing: "1px",
  marginBottom: "5px",
};

const activityName = {
  fontSize: "0.9rem",
  color: "#000",
  textAlign: "center",
  fontWeight: "bold",
  lineHeight: "1",
  fontFamily: "sans-serif",
};

const iconStyle = {
  fontSize: "1.2rem",
  marginTop: "5px",
  color: "#fdd835",
  textShadow: "1px 1px 0px #000",
};

const deleteBtn = {
  position: "absolute",
  top: "4px",
  left: "4px",
  background: "#000",
  color: "#fdd835",
  border: "none",
  borderRadius: "50%",
  width: "20px",
  height: "20px",
  fontSize: "14px",
  cursor: "pointer",
  zIndex: 10,
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  fontWeight: "bold",
};

const exhaustedBox = { textAlign: "center", marginTop: "30px" };
const exhaustedText = {
  fontFamily: "'Permanent Marker', cursive",
  color: "#d32f2f",
  fontSize: "2rem",
};
const undoBtn = {
  background: "#000",
  border: "2px solid #d32f2f",
  color: "#d32f2f",
  padding: "8px 15px",
  fontSize: "0.8rem",
  cursor: "pointer",
  marginTop: "15px",
  fontFamily: "'Permanent Marker', cursive",
  clipPath: "polygon(5% 0%, 100% 0%, 95% 100%, 0% 100%)",
};
