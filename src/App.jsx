import { useState, useEffect, useCallback } from "react";
import { Routes, Route, useLocation } from "react-router-dom";

import { AnimatePresence, motion as Motion, MotionConfig } from "motion/react";

// Components
import { sound } from "./utils/sound";
import Settings from "./components/Settings";
import { backgroundFile } from "./utils/background";
import Daily from "./pages/Daily";
import Stats from "./pages/Stats";
import Goals from "./pages/Goals";
import NavBar from "./components/NavBar";
import RankUpPopup from "./components/RankUpPopup";
import XPFeedback from "./components/XPFeedback";
import Calendar from "./components/Calendar";
import DeadlineTracker from "./components/DeadlineTracker";

import { initialActivities } from "./data/activities";
import {
  completeRewardMission,
  actionBlocked,
  blockKey,
  timeIndex as getTimeIndex,
  daysRemaining,
  gainXP,
  isStat,
  isGoal,
  isActivity,
  readSaved,
  loadGame,
} from "./utils/game";

const timeBlocks = [
  "Morning",
  "Lunch",
  "After School",
  "Evening",
  "Night",
  "Late Night",
];

function App() {
  const location = useLocation();
  const [audio, setAudio] = useState(() =>
    readSaved(
      "p5_audio",
      { enabled: true, volume: 0.35 },
      (value) =>
        value &&
        typeof value.enabled === "boolean" &&
        Number.isFinite(value.volume) &&
        value.volume >= 0 &&
        value.volume <= 1,
    ),
  );
  useEffect(() => {
    sound.configure(audio);
  }, [audio]);
  const updateAudio = (settings) => {
    sound.configure(settings);
    setAudio(settings);
  };
  const playControlSound = (event) => {
    const control = event.target.closest("button, a");
    if (
      !control ||
      control.disabled ||
      control.closest('[data-sfx="custom"]') ||
      control.classList.contains("activity-main")
    )
      return;
    sound.play(control.matches("a") ? "navigate" : "click");
  };
  const [mode, setMode] = useState(() =>
    readSaved("p5_mode", "free", (value) =>
      ["free", "persona"].includes(value),
    ),
  );
  const [appearance, setAppearance] = useState(() =>
    readSaved(
      "p5_appearance",
      { color: "#d71932", shade: 25 },
      (value) =>
        value &&
        /^#[0-9a-f]{6}$/i.test(value.color) &&
        Number.isFinite(value.shade) &&
        value.shade >= 0 &&
        value.shade <= 75,
    ),
  );
  const [image, setImage] = useState(null);
  const [imageUrl, setImageUrl] = useState("");
  useEffect(() => {
    let active = true;
    backgroundFile()
      .then((file) => {
        if (active && file) setImage(file);
      })
      .catch(() => {});
    return () => {
      active = false;
    };
  }, []);
  useEffect(() => {
    const url = image ? URL.createObjectURL(image) : "";
    const timer = setTimeout(() => setImageUrl(url), 0);
    return () => {
      clearTimeout(timer);
      if (url) URL.revokeObjectURL(url);
    };
  }, [image]);
  const [game, setGame] = useState(() => {
    const saved = loadGame();
    return {
      ...saved,
      goals: (Array.isArray(saved.goals)
        ? saved.goals
        : readSaved("p5_goals", [], Array.isArray)
      ).filter(isGoal),
    };
  });
  const { stats, lastAction, goals } = game;
  const setGoals = (update) =>
    setGame((previous) => ({ ...previous, goals: update(previous.goals) }));
  const [activities, setActivities] = useState(() =>
    readSaved("p5_activities", initialActivities, Array.isArray).filter(
      isActivity,
    ),
  );
  const [now, setNow] = useState(() => new Date());
  const [storageError, setStorageError] = useState(false);
  const [rankUpData, setRankUpData] = useState(null);
  const [feedback, setFeedback] = useState(null);
  const timeIndex = getTimeIndex(now);
  const hasUsedAction = actionBlocked(lastAction, mode, now);
  const clearFeedback = useCallback(() => setFeedback(null), []);
  const clearRankUp = useCallback(() => setRankUpData(null), []);

  useEffect(() => {
    const update = () => setNow(new Date());
    const timer = setInterval(update, 1000);
    window.addEventListener("focus", update);
    return () => {
      clearInterval(timer);
      window.removeEventListener("focus", update);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      try {
        localStorage.setItem("p5_audio", JSON.stringify(audio));
        localStorage.setItem("p5_mode", JSON.stringify(mode));
        localStorage.setItem("p5_appearance", JSON.stringify(appearance));
        localStorage.setItem("p5_game", JSON.stringify(game));
        localStorage.setItem("p5_goals", JSON.stringify(goals));
        localStorage.setItem("p5_activities", JSON.stringify(activities));
        setStorageError(false);
      } catch {
        setStorageError(true);
      }
    }, 0);
    return () => clearTimeout(timer);
  }, [game, goals, activities, mode, appearance, audio]);

  const addXP = (statName, amount) => {
    const block = blockKey(new Date());
    if (
      actionBlocked(lastAction, mode) ||
      !isStat(statName) ||
      !Number.isFinite(amount) ||
      amount <= 0
    )
      return;
    const next = gainXP(stats[statName], amount);
    sound.play(next.rank > stats[statName].rank ? "rank" : "xp");
    setFeedback({ statName, amount });
    if (next.rank > stats[statName].rank)
      setRankUpData({ statName, rank: next.rank });
    setGame((previous) =>
      actionBlocked(previous.lastAction, mode)
        ? previous
        : {
            ...previous,
            stats: {
              ...previous.stats,
              [statName]: gainXP(previous.stats[statName], amount),
            },
            lastAction: {
              block,
              stat: statName,
              previous: previous.stats[statName],
            },
          },
    );
  };

  const resetAction = () => {
    if (lastAction) sound.play("undo");
    setGame((previous) => {
      const action = previous.lastAction;
      if (!action) return previous;
      return {
        ...previous,
        stats: { ...previous.stats, [action.stat]: action.previous },
        lastAction: null,
      };
    });
    clearFeedback();
    clearRankUp();
  };

  const addCustomActivity = (name, stat) => {
    if (!name.trim() || !isStat(stat)) return;
    const newAct = { id: crypto.randomUUID(), name: name.trim(), stat, xp: 15 };
    setActivities((prev) => [...prev, newAct]);
  };

  const deleteActivity = (id) => {
    setActivities((prev) => prev.filter((act) => act.id !== id));
  };

  const addCustomGoal = (
    title,
    deadline,
    targetStat,
    targetRank,
    type,
    rewardXP,
  ) => {
    const newGoal = {
      id: crypto.randomUUID(),
      title: title.trim(),
      deadline,
      targetStat,
      targetRank: Number(targetRank),
      type,
      rewardXP: Number(rewardXP),
      status: "active",
    };
    if (
      !["reward", "rank"].includes(type) ||
      !isGoal(newGoal) ||
      (deadline && daysRemaining(deadline) < 0)
    )
      return false;
    setGoals((prev) => [...prev, newGoal]);
    return true;
  };

  const toggleGoal = (id) => {
    const goal = goals.find((mission) => mission.id === id);
    if (goal?.type === "reward" && goal.status !== "cleared") {
      const next = gainXP(stats[goal.targetStat], goal.rewardXP);
      sound.play(next.rank > stats[goal.targetStat].rank ? "rank" : "reward");
      setFeedback({ statName: goal.targetStat, amount: goal.rewardXP });
      if (next.rank > stats[goal.targetStat].rank)
        setRankUpData({ statName: goal.targetStat, rank: next.rank });
      setGame((previous) => completeRewardMission(previous, id));
    } else {
      setGoals((previous) =>
        previous.map((mission) =>
          mission.id === id && mission.type === "task"
            ? {
                ...mission,
                status: mission.status === "cleared" ? "active" : "cleared",
              }
            : mission,
        ),
      );
    }
  };

  const deleteGoal = (id) =>
    setGoals((prev) => prev.filter((g) => g.id !== id));

  return (
    <MotionConfig reducedMotion="user" transition={{ duration: 0.25 }}>
      <div className="app-shell" onClickCapture={playControlSound}>
        <div
          className="scene-texture"
          style={{
            backgroundColor: appearance.color,
            backgroundImage: imageUrl
              ? `linear-gradient(rgba(0,0,0,${appearance.shade / 100}), rgba(0,0,0,${appearance.shade / 100})), url("${imageUrl}")`
              : undefined,
          }}
          aria-hidden="true"
        />
        <NavBar />
        <div className="main-shell">
          <header className="topbar">
            <Calendar now={now} timeLabel={timeBlocks[timeIndex]} />
            <DeadlineTracker
              goals={goals}
              stats={stats}
              getDaysRemaining={(deadline) => daysRemaining(deadline, now)}
            />
            <Settings
              audio={audio}
              setAudio={updateAudio}
              appearance={appearance}
              setAppearance={setAppearance}
              image={image}
              setImage={setImage}
              mode={mode}
              setMode={setMode}
            />
          </header>
          {storageError && (
            <p role="alert" className="storage-warning">
              Progress could not be saved. Keep this tab open and allow browser
              storage.
            </p>
          )}

          <AnimatePresence>
            {feedback && (
              <XPFeedback
                stat={feedback.statName}
                amount={feedback.amount}
                onComplete={clearFeedback}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {rankUpData && (
              <RankUpPopup
                statName={rankUpData.statName}
                rank={rankUpData.rank}
                onComplete={clearRankUp}
              />
            )}
          </AnimatePresence>

          <main className="content-area">
            <AnimatePresence mode="wait">
              <Motion.div
                key={location.pathname}
                initial={{ opacity: 0, x: 24 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -20 }}
                transition={{ duration: 0.18 }}
              >
                <Routes location={location}>
                  <Route
                    path="/"
                    element={
                      <Daily
                        stats={stats}
                        timeLabel={timeBlocks[timeIndex]}
                        addXP={addXP}
                        mode={mode}
                        canUndo={!!lastAction}
                        hasUsedAction={hasUsedAction}
                        activities={activities}
                        addCustomActivity={addCustomActivity}
                        deleteActivity={deleteActivity}
                        resetAction={resetAction}
                      />
                    }
                  />
                  <Route path="/stats" element={<Stats stats={stats} />} />
                  <Route
                    path="/goals"
                    element={
                      <Goals
                        stats={stats}
                        now={now}
                        goals={goals}
                        addCustomGoal={addCustomGoal}
                        deleteGoal={deleteGoal}
                        toggleGoal={toggleGoal}
                      />
                    }
                  />
                </Routes>
              </Motion.div>
            </AnimatePresence>
          </main>
          <footer className="site-footer">
            <span>PERSONA LIFE</span>
            <span>PROGRESS SAVED IN THIS BROWSER</span>
          </footer>
        </div>
      </div>
    </MotionConfig>
  );
}

export default App;
