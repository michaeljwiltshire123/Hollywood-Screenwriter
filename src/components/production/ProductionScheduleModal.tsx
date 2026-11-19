import React, { useState } from 'react';
import { ScreenplayDocument, SceneInfo, CharacterInfo } from '../../types';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';
import { CallSheetTab } from './CallSheetTab';
import { HealthSafetyTab } from './health_safety/HealthSafetyTab';
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
  themeConfig?: AppThemeConfig;
}

export const ProductionScheduleModal: React.FC<ProductionScheduleModalProps> = ({
  isOpen, onClose, script, scenes, characters, onChangeScript, themeConfig,
}) => {
  const [activeTab, setActiveTab] = useState<ProductionTab>('CALLSHEET');
  const [isTourOpen, setIsTourOpen] = useState(false);

  if (!isOpen) return null;
  const mt = getModalTheme(themeConfig);

  return (
    <div
      className="fixed inset-x-0 top-28 bottom-0 z-50 flex items-center justify-center p-2 sm:p-4 backdrop-blur-md animate-in fade-in duration-200 font-sans"
      style={mt.overlayStyle}
    >
      <div
        className="border rounded-2xl w-full max-w-6xl max-h-[85vh] flex flex-col shadow-2xl overflow-hidden"
        style={mt.windowStyle}
      >
        <ProductionSuiteHeader
          title={script.title}
          scenesCount={scenes.length}
          charactersCount={characters.length}
          onOpenTour={() => setIsTourOpen(true)}
          onClose={onClose}
          themeConfig={themeConfig}
        />

        <ProductionSuiteTabs
          activeTab={activeTab}
          script={script}
          onChangeScript={onChangeScript}
          onSelectTab={setActiveTab}
          themeConfig={themeConfig}
        />

        <div id="production-modal-scroll-container" className="p-4 sm:p-6 overflow-y-auto flex-1 space-y-6">
          {activeTab === 'CALLSHEET' && (
            <CallSheetTab script={script} characters={characters} onChangeScript={onChangeScript} watermarkLogoUrl={script.productionLogoUrl} />
          )}
          {activeTab === 'RISK' && (
            <HealthSafetyTab script={script} scenes={scenes} onChangeScript={onChangeScript} themeConfig={themeConfig} />
          )}
          {activeTab === 'RELEASES' && (
            <ReleaseFormsTab script={script} onChangeScript={onChangeScript} watermarkLogoUrl={script.productionLogoUrl} themeConfig={themeConfig} />
          )}
        </div>
      </div>

      <PageTourModal isOpen={isTourOpen} activeTab={activeTab} onClose={() => setIsTourOpen(false)} />
    </div>
  );
};
