// Five original scenes, drawn procedurally on canvas. Each scene draws its base
// picture identically on both panels (same seeded random numbers), and the
// right panel then applies the scene's differences. A difference is one of:
//   remove — the element is drawn in the base only when its id is not skipped
//   change — the base draws variant A; apply() paints variant B over the spot
//   add    — apply() draws an extra element that the base never had
// Panel-local coordinates: 0..600 wide, 0..560 tall.
import { mulberry32, range } from './rng.js';
import { circle, ellipse, rect, poly, line, star, cloud, pine, house, boat, fish, bird, lantern } from './draw.js';

function vgrad(ctx, stops) {
  const g = ctx.createLinearGradient(0, 0, 0, 560);
  for (const [at, color] of stops) g.addColorStop(at, color);
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 600, 560);
}

function sunWithRays(ctx, x, y, r, color) {
  ctx.strokeStyle = color;
  ctx.lineWidth = 4;
  for (let i = 0; i < 12; i++) {
    const a = (i * Math.PI) / 6;
    line(ctx, x + Math.cos(a) * (r + 6), y + Math.sin(a) * (r + 6),
      x + Math.cos(a) * (r + 18), y + Math.sin(a) * (r + 18), color, 4);
  }
  circle(ctx, x, y, r, color);
}

// ---------------------------------------------------------------- scene 1
function drawHarbor(ctx, skip) {
  vgrad(ctx, [[0, '#ffd9a0'], [0.55, '#ffb877'], [1, '#ff9e6e']]);
  sunWithRays(ctx, 485, 95, 34, '#ffdf3d');
  if (!skip.has('d1')) cloud(ctx, 330, 55, 1.1);
  cloud(ctx, 110, 80, 0.9);
  cloud(ctx, 430, 150, 0.8);
  if (!skip.has('d6')) { bird(ctx, 230, 95, 1); bird(ctx, 265, 75, 0.8); }
  bird(ctx, 350, 130, 0.9);
  // distant shore with houses
  rect(ctx, 0, 300, 600, 45, '#7fae62');
  house(ctx, 150, 298, 64, 46, '#fff3d6', '#c96f4a');
  house(ctx, 250, 293, 64, 51, '#e8f1ff', '#4a6fc9');
  house(ctx, 350, 298, 64, 46, '#fff3d6', '#8a4fc9');
  // lighthouse
  rect(ctx, 58, 180, 46, 165, '#f5f0e6');
  rect(ctx, 58, 210, 46, 26, '#d93838');
  rect(ctx, 58, 268, 46, 26, '#d93838');
  rect(ctx, 52, 168, 58, 14, '#22304a');
  circle(ctx, 81, 160, 12, '#ffe9a3');
  // sea
  rect(ctx, 0, 345, 600, 130, '#2f7fb8');
  rect(ctx, 0, 345, 600, 10, '#5aa9dd');
  line(ctx, 20, 380, 180, 380, 'rgba(255,255,255,0.35)', 3);
  line(ctx, 330, 410, 560, 410, 'rgba(255,255,255,0.35)', 3);
  line(ctx, 120, 445, 300, 445, 'rgba(255,255,255,0.25)', 3);
  boat(ctx, 170, 395, 1, '#c94a4a', '#ffffff');
  boat(ctx, 410, 415, 0.85, '#3d6bc9', '#ffe9a3');
  fish(ctx, 300, 440, 1, '#ff9a3d');
  fish(ctx, 360, 458, 0.8, '#37c978');
  if (!skip.has('d7')) {
    ellipse(ctx, 540, 425, 12, 16, '#ff7a1a');
    rect(ctx, 528, 418, 24, 8, '#ffffff');
  }
  // sand
  rect(ctx, 0, 475, 600, 85, '#f2dcab');
  ellipse(ctx, 90, 520, 16, 8, '#b9a06e');
  ellipse(ctx, 500, 530, 14, 7, '#b9a06e');
  rect(ctx, 140, 495, 26, 22, '#8a6a3d');
  line(ctx, 140, 495, 166, 495, '#6e5326', 3);
  rect(ctx, 300, 510, 10, 34, '#7a5a34');
}

