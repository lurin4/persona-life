import { useState } from "react";
import { AnimatePresence, motion as Motion } from "motion/react";
import { Plus, ArrowUpRight } from "lucide-react";
import PersonaSelect from "./PersonaSelect";
export default function ActivityCreator({ addCustomActivity }) {
  const [isOpen, setIsOpen] = useState(false);
  const [name, setName] = useState("");
  const [stat, setStat] = useState("knowledge");
  return (
    <div className="creator">
      <button
        className="outline-button"
        onClick={() => setIsOpen(!isOpen)}
        aria-expanded={isOpen}
      >
        <Plus size={18} />
        {isOpen ? "Close activity editor" : "Add activity"}
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
                  "Enter an activity name.",
                );
                event.currentTarget.reportValidity();
                return;
              }
              addCustomActivity(name.trim(), stat);
              setName("");
              setIsOpen(false);
            }}
          >
            <div className="form-heading">
              <span className="eyebrow">NEW ACTIVITY</span>
              <h3>Activity details</h3>
            </div>
            <div className="form-fields">
              <label htmlFor="activity-name">
                ACTIVITY NAME
                <input
                  name="name"
                  id="activity-name"
                  required
                  maxLength={100}
                  value={name}
                  placeholder="e.g. Read a chapter"
                  onChange={(event) => {
                    event.target.setCustomValidity("");
                    setName(event.target.value);
                  }}
                />
              </label>
              <label htmlFor="activity-stat">
                ASSOCIATED STAT
                <PersonaSelect
                  id="activity-stat"
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
            </div>
            <div className="form-actions">
              <button className="primary-button" type="submit">
                Add activity <ArrowUpRight size={18} />
              </button>
              <button
                className="text-button"
                type="button"
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
