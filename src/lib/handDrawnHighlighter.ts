import React from 'react';

/**
 * Parses a hex colour code into RGBA format with custom opacity.
 */
function toRgba(hex: string, alpha: number): string {
  const clean = hex.replace('#', '');
  const r = parseInt(clean.substring(0, 2), 16) || 254;
  const g = parseInt(clean.substring(2, 4), 16) || 249;
  const b = parseInt(clean.substring(4, 6), 16) || 195;
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
}

// Microscopic felt-tip paper grain texture to evoke porous paper tooth
const MARKER_GRAIN_SVG = `data:image/svg+xml;utf8,<svg xmlns='http://www.w3.org/2000/svg' width='64' height='64'><filter id='g'><feTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='2' stitchTiles='stitch'/><feColorMatrix type='matrix' values='0 0 0 0 0  0 0 0 0 0  0 0 0 0 0  0 0 0 0.04 0'/></filter><rect width='64' height='64' filter='url(%23g)'/></svg>`;

/**
 * Generates an authentic hand-drawn highlighter underlay style with natural
 * marker ink flow, porous paper grain, and organic chisel-tip edges.
 * Translucent tint ensures text remains 100% legible and crisp.
 */
export function getHandDrawnHighlighterStyle(
  hexColor: string
): React.CSSProperties {
  const inkDark = toRgba(hexColor, 0.68);
  const inkBase = toRgba(hexColor, 0.55);
  const inkBleed = toRgba(hexColor, 0.35);
  const inkBleedSoft = toRgba(hexColor, 0.18);

  return {
    backgroundColor: toRgba(hexColor, 0.52),
    // Hug each individual line to its exact length without altering line-break points
    display: 'inline',
    boxDecorationBreak: 'clone',
    WebkitBoxDecorationBreak: 'clone',
    // Directional ink flow & paper grain
    backgroundImage: `
      url("${MARKER_GRAIN_SVG}"),
      linear-gradient(
        91.5deg,
        ${inkDark} 0%,
        ${inkBase} 3%,
        ${inkBase} 48%,
        ${inkDark} 52%,
        ${inkBase} 56%,
        ${inkBase} 96%,
        ${toRgba(hexColor, 0.48)} 100%
      )
    `,
    backgroundBlendMode: 'multiply, normal',
    // Organic chisel edges with hand-drawn waviness and angled cuts
    borderRadius: '4px 11px 3px 12px / 9px 3px 10px 4px',
    paddingTop: '0.14rem',
    paddingBottom: '0.18rem',
    paddingLeft: '0.12rem',
    paddingRight: '0.12rem',
    // Rough textured edges with ink bleed into paper fibres
    boxShadow: `0 0 2px 1.5px ${inkBleed}, 0 1px 3px -0.5px ${inkBleedSoft}`,
    transform: 'rotate(-0.15deg) skewX(-0.35deg)',
  };
}