// ---------------------------------------------------------------- scene 2
function drawMarket(ctx, skip) {
  vgrad(ctx, [[0, '#0e1a3a'], [0.6, '#1d2c5e'], [1, '#2a1e4f']]);
  const rand = mulberry32(20261121);
  for (let i = 0; i < 46; i++) {
    const x = range(rand, 10, 590), y = range(rand, 8, 200), r = range(rand, 1, 2.6);
    circle(ctx, x, y, r, rand() > 0.7 ? '#ffe9a3' : '#ffffff');
  }
  circle(ctx, 505, 85, 30, '#fff6d8');
  circle(ctx, 515, 78, 7, '#e8d9a8');
  circle(ctx, 495, 95, 5, '#e8d9a8');
  circle(ctx, 512, 98, 4, '#e8d9a8');
  // string lights
  ctx.strokeStyle = '#3a2a12';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.moveTo(0, 100);
  ctx.quadraticCurveTo(300, 150, 600, 100);
  ctx.stroke();
  for (let i = 0; i < 13; i++) {
    const t = i / 12, x = t * 600, y = 100 + Math.sin(t * Math.PI) * 34;
    if (skip.has('d7') && i === 7) continue;
    circle(ctx, x, y + 6, 6, i % 3 === 0 ? '#ff5d5d' : i % 3 === 1 ? '#ffd97a' : '#7ae0a3');
  }
  if (!skip.has('d2')) lantern(ctx, 470, 180, 1, '#ff5d5d');
  lantern(ctx, 120, 180, 1, '#ff9a3d');
  lantern(ctx, 300, 165, 1, '#ff5d5d');
  lantern(ctx, 200, 230, 0.85, '#ffd97a');
  lantern(ctx, 380, 230, 0.85, '#ff5d5d');
  // stalls
  const stall = (x, awning, sign) => {
    rect(ctx, x, 430, 150, 95, '#4a3220');
    poly(ctx, [[x - 8, 432], [x + 75, 392], [x + 158, 432]], awning);
    rect(ctx, x + 14, 452, 44, 30, '#ffe9a3');
    rect(ctx, x + 92, 452, 44, 30, '#ffe9a3');
    ctx.fillStyle = '#f2ead8';
    ctx.font = 'bold 20px Georgia, serif';
    ctx.textAlign = 'center';
    ctx.fillText(sign, x + 75, 415);
  };
  stall(60, '#d93838', 'TEA');
  stall(230, '#2f8f6b', 'FRUIT');
  stall(400, '#7a4fc9', 'SILK');
  // crates and cat
  rect(ctx, 480, 500, 44, 26, '#8a6a3d');
  rect(ctx, 528, 508, 34, 18, '#6e5326');
  if (!skip.has('d5')) {
    ellipse(ctx, 502, 488, 16, 12, '#2b2b33');
    circle(ctx, 512, 474, 9, '#2b2b33');
    poly(ctx, [[506, 466], [510, 456], [514, 466]], '#2b2b33');
    line(ctx, 516, 490, 534, 482, '#2b2b33', 3);
  }
  rect(ctx, 0, 526, 600, 34, '#171226');
}

