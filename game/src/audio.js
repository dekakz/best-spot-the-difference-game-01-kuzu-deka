// Synthesized sound effects with WebAudio: no audio files, no network.
// Every sound is a short oscillator envelope; the context is created lazily
// on the first user gesture so browsers never block it.
let audioCtx = null;
let muted = false;

export function setMuted(value) {
  muted = value;
}

export function isMuted() {
  return muted;
}

function ensureCtx() {
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === 'suspended') audioCtx.resume().catch(() => {});
  return audioCtx;
}

function tone(freq, start, dur, type = 'sine', vol = 0.16) {
  if (muted) return;
  const ctx = ensureCtx();
  if (!ctx) return;
  const osc = ctx.createOscillator();
  const gain = ctx.createGain();
  osc.type = type;
  osc.frequency.setValueAtTime(freq, ctx.currentTime + start);
  gain.gain.setValueAtTime(0.0001, ctx.currentTime + start);
  gain.gain.exponentialRampToValueAtTime(vol, ctx.currentTime + start + 0.02);
  gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + start + dur);
  osc.connect(gain);
  gain.connect(ctx.destination);
  osc.start(ctx.currentTime + start);
  osc.stop(ctx.currentTime + start + dur + 0.05);
}

export function playFind() {
  tone(659.25, 0, 0.14, 'sine', 0.18);
  tone(880, 0.09, 0.2, 'sine', 0.18);
  tone(1318.5, 0.18, 0.22, 'sine', 0.12);
}

export function playWrong() {
  tone(160, 0, 0.18, 'square', 0.07);
  tone(120, 0.05, 0.22, 'square', 0.06);
}

export function playHint() {
  tone(523.25, 0, 0.12, 'triangle', 0.12);
  tone(783.99, 0.1, 0.16, 'triangle', 0.12);
}

export function playSceneComplete() {
  const notes = [523.25, 659.25, 783.99, 1046.5];
  notes.forEach((f, i) => tone(f, i * 0.11, 0.22, 'sine', 0.16));
}

export function playGameComplete() {
  const notes = [523.25, 659.25, 783.99, 1046.5, 783.99, 1046.5, 1318.5];
  notes.forEach((f, i) => tone(f, i * 0.12, 0.26, 'sine', 0.16));
}

export function playTick() {
  tone(980, 0, 0.06, 'square', 0.05);
}
