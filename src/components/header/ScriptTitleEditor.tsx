import React, { useState } from 'react';
import { FileText } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';

interface ScriptTitleEditorProps {
  title: string;
  onUpdateTitle: (title: string) => void;
  themeConfig?: AppThemeConfig;
}

export const ScriptTitleEditor: React.FC<ScriptTitleEditorProps> = ({
  title,
  onUpdateTitle,
  themeConfig,
}) => {
  const [isEditing, setIsEditing] = useState(false);
  const [currentText, setCurrentText] = useState(title);

  const handleSubmit = () => {
    setIsEditing(false);
    if (currentText.trim()) {
      onUpdateTitle(currentText.trim().toUpperCase());
    } else {
      setCurrentText(title);
    }
  };

  return (
    <div className="flex items-center gap-2 shrink-0 min-w-0">
      <span
        className="font-extrabold text-xs sm:text-sm tracking-wider uppercase hidden 2xl:inline whitespace-nowrap shrink-0"
        style={{ color: themeConfig?.accentText || '#8C6239' }}
      >
        SCREENWRITER PRO
      </span>
      <div
        className="h-4 w-px hidden 2xl:block shrink-0"
        style={{ backgroundColor: themeConfig?.borders || '#E4D3B9' }}
      />

      {isEditing ? (
        <input
          id="script-title-input"
          type="text"
          value={currentText}
          onChange={(e) => setCurrentText(e.target.value)}
          onBlur={handleSubmit}
          onKeyDown={(e) => {
            if (e.key === 'Enter') handleSubmit();
          }}
          autoFocus
          className="border rounded-lg px-2.5 py-1 text-xs font-mono focus:outline-none shrink-0 max-w-[140px] sm:max-w-[200px]"
          style={{
            backgroundColor: themeConfig?.sceneCards || '#F4ECE0',
            borderColor: themeConfig?.accentButtons || '#8C6239',
            color: themeConfig?.primaryText || '#433422',
          }}
        />
      ) : (
        <button
          id="script-title-display-btn"
          onClick={() => {
            setCurrentText(title);
            setIsEditing(true);
          }}
          className="flex items-center gap-1.5 border px-2.5 py-1.5 rounded-lg transition shrink-0 text-left group min-h-[38px] hover:opacity-90 cursor-pointer"
          style={{
            backgroundColor: themeConfig?.sceneCards || '#F4ECE0',
            borderColor: themeConfig?.borders || '#E4D3B9',
            color: themeConfig?.primaryText || '#433422',
          }}
          title="Click to rename screenplay title"
        >
          <FileText
            className="w-4 h-4 shrink-0 group-hover:scale-105 transition"
            style={{ color: themeConfig?.accentText || '#8C6239' }}
          />
          <span className="font-mono text-xs font-bold truncate max-w-[110px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[260px] whitespace-nowrap">
            {title || 'UNTITLED SCRIPT'}
          </span>
        </button>
      )}
    </div>
  );
};
