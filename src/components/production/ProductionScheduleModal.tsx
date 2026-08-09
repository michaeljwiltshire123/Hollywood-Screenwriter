import React, { useState } from 'react';
import { ScreenplayDocument, SceneInfo, CharacterInfo } from '../../types';
import { ShootingScheduleTab } from './ShootingScheduleTab';
import { CallSheetTab } from './CallSheetTab';
import { RiskAssessmentTab } from './RiskAssessmentTab';
import { ReleaseFormsTab } from './ReleaseFormsTab';
import { LogoWatermarkUploader } from './LogoWatermarkUploader';
import { Layers, FileText, ShieldAlert, FileCheck, Image, X, Calendar } from 'lucide-react';

interface ProductionScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScreenplayDocument;
  scenes: SceneInfo[];
  characters: CharacterInfo[];
  onChangeScript: (updated: ScreenplayDocument) => void;
}

export const ProductionScheduleModal: React.FC<ProductionScheduleModalProps> = ({
  isOpen,
  onClose,
  script,
  scenes,
  characters,
  onChangeScript,
}) => {
  const [activeTab, setActiveTab] = useState<'SCHEDULE' | 'CALLSHEET' | 'RISK' | 'RELEASES' | 'WATERMARK'>('SCHEDULE');

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[92vh] flex flex-col shadow-2xl overflow-hidden font-sans">
        {/* Modal Top Header Bar */}
        <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
              <Calendar className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
                Production Schedule & Call Sheet Suite
              </h2>
              <p className="text-xs text-slate-400 font-mono">
                {script.title || 'UNTITLED SCREENPLAY'} • {scenes.length} Scenes • {characters.length} Cast Members
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
            title="Close Production Schedule"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Tab Selector Bar */}
        <div className="flex items-center gap-1 p-2 bg-slate-900 border-b border-slate-800 overflow-x-auto text-xs font-bold scrollbar-none">
          <button
            onClick={() => setActiveTab('SCHEDULE')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'SCHEDULE'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <Layers className="w-4 h-4" />
            <span>Shooting Schedule</span>
          </button>

          <button
            onClick={() => setActiveTab('CALLSHEET')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'CALLSHEET'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>Call Sheet</span>
          </button>

          <button
            onClick={() => setActiveTab('RISK')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'RISK'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <ShieldAlert className="w-4 h-4" />
            <span>Risk Assessment & Safety</span>
          </button>

          <button
            onClick={() => setActiveTab('RELEASES')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 shrink-0 cursor-pointer ${
              activeTab === 'RELEASES'
                ? 'bg-amber-500 text-slate-950 shadow-sm'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <FileCheck className="w-4 h-4" />
            <span>Release Forms</span>
          </button>

          <button
            onClick={() => setActiveTab('WATERMARK')}
            className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 shrink-0 cursor-pointer ml-auto ${
              activeTab === 'WATERMARK'
                ? 'bg-slate-800 text-amber-300 border border-amber-500/40'
                : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>Watermark & Logo</span>
          </button>
        </div>

        {/* Modal Scrollable Body */}
        <div className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'SCHEDULE' && (
            <ShootingScheduleTab
              script={script}
              scenes={scenes}
              onChangeScript={onChangeScript}
              watermarkLogoUrl={script.productionLogoUrl}
            />
          )}

          {activeTab === 'CALLSHEET' && (
            <CallSheetTab
              script={script}
              characters={characters}
              onChangeScript={onChangeScript}
              watermarkLogoUrl={script.productionLogoUrl}
            />
          )}

          {activeTab === 'RISK' && (
            <RiskAssessmentTab
              script={script}
              scenes={scenes}
              onChangeScript={onChangeScript}
              watermarkLogoUrl={script.productionLogoUrl}
            />
          )}

          {activeTab === 'RELEASES' && (
            <ReleaseFormsTab
              script={script}
              onChangeScript={onChangeScript}
              watermarkLogoUrl={script.productionLogoUrl}
            />
          )}

          {activeTab === 'WATERMARK' && (
            <LogoWatermarkUploader
              watermarkLogoUrl={script.productionLogoUrl}
              onUpdateLogoUrl={(url) => onChangeScript({ ...script, productionLogoUrl: url })}
            />
          )}
        </div>
      </div>
    </div>
  );
};
