// Heads-up display: timer, score, streak, hints, found dots, and the overlay
// cards (start, pause, scene complete, time up, game complete). All DOM, so
// text stays crisp at any size and the canvas is purely the two pictures.
const $ = (id) => document.getElementById(id);

export function setSceneLabel(text) {
  $('scene-name').textContent = text;
}

export function setRemain(n) {
  $('remain').textContent = n === 0 ? 'All found!' : `${n} to find`;
}

export function setScore(score, streak) {
  $('score').textContent = `Score ${score}`;
  $('streak').textContent = `Streak ×${streak}`;
}

export function setTimer(secondsLeft, total) {
  const m = Math.floor(secondsLeft / 60);
  const s = String(secondsLeft % 60).padStart(2, '0');
  $('timer-text').textContent = `${m}:${s}`;
  const bar = $('timer-bar');
  bar.style.width = `${Math.max(0, (secondsLeft / total) * 100)}%`;
  bar.classList.toggle('low', secondsLeft <= 15);
}

export function setHints(n) {
  const btn = $('hint-btn');
  btn.textContent = `Hint (${n})`;
  btn.disabled = n <= 0;
}

export function setFoundDots(total, foundCount) {
  const wrap = $('found-dots');
  wrap.innerHTML = '';
  for (let i = 0; i < total; i++) {
    const dot = document.createElement('span');
    dot.className = 'dot' + (i < foundCount ? ' found' : '');
    if (i < foundCount) dot.textContent = '✓';
    wrap.appendChild(dot);
  }
}

export function showOverlay(title, text, stats, buttonLabel) {
  $('overlay-title').textContent = title;
  $('overlay-text').textContent = text;
  $('overlay-stats').innerHTML = stats;
  const btn = $('overlay-btn');
  btn.textContent = buttonLabel;
  $('overlay').classList.remove('hidden');
}

export function hideOverlay() {
  $('overlay').classList.add('hidden');
}

export function onOverlayButton(handler) {
  $('overlay-btn').onclick = handler;
}

export function onHintButton(handler) {
  $('hint-btn').onclick = handler;
}

export function onPauseButton(handler) {
  $('pause-btn').onclick = handler;
}

export function onSoundButton(handler) {
  $('sound-btn').onclick = handler;
}

export function setSoundLabel(muted) {
  $('sound-btn').textContent = muted ? 'Sound: off' : 'Sound: on';
}