// ---------------------------------------------------------------- scene 3
function drawWinter(ctx, skip) {
  vgrad(ctx, [[0, '#bcd8ee'], [0.6, '#dceaf7'], [1, '#f4f8ff']]);
  const rand = mulberry32(777);
  for (let i = 0; i < 40; i++) {
    circle(ctx, range(rand, 10, 590), range(rand, 10, 200), range(rand, 1.5, 3.5), '#ffffff');
  }
  poly(ctx, [[0, 300], [140, 210], [300, 300]], '#a9c6e2');
  poly(ctx, [[260, 300], [430, 200], [600, 300]], '#93b4d6');
  if (!skip.has('d6')) { bird(ctx, 420, 90, 1); bird(ctx, 455, 70, 0.8); }
  bird(ctx, 90, 110, 0.9);
  // cabin
  rect(ctx, 90, 250, 170, 122, '#7a4a28');
  poly(ctx, [[78, 252], [175, 196], [272, 252]], '#ffffff');
  rect(ctx, 228, 196, 26, 52, '#5a3a1e');
  if (!skip.has('d1')) {
    circle(ctx, 241, 178, 10, 'rgba(255,255,255,0.85)');
    circle(ctx, 252, 162, 13, 'rgba(255,255,255,0.8)');
    circle(ctx, 264, 144, 15, 'rgba(255,255,255,0.75)');
  }
  rect(ctx, 116, 282, 26, 26, '#ffe9a3');
  rect(ctx, 208, 282, 26, 26, '#ffe9a3');
  rect(ctx, 162, 306, 28, 66, '#4a2c14');
  circle(ctx, 176, 318, 11, '#1e6b3a');
  circle(ctx, 176, 318, 6, '#d93838');
  // pines
  pine(ctx, 320, 350, 1.1);
  if (!skip.has('d3')) pine(ctx, 380, 365, 0.9);
  pine(ctx, 450, 345, 1.2);
  pine(ctx, 520, 370, 0.85);
  // frozen pond
  ellipse(ctx, 450, 470, 120, 34, '#9fd0e8');
  ellipse(ctx, 450, 470, 120, 34, 'rgba(255,255,255,0.25)');
  line(ctx, 400, 460, 440, 478, '#5a8fb0', 2);
  line(ctx, 470, 455, 500, 480, '#5a8fb0', 2);
  // snow ground
  rect(ctx, 0, 372, 600, 188, '#f4f8ff');
  ellipse(ctx, 60, 520, 40, 12, '#ffffff');
  ellipse(ctx, 540, 530, 46, 12, '#ffffff');
  // deer
  ctx.fillStyle = '#8a5a34';
  ellipse(ctx, 250, 462, 26, 16, '#8a5a34');
  circle(ctx, 272, 442, 11, '#8a5a34');
  if (!skip.has('d5')) {
    line(ctx, 266, 434, 256, 414, '#5a3a1e', 3);
    line(ctx, 276, 434, 284, 414, '#5a3a1e', 3);
  }
  line(ctx, 232, 474, 232, 496, '#8a5a34', 5);
  line(ctx, 266, 474, 266, 496, '#8a5a34', 5);
  // snowman
  circle(ctx, 540, 500, 22, '#ffffff');
  circle(ctx, 540, 468, 16, '#ffffff');
  circle(ctx, 540, 444, 11, '#ffffff');
  poly(ctx, [[540, 444], [566, 448], [540, 450]], '#ff7a1a');
  circle(ctx, 536, 440, 2, '#0d1526');
  circle(ctx, 545, 440, 2, '#0d1526');
}

// ---------------------------------------------------------------- scene 4
function drawReef(ctx, skip) {
  vgrad(ctx, [[0, '#1a6fa8'], [0.55, '#1e8fc9'], [1, '#0a4a72']]);
  ctx.fillStyle = 'rgba(255,255,220,0.10)';
  poly(ctx, [[80, 0], [150, 0], [60, 560], [0, 560]], 'rgba(255,255,220,0.10)');
  poly(ctx, [[300, 0], [350, 0], [300, 560], [230, 560]], 'rgba(255,255,220,0.08)');
  const rand = mulberry32(4242);
  for (let i = 0; i < 14; i++) {
    const x = range(rand, 40, 560), y = range(rand, 60, 420);
    circle(ctx, x, y, range(rand, 2, 4), 'rgba(255,255,255,0.5)');
  }
  // manta ray
  if (!skip.has('d8')) {
    ctx.fillStyle = '#12324a';
    ctx.beginPath();
    ctx.moveTo(480, 110);
    ctx.quadraticCurveTo(430, 88, 400, 104);
    ctx.quadraticCurveTo(440, 116, 480, 122);
    ctx.quadraticCurveTo(520, 116, 560, 104);
    ctx.quadraticCurveTo(530, 88, 480, 110);
    ctx.fill();
  }
  // turtle
  if (!skip.has('d1')) {
    ellipse(ctx, 380, 300, 34, 24, '#3d8f5a');
    circle(ctx, 414, 296, 10, '#3d8f5a');
    ellipse(ctx, 352, 282, 16, 7, '#2f7a4a');
    ellipse(ctx, 352, 318, 16, 7, '#2f7a4a');
    ellipse(ctx, 398, 322, 14, 6, '#2f7a4a');
  }
  // fish schools
  fish(ctx, 130, 200, 1, '#ffd93d');
  fish(ctx, 165, 215, 0.85, '#ffd93d');
  fish(ctx, 150, 185, 0.8, '#ff9a3d');
  fish(ctx, 450, 180, 1, '#ff7ab8');
  fish(ctx, 480, 200, 0.85, '#ff7ab8');
  fish(ctx, 250, 320, 1, '#7ae0ff');
  fish(ctx, 280, 340, 0.8, '#7ae0ff');
  // corals
  const coral = (x, y, s, color) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 7 * s;
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x - 14 * s, y - 40 * s, x - 6 * s, y - 70 * s);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 4 * s, y - 46 * s, x + 18 * s, y - 76 * s);
    ctx.moveTo(x, y);
    ctx.quadraticCurveTo(x + 16 * s, y - 30 * s, x + 26 * s, y - 48 * s);
    ctx.stroke();
  };
  coral(80, 480, 1.1, '#ff6b9d');
  coral(500, 470, 1.2, '#ff6b9d');
  coral(300, 490, 0.9, '#c96bff');
  // anemone
  ctx.strokeStyle = '#b06bff';
  ctx.lineWidth = 4;
  for (let i = 0; i < 7; i++) {
    const a = -Math.PI / 2 + (i - 3) * 0.28;
    ctx.beginPath();
    ctx.moveTo(250, 500);
    ctx.quadraticCurveTo(250 + Math.cos(a) * 14, 500 + Math.sin(a) * 22, 250 + Math.cos(a) * 26, 500 + Math.sin(a) * 34);
    ctx.stroke();
  }
  circle(ctx, 250, 500, 12, '#8a4fc9');
  // sand floor
  rect(ctx, 0, 480, 600, 80, '#e8d29a');
  ellipse(ctx, 120, 530, 30, 9, '#d9c184');
  ellipse(ctx, 430, 540, 34, 9, '#d9c184');
  if (!skip.has('d6')) star(ctx, 180, 520, 12, '#ff9a3d');
  star(ctx, 430, 530, 10, '#ff7a1a');
  // bubbles
  if (!skip.has('d5')) circle(ctx, 200, 380, 6, 'rgba(255,255,255,0.55)');
  circle(ctx, 220, 340, 4, 'rgba(255,255,255,0.5)');
  circle(ctx, 190, 300, 5, 'rgba(255,255,255,0.5)');
  circle(ctx, 340, 360, 4, 'rgba(255,255,255,0.5)');
}

