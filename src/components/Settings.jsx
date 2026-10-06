import { useState } from "react";
import { Settings2, X, Upload, Trash2 } from "lucide-react";
import { backgroundFile } from "../utils/background";
export default function Settings({
  appearance,
  setAppearance,
  image,
  setImage,
  mode,
  setMode,
  audio,
  setAudio,
}) {
  const [open, setOpen] = useState(false);
  const [error, setError] = useState("");
  const [busy, setBusy] = useState(false);
  async function upload(event) {
    const file = event.target.files[0];
    event.target.value = "";
    if (!file) return;
    if (
      ![
        "image/jpeg",
        "image/png",
        "image/webp",
        "image/gif",
        "image/avif",
      ].includes(file.type)
    ) {
      setError("Choose a JPG, PNG, WebP, GIF, or AVIF image.");
      return;
    }
    if (file.size > 20 * 1024 * 1024) {
      setError("Choose an image smaller than 20 MB.");
      return;
    }
    setBusy(true);
    setError("");
    try {
      const preview = URL.createObjectURL(file);
      try {
        const test = new Image();
        test.src = preview;
        await test.decode();
      } finally {
        URL.revokeObjectURL(preview);
      }
      await backgroundFile(file);
      setImage(file);
    } catch {
      setError(
        "The image could not be loaded or saved. Try another image or allow browser storage.",
      );
    } finally {
      setBusy(false);
    }
  }
  return (
    <div className="settings-wrapper">
      <button
        className="settings-toggle"
        aria-expanded={open}
        onClick={() => setOpen(!open)}
        aria-label="Settings"
      >
        <Settings2 size={19} />
      </button>
      {open && (
        <section className="settings-panel" aria-label="Settings">
          <div className="section-heading">
            <h2>Settings</h2>
            <button
              className="text-button"
              aria-label="Close settings"
              onClick={() => setOpen(false)}
            >
              <X />
            </button>
          </div>
          <fieldset className="sound-settings">
            <legend>SOUND EFFECTS</legend>
            <label className="sound-switch">
              <input
                type="checkbox"
                checked={audio.enabled}
                onChange={(event) =>
                  setAudio({ ...audio, enabled: event.target.checked })
                }
              />{" "}
              Enable sound effects
            </label>
            <label className="settings-label" htmlFor="sound-volume">
              VOLUME · {Math.round(audio.volume * 100)}%
              <input
                id="sound-volume"
                type="range"
                min="0"
                max="100"
                value={Math.round(audio.volume * 100)}
                onChange={(event) =>
                  setAudio({
                    ...audio,
                    volume: Number(event.target.value) / 100,
                  })
                }
              />
            </label>
          </fieldset>
          <label className="settings-label" htmlFor="play-mode">
            ACTIVITY RULES
            <select
              id="play-mode"
              value={mode}
              onChange={(event) => setMode(event.target.value)}
            >
              <option value="free">Flexible · log activities anytime</option>
              <option value="persona">
                Persona · one action per time block
              </option>
            </select>
          </label>
          <p>
            Each logged activity awards XP. Log it after doing it in real life.
            Undo restores the previous XP and rank.
          </p>
          <label className="settings-label" htmlFor="background-color">
            BACKGROUND COLOR
            <input
              id="background-color"
              type="color"
              value={appearance.color}
              onChange={(event) =>
                setAppearance({ ...appearance, color: event.target.value })
              }
            />
          </label>
          <label className="upload-button">
            <Upload size={16} />
            {busy ? "Saving image…" : "Upload background image"}
            <input
              type="file"
              accept="image/jpeg,image/png,image/webp,image/gif,image/avif"
              disabled={busy}
              onChange={upload}
            />
          </label>
          <p>
            Saved in this browser. JPG, PNG, WebP, GIF, or AVIF, up to 20 MB.
          </p>
          {image && (
            <button
              className="text-button"
              disabled={busy}
              onClick={async () => {
                setBusy(true);
                try {
                  await backgroundFile(null);
                  setImage(null);
                  setError("");
                } catch {
                  setError("Could not remove the saved image.");
                } finally {
                  setBusy(false);
                }
              }}
            >
              <Trash2 size={15} />
              Remove image
            </button>
          )}
          <label className="settings-label" htmlFor="background-shade">
            IMAGE SHADE · {appearance.shade}%
            <input
              id="background-shade"
              type="range"
              min="0"
              max="75"
              value={appearance.shade}
              onChange={(event) =>
                setAppearance({
                  ...appearance,
                  shade: Number(event.target.value),
                })
              }
            />
          </label>
          <button
            className="outline-button"
            onClick={() => setAppearance({ color: "#d71932", shade: 25 })}
          >
            Reset color and shade
          </button>
          {error && <p role="alert">{error}</p>}
        </section>
      )}
    </div>
  );
}
