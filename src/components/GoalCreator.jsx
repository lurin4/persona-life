import { useState } from "react";
import { AnimatePresence, motion as Motion } from "motion/react";
import { Plus, ArrowUpRight } from "lucide-react";
import { dateKey } from "../utils/game";
import PersonaSelect from "./PersonaSelect";
export default function GoalCreator({ addCustomGoal }) {
  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [date, setDate] = useState("");
  const [stat, setStat] = useState("knowledge");
  const [rank, setRank] = useState("2");
  const [type, setType] = useState("reward");
  const [rewardXP, setRewardXP] = useState("50");
  return (
    <div className="creator mission-creator">
      <button
        className="primary-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Plus size={18} />
        {isOpen ? "Close mission editor" : "Add mission"}
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
              if (!title.trim()) {
                event.currentTarget.elements.title.setCustomValidity(
                  "Enter a mission title.",
                );
                event.currentTarget.reportValidity();
                return;
              }
              if (addCustomGoal(title, date, stat, rank, type, rewardXP)) {
                setTitle("");
                setDate("");
                setStat("knowledge");
                setRank("2");
                setType("reward");
                setRewardXP("50");
                setIsOpen(false);
              }
            }}
          >
            <div className="form-heading">
              <span className="eyebrow">NEW MISSION</span>
              <h3>Mission details</h3>
            </div>
            <label className="settings-label" htmlFor="goal-type">
              MISSION TYPE
              <select
                id="goal-type"
                value={type}
                onChange={(event) => setType(event.target.value)}
              >
                <option value="reward">
                  Reward mission · complete to earn stat XP
                </option>
                <option value="rank">
                  Stat target · clears at the required rank
                </option>
              </select>
            </label>
            <p className="form-help">
              {type === "reward"
                ? "Choose a stat and XP reward. Mark complete after finishing the goal to claim the reward once."
                : "For stat progression, such as reaching Knowledge Rank 3. Clears as soon as your rank meets the target."}
            </p>
            <div className="form-fields">
              <label htmlFor="goal-title">
                MISSION TITLE
                <input
                  id="goal-title"
                  name="title"
                  required
                  maxLength={100}
                  value={title}
                  placeholder={
                    type === "reward"
                      ? "e.g. Finish a book"
                      : "e.g. Reach Knowledge Rank 3"
                  }
                  onChange={(event) => {
                    event.target.setCustomValidity("");
                    setTitle(event.target.value);
                  }}
                />
              </label>
              <label htmlFor="goal-date">
                DEADLINE (OPTIONAL)
                <input
                  id="goal-date"
                  type="date"
                  min={dateKey(new Date())}
                  value={date}
                  onChange={(event) => setDate(event.target.value)}
                />
              </label>
              {type === "reward" && (
                <>
                  <label htmlFor="reward-stat">
                    REWARD STAT
                    <PersonaSelect
                      id="reward-stat"
                      value={stat}
                      options={[
                        "knowledge",
                        "guts",
                        "proficiency",
                        "kindness",
                        "charm",
                      ]}
                      onChange={setStat}
                    />
                  </label>
                  <label htmlFor="reward-xp">
                    XP REWARD
                    <PersonaSelect
                      id="reward-xp"
                      value={rewardXP}
                      options={["15", "30", "50", "100"]}
                      onChange={setRewardXP}
                    />
                  </label>
                </>
              )}
              {type === "rank" && (
                <>
                  <label htmlFor="goal-stat">
                    REQUIRED STAT
                    <PersonaSelect
                      id="goal-stat"
                      value={stat}
                      options={[
                        "knowledge",
                        "guts",
                        "proficiency",
                        "kindness",
                        "charm",
                      ]}
                      onChange={setStat}
                    />
                  </label>
                  <label htmlFor="goal-rank">
                    TARGET RANK
                    <PersonaSelect
                      id="goal-rank"
                      value={rank}
                      options={["1", "2", "3", "4", "5"]}
                      onChange={setRank}
                    />
                  </label>
                </>
              )}
            </div>
            <div className="form-actions">
              <button type="submit" className="primary-button">
                Add mission <ArrowUpRight size={18} />
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
  );
}
