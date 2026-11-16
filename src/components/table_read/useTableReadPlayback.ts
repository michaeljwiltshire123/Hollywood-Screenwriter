import { useState, useEffect, useRef, useCallback } from 'react';
import { ScreenplayDocument } from '../../types';
import { speechEngine } from '../../lib/speechEngine';
import { CharacterVoiceConfig, WordBoundary } from '../../lib/tableReadTypes';
import { calculateRehearsalGapSeconds } from '../../lib/rehearsalGapTimer';
import { TIMBRE_PRESETS, resolveVoicePersona, isFxTimbre } from '../../lib/speechVoiceManager';

interface PlaybackProps {
  isOpen: boolean;
  script: ScreenplayDocument;
  characterNames: string[];
  mutedCharacters: Record<string, boolean>;
  voiceMap: Record<string, CharacterVoiceConfig>;
  narratorVoice: CharacterVoiceConfig;
  speed: number;
  isDialogueOnly: boolean;
  isSmartCadence: boolean;
}

export function useTableReadPlayback({
  isOpen, script, characterNames, mutedCharacters, voiceMap, narratorVoice, speed, isDialogueOnly, isSmartCadence,
}: PlaybackProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [wordBoundary, setWordBoundary] = useState<WordBoundary | null>(null);
  const [rehearsalSecondsLeft, setRehearsalSecondsLeft] = useState(0);
  const timerRef = useRef<number | null>(null);
  const speedRef = useRef(speed);
  useEffect(() => { speedRef.current = speed; }, [speed]);

  const advanceLine = useCallback(() => {
    if (timerRef.current) clearInterval(timerRef.current);
    speechEngine.stop();
    setWordBoundary(null);
    setCurrentIndex((prev) => (prev + 1 < script.elements.length ? prev + 1 : 0));
  }, [script.elements.length]);

  useEffect(() => {
    if (!isOpen) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.code === 'Space' && isPlaying && rehearsalSecondsLeft > 0) { e.preventDefault(); advanceLine(); }
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [isOpen, isPlaying, rehearsalSecondsLeft, advanceLine]);

  useEffect(() => {
    if (!isOpen || !isPlaying) { speechEngine.stop(); return; }
    if (currentIndex >= script.elements.length) { setIsPlaying(false); setCurrentIndex(0); return; }

    const elem = script.elements[currentIndex];
    if (isDialogueOnly && !['CHARACTER', 'PARENTICAL', 'DIALOGUE'].includes(elem.type)) { setCurrentIndex((p) => p + 1); return; }
    if (elem.type === 'CHARACTER') { setCurrentIndex((p) => (p + 1 < script.elements.length ? p + 1 : 0)); return; }

    let charName = '';
    for (let i = currentIndex - 1; i >= 0; i--) {
      if (script.elements[i].type === 'CHARACTER') {
        charName = script.elements[i].content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '').replace(/DUAL/gi, '').trim();
        break;
      }
      if (script.elements[i].type !== 'PARENTICAL') break;
    }

    if (charName && mutedCharacters[charName] && elem.type === 'DIALOGUE') {
      const totalSec = calculateRehearsalGapSeconds(elem.content);
      setRehearsalSecondsLeft(totalSec);
      const start = Date.now();
      timerRef.current = window.setInterval(() => {
        const left = Math.max(0, totalSec - (Date.now() - start) / 1000);
        setRehearsalSecondsLeft(left);
        if (left <= 0) { clearInterval(timerRef.current!); advanceLine(); }
      }, 100);
      return () => { if (timerRef.current) clearInterval(timerRef.current); };
    }
    if (!elem.content?.trim()) { setCurrentIndex((p) => p + 1); return; }

    const cfg = charName ? voiceMap[charName] || { voiceURI: '', timbre: 'MALE' } : narratorVoice;
    const timbreDef = TIMBRE_PRESETS[cfg.timbre || 'NARRATOR'];
    const persona = resolveVoicePersona(cfg.voiceURI);
    const fxMode = isFxTimbre(cfg.timbre);
    const rate = speedRef.current * (fxMode ? 1.0 : timbreDef?.rateMultiplier || 1.0) * (isSmartCadence && elem.type === 'ACTION' ? 1.12 : 1.0);

    speechEngine.speak(elem.content, {
      pitch: isFxTimbre(cfg.timbre) ? timbreDef.pitch : (persona?.pitch ?? timbreDef.pitch),
      rate,
      voiceURI: cfg.voiceURI,
      timbre: cfg.timbre,
      charOffset: charName ? Math.max(0, characterNames.indexOf(charName)) : 0,
      isParenthetical: elem.type === 'PARENTICAL',
      onBoundary: (charIndex, charLength) => setWordBoundary({ charIndex, charLength: charLength || 5 }),
      onEnd: () => { setWordBoundary(null); setCurrentIndex((p) => p + 1); },
    });
    return () => speechEngine.stop();
  }, [currentIndex, isPlaying, isOpen, script.elements, characterNames, mutedCharacters, voiceMap, narratorVoice, isDialogueOnly, isSmartCadence, advanceLine]);

  return { isPlaying, setIsPlaying, currentIndex, setCurrentIndex, wordBoundary, rehearsalSecondsLeft, advanceLine };
}
