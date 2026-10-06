// Original, short UI cues synthesized locally; no audio files or autoplay.
const cues = {
  click: [
    [700, 0, 0.035],
    [1050, 0.025, 0.045],
  ],
  navigate: [
    [330, 0, 0.06],
    [660, 0.05, 0.08],
  ],
  xp: [
    [523.25, 0, 0.08],
    [783.99, 0.075, 0.09],
    [1046.5, 0.15, 0.12],
  ],
  reward: [
    [392, 0, 0.1],
    [523.25, 0.085, 0.1],
    [659.25, 0.17, 0.1],
    [1046.5, 0.255, 0.18],
  ],
  rank: [
    [523.25, 0, 0.12],
    [659.25, 0.1, 0.12],
    [783.99, 0.2, 0.12],
    [1046.5, 0.3, 0.28],
    [1318.5, 0.3, 0.28],
  ],
  undo: [
    [660, 0, 0.07],
    [440, 0.06, 0.09],
  ],
};
export function createSoundPlayer(createContext) {
  let context;
  let master;
  let enabled = true;
  let volume = 0.35;
  let lastClick = -Infinity;
  return {
    configure(settings) {
      enabled = settings.enabled;
      volume = Math.max(0, Math.min(1, settings.volume));
      if (master)
        master.gain.setValueAtTime(
          enabled ? volume * 0.22 : 0,
          context.currentTime,
        );
    },
    async play(name = "click") {
      if (!enabled || volume === 0 || !cues[name]) return;
      try {
        if (!context) {
          context = createContext();
          if (!context) return;
          master = context.createGain();
          master.connect(context.destination);
        }
        if (context.state === "suspended") await context.resume();
        if (!enabled || volume === 0 || context.state !== "running") return;
        const start = context.currentTime;
        if (name === "click" && start - lastClick < 0.06) return;
        if (name === "click") lastClick = start;
        master.gain.setValueAtTime(volume * 0.22, start);
        for (const [frequency, delay, duration] of cues[name]) {
          const oscillator = context.createOscillator();
          const envelope = context.createGain();
          oscillator.type = name === "click" ? "triangle" : "sine";
          oscillator.frequency.setValueAtTime(frequency, start + delay);
          envelope.gain.setValueAtTime(0, start + delay);
          envelope.gain.linearRampToValueAtTime(0.6, start + delay + 0.006);
          envelope.gain.exponentialRampToValueAtTime(
            0.001,
            start + delay + duration,
          );
          oscillator.connect(envelope);
          envelope.connect(master);
          oscillator.onended = () => {
            oscillator.disconnect();
            envelope.disconnect();
          };
          oscillator.start(start + delay);
          oscillator.stop(start + delay + duration + 0.02);
        }
      } catch {
        /* Audio support must never block game actions. */
      }
    },
  };
}
export const sound = createSoundPlayer(() => {
  const AudioContext = window.AudioContext || window.webkitAudioContext;
  return AudioContext ? new AudioContext() : null;
});
