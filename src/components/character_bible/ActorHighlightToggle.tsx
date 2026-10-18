import React from 'react';

interface ActorHighlightToggleProps {
  isActive: boolean;
  onToggle: () => void;
}

export const ActorHighlightToggle: React.FC<ActorHighlightToggleProps> = ({
  isActive,
  onToggle,
}) => {
  return (
    <button
      id="actor-highlight-toggle-btn"
      type="button"
      onClick={onToggle}
      className={`px-3 py-1 rounded-md text-xs font-semibold tracking-wide transition-all cursor-pointer shrink-0 select-none whitespace-nowrap border-2 ${
        isActive
          ? 'border-emerald-500 text-emerald-300 bg-emerald-950/60 hover:bg-emerald-900/70 shadow-xs shadow-emerald-500/20'
          : 'border-purple-500/80 text-purple-300 bg-purple-950/40 hover:bg-purple-900/50 shadow-xs shadow-purple-500/10'
      }`}
      title={
        isActive
          ? 'Actor Highlight is active. Click to switch off.'
          : 'Actor Highlight is inactive. Click to switch on.'
      }
    >
      Actor Highlight
    </button>
  );
};
