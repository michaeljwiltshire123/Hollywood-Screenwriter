import React, { useState } from 'react';

interface NotesCellProps {
  notes?: string;
  onUpdateNotes: (val: string) => void;
}

export const NotesCell: React.FC<NotesCellProps> = ({ notes = '', onUpdateNotes }) => {
  const [isEditing, setIsEditing] = useState(false);
  const notesParts = notes.split(' | ').map((s) => s.trim()).filter(Boolean);

  if (isEditing) {
    return (
      <textarea
        rows={2}
        autoFocus
        value={notes}
        onBlur={() => setIsEditing(false)}
        onChange={(e) => onUpdateNotes(e.target.value)}
        className="bg-white border border-slate-300 focus:outline-none focus:ring-1 focus:ring-slate-400 rounded px-1.5 py-1 w-full text-slate-700 text-xs leading-relaxed block resize-none shadow-xs"
        placeholder="Notes..."
      />
    );
  }

  return (
    <div
      onClick={() => setIsEditing(true)}
      className="cursor-pointer hover:bg-slate-100/80 p-1 rounded transition min-h-[28px] flex flex-wrap gap-1 items-center"
      title="Click to edit notes"
    >
      {notesParts.length === 0 ? (
        <span className="text-slate-400 italic text-xs">Notes...</span>
      ) : (
        notesParts.map((part, idx) => {
          if (part.startsWith('[Prop]')) {
            const propName = part.replace('[Prop]:', '').trim();
            return (
              <span key={idx} className="inline-flex items-center gap-1 bg-amber-500/10 text-amber-900 border border-amber-300/80 rounded px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                <span>📦</span><span>{propName}</span>
              </span>
            );
          }
          if (part.startsWith('[Wardrobe')) {
            const wardName = part.replace(/^\[Wardrobe\s*-\s*[^\]]+\]:\s*/i, '').trim();
            return (
              <span key={idx} className="inline-flex items-center gap-1 bg-purple-500/10 text-purple-900 border border-purple-300/80 rounded px-1.5 py-0.5 text-[10px] font-bold shrink-0">
                <span>👗</span><span>{wardName || part}</span>
              </span>
            );
          }
          return (
            <span key={idx} className="bg-slate-200/80 text-slate-800 rounded px-1.5 py-0.5 text-[10px] font-medium shrink-0">
              {part}
            </span>
          );
        })
      )}
    </div>
  );
};
