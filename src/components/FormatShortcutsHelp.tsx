import React, { useState, useRef, useEffect } from 'react';
import { FORMAT_SHORTCUTS } from '../lib/screenplayShortcuts';
import { HelpCircle } from 'lucide-react';

export const FormatShortcutsHelp: React.FC = () => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setIsOpen(false);
      }
    };
    window.addEventListener('mousedown', handlePointerDown);
    return () => window.removeEventListener('mousedown', handlePointerDown);
  }, []);

  return (
    <div
      ref={containerRef}
      className="relative group shrink-0 inline-flex items-center ml-1"
      onMouseEnter={() => setIsOpen(true)}
      onMouseLeave={() => setIsOpen(false)}
    >
      <button
        type="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label="Format shortcuts guide"
        className="w-5 h-5 rounded-md bg-slate-800 hover:bg-slate-700 text-amber-400 hover:text-amber-300 border border-slate-700 hover:border-amber-400/70 flex items-center justify-center font-mono font-bold text-[11px] transition-colors shadow-xs cursor-pointer focus:outline-hidden focus:ring-1 focus:ring-amber-400"
      >
        i
      </button>

      {/* Minimalist Floating Dropdown UI Light Mode (Matching Autocomplete Style) */}
      <div
        role="tooltip"
        className={`absolute top-full right-0 mt-1.5 z-50 w-72 sm:w-80 bg-white/95 backdrop-blur-md border border-slate-200/90 rounded-lg shadow-xl ring-1 ring-black/5 overflow-hidden font-mono text-xs text-slate-800 select-none transition-all duration-150 pointer-events-none ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
        }`}
      >
        <div className="px-3 py-1.5 bg-slate-50/80 border-b border-slate-100 flex items-center justify-between text-[9px] uppercase tracking-wider text-slate-500 font-sans font-semibold">
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3 h-3 text-amber-600" />
            <span>Format Shortcuts</span>
          </div>
          <span className="text-[9px] text-slate-400 font-normal">Keyboard Guide</span>
        </div>

        {/* Tab Selection */}
        <div className="p-2 space-y-1 bg-slate-50/30 border-b border-slate-100 font-sans">
          <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-150 shadow-2xs">
            <span className="text-slate-600 text-[11px]">Select format right</span>
            <kbd className="px-1.5 py-0.5 bg-slate-100 text-amber-800 rounded font-mono font-bold text-[10px] border border-slate-200">Tab</kbd>
          </div>
          <div className="flex items-center justify-between bg-white px-2 py-1 rounded border border-slate-150 shadow-2xs">
            <span className="text-slate-600 text-[11px]">Select format left</span>
            <kbd className="px-1.5 py-0.5 bg-slate-100 text-amber-800 rounded font-mono font-bold text-[10px] border border-slate-200">Shift + Tab</kbd>
          </div>
        </div>

        {/* Direct Format Keys */}
        <div className="divide-y divide-slate-100 max-h-56 overflow-y-auto font-sans">
          {FORMAT_SHORTCUTS.map((s) => (
            <div key={s.type} className="px-3 py-1 flex items-center justify-between hover:bg-amber-50/40 transition">
              <span className="text-slate-700 text-[11px] font-medium">{s.label}</span>
              <kbd className="px-1.5 py-0.5 bg-slate-100 text-slate-700 rounded font-mono font-semibold text-[10px] border border-slate-200 shadow-2xs">
                {s.keyLabel}
              </kbd>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-3 py-1.5 bg-slate-50/80 border-t border-slate-100 flex items-center justify-between text-[9px] text-slate-400 font-sans">
          <span>Alternate: Alt + 1..8</span>
          <span className="text-amber-700 font-medium">Browser safe</span>
        </div>
      </div>
    </div>
  );
};
