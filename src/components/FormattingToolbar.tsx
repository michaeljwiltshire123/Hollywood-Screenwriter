import React from 'react';
import { ElementType } from '../types';
import { FormatShortcutsHelp } from './FormatShortcutsHelp';

interface FormattingToolbarProps {
  activeType: ElementType;
  onChangeType: (type: ElementType) => void;
  onAddElement: (type: ElementType) => void;
  activeElementIndex: number;
  totalElements: number;
}

const ELEMENT_BUTTONS: { type: ElementType; label: string; shortcut: string; hint: string }[] = [
  { type: 'SCENE HEADING', label: 'SCENE HEADING', shortcut: 'Shift+Alt+S', hint: 'INT. / EXT. Location' },
  { type: 'ACTION', label: 'ACTION', shortcut: 'Shift+Alt+A', hint: 'Scene description & movement' },
  { type: 'CHARACTER', label: 'CHARACTER', shortcut: 'Shift+Alt+C', hint: 'Speaking character name' },
  { type: 'PARENTICAL', label: 'PARENTICAL', shortcut: 'Shift+Alt+P', hint: '(direction or emotion)' },
  { type: 'DIALOGUE', label: 'DIALOGUE', shortcut: 'Shift+Alt+D', hint: 'Character spoken words' },
  { type: 'TRANSITION', label: 'TRANSITION', shortcut: 'Shift+Alt+T', hint: 'CUT TO: / FADE OUT:' },
  { type: 'SHOT', label: 'SHOT', shortcut: 'Alt+7', hint: 'ANGLE ON / CLOSE UP ON' },
  { type: 'NOTE', label: 'NOTE', shortcut: 'Alt+8', hint: 'Writer private comment' },
];

export const FormattingToolbar: React.FC<FormattingToolbarProps> = ({
  activeType,
  onChangeType,
  onAddElement,
  activeElementIndex,
  totalElements,
}) => {
  return (
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 py-2 px-4 shadow-sm select-none shrink-0 w-full relative z-30 overflow-visible">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs relative overflow-visible">
        {/* Literal Plain English Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto md:overflow-visible no-scrollbar [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden w-full md:w-auto py-0.5 relative overflow-visible">
          <span className="text-[10px] uppercase font-mono font-bold text-slate-400 mr-1 shrink-0">
            FORMAT:
          </span>
          {ELEMENT_BUTTONS.map((item) => {
            const isActive = activeType === item.type;
            return (
              <button
                key={item.type}
                onClick={() => onChangeType(item.type)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition shrink-0 flex items-center gap-1 border ${
                  isActive
                    ? 'bg-amber-400 text-slate-950 border-amber-300 font-bold shadow-xs'
                    : 'bg-slate-800 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
                title={`${item.label} (${item.shortcut}): ${item.hint}`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
          {/* Format Shortcuts & Navigation Info Tooltip Button */}
          <FormatShortcutsHelp />
        </div>

        {/* Script Element Counter */}
        <div className="hidden md:flex items-center text-[11px] font-mono text-slate-500 shrink-0 pr-1">
          Element {activeElementIndex + 1} of {totalElements}
        </div>
      </div>
    </div>
  );
};
