import React, { useState } from 'react';
import { ScreenplayDocument, SceneInfo, CharacterInfo } from '../../types';
import { CallSheetTab } from './CallSheetTab';
import { RiskAssessmentTab } from './RiskAssessmentTab';
import { ReleaseFormsTab } from './ReleaseFormsTab';
import { ProductionSuiteHeader } from './ProductionSuiteHeader';
import { ProductionSuiteTabs } from './ProductionSuiteTabs';
import { PageTourModal } from './tour/PageTourModal';
import { ProductionTab } from './tour/tourTypes';

interface ProductionScheduleModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScreenplayDocument;
  scenes: SceneInfo[];
  characters: CharacterInfo[];
  onChangeScript: (updated: ScreenplayDocument) => void;
}

export const ProductionScheduleModal: React.FC<ProductionScheduleModalProps> = ({
  isOpen, onClose, script, scenes, characters, onChangeScript,
}) => {
  const [activeTab, setActiveTab] = useState<ProductionTab>('CALLSHEET');
  const [isTourOpen, setIsTourOpen] = useState(false);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 z-50 flex items-center justify-center p-2 sm:p-4 bg-slate-950/85 backdrop-blur-md animate-in fade-in duration-200 font-sans">
      <div className="bg-slate-950 border border-slate-800 rounded-2xl w-full max-w-6xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden">
        <ProductionSuiteHeader
          title={script.title}
          scenesCount={scenes.length}
          charactersCount={characters.length}
          onOpenTour={() => setIsTourOpen(true)}
          onClose={onClose}
        />

        <ProductionSuiteTabs
          activeTab={activeTab}
          script={script}
          onChangeScript={onChangeScript}
          onSelectTab={setActiveTab}
        />

        <div id="production-modal-scroll-container" className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'CALLSHEET' && (
            <CallSheetTab script={script} characters={characters} onChangeScript={onChangeScript} watermarkLogoUrl={script.productionLogoUrl} />
          )}
          {activeTab === 'RISK' && (
            <RiskAssessmentTab script={script} scenes={scenes} onChangeScript={onChangeScript} watermarkLogoUrl={script.productionLogoUrl} />
          )}
          {activeTab === 'RELEASES' && (
            <ReleaseFormsTab script={script} onChangeScript={onChangeScript} watermarkLogoUrl={script.productionLogoUrl} />
          )}
        </div>
      </div>

      <PageTourModal isOpen={isTourOpen} activeTab={activeTab} onClose={() => setIsTourOpen(false)} />
    </div>
  );
};
