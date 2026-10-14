import { actionBlocked, blockKey, gainXP, isProgress, isStat } from "./game.js";

export const HANGOUT_XP = 15;
export const FRIENDSHIP_XP = 25;
export const MAX_LINK_RANK = 10;

// Derive friendship progress from logged hangouts so existing links migrate
// automatically and undo always restores the correct rank and XP.
export function friendshipProgress(hangouts) {
  const totalXP = hangouts * FRIENDSHIP_XP;
  const rank = Math.min(MAX_LINK_RANK, 1 + Math.floor(totalXP / 100));
  return { rank, xp: rank === MAX_LINK_RANK ? 100 : totalXP % 100 };
}
export const isSocialLink = (link) =>
  link &&
  typeof link.id === "string" &&
  typeof link.name === "string" &&
  !!link.name.trim() &&
  isStat(link.stat) &&
  Number.isSafeInteger(link.hangouts) &&
  link.hangouts >= 0 &&
  (link.lastHangout === null ||
    (typeof link.lastHangout === "string" &&
      Number.isFinite(Date.parse(link.lastHangout))));

export function logHangout(game, id, mode, now = new Date()) {
  const link = game.socialLinks.find((friend) => friend.id === id);
  if (!isSocialLink(link) || actionBlocked(game.lastAction, mode, now)) {
    return game;
  }
  return {
    ...game,
    stats: {
      ...game.stats,
      [link.stat]: gainXP(game.stats[link.stat], HANGOUT_XP),
    },
    socialLinks: game.socialLinks.map((friend) =>
      friend.id === id
        ? {
            ...friend,
            hangouts: friend.hangouts + 1,
            lastHangout: now.toISOString(),
          }
        : friend,
    ),
    lastAction: {
      block: blockKey(now),
      stat: link.stat,
      previous: game.stats[link.stat],
      socialLinkId: id,
      previousLink: { hangouts: link.hangouts, lastHangout: link.lastHangout },
    },
  };
}

export function undoLastAction(game) {
  const action = game.lastAction;
  if (!action || !isProgress(action.previous) || !isStat(action.stat))
    return game;
  const snapshot = action.previousLink;
  const canRestoreLink =
    snapshot &&
    Number.isSafeInteger(snapshot.hangouts) &&
    snapshot.hangouts >= 0 &&
    (snapshot.lastHangout === null ||
      (typeof snapshot.lastHangout === "string" &&
        Number.isFinite(Date.parse(snapshot.lastHangout))));
  return {
    ...game,
    stats: { ...game.stats, [action.stat]: action.previous },
    socialLinks: (game.socialLinks || []).map((friend) =>
      friend.id === action.socialLinkId && canRestoreLink
        ? {
            ...friend,
            hangouts: snapshot.hangouts,
            lastHangout: snapshot.lastHangout,
          }
        : friend,
    ),
    lastAction: null,
  };
}
