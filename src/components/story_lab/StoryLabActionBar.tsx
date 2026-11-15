import React from 'react';
import { Plus, SlidersHorizontal, Sparkles, FileText, Milestone } from 'lucide-react';
import { IdeaVaultDropdown } from './idea_sprint/IdeaVaultDropdown';
import { SprintVaultItem } from './idea_sprint/ideaSprintTypes';
import { AudienceEmotionInput } from './AudienceEmotionInput';
import { PlotSwitcherDropdown } from './PlotSwitcherDropdown';
import { SubPlotTrack } from '../../types';

interface StoryLabActionBarProps {
  isFiveAct: boolean; hasWritingOnAllThreeActs: boolean; filledFirstThreeCount: number;
  audienceEmotion: string; onChangeAudienceEmotion: (val: string) => void;
  subPlots: SubPlotTrack[]; activeSubPlotId: string | null;
  onSelectSubPlot: (id: string | null) => void; onCreateSubPlot: () => void;
  vaultItems: SprintVaultItem[]; isHeroJourneyOpen: boolean; onToggleHeroJourney: () => void;
  onStartNew: () => void; onOpenFiveActExpansion: () => void; onOpenGuidedSpark: () => void;
  onOpenSynopsis: () => void; onOpenLogline: () => void;
  hasLogline: boolean; hasSynopsis: boolean; onClearVault?: () => void;
}

export const StoryLabActionBar: React.FC<StoryLabActionBarProps> = ({
  isFiveAct, hasWritingOnAllThreeActs, filledFirstThreeCount, audienceEmotion, onChangeAudienceEmotion,
  subPlots, activeSubPlotId, onSelectSubPlot, onCreateSubPlot, vaultItems, isHeroJourneyOpen, onToggleHeroJourney,
  onStartNew, onOpenFiveActExpansion, onOpenGuidedSpark, onOpenSynopsis, onOpenLogline, hasLogline, hasSynopsis, onClearVault,
}) => {
  return (
    <div className="bg-[#FFFFFF] border border-[#E2E8F0] p-2.5 rounded-xl shadow-2xs font-sans space-y-2">
      <div className="flex flex-wrap items-center justify-between gap-2.5">
        <div className="flex flex-wrap items-center gap-2">
          {!isFiveAct && !hasWritingOnAllThreeActs && (
            <button
              type="button" onClick={onOpenGuidedSpark}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title={filledFirstThreeCount === 2 ? 'Complete the remaining empty act card' : 'Open guided creative prompts and story generator'}
            >
              <Sparkles className="w-3.5 h-3.5 text-slate-950" /><span>Create a 3-Act Story</span>
            </button>
          )}
          {!isFiveAct && hasWritingOnAllThreeActs && (
            <button
              type="button" onClick={onOpenFiveActExpansion}
              className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 active:scale-95 text-slate-950 font-black rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs"
              title="Open guided 5-Act story expansion workflow"
            >
              <SlidersHorizontal className="w-3.5 h-3.5 text-slate-950" /><span>Expand to 5 Acts</span>
            </button>
          )}
          <button
            type="button" onClick={onOpenLogline}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="Create or edit story logline"
          >
            <Sparkles className="w-3.5 h-3.5 text-amber-600" /><span>{hasLogline ? 'See Logline' : 'Create Logline'}</span>
          </button>
          <button
            type="button" onClick={onOpenSynopsis}
            className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
            title="View and edit professional story synopsis and pitch"
          >
            <FileText className="w-3.5 h-3.5 text-amber-600" /><span>{hasSynopsis ? 'See Synopsis' : 'Create Synopsis'}</span>
          </button>
          {(hasWritingOnAllThreeActs || isHeroJourneyOpen) && (
            <button
              type="button" onClick={onToggleHeroJourney}
              className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs active:scale-95"
              title={isHeroJourneyOpen ? 'Return to Act cards view' : 'Arrange story beats into the 12-stage Hero’s Journey grid'}
            >
              <Milestone className="w-3.5 h-3.5 text-amber-600" /><span>The Hero&apos;s Journey</span>
            </button>
          )}
        </div>

        <div className="flex items-center gap-2 shrink-0 ml-auto">
          <button
            type="button" onClick={onStartNew}
            className="px-3 py-1.5 bg-[#FFFFFF] hover:bg-slate-50 text-slate-800 border border-slate-300 hover:border-slate-400 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer active:scale-95 shadow-2xs"
            title="Start fresh with empty act cards"
          >
            <Plus className="w-3.5 h-3.5 text-amber-600" /><span>Start New</span>
          </button>
          <IdeaVaultDropdown vaultItems={vaultItems} onClearVault={onClearVault} />
        </div>
      </div>

      <div className="pt-2 border-t border-slate-100 flex flex-col sm:flex-row items-stretch sm:items-center gap-2">
        {!isHeroJourneyOpen && (
          <PlotSwitcherDropdown subPlots={subPlots} activeSubPlotId={activeSubPlotId} onSelectSubPlot={onSelectSubPlot} onCreateSubPlot={onCreateSubPlot} />
        )}
        <div className="flex-1 min-w-0"><AudienceEmotionInput value={audienceEmotion} onChange={onChangeAudienceEmotion} /></div>
      </div>
    </div>
  );
};
