// Small canvas drawing helpers shared by every scene. Each helper draws one
// motif at (x, y) in the panel's local coordinates; scenes compose them.
export function circle(ctx, x, y, r, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, r, 0, Math.PI * 2);
  ctx.fill();
}

export function ellipse(ctx, x, y, rx, ry, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.ellipse(x, y, rx, ry, 0, 0, Math.PI * 2);
  ctx.fill();
}

export function rect(ctx, x, y, w, h, fill) {
  ctx.fillStyle = fill;
  ctx.fillRect(x, y, w, h);
}

export function poly(ctx, points, fill) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.moveTo(points[0][0], points[0][1]);
  for (let i = 1; i < points.length; i++) ctx.lineTo(points[i][0], points[i][1]);
  ctx.closePath();
  ctx.fill();
}

export function line(ctx, x1, y1, x2, y2, color, width) {
  ctx.strokeStyle = color;
  ctx.lineWidth = width;
  ctx.beginPath();
  ctx.moveTo(x1, y1);
  ctx.lineTo(x2, y2);
  ctx.stroke();
}

export function star(ctx, x, y, r, fill, points = 5) {
  ctx.fillStyle = fill;
  ctx.beginPath();
  for (let i = 0; i < points * 2; i++) {
    const rr = i % 2 === 0 ? r : r * 0.45;
    const a = (i * Math.PI) / points - Math.PI / 2;
    const px = x + Math.cos(a) * rr;
    const py = y + Math.sin(a) * rr;
    if (i === 0) ctx.moveTo(px, py);
    else ctx.lineTo(px, py);
  }
  ctx.closePath();
  ctx.fill();
}

export function cloud(ctx, x, y, s, fill = '#ffffff') {
  ctx.fillStyle = fill;
  ctx.beginPath();
  ctx.arc(x, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 18 * s, y - 6 * s, 20 * s, 0, Math.PI * 2);
  ctx.arc(x + 38 * s, y, 16 * s, 0, Math.PI * 2);
  ctx.arc(x + 19 * s, y + 8 * s, 18 * s, 0, Math.PI * 2);
  ctx.fill();
}

export function pine(ctx, x, y, s, green = '#1e6b3a') {
  ctx.fillStyle = '#5a3a1e';
  ctx.fillRect(x - 4 * s, y, 8 * s, 14 * s);
  poly(ctx, [[x, y - 58 * s], [x - 26 * s, y - 6 * s], [x + 26 * s, y - 6 * s]], green);
  poly(ctx, [[x, y - 78 * s], [x - 20 * s, y - 34 * s], [x + 20 * s, y - 34 * s]], green);
  poly(ctx, [[x, y - 96 * s], [x - 14 * s, y - 58 * s], [x + 14 * s, y - 58 * s]], green);
}

export function house(ctx, x, y, w, h, wall, roof) {
  rect(ctx, x, y, w, h, wall);
  poly(ctx, [[x - 8, y], [x + w / 2, y - 26], [x + w + 8, y]], roof);
  rect(ctx, x + w / 2 - 9, y + h - 26, 18, 26, '#5a3a1e');
  rect(ctx, x + 10, y + 12, 14, 14, '#ffe9a3');
  rect(ctx, x + w - 24, y + 12, 14, 14, '#ffe9a3');
}

export function boat(ctx, x, y, s, hull, sail) {
  poly(ctx, [[x, y], [x + 52 * s, y], [x + 44 * s, y + 16 * s], [x + 8 * s, y + 16 * s]], hull);
  line(ctx, x + 26 * s, y, x + 26 * s, y - 44 * s, '#5a3a1e', 3 * s);
  poly(ctx, [[x + 28 * s, y - 2 * s], [x + 28 * s, y - 42 * s], [x + 50 * s, y - 2 * s]], sail);
}

export function fish(ctx, x, y, s, color, flip = false) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(flip ? -s : s, s);
  ellipse(ctx, 0, 0, 16, 9, color);
  poly(ctx, [[-14, 0], [-26, -9], [-26, 9]], color);
  circle(ctx, 7, -2, 2, '#0d1526');
  ctx.restore();
}

export function bird(ctx, x, y, s, color = '#22304a') {
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5 * s;
  ctx.beginPath();
  ctx.arc(x - 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.arc(x + 7 * s, y, 7 * s, Math.PI * 1.15, Math.PI * 1.85);
  ctx.stroke();
}

export function lantern(ctx, x, y, s, color) {
  line(ctx, x, y - 26 * s, x, y - 12 * s, '#3a2a12', 2);
  ellipse(ctx, x, y, 13 * s, 17 * s, color);
  rect(ctx, x - 6 * s, y - 20 * s, 12 * s, 4 * s, '#ffd97a');
  rect(ctx, x - 6 * s, y + 16 * s, 12 * s, 4 * s, '#ffd97a');
  ctx.fillStyle = 'rgba(255, 217, 122, 0.35)';
  ctx.beginPath();
  ctx.arc(x, y, 24 * s, 0, Math.PI * 2);
  ctx.fill();
}
