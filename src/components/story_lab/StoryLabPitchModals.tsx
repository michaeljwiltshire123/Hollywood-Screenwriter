import React from 'react';
import { ScreenplayDocument, StoryArcCard, SubPlotTrack, HeroJourneyData, LoglineData, SynopsisData } from '../../types';
import { AppThemeConfig } from '../../lib/themePresets';
import { LoglineWizardModal } from './logline/LoglineWizardModal';
import { SynopsisEditorModal } from './synopsis/SynopsisEditorModal';
import { SprintVaultItem } from './idea_sprint/ideaSprintTypes';

interface StoryLabPitchModalsProps {
  isLoglineOpen: boolean;
  onCloseLogline: () => void;
  isSynopsisOpen: boolean;
  onCloseSynopsis: () => void;
  isLoglineGuardOpen: boolean;
  onCloseLoglineGuard: () => void;
  onOpenLoglineFromGuard: () => void;
  script: ScreenplayDocument;
  cards: StoryArcCard[];
  subPlots: SubPlotTrack[];
  heroJourney?: HeroJourneyData;
  themeConfig?: AppThemeConfig;
  onChangeScript: (updated: ScreenplayDocument) => void;
  onSaveVaultItem?: (item: SprintVaultItem) => void;
}

export const StoryLabPitchModals: React.FC<StoryLabPitchModalsProps> = ({
  isLoglineOpen, onCloseLogline, isSynopsisOpen, onCloseSynopsis,
  isLoglineGuardOpen, onCloseLoglineGuard, onOpenLoglineFromGuard,
  script, cards, subPlots, heroJourney, themeConfig, onChangeScript, onSaveVaultItem,
}) => {
  return (
    <>
      <LoglineWizardModal
        isOpen={isLoglineOpen}
        onClose={onCloseLogline}
        initialLogline={script.storyArc?.logline}
        cards={cards}
        themeConfig={themeConfig}
        onSaveLogline={(logline: LoglineData) => {
          onChangeScript({
            ...script,
            storyArc: { ...script.storyArc, preset: script.storyArc?.preset || '3-Act', cards: script.storyArc?.cards || cards, logline },
          });
        }}
        onSaveVaultItem={onSaveVaultItem}
      />

      <SynopsisEditorModal
        isOpen={isSynopsisOpen}
        onClose={onCloseSynopsis}
        scriptTitle={script.title}
        targetLength={script.targetLength || 90}
        logline={script.storyArc?.logline}
        synopsis={script.storyArc?.synopsis}
        cards={cards}
        subPlots={subPlots}
        heroJourney={heroJourney}
        themeConfig={themeConfig}
        onSaveSynopsis={(synopsis: SynopsisData) => {
          onChangeScript({
            ...script,
            storyArc: { ...script.storyArc, preset: script.storyArc?.preset || '3-Act', cards: script.storyArc?.cards || cards, synopsis },
          });
        }}
      />

      {isLoglineGuardOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-150">
          <div className="max-w-md w-full rounded-2xl border bg-white dark:bg-slate-900 p-5 space-y-4 shadow-2xl">
            <h3 className="text-sm font-black text-slate-900 dark:text-slate-100">Logline Required</h3>
            <p className="text-xs leading-relaxed text-slate-600 dark:text-slate-300">
              To create a synopsis you must first answer the questions to create a logline.
            </p>
            <div className="flex items-center justify-end gap-2 pt-2">
              <button type="button" onClick={onCloseLoglineGuard} className="px-3.5 py-2 rounded-xl border text-xs font-bold cursor-pointer">Cancel</button>
              <button
                type="button"
                onClick={() => { onCloseLoglineGuard(); onOpenLoglineFromGuard(); }}
                className="px-4 py-2 rounded-xl text-xs font-black bg-amber-500 hover:bg-amber-400 text-slate-950 cursor-pointer shadow-sm transition"
              >
                Create Logline Now
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};
