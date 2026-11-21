// Mirror Cove — boot, state machine, input, and rendering. One canvas holds
// both pictures; the DOM header/footer (hud.js) holds the numbers. A scene is
// won by ringing every difference on either panel before its par time runs out.
import { SCENES, drawPanel } from './scenes.js';
import { setSceneLabel, setRemain, setScore, setTimer, setHints, setFoundDots,
  showOverlay, hideOverlay, onOverlayButton, onHintButton, onPauseButton,
  onSoundButton, setSoundLabel } from './hud.js';
import { playFind, playWrong, playHint, playSceneComplete, playGameComplete,
  playTick, setMuted, isMuted } from './audio.js';
import { parseShot, stagedFound, stagedSceneIndex, stagedTimeLeft } from './shots.js';

const canvas = document.getElementById('game');
const ctx = canvas.getContext('2d');

const PANEL = { w: 600, h: 560, y: 30, leftX: 10, rightX: 630, gapX: 620 };
const HIT_PAD = 8;

const game = {
  state: 'title', // title | playing | paused | sceneDone | timeUp | gameDone
  sceneIndex: 0,
  found: new Set(),
  foundAt: new Map(),
  hints: 3,
  score: 0,
  streak: 0,
  timeLeft: 0,
  lastTick: 0,
  lastWholeSecond: -1,
  hintTarget: null,
  hintUntil: 0,
  miss: null,
  cursor: { x: 310, y: 300, visible: false },
  shot: null,
};

function scene() {
  return SCENES[game.sceneIndex];
}

function panelOrigin(right) {
  return { x: right ? PANEL.rightX : PANEL.leftX, y: PANEL.y };
}

function panelAt(px, py) {
  if (py < PANEL.y || py > PANEL.y + PANEL.h) return null;
  if (px >= PANEL.leftX && px < PANEL.leftX + PANEL.w) return { right: false, x: px - PANEL.leftX, y: py - PANEL.y };
  if (px >= PANEL.rightX && px < PANEL.rightX + PANEL.w) return { right: true, x: px - PANEL.rightX, y: py - PANEL.y };
  return null;
}

function nearestDiff(local, right) {
  let best = null;
  let bestD = Infinity;
  for (const d of scene().diffs) {
    if (game.found.has(d.id)) continue;
    const dx = local.x - d.x;
    const dy = local.y - d.y;
    const dist = Math.sqrt(dx * dx + dy * dy);
    if (dist <= d.r + HIT_PAD && dist < bestD) {
      best = d;
      bestD = dist;
    }
  }
  return best;
}

function startScene(index) {
  game.sceneIndex = index;
  game.found = new Set();
  game.foundAt = new Map();
  game.hints = 3;
  game.streak = 0;
  game.timeLeft = scene().par;
  game.lastTick = performance.now();
  game.lastWholeSecond = -1;
  game.hintTarget = null;
  game.miss = null;
  game.state = 'playing';
  setSceneLabel(`Scene ${index + 1} of ${SCENES.length} · ${scene().name} · Par ${Math.floor(scene().par / 60)}:${String(scene().par % 60).padStart(2, '0')}`);
  setHints(game.hints);
  syncHud();
  hideOverlay();
}

function syncHud() {
  const total = scene().diffs.length;
  setRemain(total - game.found.size);
  setScore(game.score, game.streak);
  setTimer(Math.ceil(game.timeLeft), scene().par);
  setFoundDots(total, game.found.size);
}

function checkPoint(local, right) {
  if (game.state !== 'playing') return;
  const diff = nearestDiff(local);
  if (diff) {
    game.found.add(diff.id);
    game.foundAt.set(diff.id, performance.now());
    game.streak += 1;
    game.score += 100 + (game.streak - 1) * 10;
    playFind();
    if (game.found.size === scene().diffs.length) {
      const bonus = Math.ceil(game.timeLeft) * 2;
      game.score += bonus;
      game.state = 'sceneDone';
      if (game.sceneIndex === SCENES.length - 1) {
        playGameComplete();
        showOverlay('You found them all!',
          `Mirror Cove is complete — every difference in all ${SCENES.length} scenes, found.`,
          `Final score: <b>${game.score}</b><br>Time bonus banked: ${bonus} points`,
          'Play again');
        onOverlayButton(() => { game.score = 0; startScene(0); });
        game.state = 'gameDone';
      } else {
        playSceneComplete();
        showOverlay('Scene complete!',
          `${scene().name} — every difference found.`,
          `Time bonus: +${bonus} points<br>Total score: <b>${game.score}</b>`,
          'Next scene');
        onOverlayButton(() => startScene(game.sceneIndex + 1));
      }
    }
    syncHud();
  } else {
    game.streak = 0;
    game.score = Math.max(0, game.score - 25);
    game.miss = { x: local.x, y: local.y, right, at: performance.now() };
    playWrong();
    syncHud();
  }
}

