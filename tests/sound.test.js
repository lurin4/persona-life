import { test } from "node:test";
import assert from "node:assert/strict";
import { createSoundPlayer } from "../src/utils/sound.js";

test("mute and zero volume avoid creating an audio context", async () => {
  let created = 0;
  const player = createSoundPlayer(() => {
    created++;
    return null;
  });
  player.configure({ enabled: false, volume: 0.5 });
  await player.play("rank");
  player.configure({ enabled: true, volume: 0 });
  await player.play("xp");
  assert.equal(created, 0);
});
test("missing audio support never rejects game interactions", async () => {
  await createSoundPlayer(() => null).play("click");
  await createSoundPlayer(() => {
    throw new Error("Blocked audio");
  }).play("reward");
});
