import React, { useState, useEffect, useRef } from 'react';
import { X, Play, Pause, RotateCcw, Volume2, VolumeX, Mic, FastForward, Sliders, Radio } from 'lucide-react';
import { ScreenplayDocument } from '../types';
import { extractCharacters } from '../lib/screenplayUtils';
import { speechEngine, assignCharacterVoices } from '../lib/speechEngine';
import { ambientRoomTone } from '../lib/ambientSound';

interface TableReadModalProps {
  isOpen: boolean;
  onClose: () => void;
  script: ScreenplayDocument;
}

export const TableReadModal: React.FC<TableReadModalProps> = ({ isOpen, onClose, script }) => {
  const characters = extractCharacters(script.elements);
  const characterNames = characters.map((c) => c.name);

  // Muted state for character rehearsal
  const [mutedCharacters, setMutedCharacters] = useState<Record<string, boolean>>({});
  const [voiceMap, setVoiceMap] = useState<Record<string, { pitch: number; rate: number; voiceIndex: number }>>(() =>
    assignCharacterVoices(characterNames)
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [readSpeed, setReadSpeed] = useState(1.0);
  const [enableAmbientTone, setEnableAmbientTone] = useState(false);
  const [charHighlightPos, setCharHighlightPos] = useState<number>(0);
  const activeElementRef = useRef<HTMLDivElement | null>(null);

  // Toggle character mute
  const toggleMute = (name: string) => {
    setMutedCharacters((prev) => ({ ...prev, [name]: !prev[name] }));
  };

  // Toggle ambient room tone
  useEffect(() => {
    if (enableAmbientTone && isPlaying) {
      ambientRoomTone.start();
    } else {
      ambientRoomTone.stop();
    }
    return () => ambientRoomTone.stop();
  }, [enableAmbientTone, isPlaying]);

  // Handle step speech synthesis
  useEffect(() => {
    if (!isOpen || !isPlaying) return;

    if (currentIndex >= script.elements.length) {
      setIsPlaying(false);
      setCurrentIndex(0);
      return;
    }

    const currentElem = script.elements[currentIndex];
    const textToSpeak = currentElem.content;

    // Check if character is muted for rehearsal
    let activeCharName = '';
    if (currentElem.type === 'CHARACTER') {
      activeCharName = currentElem.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
    } else if (currentElem.type === 'DIALOGUE' && currentIndex > 0) {
      const prev = script.elements[currentIndex - 1];
      if (prev?.type === 'CHARACTER') {
        activeCharName = prev.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
      }
    }

    const isMuted = activeCharName && mutedCharacters[activeCharName];

    if (isMuted && currentElem.type === 'DIALOGUE') {
      // Muted character rehearsal prompt: wait 4 seconds then auto-advance
      const timer = setTimeout(() => {
        if (isPlaying) {
          setCurrentIndex((prev) => prev + 1);
        }
      }, 4000);
      return () => clearTimeout(timer);
    }

    if (!textToSpeak.trim()) {
      setCurrentIndex((prev) => prev + 1);
      return;
    }

    const voiceConfig = activeCharName && voiceMap[activeCharName] ? voiceMap[activeCharName] : { pitch: 1.0, rate: readSpeed, voiceIndex: 0 };

    speechEngine.speak(textToSpeak, {
      pitch: voiceConfig.pitch,
      rate: readSpeed,
      voiceIndex: voiceConfig.voiceIndex,
      onBoundary: (pos) => setCharHighlightPos(pos),
      onEnd: () => {
        if (isPlaying) {
          setCurrentIndex((prev) => prev + 1);
        }
      },
    });

    return () => speechEngine.stop();
  }, [currentIndex, isPlaying, isOpen, script.elements, mutedCharacters, readSpeed, voiceMap]);

  // Scroll active element into view
  useEffect(() => {
    if (activeElementRef.current) {
      activeElementRef.current.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
  }, [currentIndex]);

  const handleClose = () => {
    setIsPlaying(false);
    speechEngine.stop();
    ambientRoomTone.stop();
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-slate-950/90 backdrop-blur-md z-50 flex items-center justify-center p-3 font-mono text-slate-100">
      <div className="bg-slate-900 border border-slate-800 rounded-2xl shadow-2xl max-w-4xl w-full flex flex-col h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="p-4 bg-slate-950 border-b border-slate-800 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3">
            <Radio className="w-5 h-5 text-amber-400 animate-pulse" />
            <div>
              <h2 className="font-bold text-sm uppercase text-amber-300">Table Read & Rehearsal Studio</h2>
              <p className="text-[10px] text-slate-400">Read-aloud with character mute for live actor rehearsal (100% Free Web Speech)</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setEnableAmbientTone(!enableAmbientTone)}
              className={`px-3 py-1.5 rounded-full text-xs font-bold border transition flex items-center gap-1.5 cursor-pointer ${
                enableAmbientTone ? 'bg-emerald-500/20 border-emerald-500 text-emerald-300' : 'bg-slate-800 border-slate-700 text-slate-400'
              }`}
              title="Toggle soft studio room tone"
            >
              <Volume2 className="w-3.5 h-3.5" />
              <span>{enableAmbientTone ? 'Room Tone ON' : 'Room Tone OFF'}</span>
            </button>
            <button onClick={handleClose} className="p-1 hover:bg-slate-800 rounded text-slate-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Control Toolbar */}
        <div className="p-3 bg-slate-950/80 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2">
            <button
              onClick={() => setIsPlaying(!isPlaying)}
              className="px-4 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-extrabold rounded-xl text-xs flex items-center gap-2 transition cursor-pointer"
            >
              {isPlaying ? <Pause className="w-4 h-4 fill-slate-950" /> : <Play className="w-4 h-4 fill-slate-950" />}
              <span>{isPlaying ? 'PAUSE' : 'START TABLE READ'}</span>
            </button>

            <button
              onClick={() => {
                setIsPlaying(false);
                setCurrentIndex(0);
                speechEngine.stop();
              }}
              className="px-3 py-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5 text-amber-400" />
              <span>Restart</span>
            </button>
          </div>

          <div className="flex items-center gap-4 text-xs text-slate-300">
            <div className="flex items-center gap-2">
              <Sliders className="w-3.5 h-3.5 text-sky-400" />
              <span>Speed:</span>
              <input
                type="range"
                min={0.8}
                max={1.5}
                step={0.1}
                value={readSpeed}
                onChange={(e) => setReadSpeed(parseFloat(e.target.value))}
                className="w-20 accent-amber-400 cursor-pointer"
              />
              <span className="font-bold text-amber-300 w-8">{readSpeed}x</span>
            </div>

            <div className="text-[11px] font-bold text-slate-400">
              Element {currentIndex + 1} / {script.elements.length}
            </div>
          </div>
        </div>

        {/* Main Body */}
        <div className="flex-1 flex flex-col md:flex-row overflow-hidden">
          {/* Character Mute / Voice Sidebar */}
          <div className="w-full md:w-64 bg-slate-950 border-b md:border-b-0 md:border-r border-slate-800 p-3 overflow-y-auto space-y-3 shrink-0">
            <div className="flex items-center gap-1.5 text-xs font-bold text-amber-300 uppercase">
              <Mic className="w-4 h-4 text-amber-400" />
              <span>Character Rehearsal</span>
            </div>
            <p className="text-[10px] text-slate-400 leading-relaxed">
              Mute your character to read their lines live while the app speaks the rest of the cast!
            </p>

            <div className="space-y-2 pt-1">
              {characterNames.length === 0 ? (
                <div className="text-xs text-slate-500 italic">No characters detected yet.</div>
              ) : (
                characterNames.map((char) => {
                  const isMuted = !!mutedCharacters[char];
                  return (
                    <div key={char} className="p-2 bg-slate-900 border border-slate-800 rounded-lg flex items-center justify-between">
                      <span className="font-bold text-xs truncate max-w-[110px] text-slate-200">{char}</span>
                      <button
                        onClick={() => toggleMute(char)}
                        className={`px-2.5 py-1 rounded text-[10px] font-bold flex items-center gap-1 transition cursor-pointer ${
                          isMuted
                            ? 'bg-rose-500/20 text-rose-300 border border-rose-500/50'
                            : 'bg-slate-800 text-slate-400 hover:text-white border border-slate-700'
                        }`}
                      >
                        {isMuted ? <VolumeX className="w-3 h-3 text-rose-400" /> : <Volume2 className="w-3 h-3 text-emerald-400" />}
                        <span>{isMuted ? 'MUTED' : 'LIVE'}</span>
                      </button>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          {/* Karaoke Screenplay View */}
          <div className="flex-1 bg-slate-900/60 p-6 overflow-y-auto space-y-4">
            {script.elements.map((elem, idx) => {
              const isActive = idx === currentIndex;
              let activeCharName = '';
              if (elem.type === 'CHARACTER') {
                activeCharName = elem.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
              } else if (elem.type === 'DIALOGUE' && idx > 0) {
                const prev = script.elements[idx - 1];
                if (prev?.type === 'CHARACTER') {
                  activeCharName = prev.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '');
                }
              }

              const isMuted = activeCharName && mutedCharacters[activeCharName];

              return (
                <div
                  key={elem.id}
                  ref={isActive ? activeElementRef : null}
                  onClick={() => {
                    setCurrentIndex(idx);
                    setIsPlaying(true);
                  }}
                  className={`p-3 rounded-xl border transition cursor-pointer ${
                    isActive
                      ? isMuted
                        ? 'bg-rose-950/80 border-rose-500/80 shadow-lg ring-2 ring-rose-400'
                        : 'bg-amber-950/80 border-amber-400 shadow-lg ring-2 ring-amber-400'
                      : 'bg-slate-950/40 border-slate-800/60 hover:bg-slate-900 text-slate-400'
                  }`}
                >
                  <div className="flex items-center justify-between text-[10px] font-bold uppercase mb-1">
                    <span className={isActive ? 'text-amber-300' : 'text-slate-500'}>{elem.type}</span>
                    {isActive && isMuted && <span className="text-rose-400 font-extrabold animate-bounce">YOUR TURN TO READ ALOUD! 🎙️</span>}
                  </div>

                  <p className={`font-mono text-sm leading-relaxed ${isActive ? 'text-white font-semibold' : 'text-slate-300'}`}>
                    {elem.content}
                  </p>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
