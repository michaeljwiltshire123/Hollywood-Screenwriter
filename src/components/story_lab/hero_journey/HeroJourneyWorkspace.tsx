import React, { useEffect } from 'react';
import { ScreenplayDocument, StoryArcCard, SubPlotTrack } from '../../../types';
import { AppThemeConfig } from '../../../lib/themePresets';
import { getModalTheme } from '../../../lib/modalTheme';
import { getSubPlotPalette } from '../subPlotOps';
import { useHeroJourneyState } from './useHeroJourneyState';
import { HeroJourneyDraftingPanel } from './HeroJourneyDraftingPanel';
import { HeroJourneyFilterStats } from './HeroJourneyFilterStats';
import { HeroJourneyGridMatrix } from './HeroJourneyGridMatrix';

interface HeroJourneyWorkspaceProps {
  script: ScreenplayDocument;
  mainCards: StoryArcCard[];
  subPlots: SubPlotTrack[];
  isFiveAct: boolean;
  audienceEmotion: string;
  themeConfig?: AppThemeConfig;
  onChangeScript: (updated: ScreenplayDocument) => void;
  onCreateSubPlot: () => string;
  onRenameSubPlot: (id: string, name: string) => void;
  externalSelectRef?: { trackId: string; stageIdx: number; seq: number } | null;
}

export const HeroJourneyWorkspace: React.FC<HeroJourneyWorkspaceProps> = ({
  script, mainCards, subPlots, isFiveAct, audienceEmotion, themeConfig, onChangeScript, onCreateSubPlot, onRenameSubPlot, externalSelectRef,
}) => {
  const mt = getModalTheme(themeConfig);
  const hj = useHeroJourneyState(script, mainCards, subPlots, isFiveAct, audienceEmotion, onChangeScript);
  const mainColor = mt.theme.accentButtons || '#D97706';

  useEffect(() => {
    if (externalSelectRef) hj.setSelectedRef({ trackId: externalSelectRef.trackId, stageIdx: externalSelectRef.stageIdx });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [externalSelectRef?.seq]);

  const selectedSub = hj.selectedRef.trackId === 'main'
    ? null
    : subPlots.find((s) => s.id === hj.selectedRef.trackId) || null;
  const activeTrackLabel = selectedSub ? selectedSub.name : 'Main Plot';
  const activeTrackColor = selectedSub ? getSubPlotPalette(selectedSub.color).border : mainColor;

  const handleCreateAndFocusSubPlot = () => {
    const newId = onCreateSubPlot();
    hj.setFilterTrackId('all');
    hj.setSelectedRef({ trackId: newId, stageIdx: hj.selectedRef.stageIdx });
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start">
      <div className="lg:col-span-4 space-y-3 lg:sticky lg:top-2">
        <HeroJourneyDraftingPanel
          beat={hj.activeBeat}
          stageIndex={hj.selectedRef.stageIdx}
          stageRow={hj.stages[hj.selectedRef.stageIdx]}
          trackLabel={activeTrackLabel}
          trackColor={activeTrackColor}
          mt={mt}
          onUpdate={hj.handleUpdateBeat}
        />
        <HeroJourneyFilterStats
          subPlots={subPlots}
          filterTrackId={hj.filterTrackId}
          mainColor={mainColor}
          totalPages={hj.totalMainPages}
          activeBeatTitle={hj.activeBeat.title}
          mt={mt}
          onSelectFilter={hj.setFilterTrackId}
          onCreateSubPlot={handleCreateAndFocusSubPlot}
        />
      </div>

      <div className="lg:col-span-8 min-w-0">
        <HeroJourneyGridMatrix
          heroData={hj.heroData}
          stages={hj.stages}
          subPlots={subPlots}
          filterTrackId={hj.filterTrackId}
          selectedRef={hj.selectedRef}
          mainColor={mainColor}
          mt={mt}
          onSelectBeat={hj.setSelectedRef}
          onReimportFromActs={hj.handleReimportFromActs}
          onRenameSubPlot={onRenameSubPlot}
          onInsertRow={hj.handleInsertRow}
          onDeleteCustomRow={hj.handleDeleteRow}
          onRenameStage={hj.handleRenameStage}
        />
      </div>
    </div>
  );
};
