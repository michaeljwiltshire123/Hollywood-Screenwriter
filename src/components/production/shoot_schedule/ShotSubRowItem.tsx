import React from 'react';
import { ShotSetupItem } from '../../../types';
import { Trash2 } from 'lucide-react';

interface ShotSubRowItemProps {
  shot: ShotSetupItem;
  idx: number;
  onDeleteShot: (shotId: string) => void;
  onUpdateShot: (shotId: string, field: keyof ShotSetupItem, val: any) => void;
}

export const ShotSubRowItem: React.FC<ShotSubRowItemProps> = ({
  shot,
  idx,
  onDeleteShot,
  onUpdateShot,
}) => {
  return (
    <div className="grid grid-cols-12 gap-2 items-start bg-white border border-slate-200 p-2 rounded shadow-2xs text-xs font-sans">
      <div className="col-span-1 font-bold font-mono text-sky-700">
        <input
          type="text"
          value={shot.shotNumber}
          onChange={(e) => onUpdateShot(shot.id, 'shotNumber', e.target.value)}
          className="w-full bg-slate-100 px-1 py-1 rounded text-center font-bold"
          placeholder={`1${String.fromCharCode(65 + idx)}`}
        />
      </div>
      <div className="col-span-2">
        <input
          type="text"
          value={shot.setup}
          onChange={(e) => onUpdateShot(shot.id, 'setup', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 px-1.5 py-1 rounded text-slate-800 font-bold"
          placeholder="Wide / CU"
        />
      </div>
      <div className="col-span-2 flex items-center gap-1 bg-slate-50 border border-slate-200 rounded px-1.5 py-1">
        <input
          type="number"
          value={shot.estimatedTimeMinutes !== undefined ? shot.estimatedTimeMinutes : 15}
          onChange={(e) => onUpdateShot(shot.id, 'estimatedTimeMinutes', parseInt(e.target.value, 10) || 0)}
          className="w-full bg-transparent text-slate-800 text-center font-mono text-xs focus:outline-none font-bold"
          placeholder="15"
          title="Estimated shooting time in minutes"
        />
        <span className="text-[10px] text-slate-500 shrink-0 font-bold">m</span>
      </div>
      <div className="col-span-6">
        <textarea
          rows={2}
          value={shot.description || ''}
          onChange={(e) => onUpdateShot(shot.id, 'description', e.target.value)}
          className="w-full bg-slate-50 border border-slate-200 px-2 py-1 rounded text-slate-800 text-xs focus:bg-white focus:outline-none focus:ring-1 focus:ring-sky-500 resize-y font-sans"
          placeholder="Shot description, action framing or notes..."
        />
      </div>
      <div className="col-span-1 text-center pt-1">
        <button
          type="button"
          onClick={() => onDeleteShot(shot.id)}
          className="p-1 text-slate-400 hover:text-rose-600 transition cursor-pointer"
          title="Delete shot"
        >
          <Trash2 className="w-4 h-4 inline" />
        </button>
      </div>
    </div>
  );
};
