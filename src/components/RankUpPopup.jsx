import { useEffect } from "react";
import { motion as Motion } from "motion/react";
import { statPresentation } from "../data/presentation";
export default function RankUpPopup({ statName, rank, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 3500);
    return () => clearTimeout(timer);
  }, [onComplete]);
  return (
    <Motion.div
      className="rank-overlay"
      role="status"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
    >
      <Motion.div
        className="rank-burst"
        initial={{ scale: 0.4, rotate: -35 }}
        animate={{ scale: 1, rotate: -8 }}
        transition={{ type: "spring", stiffness: 240, damping: 18 }}
        aria-hidden="true"
      >
        ★
      </Motion.div>
      <Motion.div
        className="rank-message"
        initial={{ scale: 0.5, y: 30 }}
        animate={{ scale: 1, y: 0 }}
      >
        <span className="eyebrow">SOCIAL STAT INCREASED</span>
        <h2>RANK UP!!</h2>
        <p>
          {statPresentation[statName].label} <strong>{rank}</strong>
        </p>
        <span className="rank-name">
          {statPresentation[statName].ranks[rank - 1]}
        </span>
        <button className="outline-button" onClick={onComplete}>
          Continue →
        </button>
      </Motion.div>
    </Motion.div>
  );
}
