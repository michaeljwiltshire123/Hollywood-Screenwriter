import React, { useState } from 'react';
import { FileText } from 'lucide-react';

interface ScriptTitleEditorProps {
  title: string;
  onUpdateTitle: (title: string) => void;
}

export const ScriptTitleEditor: React.FC<ScriptTitleEditorProps> = ({
  title,
  onUpdateTitle,
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
      <span className="font-extrabold text-xs sm:text-sm tracking-wider uppercase text-amber-400 hidden 2xl:inline whitespace-nowrap shrink-0">
        SCREENWRITER PRO
      </span>
      <div className="h-4 w-px bg-slate-700 hidden 2xl:block shrink-0" />

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
          className="bg-slate-950 border border-amber-400 rounded-lg px-2.5 py-1 text-xs font-mono text-amber-300 focus:outline-none shrink-0 max-w-[140px] sm:max-w-[200px]"
        />
      ) : (
        <button
          id="script-title-display-btn"
          onClick={() => {
            setCurrentText(title);
            setIsEditing(true);
          }}
          className="flex items-center gap-1.5 bg-slate-950/80 hover:bg-slate-950 border border-slate-800 hover:border-amber-500/50 px-2.5 py-1.5 rounded-lg transition shrink-0 text-left group min-h-[38px]"
          title="Click to rename screenplay title"
        >
          <FileText className="w-4 h-4 text-amber-400 shrink-0 group-hover:scale-105 transition" />
          <span className="font-mono text-xs font-bold text-slate-200 group-hover:text-amber-300 truncate max-w-[110px] sm:max-w-[160px] md:max-w-[200px] lg:max-w-[260px] whitespace-nowrap">
            {title || 'UNTITLED SCRIPT'}
          </span>
        </button>
      )}
    </div>
  );
};
