import React, { useState, useEffect, useMemo, useRef } from 'react';
import { ScreenplayDocument } from '../types';
import { extractCharacters } from '../lib/screenplayUtils';
import { ambientRoomTone } from '../lib/ambientSound';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';
import {
  getFilteredVoices, autoDetectCharacterTimbre, findBestVoiceForTimbre,
  classifyVoiceGender, resolveVoicePersona, TIMBRE_PRESETS, isFxTimbre,
} from '../lib/speechVoiceManager';
import { CharacterVoiceConfig } from '../lib/tableReadTypes';
import { speechEngine } from '../lib/speechEngine';
import { TableReadHeader } from './table_read/TableReadHeader';
import { TableReadControlsBar } from './table_read/TableReadControlsBar';
import { TableReadCastPanel } from './table_read/TableReadCastPanel';
import { TableReadScriptViewer } from './table_read/TableReadScriptViewer';
import { TableReadExportModal } from './table_read/TableReadExportModal';
import { useTableReadPlayback } from './table_read/useTableReadPlayback';

interface TableReadModalProps { isOpen: boolean; onClose: () => void; script: ScreenplayDocument; themeConfig?: AppThemeConfig; }

export const TableReadModal: React.FC<TableReadModalProps> = ({ isOpen, onClose, script, themeConfig }) => {
  const characterNames = useMemo(() => extractCharacters(script.elements).map((c) => c.name), [script.elements]);
  const [voices, setVoices] = useState(() => getFilteredVoices());
  useEffect(() => {
    if (!isOpen || typeof window === 'undefined' || !('speechSynthesis' in window)) return;
    setVoices(getFilteredVoices());
    const h = () => setVoices(getFilteredVoices());
    window.speechSynthesis.addEventListener?.('voiceschanged', h);
    return () => window.speechSynthesis.removeEventListener?.('voiceschanged', h);
  }, [isOpen]);

  const [speed, setSpeed] = useState(1.0);
  const [isDialogueOnly, setIsDialogueOnly] = useState(false);
  const [isSmartCadence, setIsSmartCadence] = useState(true);
  const [enableAmbientTone, setEnableAmbientTone] = useState(false);
  const [isExportOpen, setIsExportOpen] = useState(false);
  const [mutedCharacters, setMutedCharacters] = useState<Record<string, boolean>>({});
  const rateDebounceRef = useRef<number | null>(null);
  const [narratorVoice, setNarratorVoice] = useState<CharacterVoiceConfig>({ voiceURI: '', timbre: 'NARRATOR' });
  const [voiceMap, setVoiceMap] = useState<Record<string, CharacterVoiceConfig>>(() =>
    Object.fromEntries(characterNames.map((n, i) => {
      const t = autoDetectCharacterTimbre(n);
      return [n, { voiceURI: findBestVoiceForTimbre(voices.all, t, i), timbre: t }];
    }))
  );
  const { isPlaying, setIsPlaying, currentIndex, setCurrentIndex, wordBoundary, rehearsalSecondsLeft, advanceLine } =
    useTableReadPlayback({ isOpen, script, characterNames, mutedCharacters, voiceMap, narratorVoice, speed, isDialogueOnly, isSmartCadence });
  useEffect(() => {
    if (enableAmbientTone && isPlaying) ambientRoomTone.start(); else ambientRoomTone.stop();
    return () => ambientRoomTone.stop();
  }, [enableAmbientTone, isPlaying]);
  const handleSpeedChange = (s: number) => {
    setSpeed(s);
    if (rateDebounceRef.current) clearTimeout(rateDebounceRef.current);
    rateDebounceRef.current = window.setTimeout(() => speechEngine.updateLiveRate(s), 70);
  };

  const handleUpdateCharacterVoice = (name: string, update: Partial<CharacterVoiceConfig>, idx: number) => {
    setVoiceMap((prev) => {
      const cur = prev[name] || { voiceURI: '', timbre: 'MALE' };
      const next = { ...cur, ...update };
      if (update.timbre && !update.voiceURI) {
        const wantFem = update.timbre === 'FEMALE' || update.timbre === 'BABY' || update.timbre === 'CHIPMUNK';
        const p = resolveVoicePersona(cur.voiceURI);
        const sys = voices.all.find((v) => (v.voiceURI || v.name) === cur.voiceURI);
        if ((p ? p.gender === 'FEMALE' : sys ? classifyVoiceGender(sys) === 'FEMALE' : !wantFem) !== wantFem) {
          next.voiceURI = findBestVoiceForTimbre(voices.all, update.timbre, idx);
        }
      }
      return { ...prev, [name]: next };
    });
  };

  const handleTestVoice = (cfg: CharacterVoiceConfig, text: string, idx: number) => {
    setIsPlaying(false);
    const tDef = TIMBRE_PRESETS[cfg.timbre || 'NARRATOR'];
    const p = resolveVoicePersona(cfg.voiceURI);
    const fx = isFxTimbre(cfg.timbre);
    speechEngine.speak(text, { voiceURI: cfg.voiceURI, timbre: cfg.timbre, charOffset: idx, pitch: fx ? tDef.pitch : (p?.pitch ?? tDef.pitch), rate: fx ? speed : speed * tDef.rateMultiplier });
  };

  if (!isOpen) return null;
  const m = getModalTheme(themeConfig);
  return (
    <div className="fixed inset-x-0 top-28 bottom-0 backdrop-blur-md z-50 flex items-center justify-center p-3 font-mono" style={m.overlayStyle}>
      <div className="border rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[85vh] overflow-hidden" style={m.windowStyle}>
        <TableReadHeader m={m} isOnlineEngine={voices.onlineNatural.length > 0} enableAmbientTone={enableAmbientTone} onToggleAmbientTone={() => setEnableAmbientTone(!enableAmbientTone)} onOpenExport={() => setIsExportOpen(true)} onClose={() => { setIsPlaying(false); speechEngine.stop(); ambientRoomTone.stop(); onClose(); }} />
        <TableReadControlsBar m={m} isPlaying={isPlaying} onTogglePlay={() => setIsPlaying(!isPlaying)} onRestart={() => { setIsPlaying(false); setCurrentIndex(0); speechEngine.stop(); }} speed={speed} onChangeSpeed={handleSpeedChange} isDialogueOnly={isDialogueOnly} onToggleDialogueOnly={() => setIsDialogueOnly(!isDialogueOnly)} isSmartCadence={isSmartCadence} onToggleSmartCadence={() => setIsSmartCadence(!isSmartCadence)} currentIndex={currentIndex} totalElements={script.elements.length} />
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <TableReadCastPanel m={m} characterNames={characterNames} mutedCharacters={mutedCharacters} onToggleMute={(n) => setMutedCharacters((p) => ({ ...p, [n]: !p[n] }))} voiceMap={voiceMap} onUpdateCharacterVoice={handleUpdateCharacterVoice} narratorVoice={narratorVoice} onUpdateNarratorVoice={(u) => setNarratorVoice((p) => ({ ...p, ...u }))} onTestVoice={handleTestVoice} availableVoices={voices.all} />
          <TableReadScriptViewer elements={script.elements} currentIndex={currentIndex} mutedCharacters={mutedCharacters} wordBoundary={wordBoundary} rehearsalSecondsLeft={rehearsalSecondsLeft} onAdvanceLine={advanceLine} onSelectIndex={(idx) => { setCurrentIndex(idx); setIsPlaying(true); }} m={m} />
        </div>
      </div>
      <TableReadExportModal isOpen={isExportOpen} onClose={() => setIsExportOpen(false)} script={script} characterNames={characterNames} currentSpeed={speed} voiceMap={voiceMap} narratorVoice={narratorVoice} m={m} />
    </div>
  );
};
