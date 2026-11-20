import { ModalThemeStyles } from '../../lib/modalTheme';
import { BubbleNode, PopFx, SHEET_W, SHEET_H } from './bubbleWrapShapes';
import { getBubbleSprite } from './bubbleSpriteCache';

export function renderBubbleSheet(
  ctx: CanvasRenderingContext2D, bubbles: BubbleNode[], fxList: PopFx[], hoveredIdx: number, now: number, mt: ModalThemeStyles, dpr: number, banner?: { text: string; t: number } | null,
): boolean {
  ctx.clearRect(0, 0, SHEET_W, SHEET_H);
  let active = false;
  const dark = mt.theme.isDark;

  for (let i = 0; i < bubbles.length; i++) {
    const b = bubbles[i];
    if (b.popped) {
      if (now - b.popTime < 150) active = true;
      ctx.save();
      ctx.beginPath(); ctx.arc(b.x, b.y, b.r * 0.92, 0, Math.PI * 2);
      ctx.fillStyle = dark ? 'rgba(255,255,255,0.04)' : 'rgba(115,130,195,0.08)'; ctx.fill();
      ctx.lineWidth = 1; ctx.strokeStyle = dark ? 'rgba(255,255,255,0.16)' : 'rgba(115,130,195,0.28)'; ctx.stroke();
      ctx.beginPath(); ctx.arc(b.x - b.r * 0.12, b.y - b.r * 0.1, b.r * 0.48, 0.3, 2.1);
      ctx.strokeStyle = dark ? 'rgba(255,255,255,0.12)' : 'rgba(115,130,195,0.22)'; ctx.stroke();
      ctx.restore();
    } else {
      const sprite = getBubbleSprite(b.r, dark, dpr);
      const drawR = (b.r + 6) * (i === hoveredIdx ? 1.05 : 1);
      ctx.drawImage(sprite, b.x - drawR, b.y - drawR, drawR * 2, drawR * 2);
    }
  }

  for (let i = fxList.length - 1; i >= 0; i--) {
    const fx = fxList[i], p = (now - fx.startTime) / 520;
    if (p >= 1) { fxList.splice(i, 1); continue; }
    active = true;
    ctx.save(); ctx.beginPath(); ctx.arc(fx.x, fx.y, fx.r * (1 + p * 0.75), 0, Math.PI * 2);
    ctx.strokeStyle = `rgba(145,165,245,${(1 - p) * 0.7})`; ctx.lineWidth = 2 * (1 - p * 0.5); ctx.stroke();
    ctx.font = '800 13px sans-serif'; ctx.textAlign = 'center'; ctx.globalAlpha = 1 - p;
    ctx.fillStyle = mt.theme.accentText; ctx.fillText(fx.text.toUpperCase(), fx.x, fx.y - 8 - p * 26); ctx.restore();
  }

  if (banner && now - banner.t < 900) {
    active = true;
    const bp = (now - banner.t) / 900;
    ctx.save(); ctx.globalAlpha = 1 - bp; ctx.font = '800 16px sans-serif'; ctx.textAlign = 'center';
    ctx.fillStyle = mt.theme.accentText; ctx.fillText(banner.text, SHEET_W / 2, SHEET_H / 2 - bp * 16); ctx.restore();
  }
  return active;
}
