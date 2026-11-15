import React, { useState } from 'react';
import { LoglineData, SynopsisData, StoryArcCard, SubPlotTrack, HeroJourneyData } from '../../../types';
import { AppThemeConfig } from '../../../lib/themePresets';
import { getModalTheme } from '../../../lib/modalTheme';
import { SynopsisHeader } from './SynopsisHeader';
import { SynopsisTopControls } from './SynopsisTopControls';
import { SynopsisTextArea } from './SynopsisTextArea';
import { SynopsisTimelineDrawer } from './SynopsisTimelineDrawer';
import { SynopsisExportActions } from './SynopsisExportActions';
import {
  copyPitchToClipboard, printPitchDocument, emailPitchDraft, downloadPitchWordDoc,
} from './synopsisExportOps';

interface SynopsisEditorModalProps {
  isOpen: boolean;
  onClose: () => void;
  scriptTitle: string;
  targetLength: number;
  logline?: LoglineData;
  synopsis?: SynopsisData;
  cards: StoryArcCard[];
  subPlots: SubPlotTrack[];
  heroJourney?: HeroJourneyData;
  themeConfig?: AppThemeConfig;
  onSaveSynopsis: (data: SynopsisData) => void;
}

export const SynopsisEditorModal: React.FC<SynopsisEditorModalProps> = ({
  isOpen, onClose, scriptTitle, targetLength, logline, synopsis, cards, heroJourney, themeConfig, onSaveSynopsis,
}) => {
  const [text, setText] = useState<string>(synopsis?.text || '');
  const [comps, setComps] = useState<string>(synopsis?.comps || '');
  const [isGuideOpen, setIsGuideOpen] = useState(false);
  const [showTimelineDrawer, setShowTimelineDrawer] = useState(false);
  const [copied, setCopied] = useState(false);

  if (!isOpen) return null;
  const mt = getModalTheme(themeConfig);
  const words = text.trim().split(/\s+/).filter(Boolean).length;
  const isTooShort = words < 350 && words > 0;
  const isTooLong = words > 800;
  const hasGrammarAlert = /\b(I|me|my|mine|we|us|our|walked|ran|decided|looked|took|found|said|was|were)\b/i.test(text);

  return (
    <div className="fixed inset-0 z-70 flex items-center justify-center p-3 sm:p-5 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in duration-150">
      <div className="max-w-5xl w-full max-h-[94vh] overflow-y-auto rounded-2xl border p-5 sm:p-6 space-y-3.5 shadow-2xl flex flex-col" style={mt.windowStyle}>
        <SynopsisHeader
          showTimelineDrawer={showTimelineDrawer}
          onToggleTimelineDrawer={() => setShowTimelineDrawer((v) => !v)}
          onClose={onClose}
          mt={mt}
        />

        <SynopsisTopControls
          isGuideOpen={isGuideOpen}
          onToggleGuide={() => setIsGuideOpen((v) => !v)}
          comps={comps}
          onChangeComps={setComps}
          mt={mt}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start flex-1 min-h-0">
          <div className={`space-y-3 flex flex-col min-h-0 ${showTimelineDrawer ? 'lg:col-span-8' : 'lg:col-span-12'}`}>
            <SynopsisTextArea
              text={text}
              onChangeText={setText}
              words={words}
              isTooLong={isTooLong}
              isTooShort={isTooShort}
              hasGrammarAlert={hasGrammarAlert}
              mt={mt}
            />

            <SynopsisExportActions
              copied={copied}
              onCopy={() => copyPitchToClipboard(scriptTitle, comps, logline?.text || '', text, () => { setCopied(true); setTimeout(() => setCopied(false), 2000); })}
              onPrint={() => printPitchDocument(scriptTitle, targetLength, comps, logline?.text || '', text, words)}
              onEmail={() => emailPitchDraft(scriptTitle, comps, logline?.text || '', text)}
              onDownloadWord={() => downloadPitchWordDoc(scriptTitle, targetLength, comps, logline?.text || '', text)}
              onCancel={onClose}
              onSave={() => { onSaveSynopsis({ text, comps }); onClose(); }}
              mt={mt}
            />
          </div>

          {showTimelineDrawer && (
            <SynopsisTimelineDrawer
              cards={cards}
              heroJourney={heroJourney}
              onInsertBeat={(t, s) => setText((p) => (p ? `${p}\n\n${t}: ${s}` : `${t}: ${s}`))}
              mt={mt}
            />
          )}
        </div>
      </div>
    </div>
  );
};
