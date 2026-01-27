import { Link } from "react-router-dom";
import { useState } from "react";

export default function NavBar() {
  return (
    <nav style={navStyle}>
      <NavLink to="/" label="Daily" />
      <NavLink to="/stats" label="Stats" />
      <NavLink to="/goals" label="Goals" />
    </nav>
  );
}

// A small helper component to handle hover effects for each link
function NavLink({ to, label }) {
  const [hovered, setHovered] = useState(false);

  const dynamicLinkStyle = {
    ...linkStyle,
    color: hovered ? "#d32f2f" : "#fff",
    transform: hovered ? "scale(1.2) rotate(-5deg)" : "scale(1)",
  };

  return (
    <Link
      to={to}
      style={dynamicLinkStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      {label.toUpperCase()}
    </Link>
  );
}

// --- STYLES ---

const navStyle = {
  position: "fixed",
  bottom: 0,
  left: 0,
  width: "100%",
  background: "#000",
  display: "flex",
  justifyContent: "space-around",
  padding: "20px 0",
  borderTop: "5px solid #d32f2f",
  zIndex: 1000,
  boxShadow: "0 -5px 15px rgba(211, 47, 47, 0.3)",
};

const linkStyle = {
  textDecoration: "none",
  fontFamily: "'Permanent Marker', cursive",
  fontSize: "1.5rem",
  transition: "all 0.2s ease-in-out",
  display: "inline-block",
};
