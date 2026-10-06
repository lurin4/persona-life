import { Moon, Sun } from "lucide-react";
export default function Calendar({ now, timeLabel }) {
  const Icon = now.getHours() >= 18 || now.getHours() < 6 ? Moon : Sun;
  return (
    <div className="calendar">
      <div className="calendar-date">
        <span>{now.getMonth() + 1}</span>
        <i>/</i>
        <strong>{now.getDate()}</strong>
      </div>
      <span className="calendar-day">
        {now.toLocaleDateString("en-GB", { weekday: "long" })}
      </span>
      <div className="calendar-time">
        <Icon size={16} />
        {timeLabel}
      </div>
    </div>
  );
}
