import React from 'react';
import { Camera, Plus } from 'lucide-react';

interface ShotPlannerEmptyStateProps {
  sceneNumber: string;
  onAddFirstShot: () => void;
}

export const ShotPlannerEmptyState: React.FC<ShotPlannerEmptyStateProps> = ({
  sceneNumber,
  onAddFirstShot,
}) => {
  return (
    <div className="text-center py-10 px-6 bg-slate-50 border border-dashed border-slate-300 rounded-xl space-y-3 font-sans">
      <div className="w-12 h-12 rounded-full bg-amber-100 border border-amber-300 text-amber-800 flex items-center justify-center mx-auto shadow-2xs">
        <Camera className="w-6 h-6" />
      </div>
      <div>
        <h4 className="font-extrabold text-sm text-slate-900 uppercase">
          No Camera Setups Logged for Scene #{sceneNumber}
        </h4>
        <p className="text-xs text-slate-600 max-w-md mx-auto mt-1 leading-relaxed">
          Map out camera angles, framing notes, and estimated shooting durations for your team. Click below to add your first shot.
        </p>
      </div>
      <button
        type="button"
        onClick={onAddFirstShot}
        className="inline-flex items-center gap-1.5 px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-black text-xs uppercase tracking-wide rounded-lg transition shadow-xs cursor-pointer active:scale-95"
      >
        <Plus className="w-4 h-4" />
        <span>Add First Shot</span>
      </button>
    </div>
  );
};
