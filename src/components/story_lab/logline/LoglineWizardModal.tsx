import React, { useState } from 'react';
import { X } from 'lucide-react';
import { LoglineData, StoryArcCard } from '../../../types';
import { AppThemeConfig } from '../../../lib/themePresets';
import { getModalTheme } from '../../../lib/modalTheme';
import { ClassicExamplesBanner } from './ClassicExamplesBanner';
import { LoglineQuestionsColumn } from './LoglineQuestionsColumn';
import { LoglineWeavesColumn } from './LoglineWeavesColumn';
import { LoglineWizardFooter } from './LoglineWizardFooter';
import { IdeaSprintModal } from '../idea_sprint/IdeaSprintModal';
import { SprintVaultItem } from '../idea_sprint/ideaSprintTypes';
import { useLoglineSprint } from './useLoglineSprint';

interface LoglineWizardModalProps {
  isOpen: boolean; onClose: () => void; initialLogline?: LoglineData;
  cards: StoryArcCard[]; themeConfig?: AppThemeConfig;
  onSaveLogline: (data: LoglineData) => void; onSaveVaultItem?: (item: SprintVaultItem) => void;
}

export const LoglineWizardModal: React.FC<LoglineWizardModalProps> = ({
  isOpen, onClose, initialLogline, themeConfig, onSaveLogline, onSaveVaultItem,
}) => {
  const [formData, setFormData] = useState<LoglineData>(initialLogline || {
    protagonist: '', goal: '', obstacle: '', stakes: '', hook: '', order: [0, 1, 2], text: '',
  });
  const [showExamples, setShowExamples] = useState(false);

  const sprint = useLoglineSprint(
    (field, text) => setFormData((prev) => ({ ...prev, [field]: text })),
    onSaveVaultItem,
  );

  if (!isOpen) return null;
  const mt = getModalTheme(themeConfig);

  const handleShuffleOrder = () => {
    const cur = formData.order;
    const next: [number, number, number] = [cur[1], cur[2], cur[0]];
    setFormData((prev) => ({ ...prev, order: next }));
  };

  return (
    <>
      <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-150">
        <div className="max-w-5xl w-full max-h-[92vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 space-y-4 shadow-2xl flex flex-col" style={mt.windowStyle}>
          <div className="absolute top-4 right-4 z-10">
            <button type="button" onClick={onClose} className="p-1.5 rounded-lg border hover:bg-black/5 cursor-pointer" style={mt.secondaryBtnStyle} aria-label="Close">
              <X className="w-4 h-4" />
            </button>
          </div>

          <ClassicExamplesBanner showExamples={showExamples} onToggle={() => setShowExamples((v) => !v)} mt={mt} />

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start flex-1 min-h-0 pt-1">
            <div className="lg:col-span-6">
              <div className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-2">Step 1: Answer 5 Key Questions</div>
              <LoglineQuestionsColumn
                formData={formData}
                onChangeField={(field, val) => setFormData((prev) => ({ ...prev, [field]: val }))}
                onBrainstormField={sprint.startSprint}
                mt={mt}
              />
            </div>

            <div className="lg:col-span-6 flex flex-col justify-between h-full">
              <div>
                <div className="text-xs font-black uppercase tracking-wider text-amber-800 dark:text-amber-300 mb-2">Step 2: Weave &amp; Polish Hook</div>
                <LoglineWeavesColumn
                  formData={formData}
                  onChangeText={(text) => setFormData((prev) => ({ ...prev, text }))}
                  onShuffle={handleShuffleOrder}
                  mt={mt}
                />
              </div>

              <LoglineWizardFooter
                onCancel={onClose}
                onSave={() => { onSaveLogline(formData); onClose(); }}
                mt={mt}
              />
            </div>
          </div>
        </div>
      </div>

      {sprint.sprintQuestion && (
        <IdeaSprintModal
          isOpen={Boolean(sprint.sprintQuestion)}
          initialQuestion={sprint.sprintQuestion}
          onApplyResult={sprint.handleApply}
          onClose={sprint.cancelSprint}
          themeConfig={themeConfig}
        />
      )}
    </>
  );
};
