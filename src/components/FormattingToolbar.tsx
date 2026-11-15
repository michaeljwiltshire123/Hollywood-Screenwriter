import React from 'react';
import { ElementType } from '../types';
import { AppThemeConfig } from '../lib/themePresets';
import { FormatShortcutsHelp } from './FormatShortcutsHelp';
import { FormatBarOpenMenu } from './format_bar/FormatBarOpenMenu';
import { FormatBarExportMenu } from './format_bar/FormatBarExportMenu';

interface FormattingToolbarProps {
  activeType: ElementType;
  onChangeType: (type: ElementType) => void;
  onAddElement: (type: ElementType) => void;
  activeElementIndex: number;
  totalElements: number;
  onOpenProject?: () => void;
  onImport?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  onNewScript?: () => void;
  onLoadSample?: () => void;
  onExport?: (format: 'pdf' | 'docx' | 'screenplay' | 'print' | 'actor-pdf') => void;
  onSaveAs?: () => void;
  themeConfig?: AppThemeConfig;
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
  activeType, onChangeType, activeElementIndex, totalElements,
  onOpenProject, onImport, onNewScript, onLoadSample, onExport, onSaveAs, themeConfig,
}) => {
  return (
    <div
      className="border-b py-2 px-4 shadow-sm select-none shrink-0 w-full relative z-30 overflow-visible transition-colors"
      style={{
        backgroundColor: themeConfig?.topBottomBars,
        borderColor: themeConfig?.borders,
        color: themeConfig?.primaryText,
      }}
    >
      <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-2 text-xs relative overflow-visible">
        <div className="flex items-center gap-1.5 overflow-x-auto md:overflow-visible no-scrollbar w-full md:w-auto py-0.5 relative overflow-visible">
          <span className="text-[10px] uppercase font-mono font-bold opacity-70 mr-1 shrink-0">FORMAT:</span>
          {ELEMENT_BUTTONS.map((item) => {
            const isActive = activeType === item.type;
            return (
              <button
                key={item.type}
                onClick={() => onChangeType(item.type)}
                className={`px-2.5 py-1 rounded text-xs font-mono font-semibold transition shrink-0 flex items-center gap-1 border cursor-pointer ${
                  isActive ? 'shadow-xs font-bold' : 'hover:opacity-80'
                }`}
                style={{
                  backgroundColor: isActive ? (themeConfig?.accentButtons || '#8C6239') : (themeConfig?.sceneCards || '#F4ECE0'),
                  color: isActive ? '#FFFFFF' : (themeConfig?.primaryText || '#433422'),
                  borderColor: isActive ? (themeConfig?.accentButtons || '#8C6239') : (themeConfig?.borders || '#E4D3B9'),
                }}
                title={`${item.label} (${item.shortcut}): ${item.hint}`}
              >
                <span>{item.label}</span>
              </button>
            );
          })}
          <FormatShortcutsHelp themeConfig={themeConfig} />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          {onOpenProject && onImport && onNewScript && onLoadSample && (
            <FormatBarOpenMenu
              onOpenProject={onOpenProject}
              onImport={onImport}
              onNewScript={onNewScript}
              onLoadSample={onLoadSample}
              themeConfig={themeConfig}
            />
          )}
          {onExport && <FormatBarExportMenu onExport={onExport} onSaveAs={onSaveAs} themeConfig={themeConfig} />}
          <div className="hidden md:flex items-center text-[11px] font-mono opacity-75 shrink-0 pr-1">
            Element {activeElementIndex + 1} of {totalElements}
          </div>
        </div>
      </div>
    </div>
  );
};