// ---------------------------------------------------------------- scene 5
function drawDesert(ctx, skip) {
  vgrad(ctx, [[0, '#2a1e4f'], [0.45, '#7a3d6e'], [0.75, '#e0784a'], [1, '#f2a65e']]);
  const rand = mulberry32(99);
  for (let i = 0; i < 40; i++) {
    circle(ctx, range(rand, 10, 590), range(rand, 8, 180), range(rand, 1, 2.4), '#ffffff');
  }
  circle(ctx, 90, 80, 30, '#fff6d8');
  circle(ctx, 100, 74, 6, '#e8d9a8');
  // dunes
  ctx.fillStyle = '#d98a4a';
  ctx.beginPath();
  ctx.moveTo(0, 380);
  ctx.quadraticCurveTo(200, 320, 400, 380);
  ctx.quadraticCurveTo(520, 420, 600, 380);
  ctx.lineTo(600, 560);
  ctx.lineTo(0, 560);
  ctx.fill();
  ctx.fillStyle = '#c9743a';
  ctx.beginPath();
  ctx.moveTo(0, 450);
  ctx.quadraticCurveTo(180, 400, 380, 450);
  ctx.quadraticCurveTo(500, 480, 600, 440);
  ctx.lineTo(600, 560);
  ctx.lineTo(0, 560);
  ctx.fill();
  ctx.fillStyle = '#b8642f';
  ctx.beginPath();
  ctx.moveTo(0, 520);
  ctx.quadraticCurveTo(250, 480, 600, 520);
  ctx.lineTo(600, 560);
  ctx.lineTo(0, 560);
  ctx.fill();
  // observatory
  rect(ctx, 330, 330, 100, 70, '#f5f0e6');
  ctx.fillStyle = '#f5f0e6';
  ctx.beginPath();
  ctx.arc(380, 330, 52, Math.PI, 0);
  ctx.fill();
  rect(ctx, 372, 262, 16, 68, '#22304a');
  rect(ctx, 352, 330, 56, 8, '#d93838');
  rect(ctx, 352, 352, 56, 8, '#d93838');
  // flag pole on the ground
  line(ctx, 310, 330, 310, 268, '#5a3a1e', 4);
  poly(ctx, [[310, 268], [340, 276], [310, 286]], '#d93838');
  // cacti
  const cactus = (x, y, s) => {
    ctx.fillStyle = '#2f7a4a';
    rect(ctx, x - 6 * s, y - 52 * s, 12 * s, 52 * s);
    rect(ctx, x - 22 * s, y - 34 * s, 10 * s, 22 * s);
    rect(ctx, x - 22 * s, y - 34 * s, 18 * s, 8 * s);
    rect(ctx, x + 12 * s, y - 26 * s, 10 * s, 18 * s);
    rect(ctx, x + 12 * s, y - 26 * s, 18 * s, 8 * s);
  };
  if (!skip.has('d2')) cactus(120, 470, 1);
  cactus(520, 480, 0.9);
  cactus(220, 510, 0.8);
  // rocks
  ellipse(ctx, 300, 510, 26, 12, '#8a5a34');
  ellipse(ctx, 480, 520, 30, 12, '#8a5a34');
  // lizard on the right rock
  if (!skip.has('d8')) {
    ellipse(ctx, 470, 500, 14, 5, '#4a9e5c');
    circle(ctx, 484, 498, 5, '#4a9e5c');
    line(ctx, 456, 500, 442, 496, '#4a9e5c', 3);
  }
}

