import React, { useState } from 'react';
import { Bookmark, ArrowUpRight, ChevronDown, ChevronUp } from 'lucide-react';

interface BackupsProps {
  backups: string[];
  onPromote: (backupText: string) => void;
}

export const StoryLabCardBackups: React.FC<BackupsProps> = ({ backups, onPromote }) => {
  const [isOpen, setIsOpen] = useState(false);

  if (!backups || backups.length === 0) return null;

  return (
    <div className="pt-2 font-sans">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-blue-50/80 hover:bg-blue-100/80 text-blue-950 border border-blue-200 rounded-lg px-2.5 py-1 text-xs font-bold transition flex items-center justify-between cursor-pointer"
      >
        <div className="flex items-center gap-1.5">
          <Bookmark className="w-3.5 h-3.5 text-blue-600" />
          <span>Backup Ideas to Sleep On ({backups.length})</span>
        </div>
        {isOpen ? <ChevronUp className="w-3.5 h-3.5" /> : <ChevronDown className="w-3.5 h-3.5" />}
      </button>

      {isOpen && (
        <div className="mt-1.5 space-y-1.5 bg-white border border-blue-200 rounded-lg p-2 animate-in fade-in duration-100">
          {backups.map((backup, idx) => (
            <div
              key={idx}
              className="bg-slate-50 border border-slate-200 rounded-md p-2 text-xs flex items-start justify-between gap-2"
            >
              <div className="flex-1 font-medium text-slate-800 leading-relaxed">
                <span className="font-bold text-blue-700 mr-1 font-sans">Backup {idx + 1}:</span>
                {backup}
              </div>
              <button
                type="button"
                onClick={() => onPromote(backup)}
                className="px-2 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 rounded text-[10px] font-black transition shrink-0 flex items-center gap-0.5 cursor-pointer shadow-2xs"
                title="Promote this backup idea to the primary card text"
              >
                <span>Promote</span>
                <ArrowUpRight className="w-3 h-3" />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
