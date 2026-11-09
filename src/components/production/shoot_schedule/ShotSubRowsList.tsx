import React from 'react';
import { ShotSetupItem } from '../../../types';
import { Plus, Video } from 'lucide-react';
import { ShotSubRowItem } from './ShotSubRowItem';

interface ShotSubRowsListProps {
  shots?: ShotSetupItem[];
  onAddShot: () => void;
  onDeleteShot: (shotId: string) => void;
  onUpdateShot: (shotId: string, field: keyof ShotSetupItem, val: any) => void;
}

export const ShotSubRowsList: React.FC<ShotSubRowsListProps> = ({
  shots = [],
  onAddShot,
  onDeleteShot,
  onUpdateShot,
}) => {
  return (
    <tr className="bg-slate-50/90 border-b border-slate-300">
      <td colSpan={11} className="px-6 py-3">
        <div className="space-y-2 border-l-2 border-sky-500 pl-4 w-full">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-1.5 text-xs font-bold text-slate-800 uppercase tracking-wide">
              <Video className="w-3.5 h-3.5 text-sky-600" />
              <span>Camera Setup Shot List & Estimated Shooting Time</span>
            </div>
            <button
              type="button"
              onClick={onAddShot}
              className="px-2 py-1 bg-sky-600 hover:bg-sky-700 text-white rounded text-[11px] font-semibold flex items-center gap-1 transition cursor-pointer shadow-xs"
            >
              <Plus className="w-3 h-3" /> Add Shot Setup
            </button>
          </div>

          {shots.length === 0 ? (
            <div className="text-xs text-slate-500 italic py-1">
              No individual camera setups added yet. Click above to add shots (e.g. Wide, Close Up, Insert).
            </div>
          ) : (
            <div className="space-y-2 pt-1">
              {shots.map((shot, idx) => (
                <ShotSubRowItem
                  key={shot.id}
                  shot={shot}
                  idx={idx}
                  onDeleteShot={onDeleteShot}
                  onUpdateShot={onUpdateShot}
                />
              ))}
            </div>
          )}
        </div>
      </td>
    </tr>
  );
};
