import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Mic, Sliders, Radio } from 'lucide-react';
import { ScreenplayDocument } from '../types';
import { extractCharacters } from '../lib/screenplayUtils';
import { speechEngine, assignCharacterVoices } from '../lib/speechEngine';
import { ambientRoomTone } from '../lib/ambientSound';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';

interface TableReadModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScreenplayDocument;
  themeConfig?: AppThemeConfig;
}

export const TableReadModal: React.FC<TableReadModalProps> = ({ isOpen, onClose, script, themeConfig }) => {
  const characters = extractCharacters(script.elements);
  const characterNames = characters.map((c) => c.name);
  const [mutedCharacters, setMutedCharacters] = useState<Record<string, boolean>>({});
  const [voiceMap] = useState<Record<string, { pitch: number; rate: number; voiceIndex: number }>>(() =>
    assignCharacterVoices(characterNames)
  );
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [readSpeed, setReadSpeed] = useState(1.0);
  const [enableAmbientTone, setEnableAmbientTone] = useState(false);
  const [, setCharHighlightPos] = useState<number>(0);
  const activeElementRef = useRef<HTMLDivElement | null>(null);

  const toggleMute = (name: string) => setMutedCharacters((prev) => ({ ...prev, [name]: !prev[name] }));

  useEffect(() => {
    if (enableAmbientTone && isPlaying) ambientRoomTone.start();
    else ambientRoomTone.stop();
    return () => ambientRoomTone.stop();
  }, [enableAmbientTone, isPlaying]);

  useEffect(() => {
    if (!isOpen || !isPlaying) return;
    if (currentIndex >= script.elements.length) { setIsPlaying(false); setCurrentIndex(0); return; }

    const currentElem = script.elements[currentIndex];
    const textToSpeak = currentElem.content;
    let activeCharName = '';
    if (currentElem.type === 'CHARACTER') activeCharName = currentElem.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
    else if (currentElem.type === 'DIALOGUE' && currentIndex > 0) {
      const prev = script.elements[currentIndex - 1];
      if (prev?.type === 'CHARACTER') activeCharName = prev.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
    }

    const isMuted = activeCharName && mutedCharacters[activeCharName];
    if (isMuted && currentElem.type === 'DIALOGUE') {
      const timer = setTimeout(() => { if (isPlaying) setCurrentIndex((prev) => prev + 1); }, 4000);
      return () => clearTimeout(timer);
    }
    if (!textToSpeak.trim()) { setCurrentIndex((prev) => prev + 1); return; }

    const voiceConfig = activeCharName && voiceMap[activeCharName] ? voiceMap[activeCharName] : { pitch: 1.0, rate: readSpeed, voiceIndex: 0 };
    speechEngine.speak(textToSpeak, {
      pitch: voiceConfig.pitch,
      rate: readSpeed,
      voiceIndex: voiceConfig.voiceIndex,
      onBoundary: (pos) => setCharHighlightPos(pos),
      onEnd: () => { if (isPlaying) setCurrentIndex((prev) => prev + 1); },
    });
    return () => speechEngine.stop();
  }, [currentIndex, isPlaying, isOpen, script.elements, mutedCharacters, readSpeed, voiceMap]);

  useEffect(() => {
    activeElementRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
  }, [currentIndex]);

  const handleClose = () => { setIsPlaying(false); speechEngine.stop(); ambientRoomTone.stop(); onClose(); };
  if (!isOpen) return null;

  const m = getModalTheme(themeConfig);

  return (
    <div className="fixed inset-x-0 top-28 bottom-0 backdrop-blur-md z-50 flex items-center justify-center p-3 font-mono" style={m.overlayStyle}>
      <div className="border rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col max-h-[85vh] overflow-hidden" style={m.windowStyle}>
        <div className="p-4 border-b flex items-center justify-between shrink-0" style={m.headerStyle}>
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 animate-pulse" style={m.accentStyle} />
            <div>
              <h2 className="font-bold text-sm uppercase" style={m.accentStyle}>Table Read & Rehearsal Studio</h2>
              <p className="text-[10px]" style={m.mutedStyle}>Read-aloud with character mute for live actor rehearsal (100% Free Web Speech)</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setEnableAmbientTone(!enableAmbientTone)}
              className="px-3 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer hover:opacity-90"
              style={enableAmbientTone ? m.primaryBtnStyle : m.secondaryBtnStyle}
              title="Toggle soft studio room tone"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{enableAmbientTone ? 'Room Tone ON' : 'Room Tone OFF'}</span>
            </button>
            <button onClick={handleClose} className="p-1 rounded opacity-70 hover:opacity-100 cursor-pointer"><X className="w-5 h-5" /></button>
          </div>
        </div>

        <div className="p-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0" style={m.cardStyle}>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 font-extrabold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer hover:opacity-90"
              style={m.primaryBtnStyle}
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
              <span>{isPlaying ? 'PAUSE' : 'START TABLE READ'}</span>
            </button>
            <button
              onClick={() => { setIsPlaying(false); setCurrentIndex(0); speechEngine.stop(); }}
              className="px-3 py-2 border rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:opacity-85"
              style={m.secondaryBtnStyle}
            >
              <RotateCcw className="w-3.5 h-3.5" style={m.accentStyle} />
              <span>Restart</span>
            </button>
          </div>
          <div className="flex items-center gap-4 text-xs">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5" style={m.accentStyle} />
              <span>Speed:</span>
              <input
                type="range" min={0.8} max={1.5} step={0.1} value={readSpeed}
                onChange={(e) => setReadSpeed(parseFloat(e.target.value))}
                className="w-20 cursor-pointer"
                style={{ accentColor: m.theme.accentButtons }}
              />
              <span className="font-bold w-8" style={m.accentStyle}>{readSpeed}x</span>
            </div>
            <div className="text-[11px] font-bold" style={m.mutedStyle}>Element {currentIndex + 1} / {script.elements.length}</div>
          </div>
        </div>

        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          <div className="w-full md:w-64 border-b md:border-b-0 md:border-r p-3 overflow-y-auto space-y-3 shrink-0" style={m.subCardStyle}>
            <div className="flex items-center gap-1.5 text-xs font-bold uppercase" style={m.accentStyle}>
              <Mic className="w-4 h-4" />
              <span>Character Rehearsal</span>
            </div>
            <p className="text-[10px] leading-relaxed" style={m.mutedStyle}>
              Mute your character to read their lines live while the app speaks the rest of the cast!
            </p>
            <div className="space-y-2 pt-1">
              {characterNames.length === 0 ? (
                <div className="text-xs italic" style={m.mutedStyle}>No characters detected yet.</div>
              ) : (
                characterNames.map((char) => {
                  const isMuted = !!mutedCharacters[char];
                  return (
                    <div key={char} className="p-2 border rounded-lg flex items-center justify-between" style={m.cardStyle}>
                      <span className="font-bold text-xs truncate max-w-[110px]">{char}</span>
                      <button
                        onClick={() => toggleMute(char)}
                        className="px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer border"
                        style={isMuted ? { backgroundColor: '#BE123C', borderColor: '#BE123C', color: '#FFFFFF' } : m.headerStyle}
                      >
                        {isMuted ? <VolumeX className="w-3 h-3" /> : <Volume2 className="w-3 h-3" style={m.accentStyle} />}
                        <span>{isMuted ? 'MUTED' : 'LIVE'}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="flex-1 p-6 overflow-y-auto space-y-4">
            {script.elements.map((elem, idx) => {
              const isActive = idx === currentIndex;
              let activeCharName = '';
              if (elem.type === 'CHARACTER') activeCharName = elem.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
              else if (elem.type === 'DIALOGUE' && idx > 0) {
                const prev = script.elements[idx - 1];
                if (prev?.type === 'CHARACTER') activeCharName = prev.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
              }
              const isMuted = activeCharName && mutedCharacters[activeCharName];

              return (
                <div
                  key={elem.id}
                  ref={isActive ? activeElementRef : null}
                  onClick={() => { setCurrentIndex(idx); setIsPlaying(true); }}
                  className={`p-3 rounded-xl border transition cursor-pointer ${isActive ? 'shadow-lg ring-2' : 'hover:opacity-95'}`}
                  style={
                    isActive
                      ? { ...m.headerStyle, borderColor: isMuted ? '#E11D48' : m.theme.accentButtons, outline: `2px solid ${isMuted ? '#E11D48' : m.theme.accentButtons}` }
                      : m.cardStyle
                  }
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
                    <span style={isActive ? m.accentStyle : m.mutedStyle}>{elem.type}</span>
                    {isActive && isMuted && <span className="text-rose-500 font-extrabold animate-bounce">YOUR TURN TO READ ALOUD! 🎙️</span>}
                  </div>
                  <p className={`font-mono text-sm leading-relaxed ${isActive ? 'font-semibold' : ''}`}>{elem.content}</p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
