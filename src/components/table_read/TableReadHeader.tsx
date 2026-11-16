import React from 'react';
import { X, Volume2, Radio, Download } from 'lucide-react';
import { ModalTheme } from '../../lib/modalTheme';

interface TableReadHeaderProps {
  m: ModalTheme;
  isOnlineEngine: boolean;
  enableAmbientTone: boolean;
  onToggleAmbientTone: () => void;
  onOpenExport: () => void;
  onClose: () => void;
}

export const TableReadHeader: React.FC<TableReadHeaderProps> = ({
  m,
  isOnlineEngine,
  enableAmbientTone,
  onToggleAmbientTone,
  onOpenExport,
  onClose,
}) => {
  return (
    <div className="p-4 border-b flex items-center justify-between shrink-0" style={m.headerStyle}>
      <div className="flex items-center gap-3">
        <Radio className="w-5 h-5 animate-pulse" style={m.accentStyle} />
        <div>
          <div className="flex items-center gap-2">
            <h2 className="font-bold text-sm uppercase" style={m.accentStyle}>Table Read & Rehearsal Studio</h2>
            <span
              className="text-[9px] font-sans font-bold px-2 py-0.5 rounded-full border uppercase"
              style={{
                backgroundColor: isOnlineEngine ? 'rgba(16, 185, 129, 0.1)' : 'rgba(59, 130, 246, 0.1)',
                borderColor: isOnlineEngine ? '#10B981' : '#3B82F6',
                color: isOnlineEngine ? '#059669' : '#2563EB',
              }}
            >
              {isOnlineEngine ? 'Edge Natural Voices' : 'Offline OS Voices'}
            </span>
          </div>
          <p className="text-[10px]" style={m.mutedStyle}>
            Multi-voice character casting, live rate modulation, and actor rehearsal
          </p>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onOpenExport}
          className="px-3 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer hover:opacity-90"
          style={m.secondaryBtnStyle}
          title="Export rehearsal audio pack for actors"
        >
          <Download className="w-3.5 h-3.5" style={m.accentStyle} />
          <span>Export Rehearsal Audio</span>
        </button>
        <button
          onClick={onToggleAmbientTone}
          className="px-3 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer hover:opacity-90"
          style={enableAmbientTone ? m.primaryBtnStyle : m.secondaryBtnStyle}
          title="Toggle soft studio room tone"
        >
          <Volume2 className="w-3.5 h-3.5" />
          <span>{enableAmbientTone ? 'Room Tone ON' : 'Room Tone OFF'}</span>
        </button>
        <button onClick={onClose} className="p-1 rounded opacity-70 hover:opacity-100 cursor-pointer" title="Close Studio">
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
