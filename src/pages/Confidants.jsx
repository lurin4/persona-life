import { useState } from "react";
import { AnimatePresence, motion as Motion } from "motion/react";
import { Users, Plus, X, RotateCcw, ArrowUpRight } from "lucide-react";
import PersonaSelect from "../components/PersonaSelect";
import { statPresentation } from "../data/presentation";
import {
  HANGOUT_XP,
  FRIENDSHIP_XP,
  MAX_LINK_RANK,
  friendshipProgress,
} from "../utils/socialLinks";

export default function Confidants({
  socialLinks,
  addSocialLink,
  deleteSocialLink,
  logSocialHangout,
  resetAction,
  lastAction,
  hasUsedAction,
  mode,
}) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [stat, setStat] = useState("charm");

  return (
    <section>
      <header className="page-heading">
        <span className="eyebrow">FRIENDS / HANGOUT LOG</span>
        <h1>
          Your
          <br />
          <span className="cutout">confidants.</span>
        </h1>
        <p>
          Each friend has their own Confidant rank, from 1 to 10. Hangouts earn{" "}
          {FRIENDSHIP_XP} friendship XP; every 100 XP raises that friend’s rank.
          You also earn {HANGOUT_XP} XP for their chosen social stat.
        </p>
      </header>
      <div className="rules-panel">
        <strong>{mode === "persona" ? "Persona mode" : "Flexible mode"}</strong>
        <p>
          {mode === "persona"
            ? "A hangout uses the same time-block action as a daily activity. You can log one activity or hangout per block."
            : "Log a hangout whenever you spend time with a friend. Each log awards XP; only log hangouts that actually happened."}{" "}
          Undo restores friendship progress, stat XP, and the hangout count from
          your last action.
        </p>
        {hasUsedAction && (
          <p role="status">
            This time block is used. Wait for the next block or undo your last
            action.
          </p>
        )}
      </div>
      <div className="section-heading">
        <h2>Your confidants</h2>
        <span>{socialLinks.length} CONFIDANTS</span>
      </div>
      {socialLinks.length === 0 && (
        <div className="empty-missions">
          <Users size={54} strokeWidth={1} />
          <h2>No confidants yet</h2>
          <p>Add a confidant to start logging hangouts.</p>
        </div>
      )}
      <Motion.div className="social-grid" layout>
        <AnimatePresence>
          {socialLinks.map((friend) => {
            const bond = friendshipProgress(friend.hangouts);
            const { Icon, label } = statPresentation[friend.stat];
            return (
              <Motion.article
                className="social-card"
                layout
                key={friend.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95 }}
              >
                <button
                  className="delete-button"
                  aria-label={`Remove ${friend.name}`}
                  onClick={() => deleteSocialLink(friend.id)}
                >
                  <X size={16} />
                </button>
                <div className="social-card-header">
                  <span className="friend-avatar" aria-hidden="true">
                    {Array.from(friend.name.trim())[0].toUpperCase()}
                  </span>
                  <div>
                    <span className="eyebrow">CONFIDANT</span>
                    <h2>{friend.name}</h2>
                  </div>
                </div>
                <div className="friendship-progress">
                  <div className="friendship-heading">
                    <strong>
                      RANK {bond.rank}
                      <small> / {MAX_LINK_RANK}</small>
                    </strong>
                    <span>
                      {bond.rank === MAX_LINK_RANK
                        ? "MAX CONFIDANT"
                        : `${bond.xp} / 100 FRIENDSHIP XP`}
                    </span>
                  </div>
                  <div
                    className="xp-track"
                    role="progressbar"
                    aria-label={`${friend.name} friendship XP`}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-valuenow={bond.xp}
                  >
                    <Motion.div
                      initial={false}
                      animate={{ width: `${bond.xp}%` }}
                    />
                  </div>
                  <p>
                    {bond.rank === MAX_LINK_RANK
                      ? "Maximum friendship rank reached. You can still log hangouts for stat XP."
                      : `${100 - bond.xp} friendship XP to Rank ${bond.rank + 1}`}
                  </p>
                </div>
                <p className="friend-reward">
                  <Icon size={18} />
                  {label} <strong>+{HANGOUT_XP} XP per hangout</strong>
                </p>
                <div className="friend-history">
                  <span>
                    {friend.hangouts}{" "}
                    {friend.hangouts === 1 ? "hangout" : "hangouts"} logged
                  </span>
                  <span>
                    {friend.lastHangout
                      ? `Last: ${new Date(friend.lastHangout).toLocaleDateString("en-GB")}`
                      : "No hangouts yet"}
                  </span>
                </div>
                <button
                  className="primary-button"
                  data-sfx="custom"
                  disabled={hasUsedAction}
                  onClick={() => logSocialHangout(friend.id)}
                  aria-label={`Log hangout with ${friend.name}`}
                >
                  <Users size={17} />
                  Log hangout · +{FRIENDSHIP_XP} friendship XP
                </button>
                {lastAction?.socialLinkId === friend.id && (
                  <button
                    className="text-button"
                    data-sfx="custom"
                    onClick={resetAction}
                  >
                    <RotateCcw size={15} />
                    Undo hangout with {friend.name}
                  </button>
                )}
              </Motion.article>
            );
          })}
        </AnimatePresence>
      </Motion.div>
      <div className="creator mission-creator">
        <button
          className="primary-button"
          onClick={() => setIsOpen(!isOpen)}
          aria-expanded={isOpen}
        >
          <Plus size={18} />
          {isOpen ? "Close confidant editor" : "Add confidant"}
        </button>
        <AnimatePresence>
          {isOpen && (
            <Motion.form
              className="creator-form"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              onSubmit={(event) => {
                event.preventDefault();
                if (!name.trim()) {
                  event.currentTarget.elements.name.setCustomValidity(
                    "Enter your friend's name.",
                  );
                  event.currentTarget.reportValidity();
                  return;
                }
                if (addSocialLink(name, stat)) {
                  setName("");
                  setStat("charm");
                  setIsOpen(false);
                }
              }}
            >
              <div className="form-heading">
                <span className="eyebrow">NEW CONFIDANT</span>
                <h3>Confidant details</h3>
              </div>
              <div className="form-fields">
                <label htmlFor="friend-name">
                  CONFIDANT NAME
                  <input
                    id="friend-name"
                    name="name"
                    required
                    maxLength={80}
                    value={name}
                    placeholder="e.g. Alex"
                    onChange={(event) => {
                      event.target.setCustomValidity("");
                      setName(event.target.value);
                    }}
                  />
                </label>
                <label htmlFor="friend-stat">
                  BONUS SOCIAL STAT
                  <PersonaSelect
                    id="friend-stat"
                    value={stat}
                    options={Object.keys(statPresentation)}
                    onChange={setStat}
                  />
                </label>
              </div>
              <p className="form-help">
                Choose the stat that fits what you do together—for example,
                Knowledge for studying or Charm for socialising.
              </p>
              <div className="form-actions">
                <button type="submit" className="primary-button">
                  Save confidant <ArrowUpRight size={18} />
                </button>
                <button
                  type="button"
                  className="text-button"
                  onClick={() => setIsOpen(false)}
                >
                  Cancel
                </button>
              </div>
            </Motion.form>
          )}
        </AnimatePresence>
      </div>
    </section>
  );
}
