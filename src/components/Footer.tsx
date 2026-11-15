import React, { useState, useEffect } from 'react';
import { ShieldAlert, HardDrive, Link2 } from 'lucide-react';
import { ScreenplayDocument } from '../types';
import { AppThemeConfig } from '../lib/themePresets';
import { calculatePageEstimate } from '../lib/screenplayUtils';

interface FooterProps {
  script: ScreenplayDocument;
  latencyMs: number;
  lastSavedAt: Date | null;
  onEmergencyExport: () => void;
  isDirty?: boolean;
  linkedFileName?: string | null;
  hasFileHandle?: boolean;
  onRelinkFile?: () => void;
  themeConfig?: AppThemeConfig;
}

export const Footer: React.FC<FooterProps> = ({
  script, onEmergencyExport, isDirty = false, linkedFileName = null, hasFileHandle = false, onRelinkFile, themeConfig,
}) => {
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const pageStats = calculatePageEstimate(script?.elements || []);

  useEffect(() => {
    const on = () => setIsOnline(true);
    const off = () => setIsOnline(false);
    window.addEventListener('online', on);
    window.addEventListener('offline', off);
    return () => { window.removeEventListener('online', on); window.removeEventListener('offline', off); };
  }, []);

  const badgeTone = !isOnline || isDirty
    ? 'border-rose-500/80 bg-rose-950/90 text-rose-300'
    : 'border-emerald-500/80 bg-emerald-950/90 text-emerald-300';

  return (
    <footer
      className="py-2 px-4 text-xs font-mono select-none sticky bottom-0 z-20 border-t transition-colors"
      style={{ backgroundColor: themeConfig?.topBottomBars, borderColor: themeConfig?.borders, color: themeConfig?.primaryText }}
    >
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          <div className={`flex items-center gap-2 px-2.5 py-1 rounded-full border ${badgeTone}`}>
            <span className="relative flex h-2 w-2">
              {(!isOnline || isDirty) && <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-rose-400" />}
              <span className={`relative inline-flex rounded-full h-2 w-2 ${!isOnline || isDirty ? 'bg-rose-500' : 'bg-emerald-500'}`} />
            </span>
            <HardDrive className="w-3.5 h-3.5" />
            <span className="font-bold tracking-wide text-[11px] uppercase">
              {!isOnline ? 'OFFLINE' : isDirty ? 'UNSAVED CHANGES' : 'SAVED'}
            </span>
          </div>

          {linkedFileName && !hasFileHandle && onRelinkFile && (
            <button
              type="button"
              onClick={onRelinkFile}
              className="px-2.5 py-1 rounded border font-bold flex items-center gap-1.5 transition text-[11px] shadow-xs cursor-pointer hover:opacity-85"
              style={{ backgroundColor: themeConfig?.sceneCards, borderColor: themeConfig?.borders, color: themeConfig?.primaryText }}
            >
              <Link2 className="w-3.5 h-3.5 shrink-0" style={{ color: themeConfig?.accentText }} />
              <span>Relink {linkedFileName}</span>
            </button>
          )}
        </div>

        <div className="hidden md:flex items-center gap-4 text-xs opacity-85">
          <span><strong className="font-bold" style={{ color: themeConfig?.accentText }}>{pageStats.pages}</strong> Pages (~{Math.ceil(pageStats.pages)} mins)</span>
          <span>|</span>
          <span><strong className="font-bold">{pageStats.totalWords}</strong> Words</span>
          <span>|</span>
          <span><strong className="font-bold">{script.elements.length}</strong> Elements</span>
        </div>

        <button
          onClick={onEmergencyExport}
          className="px-3 py-1 font-bold rounded border flex items-center gap-1.5 transition text-[11px] shadow-xs cursor-pointer hover:opacity-85"
          style={{ backgroundColor: themeConfig?.sceneCards, borderColor: themeConfig?.borders, color: themeConfig?.primaryText }}
          title="Instantly download a plain-text .fountain screenplay backup"
        >
          <ShieldAlert className="w-3.5 h-3.5 shrink-0" style={{ color: themeConfig?.accentText }} />
          <span>EMERGENCY BACKUP (.fountain)</span>
        </button>
      </div>
    </footer>
  );
};
