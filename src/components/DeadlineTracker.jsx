import { Crosshair, ArrowUpRight } from "lucide-react";
import { Link } from "react-router-dom";
import { missionState } from "../utils/game";
export default function DeadlineTracker({ goals, stats, getDaysRemaining }) {
  const urgent = goals
    .filter((goal) => !missionState(goal, stats).cleared && goal.deadline)
    .map((goal) => ({ ...goal, days: getDaysRemaining(goal.deadline) }))
    .sort((a, b) => a.days - b.days)[0];
  return (
    <Link to="/goals" className="deadline-tracker">
      <Crosshair size={22} />
      <div>
        <span className="eyebrow">
          {urgent
            ? urgent.days < 0
              ? "OVERDUE MISSION"
              : "NEXT DEADLINE"
            : "MISSIONS"}
        </span>
        <strong>{urgent ? urgent.title : "View or add missions"}</strong>
      </div>
      {urgent ? (
        <span className="deadline-days">
          {String(Math.abs(urgent.days)).padStart(2, "0")}
          <small>
            {urgent.days < 0
              ? "DAYS OVERDUE"
              : urgent.days === 0
                ? "DUE TODAY"
                : "DAYS LEFT"}
          </small>
        </span>
      ) : (
        <ArrowUpRight size={22} />
      )}
    </Link>
  );
}
