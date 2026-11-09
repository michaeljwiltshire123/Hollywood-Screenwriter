import React from 'react';
import { SpotlightRect } from './useElementTracker';

interface SpotlightOverlayProps {
  rect: SpotlightRect | null;
  onOverlayClick?: () => void;
}

export const SpotlightOverlay: React.FC<SpotlightOverlayProps> = ({ rect, onOverlayClick }) => {
  const handleWheel = (e: React.WheelEvent) => {
    const scrollContainer = document.getElementById('production-modal-scroll-container');
    if (scrollContainer) {
      scrollContainer.scrollTop += e.deltaY;
    }
  };

  if (!rect) {
    return (
      <div
        onClick={onOverlayClick}
        onWheel={handleWheel}
        className="fixed inset-0 z-[100] bg-slate-950/80 backdrop-blur-[1px] transition-opacity duration-200 pointer-events-auto"
      />
    );
  }

  const padding = 6;
  const top = Math.max(0, rect.top - padding);
  const left = Math.max(0, rect.left - padding);
  const width = Math.max(20, rect.width + padding * 2);
  const height = Math.max(20, rect.height + padding * 2);

  return (
    <div onWheel={handleWheel} className="fixed inset-0 z-[100] overflow-hidden pointer-events-none">
      {/* Top blocker */}
      <div
        style={{ top: 0, left: 0, right: 0, height: `${top}px` }}
        onClick={onOverlayClick}
        onWheel={handleWheel}
        className="absolute bg-slate-950/80 backdrop-blur-[1px] pointer-events-auto"
      />
      {/* Bottom blocker */}
      <div
        style={{ top: `${top + height}px`, left: 0, right: 0, bottom: 0 }}
        onClick={onOverlayClick}
        onWheel={handleWheel}
        className="absolute bg-slate-950/80 backdrop-blur-[1px] pointer-events-auto"
      />
      {/* Left blocker */}
      <div
        style={{ top: `${top}px`, left: 0, width: `${left}px`, height: `${height}px` }}
        onClick={onOverlayClick}
        onWheel={handleWheel}
        className="absolute bg-slate-950/80 backdrop-blur-[1px] pointer-events-auto"
      />
      {/* Right blocker */}
      <div
        style={{ top: `${top}px`, left: `${left + width}px`, right: 0, height: `${height}px` }}
        onClick={onOverlayClick}
        onWheel={handleWheel}
        className="absolute bg-slate-950/80 backdrop-blur-[1px] pointer-events-auto"
      />

      {/* Target spotlight cutout frame */}
      <div
        style={{
          top: `${top}px`,
          left: `${left}px`,
          width: `${width}px`,
          height: `${height}px`,
        }}
        className="absolute rounded-xl border-2 border-amber-400 ring-4 ring-amber-400/30 shadow-[0_0_30px_rgba(251,191,36,0.45)] pointer-events-none transition-all duration-150 ease-out"
      />
    </div>
  );
};
