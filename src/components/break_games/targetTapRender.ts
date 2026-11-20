export interface Orb { x: number; y: number; vx: number; vy: number; r: number; decoy: boolean; born: number; life: number; }
export interface TargetFx { x: number; y: number; text: string; color: string; t: number; }
export const TARGET_W = 360, TARGET_H = 260;

export const spawnOrb = (decoy: boolean, now: number): Orb => ({
  x: 32 + Math.random() * (TARGET_W - 64), y: 32 + Math.random() * (TARGET_H - 64),
  vx: (Math.random() < 0.5 ? -1 : 1) * (1.2 + Math.random() * 1.5),
  vy: (Math.random() < 0.5 ? -1 : 1) * (1.1 + Math.random() * 1.4),
  r: decoy ? 18 : 20, decoy, born: now, life: decoy ? 3600 : 999999,
});

export function renderTargetArena(
  ctx: CanvasRenderingContext2D, good: Orb[], decoys: Orb[], fx: TargetFx[], accent: string, ended: boolean, now: number, dt: number,
): void {
  ctx.clearRect(0, 0, TARGET_W, TARGET_H);
  decoys.forEach((d, i) => { if (!ended && now - d.born > d.life) decoys[i] = spawnOrb(true, now); });
  [...good, ...decoys].forEach((t) => {
    if (!ended) {
      t.x += t.vx * dt; t.y += t.vy * dt;
      if (t.x < t.r || t.x > TARGET_W - t.r) { t.vx *= -1; t.x = Math.max(t.r, Math.min(TARGET_W - t.r, t.x)); }
      if (t.y < t.r || t.y > TARGET_H - t.r) { t.vy *= -1; t.y = Math.max(t.r, Math.min(TARGET_H - t.r, t.y)); }
    }
    const scale = Math.min(1, (now - t.born) / 140);
    ctx.save(); ctx.translate(t.x, t.y); ctx.scale(scale, scale);
    ctx.beginPath(); ctx.arc(0, 0, t.r, 0, Math.PI * 2);
    ctx.fillStyle = t.decoy ? '#DC2626' : accent; ctx.fill();
    ctx.lineWidth = 2.5; ctx.strokeStyle = 'rgba(255,255,255,0.88)'; ctx.stroke();
    ctx.beginPath(); ctx.arc(0, 0, t.r * 0.52, 0, Math.PI * 2);
    ctx.strokeStyle = 'rgba(255,255,255,0.5)'; ctx.lineWidth = 1.5; ctx.stroke();
    ctx.fillStyle = '#FFFFFF'; ctx.font = 'bold 12px sans-serif'; ctx.textAlign = 'center'; ctx.textBaseline = 'middle';
    ctx.fillText(t.decoy ? '✕' : '★', 0, 0.5); ctx.restore();
  });
  for (let i = fx.length - 1; i >= 0; i--) {
    const p = fx[i], prog = (now - p.t) / 480;
    if (prog >= 1) { fx.splice(i, 1); continue; }
    ctx.save(); ctx.globalAlpha = 1 - prog;
    ctx.beginPath(); ctx.arc(p.x, p.y, 18 + prog * 18, 0, Math.PI * 2);
    ctx.strokeStyle = p.color; ctx.lineWidth = 2; ctx.stroke();
    ctx.fillStyle = p.color; ctx.font = 'bold 13px sans-serif'; ctx.textAlign = 'center';
    ctx.fillText(p.text, p.x, p.y - 12 - prog * 20); ctx.restore();
  }
}
