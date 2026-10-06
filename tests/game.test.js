import process from "node:process";
import { test } from "node:test";
import assert from "node:assert/strict";
import {
  completeRewardMission,
  actionBlocked,
  missionState,
  blockKey,
  daysRemaining,
  gainXP,
  isDate,
  isGoal,
  loadGame,
} from "../src/utils/game.js";

test("blocks differ across local dates and time boundaries", () => {
  assert.notEqual(
    blockKey(new Date("2026-10-06T08:00:00")),
    blockKey(new Date("2026-10-07T08:00:00")),
  );
  assert.notEqual(
    blockKey(new Date("2026-10-06T11:59:59")),
    blockKey(new Date("2026-10-06T12:00:00")),
  );
});
test("deadline days ignore timezone offsets and DST", () => {
  const original = process.env.TZ;
  try {
    for (const zone of ["Europe/London", "America/Los_Angeles"]) {
      process.env.TZ = zone;
      assert.equal(
        daysRemaining("2026-10-06", new Date("2026-10-06T12:00:00")),
        0,
      );
      assert.equal(
        daysRemaining("2026-10-26", new Date("2026-10-24T12:00:00")),
        2,
      );
    }
  } finally {
    if (original === undefined) delete process.env.TZ;
    else process.env.TZ = original;
  }
});
test("XP carries over across ranks and caps at rank five", () => {
  assert.deepEqual(gainXP({ rank: 1, xp: 90 }, 15), { rank: 2, xp: 5 });
  assert.deepEqual(gainXP({ rank: 1, xp: 90 }, 215), { rank: 4, xp: 5 });
  assert.deepEqual(gainXP({ rank: 4, xp: 90 }, 15), { rank: 5, xp: 100 });
});
test("invalid dates and missions are rejected", () => {
  assert.equal(isDate("2026-02-30"), false);
  assert.equal(isDate(""), false);
  assert.equal(
    Boolean(
      isGoal({
        id: "1",
        title: " ",
        deadline: "2026-10-06",
        targetStat: "knowledge",
        targetRank: 2,
      }),
    ),
    false,
  );
});
test("migration preserves valid stats and recovers malformed data", () => {
  const original = globalThis.localStorage;
  try {
    globalThis.localStorage = {
      getItem: (key) =>
        key === "p5_stats"
          ? JSON.stringify({ knowledge: { rank: 3, xp: 40 }, guts: null })
          : "null",
    };
    const game = loadGame();
    assert.deepEqual(game.stats.knowledge, { rank: 3, xp: 40 });
    assert.deepEqual(game.stats.guts, { rank: 1, xp: 0 });
    assert.equal(game.lastAction, null);
    globalThis.localStorage = {
      getItem: () => {
        throw new Error("Storage denied");
      },
    };
    assert.equal(loadGame().stats.knowledge.rank, 1);
  } finally {
    if (original === undefined) delete globalThis.localStorage;
    else globalThis.localStorage = original;
  }
});

test("stat targets clear immediately, including before or after deadlines", () => {
  const goal = {
    targetStat: "knowledge",
    targetRank: 2,
    deadline: "2026-10-20",
  };
  const stats = { knowledge: { rank: 2, xp: 0 } };
  assert.equal(
    missionState(goal, stats, new Date("2026-10-06T12:00:00")).cleared,
    true,
  );
  assert.equal(
    missionState(goal, stats, new Date("2026-10-21T12:00:00")).cleared,
    true,
  );
  assert.equal(
    missionState(
      goal,
      { knowledge: { rank: 1 } },
      new Date("2026-10-21T12:00:00"),
    ).overdue,
    true,
  );
});
test("tasks require explicit completion and support optional deadlines", () => {
  const goal = {
    id: "task",
    title: "Assignment",
    type: "task",
    deadline: "",
    status: "active",
  };
  assert.equal(isGoal(goal), true);
  assert.equal(missionState(goal, {}).cleared, false);
  assert.equal(missionState(goal, {}).days, null);
  assert.equal(missionState({ ...goal, status: "cleared" }, {}).cleared, true);
});
test("flexible mode never locks actions; Persona mode locks only the current block", () => {
  const now = new Date("2026-10-06T08:00:00");
  const action = { block: blockKey(now) };
  assert.equal(actionBlocked(action, "free", now), false);
  assert.equal(actionBlocked(action, "persona", now), true);
  assert.equal(
    actionBlocked(action, "persona", new Date("2026-10-07T08:00:00")),
    false,
  );
});

test("reward mission grants chosen stat XP once and triggers normal rank progression", () => {
  const goal = {
    id: "book",
    title: "Finish a book",
    type: "reward",
    deadline: "",
    targetStat: "knowledge",
    rewardXP: 50,
    status: "active",
  };
  const game = {
    stats: { knowledge: { rank: 1, xp: 75 }, guts: { rank: 1, xp: 0 } },
    goals: [goal],
    lastAction: null,
  };
  const completed = completeRewardMission(game, "book");
  assert.deepEqual(completed.stats.knowledge, { rank: 2, xp: 25 });
  assert.deepEqual(completed.stats.guts, game.stats.guts);
  assert.equal(completed.goals[0].status, "cleared");
  assert.equal(missionState(completed.goals[0], completed.stats).cleared, true);
  assert.equal(completeRewardMission(completed, "book"), completed);
  assert.equal(
    completeRewardMission(JSON.parse(JSON.stringify(completed)), "book").stats
      .knowledge.xp,
    25,
  );
  assert.equal(game.goals[0].status, "active");
});
test("activity undo preserves mission rewards without clearing the Persona action lock", () => {
  const game = {
    stats: { knowledge: { rank: 1, xp: 90 } },
    goals: [
      {
        id: "book",
        title: "Book",
        type: "reward",
        deadline: "",
        targetStat: "knowledge",
        rewardXP: 50,
        status: "active",
      },
    ],
    lastAction: {
      block: "2026-10-06:0",
      stat: "knowledge",
      previous: { rank: 1, xp: 75 },
    },
  };
  const completed = completeRewardMission(game, "book");
  assert.deepEqual(completed.stats.knowledge, { rank: 2, xp: 40 });
  assert.deepEqual(completed.lastAction.previous, { rank: 2, xp: 25 });
  assert.equal(completed.lastAction.block, game.lastAction.block);
});
test("reward mission rejects invalid rewards and caps stats at rank five", () => {
  const goal = {
    id: "book",
    title: "Book",
    type: "reward",
    deadline: "",
    targetStat: "knowledge",
    rewardXP: 50,
    status: "active",
  };
  for (const rewardXP of [0, -5, 101, NaN])
    assert.equal(Boolean(isGoal({ ...goal, rewardXP })), false);
  const game = {
    stats: { knowledge: { rank: 5, xp: 100 } },
    goals: [goal],
    lastAction: null,
  };
  assert.deepEqual(
    completeRewardMission(game, "book").stats.knowledge,
    game.stats.knowledge,
  );
});
