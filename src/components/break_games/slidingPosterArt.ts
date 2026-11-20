export function generatePosterSlices(): string[] {
  const size = 240, tile = 80;
  const full = document.createElement('canvas');
  full.width = size; full.height = size;
  const ctx = full.getContext('2d')!;

  const sky = ctx.createLinearGradient(0, 0, 0, size);
  sky.addColorStop(0, '#1E1B4B');
  sky.addColorStop(0.55, '#B45309');
  sky.addColorStop(1, '#F59E0B');
  ctx.fillStyle = sky;
  ctx.fillRect(0, 0, size, size);

  ctx.fillStyle = 'rgba(255,245,200,0.22)';
  ctx.beginPath(); ctx.moveTo(40, size); ctx.lineTo(130, 0); ctx.lineTo(175, 0); ctx.closePath(); ctx.fill();
  ctx.beginPath(); ctx.moveTo(200, size); ctx.lineTo(65, 0); ctx.lineTo(110, 0); ctx.closePath(); ctx.fill();

  ctx.fillStyle = '#FDE68A';
  ctx.beginPath(); ctx.arc(120, 108, 46, 0, Math.PI * 2); ctx.fill();

  ctx.fillStyle = '#18181B';
  ctx.beginPath(); ctx.moveTo(0, 185); ctx.lineTo(52, 136); ctx.lineTo(98, 165); ctx.lineTo(154, 124); ctx.lineTo(205, 162); ctx.lineTo(size, 140); ctx.lineTo(size, size); ctx.lineTo(0, size); ctx.closePath(); ctx.fill();

  ctx.strokeStyle = '#FDE68A'; ctx.lineWidth = 4;
  ctx.strokeRect(8, 8, size - 16, size - 16);
  ctx.fillStyle = '#FEF3C7'; ctx.font = 'bold 18px serif'; ctx.textAlign = 'center';
  ctx.fillText('PREMIERE', 120, 214);

  const slices: string[] = [];
  for (let i = 0; i < 8; i++) {
    const r = Math.floor(i / 3), c = i % 3;
    const sc = document.createElement('canvas');
    sc.width = tile; sc.height = tile;
    const sctx = sc.getContext('2d')!;
    sctx.drawImage(full, c * tile, r * tile, tile, tile, 0, 0, tile, tile);
    sctx.fillStyle = 'rgba(0,0,0,0.48)';
    sctx.fillRect(4, 4, 18, 18);
    sctx.fillStyle = '#FFFFFF'; sctx.font = 'bold 11px sans-serif'; sctx.textAlign = 'center'; sctx.textBaseline = 'middle';
    sctx.fillText(String(i + 1), 13, 13);
    slices.push(sc.toDataURL());
  }
  return slices;
}

export function createShuffledBoard(): (number | null)[] {
  const b: (number | null)[] = [0, 1, 2, 3, 4, 5, 6, 7, null];
  let empty = 8, prev = -1;
  for (let s = 0; s < 65; s++) {
    const r = Math.floor(empty / 3), c = empty % 3;
    const nbrs = [[r - 1, c], [r + 1, c], [r, c - 1], [r, c + 1]]
      .filter(([nr, nc]) => nr >= 0 && nr < 3 && nc >= 0 && nc < 3)
      .map(([nr, nc]) => nr * 3 + nc)
      .filter((idx) => idx !== prev);
    const pick = nbrs[Math.floor(Math.random() * nbrs.length)];
    b[empty] = b[pick]; b[pick] = null;
    prev = empty; empty = pick;
  }
  return b;
}
