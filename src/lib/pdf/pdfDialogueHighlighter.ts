import { jsPDF } from 'jspdf';

interface RgbColor {
  r: number;
  g: number;
  b: number;
}

interface Point {
  x: number;
  y: number;
}

function hashNoise(seed: number): number {
  const s = Math.sin(seed * 12.9898) * 43758.5453;
  return s - Math.floor(s);
}

function buildStrokePoints(
  startX: number,
  endX: number,
  topY: number,
  botY: number,
  seed: number,
  expand: number
): Point[] {
  const points: Point[] = [];
  const tilt = -0.55;
  const segments = Math.max(4, Math.min(10, Math.round((endX - startX) / 25)));

  // Angled chisel start (top-left)
  points.push({ x: startX - 1.5 - expand, y: topY - expand });

  // Top edge with uneven hand waviness
  for (let i = 1; i < segments; i++) {
    const t = i / segments;
    const px = startX + t * (endX - startX);
    const wave = (hashNoise(seed + i * 3.1) - 0.5) * 1.4;
    points.push({ x: px, y: topY + t * tilt + wave - expand });
  }

  // Angled chisel end (top-right to bottom-right cut)
  points.push({ x: endX + 1.8 + tilt + expand, y: topY + tilt - expand });
  points.push({ x: endX - 0.9 + tilt + expand, y: botY + tilt + expand });

  // Bottom edge with uneven hand waviness returning to bottom-left
  for (let i = segments - 1; i >= 1; i--) {
    const t = i / segments;
    const px = startX + t * (endX - startX);
    const wave = (hashNoise(seed + 100 + i * 2.7) - 0.5) * 1.4;
    points.push({ x: px, y: botY + t * tilt + wave + expand });
  }

  // Angled chisel start (bottom-left)
  points.push({ x: startX + 1.1 - expand, y: botY + expand });

  return points;
}

function drawPolygon(doc: jsPDF, points: Point[]): void {
  if (points.length === 0) return;
  doc.moveTo(points[0].x, points[0].y);
  for (let i = 1; i < points.length; i++) {
    doc.lineTo(points[i].x, points[i].y);
  }
  doc.close();
  doc.fill();
}

/**
 * Draws an authentic hand-drawn chisel highlighter stroke behind each dialogue line
 * featuring uneven waviness, angled chisel-tip cuts, human tilt, and fibre ink bleed.
 */
export function drawPdfDialogueHighlight(
  doc: jsPDF,
  x: number,
  y: number,
  textWidth: number,
  lineHeight: number,
  rgb: RgbColor
): void {
  const startX = x - 3.5;
  const endX = x + textWidth + 3.5;
  const topY = y - lineHeight + 2.5;
  const botY = y + 2;
  const seed = Math.round(x * 7 + y * 13 + textWidth);

  // Pass 1: Subtle ink bleed into paper fibres
  const bleedR = Math.min(255, Math.round(rgb.r * 0.4 + 255 * 0.6));
  const bleedG = Math.min(255, Math.round(rgb.g * 0.4 + 255 * 0.6));
  const bleedB = Math.min(255, Math.round(rgb.b * 0.4 + 255 * 0.6));
  doc.setFillColor(bleedR, bleedG, bleedB);
  drawPolygon(doc, buildStrokePoints(startX, endX, topY, botY, seed, 0.9));

  // Pass 2: Main hand-drawn chisel stroke
  doc.setFillColor(rgb.r, rgb.g, rgb.b);
  drawPolygon(doc, buildStrokePoints(startX, endX, topY, botY, seed, 0));

  doc.setTextColor(0, 0, 0);
}
