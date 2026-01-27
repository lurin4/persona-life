import React from "react";

// Persona Rank Names
const RANK_NAMES = {
  knowledge: ["Oblivious", "Learned", "Scholarly", "Encyclopedic", "Erudite"],
  guts: ["Milquetoast", "Bold", "Staunch", "Dauntless", "Lionhearted"],
  proficiency: ["Bumbling", "Decent", "Skilled", "Masterful", "Transcendent"],
  kindness: ["Inoffensive", "Considerate", "Empathetic", "Selfless", "Angelic"],
  charm: ["Existent", "Noteworthy", "Suave", "Charismatic", "Debonair"],
};

export default function StatsStar({ stats }) {
  const cx = 250;
  const cy = 250;
  const maxRadius = 165;
  const statKeys = ["knowledge", "guts", "proficiency", "kindness", "charm"];

  const getCoords = (rank, index, radiusMultiplier = 1) => {
    const angle = (Math.PI / 180) * (index * 72 - 90);
    const radius = (rank / 5) * maxRadius * radiusMultiplier;
    return {
      x: cx + radius * Math.cos(angle),
      y: cy + radius * Math.sin(angle),
    };
  };

  const dataPoints = statKeys
    .map((key, i) => {
      const rank = stats[key]?.rank || 1;
      const coords = getCoords(rank, i);
      return `${coords.x},${coords.y}`;
    })
    .join(" ");

  return (
    <div style={containerStyle}>
      <svg
        width="550"
        height="550"
        viewBox="0 0 500 500"
        style={{ overflow: "visible" }}
      >
        {/* 1. THE BIG BLACK BACKGROUND STAR */}
        <polygon
          points="250,10 320,170 490,170 350,280 410,460 250,350 90,460 150,280 10,170 180,170"
          fill="rgba(15, 15, 15, 0.95)"
          stroke="#333"
          strokeWidth="2"
        />

        {/* 2. THE RADIAL WEB LINES */}
        {statKeys.map((_, i) => {
          const end = getCoords(5, i);
          return (
            <line
              key={`line-${i}`}
              x1={cx}
              y1={cy}
              x2={end.x}
              y2={end.y}
              stroke="rgba(255, 255, 255, 0.15)"
              strokeWidth="1.5"
            />
          );
        })}

        {/* 3. THE DATA SHAPE */}
        <polygon
          points={dataPoints}
          fill="rgba(212, 175, 55, 0.7)"
          stroke="#fdd835"
          strokeWidth="4"
          strokeLinejoin="round"
          style={{
            transition: "all 0.8s cubic-bezier(0.175, 0.885, 0.32, 1.275)",
            filter: "drop-shadow(0 0 10px rgba(253, 216, 53, 0.4))",
          }}
        />

        {/* 4. CENTRAL GOLD STAR */}
        <polygon
          points="250,220 265,245 290,250 265,265 270,290 250,275 230,290 235,265 210,250 235,245"
          fill="#fdd835"
          stroke="#fff"
          strokeWidth="2"
        />

        {/* 5. LABELS AND RANK TEXT */}
        {statKeys.map((key, i) => {
          const labelPos = getCoords(5, i, 1.4);
          const currentRank = stats[key]?.rank || 1;
          const rankLabel = RANK_NAMES[key][currentRank - 1] || "???";

          return (
            <g
              key={`label-${key}`}
              style={{ filter: "drop-shadow(2px 2px 0px #000)" }}
            >
              <text
                x={labelPos.x}
                y={labelPos.y - 8}
                textAnchor="middle"
                style={labelTextStyle}
              >
                {key.toUpperCase()}
              </text>
              <text
                x={labelPos.x}
                y={labelPos.y + 15}
                textAnchor="middle"
                style={rankTextStyle}
              >
                {rankLabel}
              </text>
            </g>
          );
        })}
      </svg>
    </div>
  );
}

const containerStyle = {
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  transform: "rotate(-2deg) scale(1.05)",
  margin: "20px auto",
  overflow: "visible",
};

const labelTextStyle = {
  fill: "#fdd835",
  fontSize: "24px",
  fontWeight: "900",
  fontFamily: "'Permanent Marker', cursive",
  paintOrder: "stroke",
  stroke: "#000",
  strokeWidth: "6px",
  letterSpacing: "1px",
};

const rankTextStyle = {
  fill: "#fff",
  fontSize: "16px",
  fontWeight: "bold",
  fontFamily: "sans-serif",
  fontStyle: "italic",
  textTransform: "uppercase",
};
