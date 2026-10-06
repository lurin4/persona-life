import { NavLink } from "react-router-dom";
import { Zap, Star, Crosshair, ArrowUpRight } from "lucide-react";
const links = [
  { to: "/", label: "Daily life", Icon: Zap },
  { to: "/stats", label: "Social stats", Icon: Star },
  { to: "/goals", label: "Missions", Icon: Crosshair },
];
export default function NavBar() {
  return (
    <aside className="sidebar">
      <a className="brand" href="/" aria-label="Persona Life home">
        <span className="brand-symbol">
          P<span>★</span>
        </span>
        <span>
          PERSONA<span className="brand-life">LIFE.</span>
        </span>
      </a>
      <div className="sidebar-caption">ACTIVITIES / STATS / MISSIONS</div>
      <nav aria-label="Main navigation">
        {links.map(({ to, label, Icon: LinkIcon }, index) => (
          <NavLink
            aria-label={label}
            end={to === "/"}
            key={to}
            to={to}
            className={({ isActive }) =>
              `nav-link ${isActive ? "is-active" : ""}`
            }
          >
            <span className="nav-index">0{index + 1}</span>
            <LinkIcon size={20} />
            <span>{label}</span>
            <ArrowUpRight className="nav-arrow" size={20} />
          </NavLink>
        ))}
      </nav>
      <div className="sidebar-bottom">
        <span className="small-star">✦</span>
        <p>
          100 XP per rank
          <br />
          <strong>5 social stats</strong>
        </p>
        <span className="edition">PERSONA LIFE / LOCAL SAVE</span>
      </div>
    </aside>
  );
}
