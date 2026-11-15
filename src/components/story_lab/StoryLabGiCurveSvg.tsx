import React from 'react';
import { TimelineTagPoint } from './characterFortuneTypes';

interface StoryLabGiCurveSvgProps {
  characterPointsMap: Record<string, TimelineTagPoint[]>;
  canvasWidth?: number;
  canvasHeight?: number;
  selectedCharId?: string | null;
}

function buildSmoothSpline(points: { x: number; y: number }[]): string {
  if (points.length === 0) return '';
  if (points.length === 1) return `M ${points[0].x} ${points[0].y}`;
  let path = `M ${points[0].x.toFixed(1)} ${points[0].y.toFixed(1)}`;
  for (let i = 0; i < points.length - 1; i += 1) {
    const p0 = points[Math.max(i - 1, 0)];
    const p1 = points[i];
    const p2 = points[i + 1];
    const p3 = points[Math.min(i + 2, points.length - 1)];
    const cp1x = p1.x + (p2.x - p0.x) / 5;
    const cp1y = p1.y + (p2.y - p0.y) / 5;
    const cp2x = p2.x - (p3.x - p1.x) / 5;
    const cp2y = p2.y - (p3.y - p1.y) / 5;
    path += ` C ${cp1x.toFixed(1)} ${cp1y.toFixed(1)}, ${cp2x.toFixed(1)} ${cp2y.toFixed(1)}, ${p2.x.toFixed(1)} ${p2.y.toFixed(1)}`;
  }
  return path;
}

export const StoryLabGiCurveSvg: React.FC<StoryLabGiCurveSvgProps> = ({
  characterPointsMap,
  canvasWidth = 1000,
  canvasHeight = 340,
  selectedCharId,
}) => {
  return (
    <svg
      className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10"
      preserveAspectRatio="none"
      viewBox={`0 0 ${canvasWidth} ${canvasHeight}`}
    >
      <defs>
        <filter id="gi-curve-shadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="1.5" stdDeviation="1.5" floodColor="#000000" floodOpacity="0.25" />
        </filter>
      </defs>

      {(Object.entries(characterPointsMap) as [string, TimelineTagPoint[]][]).map(([charId, points]) => {
        if (points.length === 0) return null;
        const sorted = [...points].sort((a, b) => a.percentX - b.percentX);
        const color = sorted[0].characterColor;
        const centerY = canvasHeight / 2;
        const maxDelta = centerY - 28;
        const coords = sorted.map((p) => ({
          x: (p.percentX / 100) * canvasWidth,
          y: centerY - (p.fortune / 100) * maxDelta,
        }));
        const isActive = selectedCharId === charId;

        return (
          <g key={charId} className="transition-all duration-150">
            <path
              d={buildSmoothSpline(coords)}
              fill="none"
              stroke={color}
              strokeWidth={isActive ? '4.5' : '3.5'}
              strokeLinecap="round"
              strokeLinejoin="round"
              filter="url(#gi-curve-shadow)"
            />
          </g>
        );
      })}
    </svg>
  );
};
