const spriteCache = new Map<string, HTMLCanvasElement>();

function paintArcGlow(
  ctx: CanvasRenderingContext2D, r: number, a0: number, a1: number, wOuter: number, wInner: number, alpha: number,
): void {
  ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.arc(0, 0, r, a0, a1);
  ctx.strokeStyle = `rgba(255,255,255,${alpha * 0.42})`;
  ctx.lineWidth = wOuter;
  ctx.stroke();
  ctx.beginPath();
  ctx.arc(0, 0, r, a0 + 0.06, a1 - 0.06);
  ctx.strokeStyle = `rgba(255,255,255,${alpha})`;
  ctx.lineWidth = wInner;
  ctx.stroke();
}

export function getBubbleSprite(r: number, dark: boolean, dpr: number): HTMLCanvasElement {
  const key = `${r}-${dark}-${dpr}`;
  const cached = spriteCache.get(key);
  if (cached) return cached;

  const pad = 6;
  const c = document.createElement('canvas');
  c.width = Math.ceil((r + pad) * 2 * dpr);
  c.height = c.width;
  const ctx = c.getContext('2d')!;
  ctx.scale(dpr, dpr);
  ctx.translate(r + pad, r + pad);

  ctx.beginPath();
  ctx.arc(0, 2.5, r + 0.5, 0, Math.PI * 2);
  ctx.fillStyle = dark ? 'rgba(10,14,35,0.55)' : 'rgba(95,112,195,0.28)';
  ctx.fill();

  ctx.save();
  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.clip();

  const base = ctx.createRadialGradient(r * 0.22, -r * 0.05, r * 0.1, 0, 0, r);
  base.addColorStop(0, dark ? 'rgba(225,235,250,0.68)' : 'rgba(242,246,255,0.84)');
  base.addColorStop(0.68, dark ? 'rgba(165,178,225,0.52)' : 'rgba(195,205,238,0.72)');
  base.addColorStop(1, dark ? 'rgba(110,125,205,0.72)' : 'rgba(130,145,215,0.88)');
  ctx.fillStyle = base;
  ctx.fillRect(-r, -r, r * 2, r * 2);

  const violet = ctx.createRadialGradient(-r * 0.65, -r * 0.35, 0, -r * 0.45, -r * 0.2, r * 0.95);
  violet.addColorStop(0, 'rgba(190,145,220,0.55)');
  violet.addColorStop(1, 'rgba(190,145,220,0)');
  ctx.fillStyle = violet;
  ctx.fillRect(-r, -r, r * 2, r * 2);

  const mint = ctx.createRadialGradient(-r * 0.08, r * 0.05, 0, 0, 0, r * 0.68);
  mint.addColorStop(0, 'rgba(145,215,210,0.42)');
  mint.addColorStop(1, 'rgba(145,215,210,0)');
  ctx.fillStyle = mint;
  ctx.fillRect(-r, -r, r * 2, r * 2);

  paintArcGlow(ctx, r * 0.72, 2.75, 3.85, r * 0.24, r * 0.12, 0.96);
  paintArcGlow(ctx, r * 0.76, -1.35, 0.35, r * 0.12, r * 0.055, 0.78);
  paintArcGlow(ctx, r * 0.78, 1.05, 2.1, r * 0.14, r * 0.065, 0.88);
  ctx.restore();

  ctx.beginPath();
  ctx.arc(0, 0, r, 0, Math.PI * 2);
  ctx.lineWidth = 1.2;
  ctx.strokeStyle = dark ? 'rgba(175,190,255,0.45)' : 'rgba(110,125,205,0.55)';
  ctx.stroke();

  spriteCache.set(key, c);
  return c;
}
