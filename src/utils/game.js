import { initialStats } from "../data/stats.js";

export const statKeys = Object.keys(initialStats);
export const isStat = (value) => statKeys.includes(value);
export const isProgress = (value) =>
  value &&
  Number.isInteger(value.rank) &&
  value.rank >= 1 &&
  value.rank <= 5 &&
  Number.isFinite(value.xp) &&
  value.xp >= 0 &&
  value.xp <= 100;
export const isDate = (value) => {
  if (typeof value !== "string" || !/^\d{4}-\d{2}-\d{2}$/.test(value))
    return false;
  const date = new Date(`${value}T00:00:00Z`);
  return (
    !Number.isNaN(date.getTime()) && date.toISOString().slice(0, 10) === value
  );
};
export const dateKey = (now) =>
  `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, "0")}-${String(now.getDate()).padStart(2, "0")}`;
export function timeIndex(now) {
  const hour = now.getHours();
  if (hour < 6) return 5;
  if (hour < 12) return 0;
  if (hour < 14) return 1;
  if (hour < 18) return 2;
  if (hour < 21) return 3;
  return 4;
}
export const blockKey = (now) => `${dateKey(now)}:${timeIndex(now)}`;
export function daysRemaining(deadline, now = new Date()) {
  if (!isDate(deadline)) return NaN;
  return (
    (Date.parse(`${deadline}T00:00:00Z`) -
      Date.parse(`${dateKey(now)}T00:00:00Z`)) /
    86400000
  );
}
export function gainXP(progress, amount) {
  let { rank, xp } = progress;
  xp += amount;
  while (xp >= 100 && rank < 5) {
    xp -= 100;
    rank += 1;
  }
  return { rank, xp: rank === 5 ? 100 : xp };
}
export const isActivity = (value) =>
  value &&
  typeof value.id === "string" &&
  typeof value.name === "string" &&
  !!value.name.trim() &&
  isStat(value.stat) &&
  Number.isFinite(value.xp) &&
  value.xp > 0;
export const isGoal = (value) =>
  value &&
  typeof value.id === "string" &&
  typeof value.title === "string" &&
  !!value.title.trim() &&
  (value.deadline === "" || isDate(value.deadline)) &&
  (value.type === "task" ||
    (value.type === "reward" &&
      isStat(value.targetStat) &&
      Number.isInteger(value.rewardXP) &&
      value.rewardXP >= 1 &&
      value.rewardXP <= 100) ||
    ((value.type === undefined || value.type === "rank") &&
      isStat(value.targetStat) &&
      Number.isInteger(value.targetRank) &&
      value.targetRank >= 1 &&
      value.targetRank <= 5));
export function readSaved(key, fallback, validate) {
  try {
    const saved = JSON.parse(localStorage.getItem(key));
    return validate(saved) ? saved : fallback;
  } catch {
    return fallback;
  }
}
export function loadGame() {
  const saved = readSaved(
    "p5_game",
    null,
    (value) =>
      value &&
      statKeys.every((key) => isProgress(value.stats?.[key])) &&
      (value.lastAction === null ||
        (typeof value.lastAction?.block === "string" &&
          /^\d{4}-\d{2}-\d{2}:[0-5]$/.test(value.lastAction.block) &&
          isDate(value.lastAction.block.slice(0, 10)) &&
          isStat(value.lastAction.stat) &&
          isProgress(value.lastAction.previous))),
  );
  if (saved) return saved;
  const legacy = readSaved(
    "p5_stats",
    initialStats,
    (value) => value && typeof value === "object",
  );
  return {
    stats: Object.fromEntries(
      statKeys.map((key) => [
        key,
        isProgress(legacy[key]) ? legacy[key] : initialStats[key],
      ]),
    ),
    lastAction: null,
  };
}

export function missionState(goal, stats, now = new Date()) {
  const cleared = ["task", "reward"].includes(goal.type)
    ? goal.status === "cleared"
    : stats[goal.targetStat].rank >= goal.targetRank;
  const days = goal.deadline ? daysRemaining(goal.deadline, now) : null;
  return { cleared, days, overdue: !cleared && days !== null && days < 0 };
}
export function actionBlocked(lastAction, mode, now = new Date()) {
  return mode === "persona" && lastAction?.block === blockKey(now);
}

// Store reward completion and XP together; repeated completion is a no-op.
export function completeRewardMission(game, id) {
  const goal = game.goals.find((mission) => mission.id === id);
  if (
    !goal ||
    goal.type !== "reward" ||
    goal.status === "cleared" ||
    !isGoal(goal)
  )
    return game;
  const stat = goal.targetStat;
  return {
    ...game,
    stats: { ...game.stats, [stat]: gainXP(game.stats[stat], goal.rewardXP) },
    goals: game.goals.map((mission) =>
      mission.id === id ? { ...mission, status: "cleared" } : mission,
    ),
    // Activity undo must preserve any mission reward received afterwards.
    lastAction:
      game.lastAction?.stat === stat
        ? {
            ...game.lastAction,
            previous: gainXP(game.lastAction.previous, goal.rewardXP),
          }
        : game.lastAction,
  };
}