function useHint() {
  if (game.state !== 'playing' || game.hints <= 0) return;
  const remaining = scene().diffs.filter((d) => !game.found.has(d.id));
  if (remaining.length === 0) return;
  game.hints -= 1;
  game.score = Math.max(0, game.score - 50);
  game.hintTarget = remaining[Math.floor(Math.random() * remaining.length)];
  game.hintUntil = performance.now() + 2000;
  playHint();
  setHints(game.hints);
  syncHud();
}

function togglePause() {
  if (game.state === 'playing') {
    game.state = 'paused';
    showOverlay('Paused', 'Take a breath. The pictures will wait — the timer will not run while paused.',
      `Scene ${game.sceneIndex + 1} · ${scene().diffs.length - game.found.size} still to find`, 'Resume');
    onOverlayButton(() => {
      game.state = 'playing';
      game.lastTick = performance.now();
      hideOverlay();
    });
  } else if (game.state === 'paused') {
    game.state = 'playing';
    game.lastTick = performance.now();
    hideOverlay();
  }
}

function toggleSound() {
  setMuted(!isMuted());
  setSoundLabel(isMuted());
}

// ------------------------------------------------------------ rendering
function drawPanelFrame(right) {
  const o = panelOrigin(right);
  ctx.save();
  ctx.beginPath();
  ctx.rect(o.x, o.y, PANEL.w, PANEL.h);
  ctx.clip();
  ctx.translate(o.x, o.y);
  drawPanel(ctx, scene(), right);
  ctx.restore();
  ctx.strokeStyle = '#3a5178';
  ctx.lineWidth = 3;
  ctx.strokeRect(o.x, o.y, PANEL.w, PANEL.h);
  ctx.fillStyle = '#f2ead8';
  ctx.font = 'bold 15px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = right ? 'right' : 'left';
  ctx.fillText(right ? 'RIGHT — spot the changes' : 'LEFT — original', right ? o.x + PANEL.w : o.x, 20);
}

function drawRings(now) {
  for (const d of scene().diffs) {
    if (!game.found.has(d.id)) continue;
    const born = game.foundAt.get(d.id) || now;
    const age = Math.min(1, (now - born) / 220);
    const scale = 0.6 + 0.4 * age;
    for (const right of [false, true]) {
      const o = panelOrigin(right);
      const r = d.r * scale + 4;
      ctx.save();
      ctx.lineWidth = 5;
      ctx.strokeStyle = '#ffd97a';
      ctx.beginPath();
      ctx.arc(o.x + d.x, o.y + d.y, r, 0, Math.PI * 2);
      ctx.stroke();
      ctx.lineWidth = 2.5;
      ctx.strokeStyle = '#37c978';
      ctx.beginPath();
      ctx.arc(o.x + d.x, o.y + d.y, r + 6, 0, Math.PI * 2);
      ctx.stroke();
      ctx.restore();
    }
  }
}

function drawHint(now) {
  if (!game.hintTarget || now > game.hintUntil) return;
  const pulse = 1 + 0.18 * Math.sin(now / 130);
  for (const right of [false, true]) {
    const o = panelOrigin(right);
    const d = game.hintTarget;
    ctx.save();
    ctx.globalAlpha = 0.65 + 0.35 * Math.sin(now / 130);
    ctx.lineWidth = 4;
    ctx.strokeStyle = '#7ae0ff';
    ctx.beginPath();
    ctx.arc(o.x + d.x, o.y + d.y, (d.r + 10) * pulse, 0, Math.PI * 2);
    ctx.stroke();
    ctx.restore();
  }
}

