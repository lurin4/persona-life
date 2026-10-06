import { useEffect } from "react";
import { motion as Motion } from "motion/react";
import { statPresentation } from "../data/presentation";
export default function XPFeedback({ stat, amount, onComplete }) {
  useEffect(() => {
    const timer = setTimeout(onComplete, 2000);
    return () => clearTimeout(timer);
  }, [onComplete]);
  const { Icon, label } = statPresentation[stat];
  return (
    <Motion.div
      className="xp-feedback"
      role="status"
      initial={{ opacity: 0, y: 40, rotate: 5, scale: 0.8 }}
      animate={{ opacity: 1, y: 0, rotate: -3, scale: 1 }}
      exit={{ opacity: 0, y: -30 }}
    >
      <Icon size={24} />
      <span>
        {label}
        <strong>+{amount} XP</strong>
      </span>
      <span className="feedback-star">✦</span>
    </Motion.div>
  );
}
