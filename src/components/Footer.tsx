import React, { useState, useEffect } from 'react';
import { ShieldAlert, CheckCircle2, HardDrive, Download, Clock, Zap } from 'lucide-react';
import { ScreenplayDocument } from '../types';
import { calculatePageEstimate } from '../lib/screenplayUtils';

interface FooterProps {
  script: ScreenplayDocument;
  latencyMs: number;
  lastSavedAt: Date | null;
  onEmergencyExport: () => void;
  isDriveConnected?: boolean;
  isDirty?: boolean;
}

export const Footer: React.FC<FooterProps> = ({
  script,
  latencyMs,
  lastSavedAt,
  onEmergencyExport,
  isDriveConnected = false,
  isDirty = false,
}) => {
  const [justSaved, setJustSaved] = useState(false);
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const elements = script?.elements || [];
  const pageStats = calculatePageEstimate(elements);

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const formattedTime = lastSavedAt
    ? lastSavedAt.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit' })
    : 'Ready';

  const isCloudOffline = !isOnline;

  return (
    <footer className="bg-slate-900 border-t border-slate-800 text-slate-300 py-2 px-4 text-xs font-mono select-none sticky bottom-0 z-20">
      <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-3">
        {/* Left: Synced vs Unsaved Status Indicator / Cloud Offline */}
        <div className="flex items-center gap-3">
          {isCloudOffline ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border border-rose-500/80 bg-rose-950/90 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.4)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-rose-400"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <HardDrive className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-bold tracking-wide text-[11px] text-rose-300 uppercase">
                CLOUD OFFLINE - SYNC PAUSED
              </span>
            </div>
          ) : !isDirty ? (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border bg-emerald-950/90 border-emerald-500/80 text-emerald-300 shadow-[0_0_12px_rgba(16,185,129,0.3)]">
              <span className="relative flex h-2 w-2">
                <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
              </span>
              <HardDrive className="w-3.5 h-3.5 text-emerald-400" />
              <span className="font-bold tracking-wide text-[11px] text-emerald-400 uppercase">
                SYNCED
              </span>
            </div>
          ) : (
            <div className="flex items-center gap-2 px-2.5 py-1 rounded-full border bg-rose-950/90 border-rose-500/80 text-rose-300 shadow-[0_0_12px_rgba(244,63,94,0.3)]">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full opacity-75 bg-rose-400"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-rose-500"></span>
              </span>
              <HardDrive className="w-3.5 h-3.5 text-rose-400" />
              <span className="font-bold tracking-wide text-[11px] text-rose-400 uppercase">
                UNSAVED CHANGES
              </span>
            </div>
          )}
        </div>

        {/* Center: Script Stats */}
        <div className="hidden md:flex items-center gap-4 text-slate-400 text-[11px]">
          <span>
            <strong className="text-amber-400 font-bold">{pageStats.pages}</strong> Pages (~{Math.ceil(pageStats.pages)} mins)
          </span>
          <span className="text-slate-700">|</span>
          <span>
            <strong className="text-slate-200">{pageStats.totalWords}</strong> Words
          </span>
          <span className="text-slate-700">|</span>
          <span>
            <strong className="text-slate-200">{script.elements.length}</strong> Elements
          </span>
        </div>

        {/* Right: Emergency Export Button */}
        <div className="flex items-center gap-2">
          <button
            onClick={onEmergencyExport}
            className="px-3 py-1 bg-amber-500/10 hover:bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold rounded flex items-center gap-1.5 transition text-[11px] shadow-xs active:scale-95"
            title="Instantly download a plain-text .fountain screenplay backup to your browser"
          >
            <ShieldAlert className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span>EMERGENCY BACKUP (.fountain)</span>
          </button>
        </div>
      </div>
    </footer>
  );
};