function drawMiss(now) {
  if (!game.miss) return;
  const age = (now - game.miss.at) / 450;
  if (age > 1) { game.miss = null; return; }
  ctx.save();
  ctx.globalAlpha = 1 - age;
  ctx.strokeStyle = '#ff5d5d';
  ctx.lineWidth = 4;
  const r = 14 + age * 14;
  const o = panelOrigin(game.miss.right);
  const px = o.x + game.miss.x;
  const py = o.y + game.miss.y;
  ctx.beginPath();
  ctx.arc(px, py, r, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(px - r, py - r); ctx.lineTo(px + r, py + r);
  ctx.moveTo(px + r, py - r); ctx.lineTo(px - r, py + r);
  ctx.stroke();
  ctx.restore();
}

function drawCursor() {
  if (!game.cursor.visible || game.state !== 'playing') return;
  const { x, y } = game.cursor;
  ctx.save();
  ctx.strokeStyle = '#ffffff';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.arc(x, y, 16, 0, Math.PI * 2);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(x - 24, y); ctx.lineTo(x - 10, y);
  ctx.moveTo(x + 10, y); ctx.lineTo(x + 24, y);
  ctx.moveTo(x, y - 24); ctx.lineTo(x, y - 10);
  ctx.moveTo(x, y + 10); ctx.lineTo(x, y + 24);
  ctx.stroke();
  ctx.restore();
}

function render(now) {
  ctx.fillStyle = '#0d1526';
  ctx.fillRect(0, 0, canvas.width, canvas.height);
  drawPanelFrame(false);
  drawPanelFrame(true);
  // VS badge in the gap
  ctx.fillStyle = '#f5a623';
  ctx.beginPath();
  ctx.arc(PANEL.gapX, PANEL.y + PANEL.h / 2, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = '#231303';
  ctx.font = 'bold 15px "Segoe UI", system-ui, sans-serif';
  ctx.textAlign = 'center';
  ctx.fillText('VS', PANEL.gapX, PANEL.y + PANEL.h / 2 + 5);
  drawRings(now);
  drawHint(now);
  drawMiss(now);
  drawCursor();
}

// ------------------------------------------------------------ input
function canvasPoint(ev) {
  const rect = canvas.getBoundingClientRect();
  return {
    x: ((ev.clientX - rect.left) / rect.width) * canvas.width,
    y: ((ev.clientY - rect.top) / rect.height) * canvas.height,
  };
}

canvas.addEventListener('pointerdown', (ev) => {
  const p = canvasPoint(ev);
  const hit = panelAt(p.x, p.y);
  if (!hit) return;
  checkPoint({ x: hit.x, y: hit.y }, hit.right);
  game.cursor.visible = false;
});

canvas.addEventListener('pointermove', (ev) => {
  const p = canvasPoint(ev);
  game.cursor.x = p.x;
  game.cursor.y = p.y;
});

document.addEventListener('keydown', (ev) => {
  if (game.state === 'title') {
    if (ev.key === 'Enter' || ev.key === ' ') startScene(0);
    return;
  }
  if (ev.key === 'p' || ev.key === 'P') { togglePause(); return; }
  if (ev.key === 'm' || ev.key === 'M') { toggleSound(); return; }
  if (game.state !== 'playing') return;
  const step = ev.shiftKey ? 24 : 10;
  if (ev.key === 'ArrowLeft') { game.cursor.x = Math.max(0, game.cursor.x - step); game.cursor.visible = true; ev.preventDefault(); }
  else if (ev.key === 'ArrowRight') { game.cursor.x = Math.min(canvas.width, game.cursor.x + step); game.cursor.visible = true; ev.preventDefault(); }
  else if (ev.key === 'ArrowUp') { game.cursor.y = Math.max(0, game.cursor.y - step); game.cursor.visible = true; ev.preventDefault(); }
  else if (ev.key === 'ArrowDown') { game.cursor.y = Math.min(canvas.height, game.cursor.y + step); game.cursor.visible = true; ev.preventDefault(); }
  else if (ev.key === 'Enter' || ev.key === ' ') {
    const hit = panelAt(game.cursor.x, game.cursor.y);
    if (hit) checkPoint({ x: hit.x, y: hit.y }, hit.right);
    ev.preventDefault();
  } else if (ev.key === 'h' || ev.key === 'H') useHint();
});

onHintButton(useHint);
onPauseButton(togglePause);
onSoundButton(toggleSound);

// ------------------------------------------------------------ main loop
function loop(now) {
  if (game.state === 'playing' && !game.shot) {
    const dt = (now - game.lastTick) / 1000;
    game.lastTick = now;
    game.timeLeft -= dt;
    const whole = Math.ceil(game.timeLeft);
    if (whole !== game.lastWholeSecond) {
      game.lastWholeSecond = whole;
      setTimer(Math.max(0, whole), scene().par);
      if (whole <= 10 && whole > 0) playTick();
    }
    if (game.timeLeft <= 0) {
      game.timeLeft = 0;
      game.state = 'timeUp';
      playWrong();
      showOverlay('Time up!',
        `The par time for ${scene().name} ran out with ${scene().diffs.length - game.found.size} differences still hidden.`,
        `Score kept: <b>${game.score}</b>`, 'Try this scene again');
      onOverlayButton(() => startScene(game.sceneIndex));
    }
  }
  render(now);
  requestAnimationFrame(loop);
}

// ------------------------------------------------------------ boot
function boot() {
  const shotInfo = parseShot();
  game.shot = shotInfo;
  if (shotInfo) {
    // Staged render for screenshots: no title card, no countdown.
    const idx = stagedSceneIndex(shotInfo.shot);
    game.sceneIndex = idx;
    game.found = new Set(stagedFound(scene(), shotInfo.shot));
    game.foundAt = new Map([...game.found].map((id) => [id, 0]));
    game.hints = 3;
    game.timeLeft = stagedTimeLeft(scene(), shotInfo.shot);
    game.state = 'playing';
    setSceneLabel(`Scene ${idx + 1} of ${SCENES.length} · ${scene().name} · Par ${Math.floor(scene().par / 60)}:${String(scene().par % 60).padStart(2, '0')}`);
    setHints(3);
    syncHud();
    render(performance.now());
    return;
  }
  startScene(0);
  game.state = 'title';
  showOverlay('Mirror Cove',
    'Two pictures, nearly twins. Find every difference before the par time runs out — click it on either panel. Three hints per scene, and a wrong click costs 25 points.',
    `5 scenes · 7 to 9 differences each · Keyboard: arrows + Enter, H hint, P pause`,
    'Start playing');
  onOverlayButton(() => { game.state = 'playing'; game.lastTick = performance.now(); hideOverlay(); });
  requestAnimationFrame(loop);
}

boot();
