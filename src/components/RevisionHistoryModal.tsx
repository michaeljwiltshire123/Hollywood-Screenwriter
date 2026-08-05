import React from 'react';
import { X, History, RotateCcw, Save, Layers } from 'lucide-react';
import { RevisionHistoryItem } from '../types';

interface RevisionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  revisions: RevisionHistoryItem[];
  onRollback: (rev: RevisionHistoryItem) => void;
  onCreateSnapshot: () => void;
}

export const RevisionHistoryModal: React.FC<RevisionHistoryModalProps> = ({
  isOpen,
  onClose,
  revisions,
  onRollback,
  onCreateSnapshot,
}) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono">
      <div className="bg-slate-900 border border-slate-700 rounded-xl shadow-2xl max-w-xl w-full text-slate-100 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <History className="w-5 h-5 text-amber-400" />
            <h2 className="font-bold text-sm uppercase text-amber-300">
              INDEXEDDB REVISION LOGS & SNAPSHOTS
            </h2>
          </div>
          <button onClick={onClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 bg-slate-950/60 border-b border-slate-800 flex items-center justify-between">
          <span className="text-xs text-slate-400">
            Every keystroke is saved atomically to IndexedDB. Create manual snapshots for major drafts.
          </span>
          <button
            onClick={onCreateSnapshot}
            className="px-3 py-1.5 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-xs rounded flex items-center gap-1 shrink-0"
          >
            <Save className="w-3.5 h-3.5" />
            Create Snapshot
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
          {revisions.length === 0 ? (
            <div className="text-center py-12 text-slate-500 italic">
              No saved revisions yet. Start editing to generate atomic IndexedDB logs.
            </div>
          ) : (
            revisions.map((rev) => (
              <div
                key={rev.id}
                className="p-3 bg-slate-950 border border-slate-800 rounded-lg flex items-center justify-between hover:border-amber-500/50 transition"
              >
                <div>
                  <div className="font-bold text-slate-200 flex items-center gap-2">
                    <span>{rev.label}</span>
                    <span className="text-[10px] text-amber-400 bg-amber-950/60 px-1.5 py-0.5 rounded border border-amber-800">
                      {rev.elementCount} elements
                    </span>
                  </div>
                  <div className="text-[10px] text-slate-500 mt-0.5">
                    {new Date(rev.timestamp).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRollback(rev);
                    onClose();
                  }}
                  className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-amber-400 border border-slate-700 rounded font-semibold text-xs flex items-center gap-1.5"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  Rollback
                </button>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};
