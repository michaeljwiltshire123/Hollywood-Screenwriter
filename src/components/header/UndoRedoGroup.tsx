import React from 'react';
import { Undo2, Redo2 } from 'lucide-react';

interface UndoRedoGroupProps {
  onUndo: () => void;
  onRedo: () => void;
  canUndo: boolean;
  canRedo: boolean;
}

export const UndoRedoGroup: React.FC<UndoRedoGroupProps> = ({
  onUndo,
  onRedo,
  canUndo,
  canRedo,
}) => {
  return (
    <div className="hidden lg:flex items-center bg-slate-800 border border-slate-700 rounded-lg overflow-hidden shrink-0">
      <button
        onClick={onUndo}
        disabled={!canUndo}
        className="p-2 min-h-[38px] text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
        title="Undo (Ctrl+Z)"
      >
        <Undo2 className="w-4 h-4" />
      </button>
      <div className="w-px bg-slate-700 h-4" />
      <button
        onClick={onRedo}
        disabled={!canRedo}
        className="p-2 min-h-[38px] text-slate-300 hover:text-white hover:bg-slate-700 disabled:opacity-40 disabled:hover:bg-transparent transition cursor-pointer"
        title="Redo (Ctrl+Y)"
      >
        <Redo2 className="w-4 h-4" />
      </button>
    </div>
  );
};
