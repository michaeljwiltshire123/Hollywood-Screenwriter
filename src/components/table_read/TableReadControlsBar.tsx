import React from 'react';
import { Play, Pause, RotateCcw, Sliders, MessageSquare, Gauge } from 'lucide-react';
import { ModalTheme } from '../../lib/modalTheme';

interface TableReadControlsBarProps {
  m: ModalTheme;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onRestart: () => void;
  speed: number;
  onChangeSpeed: (newSpeed: number) => void;
  isDialogueOnly: boolean;
  onToggleDialogueOnly: () => void;
  isSmartCadence: boolean;
  onToggleSmartCadence: () => void;
  currentIndex: number;
  totalElements: number;
}

export const TableReadControlsBar: React.FC<TableReadControlsBarProps> = ({
  m, isPlaying, onTogglePlay, onRestart, speed, onChangeSpeed,
  isDialogueOnly, onToggleDialogueOnly, isSmartCadence, onToggleSmartCadence,
  currentIndex, totalElements,
}) => {
  return (
    <div className="p-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0" style={m.cardStyle}>
      <div className="flex items-center gap-2">
        <button onClick={onTogglePlay} className="px-4 py-2 font-extrabold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer hover:opacity-90 shadow-2xs" style={m.primaryBtnStyle}>
          {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
          <span>{isPlaying ? 'PAUSE' : 'START TABLE READ'}</span>
        </button>
        <button onClick={onRestart} className="px-3 py-2 border rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:opacity-85" style={m.secondaryBtnStyle}>
          <RotateCcw className="w-3.5 h-3.5" style={m.accentStyle} />
          <span>Restart</span>
        </button>
      </div>

      <div className="flex flex-wrap items-center gap-3 text-xs">
        <div className="flex items-center gap-2 bg-black/5 dark:bg-white/5 px-2.5 py-1.5 rounded-lg border" style={m.borderStyle}>
          <Sliders className="w-3.5 h-3.5" style={m.accentStyle} />
          <span className="font-semibold text-[11px]">Speed:</span>
          <input type="range" min={0.5} max={5.0} step={0.1} value={speed} onChange={(e) => onChangeSpeed(parseFloat(e.target.value))} className="w-20 cursor-pointer" style={{ accentColor: m.theme.accentButtons }} title="Adjust speed live (0.5x to 5.0x)" />
          <span className="font-bold font-mono w-8 text-[11px]" style={m.accentStyle}>{speed.toFixed(1)}x</span>
        </div>

        <button onClick={onToggleDialogueOnly} className="px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition hover:opacity-90" style={isDialogueOnly ? m.primaryBtnStyle : m.secondaryBtnStyle} title="Skip Scene Headings and Action descriptions">
          <MessageSquare className="w-3 h-3" />
          <span>{isDialogueOnly ? 'Dialogue Only: ON' : 'Dialogue Only: OFF'}</span>
        </button>

        <button onClick={onToggleSmartCadence} className="px-2.5 py-1.5 rounded-lg border text-[11px] font-bold flex items-center gap-1.5 cursor-pointer transition hover:opacity-90" style={isSmartCadence ? m.primaryBtnStyle : m.secondaryBtnStyle} title="Action brisk, Dialogue steady">
          <Gauge className="w-3 h-3" />
          <span>{isSmartCadence ? 'Smart Cadence: ON' : 'Smart Cadence: OFF'}</span>
        </button>

        <div className="text-[11px] font-bold font-mono" style={m.mutedStyle}>
          Line {Math.min(totalElements, currentIndex + 1)} / {totalElements}
        </div>
      </div>
    </div>
  );
};
