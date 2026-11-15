import React from 'react';
import { Camera, X, Plus, Check } from 'lucide-react';
import { ScreenplayElement, ShotInfo } from '../../../types';
import { AppThemeConfig } from '../../../lib/themePresets';
import { getModalTheme } from '../../../lib/modalTheme';
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
  themeConfig?: AppThemeConfig;
}

export const SceneShotPlannerModal: React.FC<SceneShotPlannerModalProps> = ({
  activeShotSceneId, scenes, shots, elements, onClose, onAddShot, onUpdateShot, onDeleteShot, themeConfig,
}) => {
  if (!activeShotSceneId) return null;
  const targetScene = scenes.find((s) => s.id === activeShotSceneId);
  if (!targetScene) return null;

  const mt = getModalTheme(themeConfig);
  const sceneShots = shots.filter((s) => s.sceneHeadingId === activeShotSceneId);
  const scIdx = elements.findIndex((e) => e.id === activeShotSceneId);
  const nextScIdx = elements.findIndex((e, i) => i > scIdx && e.type === 'SCENE HEADING');
  const sceneBlock = elements.slice(scIdx, nextScIdx >= 0 ? nextScIdx : elements.length);
  const taggedProps = Array.from(new Set(sceneBlock.flatMap((e) => e.propTags || [])));

  return (
    <div className="fixed inset-0 backdrop-blur-xs z-50 flex items-center justify-center p-3 sm:p-6 font-sans animate-in fade-in duration-150" style={mt.overlayStyle}>
      <div className="border rounded-xl shadow-2xl max-w-2xl w-full overflow-hidden flex flex-col max-h-[85vh]" style={mt.windowStyle}>
        <div className="p-4 border-b flex items-center justify-between shrink-0" style={mt.headerStyle}>
          <div className="flex items-center gap-2.5 min-w-0">
            <Camera className="w-5 h-5 shrink-0" style={mt.accentStyle} />
            <div className="min-w-0">
              <div className="flex items-center gap-2">
                <span className="px-2 py-0.5 border font-mono font-bold text-xs rounded" style={mt.cardStyle}>
                  Scene #{targetScene.sceneNumber}
                </span>
                <h3 className="font-extrabold text-sm uppercase truncate">Shot Planning</h3>
              </div>
              <p className="text-xs font-medium truncate mt-0.5" style={mt.mutedStyle}>{targetScene.heading}</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button type="button" onClick={() => onAddShot(targetScene.id)} className="px-3 py-1.5 font-extrabold rounded-lg flex items-center gap-1.5 text-xs shadow-xs transition cursor-pointer hover:opacity-90" style={mt.primaryBtnStyle}>
              <Plus className="w-3.5 h-3.5" />
              <span>Add Shot</span>
            </button>
            <button onClick={onClose} className="p-1 rounded transition cursor-pointer hover:opacity-80" style={mt.secondaryBtnStyle}>
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        <div className="p-4 overflow-y-auto space-y-3.5 flex-1">
          {sceneShots.length === 0 ? (
            <ShotPlannerEmptyState sceneNumber={targetScene.sceneNumber} onAddFirstShot={() => onAddShot(targetScene.id)} />
          ) : (
            sceneShots.map((sh, idx) => (
              <ShotPlannerRowItem key={sh.id} shot={sh} index={idx} taggedProps={taggedProps} onUpdateShot={onUpdateShot} onDeleteShot={onDeleteShot} />
            ))
          )}
        </div>

        <div className="p-3.5 border-t flex items-center justify-between shrink-0" style={mt.headerStyle}>
          <button type="button" onClick={() => onAddShot(targetScene.id)} className="px-3.5 py-1.5 font-extrabold text-xs rounded-lg flex items-center gap-1.5 shadow-xs transition cursor-pointer hover:opacity-90" style={mt.primaryBtnStyle}>
            <Plus className="w-3.5 h-3.5" />
            <span>Add Shot</span>
          </button>
          <button type="button" onClick={onClose} className="px-4 py-1.5 font-extrabold text-xs rounded-lg border transition flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-85" style={mt.secondaryBtnStyle}>
            <Check className="w-3.5 h-3.5" />
            <span>Done</span>
          </button>
        </div>
      </div>
    </div>
  );
};
