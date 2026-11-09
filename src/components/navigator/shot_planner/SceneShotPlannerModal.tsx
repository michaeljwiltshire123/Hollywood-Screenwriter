import React from 'react';
import { Camera, X, Plus, Check } from 'lucide-react';
import { ScreenplayElement, ShotInfo } from '../../../types';
import { ShotPlannerRowItem } from './ShotPlannerRowItem';
import { ShotPlannerEmptyState } from './ShotPlannerEmptyState';

interface SceneShotPlannerModalProps {
  activeShotSceneId: string | null;
  scenes: { id: string; sceneNumber: string; heading: string }[];
  shots: ShotInfo[];
  elements: ScreenplayElement[];
  onClose: () => void;
  onAddShot: (sceneId: string) => void;
  onUpdateShot: (shotId: string, fields: Partial<ShotInfo>) => void;
  onDeleteShot: (shotId: string) => void;
}

export const SceneShotPlannerModal: React.FC<SceneShotPlannerModalProps> = ({
  activeShotSceneId, scenes, shots, elements, onClose, onAddShot, onUpdateShot, onDeleteShot,
}) => {
  if (!activeShotSceneId) return null;
  const targetScene = scenes.find((s) => s.id === activeShotSceneId);
  if (!targetScene) return null;

  const sceneShots = shots.filter((s) => s.sceneHeadingId === activeShotSceneId);
  const scIdx = elements.findIndex((e) => e.id === activeShotSceneId);
  const nextScIdx = elements.findIndex((e, i) => i > scIdx && e.type === 'SCENE HEADING');
  const sliceEnd = nextScIdx >= 0 ? nextScIdx : elements.length;
  const sceneBlock = elements.slice(scIdx, sliceEnd);
  const taggedProps = Array.from(new Set(sceneBlock.flatMap((e) => e.propTags || [])));

  return (
    <div className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 font-sans animate-in fade-in duration-150">
      <div className="bg-white border border-slate-300 rounded-xl shadow-2xl max-w-2xl w-full text-slate-900 overflow-hidden flex flex-col max-h-[85vh]">
        <div className="p-4 bg-slate-100 border-b border-slate-200 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-2.5 min-w-0">
            <Camera className="w-5 h-5 text-amber-600 shrink-0" />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 bg-sky-100 text-sky-900 border border-sky-300 font-mono font-bold text-xs rounded">
                  Scene #{targetScene.sceneNumber}
                </span>
                <h3 className="font-extrabold text-sm text-slate-900 uppercase truncate">Shot Planning</h3>
              </div>
              <p className="text-xs text-slate-500 font-medium truncate mt-0.5">{targetScene.heading}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={() => onAddShot(targetScene.id)}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-lg flex items-center gap-1.5 text-xs shadow-xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Add Shot</span>
            </button>
            <button onClick={onClose} className="p-1 hover:bg-slate-200 rounded text-slate-500 hover:text-slate-900 transition">
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 flex-1 bg-slate-50/50">
          {sceneShots.length === 0 ? (
            <ShotPlannerEmptyState sceneNumber={targetScene.sceneNumber} onAddFirstShot={() => onAddShot(targetScene.id)} />
          ) : (
            sceneShots.map((sh, idx) => (
              <ShotPlannerRowItem
                key={sh.id}
                shot={sh}
                index={idx}
                taggedProps={taggedProps}
                onUpdateShot={onUpdateShot}
                onDeleteShot={onDeleteShot}
              />
            ))
          )}
        </div>

        <div className="p-3.5 bg-slate-100 border-t border-slate-200 flex items-center justify-between shrink-0">
          <button
            type="button"
            onClick={() => onAddShot(targetScene.id)}
            className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer"
          >
            <Plus className="w-3.5 h-3.5" />
            <span>Add Shot</span>
          </button>
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-1.5 bg-slate-800 hover:bg-slate-900 text-white font-extrabold text-xs rounded-lg transition flex items-center gap-1.5 cursor-pointer shadow-xs"
          >
            <Check className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
