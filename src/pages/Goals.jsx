import { motion as Motion, AnimatePresence } from "motion/react";
import { Crosshair, X, Check } from "lucide-react";
import GoalCreator from "../components/GoalCreator";
import { missionState } from "../utils/game";
export default function Goals({
  stats,
  goals,
  addCustomGoal,
  deleteGoal,
  toggleGoal,
  now,
}) {
  return (
    <section>
      <header className="page-heading">
        <span className="eyebrow">MISSION LOG</span>
        <h1>
          Your
          <br />
          <span className="cutout">missions.</span>
        </h1>
        <p>
          Reward missions award stat XP when you mark them complete. Stat
          targets clear immediately when you reach the required rank. You do not
          need to wait for a deadline.
        </p>
      </header>
      <div className="rules-panel">
        <strong>How deadlines work</strong>
        <p>
          A deadline is a reminder. Overdue missions stay available and can
          still be cleared. Reward missions grant their listed XP once. Stat
          targets do not award XP.
        </p>
      </div>
      <div className="section-heading">
        <h2>Mission progress</h2>
        <span>
          {
            goals.filter((goal) => !missionState(goal, stats, now).cleared)
              .length
          }{" "}
          ACTIVE /{" "}
          {
            goals.filter((goal) => missionState(goal, stats, now).cleared)
              .length
          }{" "}
          CLEARED
        </span>
      </div>
      <div className="mission-grid">
        <AnimatePresence>
          {[...goals]
            .sort((a, b) =>
              (a.deadline || "9999").localeCompare(b.deadline || "9999"),
            )
            .map((goal) => {
              const reward = goal.type === "reward";
              const task = goal.type === "task" || reward;
              const { cleared, days, overdue } = missionState(goal, stats, now);
              const rank = task ? 0 : stats[goal.targetStat].rank;
              return (
                <Motion.article
                  layout
                  key={goal.id}
                  className={`mission-card ${cleared ? "is-cleared" : ""}`}
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                >
                  <button
                    className="delete-button"
                    onClick={() => deleteGoal(goal.id)}
                    aria-label={`Delete ${goal.title}`}
                  >
                    <X size={16} />
                  </button>
                  <span className="eyebrow">
                    {cleared ? "CLEARED" : overdue ? "OVERDUE" : "ACTIVE"} ·{" "}
                    {reward ? "REWARD MISSION" : task ? "TASK" : "STAT TARGET"}
                  </span>
                  <h2>{goal.title}</h2>
                  <div className="mission-details">
                    {reward && (
                      <span>
                        {goal.targetStat}{" "}
                        <strong>
                          +{goal.rewardXP} XP {cleared ? "AWARDED" : "REWARD"}
                        </strong>
                      </span>
                    )}
                    {!task && (
                      <span>
                        {goal.targetStat}{" "}
                        <strong>
                          RANK {rank} / {goal.targetRank}
                        </strong>
                      </span>
                    )}
                    <span>
                      {goal.deadline ? `DUE ${goal.deadline}` : "NO DEADLINE"}
                    </span>
                  </div>
                  {!task && (
                    <div className="xp-track">
                      <Motion.div
                        initial={{ width: 0 }}
                        animate={{
                          width: `${Math.min(100, (rank / goal.targetRank) * 100)}%`,
                        }}
                      />
                    </div>
                  )}
                  <p className="mission-instructions">
                    {reward
                      ? cleared
                        ? "Reward claimed. This mission cannot award XP again."
                        : "Complete this goal in real life, then claim the listed stat XP. Rewards do not use your time-block action."
                      : task
                        ? "Clear this mission after completing the task in real life."
                        : cleared
                          ? "Required rank reached. This mission is automatically cleared."
                          : `Log ${goal.targetStat} activities to reach Rank ${goal.targetRank}. Clears automatically.`}
                  </p>
                  <div className="mission-bottom">
                    <span>
                      {cleared ? <Check size={17} /> : <Crosshair size={17} />}
                      {cleared
                        ? "Mission cleared"
                        : task
                          ? "Awaiting completion"
                          : `${goal.targetRank - rank} more ranks required`}
                    </span>
                    <strong>
                      {cleared
                        ? "CLEAR"
                        : overdue
                          ? `${Math.abs(days)} DAYS OVERDUE`
                          : days === null
                            ? "NO DEADLINE"
                            : days === 0
                              ? "DUE TODAY"
                              : `${days} DAYS LEFT`}
                    </strong>
                  </div>
                  {task && !(reward && cleared) && (
                    <button
                      data-sfx={reward ? "custom" : undefined}
                      className={cleared ? "outline-button" : "primary-button"}
                      onClick={() => toggleGoal(goal.id)}
                    >
                      {cleared
                        ? "Reopen mission"
                        : reward
                          ? `Complete · +${goal.rewardXP} XP`
                          : "Mark complete"}
                    </button>
                  )}
                </Motion.article>
              );
            })}
        </AnimatePresence>
      </div>
      {goals.length === 0 && (
        <div className="empty-missions">
          <Crosshair size={54} strokeWidth={1} />
          <h2>No missions yet</h2>
          <p>Add a reward mission or a social stat target.</p>
        </div>
      )}
      <GoalCreator addCustomGoal={addCustomGoal} />
    </section>
  );
}
