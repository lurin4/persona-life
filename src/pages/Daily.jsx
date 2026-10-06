import { motion as Motion, AnimatePresence } from "motion/react";
import { ArrowUpRight, Check, RotateCcw, X, Zap } from "lucide-react";
import ActivityCreator from "../components/ActivityCreator";
import { statPresentation } from "../data/presentation";
export default function Daily({
  addXP,
  hasUsedAction,
  activities,
  addCustomActivity,
  deleteActivity,
  resetAction,
  stats,
  timeLabel,
  mode,
  canUndo,
}) {
  return (
    <section className="daily-page">
      <header className="page-heading">
        <span className="eyebrow">
          <span className="red-dot" /> ACTIVITY LOG
        </span>
        <h1>
          Daily
          <br />
          <span className="cutout">activities.</span>
          <span className="heading-star" aria-hidden="true">
            ✦
          </span>
        </h1>
        <p>
          Log an activity after completing it in real life. Each activity awards
          XP to its associated social stat.
        </p>
      </header>
      <div className={`action-status ${hasUsedAction ? "is-complete" : ""}`}>
        <span className="status-icon">
          {hasUsedAction ? <Check /> : <Zap />}
        </span>
        <div>
          <strong>
            {hasUsedAction
              ? "Time block used"
              : mode === "persona"
                ? `${timeLabel} · one action available`
                : "Flexible mode · log activities anytime"}
          </strong>
          <p>
            {hasUsedAction
              ? "Activity complete. Come back in the next time block."
              : "100 XP increases a stat by one rank. Maximum rank: 5."}
          </p>
        </div>
        <span className="status-stamp">
          {hasUsedAction
            ? "COMPLETE"
            : mode === "persona"
              ? "1 ACTION AVAILABLE"
              : "NO TIME LIMIT"}
        </span>
      </div>
      <div className="section-heading">
        <h2>Choose your action</h2>
        <span>{String(activities.length).padStart(2, "0")} ACTIVITIES</span>
      </div>
      <Motion.div className="activity-grid" layout>
        <AnimatePresence>
          {activities.map((activity, index) => {
            const { Icon, label } = statPresentation[activity.stat];
            return (
              <Motion.article
                layout
                key={activity.id}
                className={`activity-card ${hasUsedAction ? "is-used" : ""}`}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9 }}
                transition={{ duration: 0.3, delay: index * 0.035 }}
                whileHover={
                  hasUsedAction ? {} : { y: -6, rotate: index % 2 ? 1 : -1 }
                }
              >
                <button
                  className="activity-main"
                  disabled={hasUsedAction}
                  onClick={() => addXP(activity.stat, activity.xp)}
                >
                  <div className="card-topline">
                    <span className="eyebrow">{label}</span>
                    <span className="xp-chip">+{activity.xp} XP</span>
                  </div>
                  <Icon className="activity-symbol" strokeWidth={1.5} />
                  <span className="card-number" aria-hidden="true">
                    0{index + 1}
                  </span>
                  <h3>{activity.name}</h3>
                  <p>
                    {activity.xp} XP toward {label}
                  </p>
                  <div className="card-bottom">
                    <span>
                      RANK {stats[activity.stat].rank}{" "}
                      <span className="card-progress">/ 5</span>
                    </span>
                    <span className="card-arrow">
                      <ArrowUpRight size={20} />
                    </span>
                  </div>
                </button>
                <button
                  className="delete-button"
                  aria-label={`Delete ${activity.name}`}
                  onClick={() => deleteActivity(activity.id)}
                >
                  <X size={14} />
                </button>
              </Motion.article>
            );
          })}
        </AnimatePresence>
      </Motion.div>
      <div className="daily-footer">
        <ActivityCreator addCustomActivity={addCustomActivity} />
        {canUndo && (
          <button
            data-sfx="custom"
            className="text-button"
            onClick={resetAction}
          >
            <RotateCcw size={15} /> Undo last activity
          </button>
        )}
        <p className="form-help">
          Undo removes the XP from your last logged activity. Activity rules can
          be changed in Settings.
        </p>
      </div>
    </section>
  );
}
