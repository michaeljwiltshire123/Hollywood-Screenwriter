import React, { useState, useRef, useEffect } from 'react';
import { FORMAT_SHORTCUTS } from '../lib/screenplayShortcuts';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';
import { HelpCircle } from 'lucide-react';

interface FormatShortcutsHelpProps {
  themeConfig?: AppThemeConfig;
}

export const FormatShortcutsHelp: React.FC<FormatShortcutsHelpProps> = ({ themeConfig }) => {
  const [isOpen, setIsOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const mt = getModalTheme(themeConfig);

  useEffect(() => {
    const handlePointerDown = (e: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) setIsOpen(false);
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
        id="format-shortcuts-help-btn"
        type="button"
        tabIndex={0}
        onClick={() => setIsOpen((prev) => !prev)}
        onFocus={() => setIsOpen(true)}
        aria-expanded={isOpen}
        aria-label="Format shortcuts guide"
        className="px-2 py-1 rounded text-xs font-mono font-bold transition-all shrink-0 flex items-center gap-1.5 border shadow-xs cursor-pointer active:scale-95 hover:opacity-90"
        style={mt.cardStyle}
        title="View Format Shortcuts & Keyboard Guide"
      >
        <HelpCircle className="w-3.5 h-3.5 shrink-0" style={mt.accentStyle} />
        <span className="text-[10px] tracking-wider uppercase font-bold">KEYS</span>
      </button>

      <div
        role="tooltip"
        className={`absolute top-full right-0 mt-1.5 z-50 w-72 sm:w-80 backdrop-blur-md border rounded-lg shadow-xl overflow-hidden font-mono text-xs select-none transition-all duration-150 pointer-events-none ${
          isOpen ? 'opacity-100 visible translate-y-0' : 'opacity-0 invisible -translate-y-1'
        }`}
        style={mt.windowStyle}
      >
        <div className="px-3 py-1.5 border-b flex items-center justify-between text-[9px] uppercase tracking-wider font-sans font-semibold" style={mt.headerStyle}>
          <div className="flex items-center gap-1.5">
            <HelpCircle className="w-3 h-3" style={mt.accentStyle} />
            <span>Format Shortcuts</span>
          </div>
          <span className="text-[9px] font-normal" style={mt.mutedStyle}>Keyboard Guide</span>
        </div>

        <div className="p-2 space-y-1 border-b font-sans" style={mt.subCardStyle}>
          <div className="flex items-center justify-between px-2 py-1 rounded border shadow-2xs" style={mt.cardStyle}>
            <span className="text-[11px]" style={mt.mutedStyle}>Select format right</span>
            <kbd className="px-1.5 py-0.5 rounded border font-mono font-bold text-[10px]" style={{ ...mt.inputStyle, ...mt.accentStyle }}>Tab</kbd>
          </div>
          <div className="flex items-center justify-between px-2 py-1 rounded border shadow-2xs" style={mt.cardStyle}>
            <span className="text-[11px]" style={mt.mutedStyle}>Select format left</span>
            <kbd className="px-1.5 py-0.5 rounded border font-mono font-bold text-[10px]" style={{ ...mt.inputStyle, ...mt.accentStyle }}>Shift + Tab</kbd>
          </div>
        </div>

        <div className="divide-y max-h-56 overflow-y-auto font-sans" style={mt.borderStyle}>
          {FORMAT_SHORTCUTS.map((s) => (
            <div key={s.type} className="px-3 py-1 flex items-center justify-between">
              <span className="text-[11px] font-medium">{s.label}</span>
              <kbd className="px-1.5 py-0.5 rounded font-mono font-semibold text-[10px] border shadow-2xs" style={mt.inputStyle}>
                {s.keyLabel}
              </kbd>
            </div>
          ))}
        </div>

        <div className="px-3 py-1.5 border-t flex items-center justify-between text-[9px] font-sans" style={mt.headerStyle}>
          <span style={mt.mutedStyle}>Alternate: Alt + 1..8</span>
          <span className="font-medium" style={mt.accentStyle}>Browser safe</span>
        </div>
      </div>
    </div>
  );
};
