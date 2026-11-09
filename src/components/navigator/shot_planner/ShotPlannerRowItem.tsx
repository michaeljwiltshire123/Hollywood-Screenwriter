import React from 'react';
import { ShotInfo } from '../../../types';
import { GripVertical, Trash2, Tag } from 'lucide-react';
import { ShotTypeChipDropdown } from './ShotTypeChipDropdown';
import { ShotDurationChips } from './ShotDurationChips';

interface ShotPlannerRowItemProps {
  shot: ShotInfo;
  index: number;
  taggedProps?: string[];
  onUpdateShot: (shotId: string, fields: Partial<ShotInfo>) => void;
  onDeleteShot: (shotId: string) => void;
}

export const ShotPlannerRowItem: React.FC<ShotPlannerRowItemProps> = ({
  shot, index, taggedProps = [], onUpdateShot, onDeleteShot,
}) => {
  return (
    <div className="bg-slate-50/90 hover:bg-slate-50 border border-slate-200 rounded-xl p-3.5 space-y-3 shadow-2xs font-sans transition-colors">
      <div className="flex items-center justify-between gap-3 border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <GripVertical className="w-4 h-4 text-slate-400 cursor-grab hover:text-slate-600" />
          <span className="text-[10px] font-bold text-slate-500 uppercase">Shot #{index + 1}</span>
          <input
            type="text"
            value={shot.shotNumber}
            onChange={(e) => onUpdateShot(shot.id, { shotNumber: e.target.value })}
            className="w-16 bg-white border border-slate-300 rounded px-2 py-0.5 text-xs font-mono font-black text-slate-900 text-center focus:outline-none focus:ring-1 focus:ring-sky-500"
          />
          <ShotTypeChipDropdown
            value={shot.shotType}
            onChange={(newType) => onUpdateShot(shot.id, { shotType: newType as any })}
          />
        </div>

        <div className="flex items-center gap-3">
          <ShotDurationChips
            minutes={shot.estimatedTimeMin || 15}
            onChangeMinutes={(mins) => onUpdateShot(shot.id, { estimatedTimeMin: mins })}
          />
          <button
            type="button"
            onClick={() => onDeleteShot(shot.id)}
            className="p-1 text-slate-400 hover:text-rose-600 rounded transition cursor-pointer"
            title="Delete shot setup"
          >
            <Trash2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      <div className="space-y-1.5">
        <textarea
          rows={2}
          value={shot.description || ''}
          onChange={(e) => onUpdateShot(shot.id, { description: e.target.value })}
          placeholder="Describe framing, camera angle, character action, or lens movement..."
          className="w-full bg-white border border-slate-300 rounded-lg p-2.5 text-xs text-slate-900 focus:outline-none focus:ring-1 focus:ring-sky-500 resize-none font-sans"
        />

        {taggedProps.length > 0 && (
          <div className="flex items-center gap-1.5 flex-wrap pt-0.5">
            <Tag className="w-3 h-3 text-amber-600 shrink-0" />
            <span className="text-[10px] font-bold text-slate-500 uppercase">Tagged Scene Props:</span>
            {taggedProps.map((p) => (
              <span key={p} className="px-1.5 py-0.5 bg-amber-50 text-amber-900 border border-amber-200 rounded text-[10px] font-bold">
                {p}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
