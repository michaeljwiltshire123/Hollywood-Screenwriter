import React from 'react';
import { ElementType } from '../types';

interface FormattingToolbarProps {
  activeType: ElementType;
  onChangeType: (type: ElementType) => void;
  onAddElement: (type: ElementType) => void;
  activeElementIndex: number;
  totalElements: number;
}

const ELEMENT_BUTTONS: { type: ElementType; label: string; shortcut: string; hint: string }[] = [
  { type: 'SCENE HEADING', label: 'SCENE HEADING', shortcut: 'Alt+1', hint: 'INT. / EXT. Location' },
  { type: 'ACTION', label: 'ACTION', shortcut: 'Alt+2', hint: 'Scene description & movement' },
  { type: 'CHARACTER', label: 'CHARACTER', shortcut: 'Alt+3', hint: 'Speaking character name' },
  { type: 'PARENTICAL', label: 'PARENTICAL', shortcut: 'Alt+4', hint: '(direction or emotion)' },
  { type: 'DIALOGUE', label: 'DIALOGUE', shortcut: 'Alt+5', hint: 'Character spoken words' },
  { type: 'TRANSITION', label: 'TRANSITION', shortcut: 'Alt+6', hint: 'CUT TO: / FADE OUT:' },
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
    <div className="bg-slate-900 border-b border-slate-800 text-slate-200 py-2 px-4 shadow-sm select-none shrink-0 w-full">
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs">
        {/* Literal Plain English Buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full md:w-auto pb-1 md:pb-0">
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
        </div>

        {/* Predictive Flow Info & Shortcut guide */}
        <div className="hidden lg:flex items-center gap-3 text-[11px] font-mono text-slate-400">
          <div className="flex items-center gap-1 bg-slate-950 px-2.5 py-1 rounded border border-slate-800">
            <span className="text-amber-400 font-bold">PREDICTIVE FLOW:</span>
            <span>
              {activeType === 'CHARACTER'
                ? 'Enter → DIALOGUE'
                : activeType === 'DIALOGUE'
                ? 'Enter → CHARACTER'
                : activeType === 'SCENE HEADING'
                ? 'Enter → ACTION'
                : 'Enter ×2 → ACTION'}
            </span>
          </div>

          <div className="text-slate-500">
            Tab: Cycle type | Element {activeElementIndex + 1} / {totalElements}
          </div>
        </div>
      </div>
    </div>
  );
};