// ---------------------------------------------------------------- scenes
export const SCENES = [
  {
    id: 'harbor', name: 'Harbor at Dawn', par: 90,
    draw: drawHarbor,
    diffs: [
      { id: 'd1', x: 330, y: 55, r: 30, kind: 'remove' },
      { id: 'd2', x: 81, y: 250, r: 26, kind: 'change', apply(ctx) { rect(ctx, 58, 210, 46, 26, '#2f8f8f'); rect(ctx, 58, 268, 46, 26, '#2f8f8f'); } },
      { id: 'd3', x: 210, y: 365, r: 26, kind: 'change', apply(ctx) { poly(ctx, [[198, 393], [198, 353], [220, 393]], '#ff7ab8'); } },
      { id: 'd4', x: 450, y: 450, r: 24, kind: 'add', apply(ctx) { fish(ctx, 450, 450, 0.9, '#7ae0ff'); } },
      { id: 'd5', x: 382, y: 278, r: 26, kind: 'change', apply(ctx) { poly(ctx, [[342, 298], [382, 272], [422, 298]], '#2f8f5a'); } },
      { id: 'd6', x: 230, y: 95, r: 24, kind: 'remove' },
      { id: 'd7', x: 540, y: 425, r: 26, kind: 'remove' },
    ],
  },
  {
    id: 'market', name: 'Lantern Night Market', par: 105,
    draw: drawMarket,
    diffs: [
      { id: 'd1', x: 300, y: 165, r: 26, kind: 'change', apply(ctx) { lantern(ctx, 300, 165, 1, '#7ae0a3'); } },
      { id: 'd2', x: 470, y: 180, r: 26, kind: 'remove' },
      { id: 'd3', x: 150, y: 200, r: 22, kind: 'add', apply(ctx) { star(ctx, 150, 200, 9, '#ffe9a3'); } },
      { id: 'd4', x: 135, y: 392, r: 28, kind: 'change', apply(ctx) { poly(ctx, [[52, 432], [135, 392], [218, 432]], '#ff9a3d'); } },
      { id: 'd5', x: 502, y: 488, r: 26, kind: 'remove' },
      { id: 'd6', x: 515, y: 78, r: 22, kind: 'change', apply(ctx) { circle(ctx, 515, 78, 7, '#fff6d8'); } },
      { id: 'd7', x: 350, y: 128, r: 22, kind: 'remove' },
    ],
  },
  {
    id: 'winter', name: 'Winter Cabin', par: 120,
    draw: drawWinter,
    diffs: [
      { id: 'd1', x: 252, y: 162, r: 26, kind: 'remove' },
      { id: 'd2', x: 129, y: 295, r: 24, kind: 'change', apply(ctx) { rect(ctx, 116, 282, 26, 26, '#7ab8e0'); } },
      { id: 'd3', x: 380, y: 335, r: 28, kind: 'remove' },
      { id: 'd4', x: 540, y: 446, r: 22, kind: 'change', apply(ctx) { poly(ctx, [[540, 444], [566, 448], [540, 450]], '#37c978'); } },
      { id: 'd5', x: 268, y: 424, r: 26, kind: 'remove' },
      { id: 'd6', x: 420, y: 90, r: 22, kind: 'add', apply(ctx) { bird(ctx, 420, 90, 1); } },
      { id: 'd7', x: 450, y: 468, r: 26, kind: 'change', apply(ctx) { ellipse(ctx, 450, 470, 120, 34, '#9fd0e8'); } },
      { id: 'd8', x: 176, y: 320, r: 22, kind: 'remove' },
    ],
  },
  {
    id: 'reef', name: 'Coral Reef', par: 135,
    draw: drawReef,
    diffs: [
      { id: 'd1', x: 380, y: 300, r: 30, kind: 'remove' },
      { id: 'd2', x: 500, y: 440, r: 28, kind: 'change', apply(ctx) {
        ctx.strokeStyle = '#ff9a3d'; ctx.lineWidth = 8; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.moveTo(500, 470);
        ctx.quadraticCurveTo(486, 430, 494, 400);
        ctx.moveTo(500, 470); ctx.quadraticCurveTo(504, 424, 518, 394);
        ctx.moveTo(500, 470); ctx.quadraticCurveTo(516, 440, 526, 422);
        ctx.stroke();
      } },
      { id: 'd3', x: 150, y: 200, r: 26, kind: 'change', apply(ctx) { fish(ctx, 130, 200, 1, '#b06bff'); } },
      { id: 'd4', x: 330, y: 530, r: 22, kind: 'add', apply(ctx) { ellipse(ctx, 330, 530, 12, 8, '#ffb8d9'); } },
      { id: 'd5', x: 200, y: 380, r: 22, kind: 'remove' },
      { id: 'd6', x: 180, y: 520, r: 24, kind: 'remove' },
      { id: 'd7', x: 250, y: 492, r: 24, kind: 'change', apply(ctx) {
        ctx.strokeStyle = '#2fbf9a'; ctx.lineWidth = 4;
        for (let i = 0; i < 7; i++) {
          const a = -Math.PI / 2 + (i - 3) * 0.28;
          ctx.beginPath(); ctx.moveTo(250, 500);
          ctx.quadraticCurveTo(250 + Math.cos(a) * 14, 500 + Math.sin(a) * 22, 250 + Math.cos(a) * 26, 500 + Math.sin(a) * 34);
          ctx.stroke();
        }
        circle(ctx, 250, 500, 12, '#1e8f7a');
      } },
      { id: 'd8', x: 480, y: 110, r: 28, kind: 'remove' },
    ],
  },
  {
    id: 'desert', name: 'Desert Observatory', par: 150,
    draw: drawDesert,
    diffs: [
      { id: 'd1', x: 380, y: 318, r: 28, kind: 'change', apply(ctx) { rect(ctx, 352, 330, 56, 8, '#2f8f8f'); rect(ctx, 352, 352, 56, 8, '#2f8f8f'); } },
      { id: 'd2', x: 120, y: 440, r: 26, kind: 'remove' },
      { id: 'd3', x: 250, y: 70, r: 22, kind: 'add', apply(ctx) { star(ctx, 250, 70, 9, '#ffe9a3'); } },
      { id: 'd4', x: 380, y: 235, r: 26, kind: 'change', apply(ctx) {
        rect(ctx, 372, 262, 16, 68, '#f5f0e6');
        ctx.strokeStyle = '#22304a'; ctx.lineWidth = 8;
        ctx.beginPath(); ctx.moveTo(380, 300); ctx.lineTo(420, 252); ctx.stroke();
        circle(ctx, 420, 252, 7, '#22304a');
      } },
      { id: 'd5', x: 90, y: 80, r: 26, kind: 'change', apply(ctx) { circle(ctx, 104, 80, 26, '#2a1e4f'); } },
      { id: 'd6', x: 300, y: 505, r: 24, kind: 'remove' },
      { id: 'd7', x: 318, y: 278, r: 22, kind: 'change', apply(ctx) { poly(ctx, [[310, 268], [340, 276], [310, 286]], '#2f6fd0'); } },
      { id: 'd8', x: 470, y: 498, r: 22, kind: 'remove' },
      { id: 'd9', x: 520, y: 90, r: 24, kind: 'add', apply(ctx) {
        line(ctx, 505, 90, 535, 90, '#ffffff', 2);
        rect(ctx, 514, 84, 12, 12, '#ffd97a');
        circle(ctx, 508, 90, 3, '#ffffff');
        circle(ctx, 532, 90, 3, '#ffffff');
      } },
    ],
  },
];

// Draw one panel: base picture, then (right panel only) the differences.
export function drawPanel(ctx, scene, right) {
  const skip = new Set();
  if (right) {
    for (const d of scene.diffs) if (d.kind === 'remove') skip.add(d.id);
  }
  scene.draw(ctx, skip);
  if (right) {
    for (const d of scene.diffs) {
      if (d.kind === 'change' || d.kind === 'add') d.apply(ctx);
    }
  }
}
