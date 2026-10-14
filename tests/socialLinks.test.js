import { test } from "node:test";
import assert from "node:assert/strict";
import { initialStats } from "../src/data/stats.js";
import { completeRewardMission, actionBlocked } from "../src/utils/game.js";
import {
  isSocialLink,
  logHangout,
  undoLastAction,
} from "../src/utils/socialLinks.js";

const now = new Date("2026-10-14T15:00:00");
const createGame = () => ({
  stats: initialStats,
  goals: [],
  lastAction: null,
  socialLinks: [
    {
      id: "alex",
      name: "Alex",
      stat: "knowledge",
      hangouts: 0,
      lastHangout: null,
    },
  ],
});

test("hangouts award the friend's chosen stat and update the count/date atomically", () => {
  const game = createGame();
  game.stats = { ...initialStats, knowledge: { rank: 1, xp: 90 } };
  const next = logHangout(game, "alex", "free", now);
  assert.deepEqual(next.stats.knowledge, { rank: 2, xp: 5 });
  assert.equal(next.stats.charm, initialStats.charm);
  assert.equal(next.socialLinks[0].hangouts, 1);
  assert.equal(next.socialLinks[0].lastHangout, now.toISOString());
  assert.equal(game.socialLinks[0].hangouts, 0);
  const saved = JSON.parse(JSON.stringify(next));
  assert.equal(isSocialLink(saved.socialLinks[0]), true);
  assert.deepEqual(undoLastAction(saved).stats, game.stats);
  assert.deepEqual(undoLastAction(saved).socialLinks, game.socialLinks);
});

test("Persona hangouts share the daily action lock; flexible mode supports later hangouts", () => {
  const game = logHangout(createGame(), "alex", "persona", now);
  assert.equal(actionBlocked(game.lastAction, "persona", now), true);
  assert.equal(logHangout(game, "alex", "persona", now), game);
  const later = logHangout(game, "alex", "free", now);
  assert.equal(later.socialLinks[0].hangouts, 2);
  assert.equal(later.stats.knowledge.xp, 30);
  assert.equal(undoLastAction(later).socialLinks[0].hangouts, 1);
  assert.equal(
    logHangout(game, "alex", "persona", new Date("2026-10-14T18:00:00"))
      .socialLinks[0].hangouts,
    2,
  );
});

test("hangout undo preserves a reward earned afterwards", () => {
  const game = logHangout(createGame(), "alex", "free", now);
  game.goals = [
    {
      id: "book",
      title: "Read a book",
      deadline: "",
      type: "reward",
      targetStat: "knowledge",
      rewardXP: 50,
      status: "active",
    },
  ];
  const undone = undoLastAction(completeRewardMission(game, "book"));
  assert.equal(undone.stats.knowledge.xp, 50);
  assert.equal(undone.socialLinks[0].hangouts, 0);
  assert.equal(undone.goals[0].status, "cleared");
  assert.equal(undoLastAction(undone), undone);
});

test("invalid links cannot award XP and deleting a friend leaves earned XP intact", () => {
  const game = createGame();
  assert.equal(logHangout(game, "missing", "free", now), game);
  for (const change of [
    { name: " " },
    { stat: "unknown" },
    { hangouts: -1 },
    { lastHangout: "invalid" },
  ]) {
    assert.equal(
      Boolean(isSocialLink({ ...game.socialLinks[0], ...change })),
      false,
    );
  }
  const logged = logHangout(game, "alex", "free", now);
  const deleted = { ...logged, socialLinks: [] };
  assert.equal(deleted.stats.knowledge.xp, 15);
  assert.equal(undoLastAction(deleted).stats.knowledge.xp, 0);
  assert.deepEqual(undoLastAction(deleted).socialLinks, []);
});

test("each friend progresses independently from Rank 1 to Rank 10", async () => {
  const { friendshipProgress } = await import("../src/utils/socialLinks.js");
  let game = createGame();
  game.socialLinks.push({
    id: "sam",
    name: "Sam",
    stat: "charm",
    hangouts: 0,
    lastHangout: null,
  });
  assert.deepEqual(friendshipProgress(0), { rank: 1, xp: 0 });
  for (let index = 0; index < 4; index++)
    game = logHangout(game, "alex", "free", now);
  assert.deepEqual(friendshipProgress(game.socialLinks[0].hangouts), {
    rank: 2,
    xp: 0,
  });
  assert.deepEqual(friendshipProgress(game.socialLinks[1].hangouts), {
    rank: 1,
    xp: 0,
  });
  const undone = undoLastAction(game);
  assert.deepEqual(friendshipProgress(undone.socialLinks[0].hangouts), {
    rank: 1,
    xp: 75,
  });
  assert.deepEqual(friendshipProgress(36), { rank: 10, xp: 100 });
  assert.deepEqual(friendshipProgress(100), { rank: 10, xp: 100 });
});
