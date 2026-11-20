export interface Block { x: number; width: number; }
export interface Debris { x: number; y: number; w: number; vy: number; alpha: number; }

export interface StackerState {
  stack: Block[];
  debris: Debris[];
  currentX: number;
  currentWidth: number;
  dir: number;
  speed: number;
  camY: number;
  flash: number;
  perfectStreak: number;
  gameOver: boolean;
}

export function drawStackerFrame(
  ctx: CanvasRenderingContext2D, s: StackerState, accent: string, isDark: boolean, dt: number,
): void {
  s.camY += (Math.max(0, (s.stack.length - 6) * 24) - s.camY) * 0.14 * dt;
  ctx.clearRect(0, 0, 300, 288);
  ctx.strokeStyle = isDark ? 'rgba(255,255,255,0.06)' : 'rgba(0,0,0,0.06)';
  for (let y = 0; y < 288; y += 24) { ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(300, y); ctx.stroke(); }

  s.stack.forEach((b, i) => {
    ctx.fillStyle = accent;
    ctx.globalAlpha = 0.65 + (i % 4) * 0.09;
    ctx.beginPath(); ctx.roundRect(b.x, 288 - 30 - i * 24 + s.camY, b.width, 21, 5); ctx.fill();
  });
  ctx.globalAlpha = 1;

  if (s.flash > 0) {
    const top = s.stack[s.stack.length - 1];
    ctx.strokeStyle = `rgba(255,255,255,${s.flash})`; ctx.lineWidth = 3;
    ctx.strokeRect(top.x - (1 - s.flash) * 8, 288 - 30 - (s.stack.length - 1) * 24 + s.camY, top.width + (1 - s.flash) * 16, 21);
    s.flash = Math.max(0, s.flash - 0.06 * dt);
  }

  s.debris.forEach((d) => {
    d.y += d.vy * dt; d.vy += 0.38 * dt; d.alpha -= 0.03 * dt;
    if (d.alpha > 0) { ctx.globalAlpha = d.alpha; ctx.fillStyle = accent; ctx.fillRect(d.x, d.y, d.w, 21); ctx.globalAlpha = 1; }
  });
  s.debris = s.debris.filter((d) => d.alpha > 0);

  if (!s.gameOver) {
    s.currentX += s.speed * s.dir * dt;
    if (s.currentX <= 0) { s.currentX = 0; s.dir = 1; }
    if (s.currentX + s.currentWidth >= 300) { s.currentX = 300 - s.currentWidth; s.dir = -1; }
    ctx.fillStyle = accent;
    ctx.beginPath(); ctx.roundRect(s.currentX, 288 - 30 - s.stack.length * 24 + s.camY, s.currentWidth, 21, 5); ctx.fill();
  }
}
