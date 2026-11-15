import React from 'react';
import { X, History, RotateCcw, Save } from 'lucide-react';
import { RevisionHistoryItem } from '../types';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';

interface RevisionHistoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  revisions: RevisionHistoryItem[];
  onRollback: (rev: RevisionHistoryItem) => void;
  onCreateSnapshot: () => void;
  themeConfig?: AppThemeConfig;
}

export const RevisionHistoryModal: React.FC<RevisionHistoryModalProps> = ({
  isOpen, onClose, revisions, onRollback, onCreateSnapshot, themeConfig,
}) => {
  if (!isOpen) return null;
  const m = getModalTheme(themeConfig);

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 backdrop-blur-xs z-50 flex items-center justify-center p-4 font-mono" style={m.overlayStyle}>
      <div className="border rounded-xl shadow-2xl max-w-xl w-full overflow-hidden flex flex-col max-h-[85vh]" style={m.windowStyle}>
        <div className="p-4 border-b flex items-center justify-between" style={m.headerStyle}>
          <div className="flex items-center gap-2">
            <History className="w-5 h-5" style={m.accentStyle} />
            <h2 className="font-bold text-sm uppercase" style={m.accentStyle}>
              INDEXEDDB REVISION LOGS & SNAPSHOTS
            </h2>
          </div>
          <button onClick={onClose} className="p-1 rounded opacity-70 hover:opacity-100 cursor-pointer">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-4 border-b flex items-center justify-between gap-3" style={m.cardStyle}>
          <span className="text-xs" style={m.mutedStyle}>
            Every keystroke is saved atomically to IndexedDB. Create manual snapshots for major drafts.
          </span>
          <button
            onClick={onCreateSnapshot}
            className="px-3 py-1.5 font-bold text-xs rounded flex items-center gap-1 shrink-0 cursor-pointer hover:opacity-90 transition"
            style={m.primaryBtnStyle}
          >
            <Save className="w-3.5 h-3.5" />
            Create Snapshot
          </button>
        </div>

        <div className="flex-1 overflow-y-auto p-4 space-y-2 text-xs">
          {revisions.length === 0 ? (
            <div className="text-center py-12 italic" style={m.mutedStyle}>
              No saved revisions yet. Start editing to generate atomic IndexedDB logs.
            </div>
          ) : (
            revisions.map((rev) => (
              <div
                key={rev.id}
                className="p-3 border rounded-lg flex items-center justify-between transition"
                style={m.cardStyle}
              >
                <div>
                  <div className="font-bold flex items-center gap-2">
                    <span>{rev.label}</span>
                    <span className="text-[10px] px-1.5 py-0.5 rounded border" style={{ ...m.headerStyle, ...m.accentStyle }}>
                      {rev.elementCount} elements
                    </span>
                  </div>
                  <div className="text-[10px] mt-0.5" style={m.mutedStyle}>
                    {new Date(rev.timestamp).toLocaleString()}
                  </div>
                </div>

                <button
                  onClick={() => {
                    onRollback(rev);
                    onClose();
                  }}
                  className="px-3 py-1.5 border rounded font-semibold text-xs flex items-center gap-1.5 cursor-pointer hover:opacity-85 transition"
                  style={{ ...m.headerStyle, ...m.accentStyle }}
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
