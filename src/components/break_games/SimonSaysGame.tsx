import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameScreenProps } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';

const TONES = [261.6, 329.6, 392.0, 523.2];
const PADS = [
  { bg: '#DC2626', rounded: 'rounded-tl-[100px] rounded-tr-xl rounded-bl-xl rounded-br-sm', label: 'Red (1)' },
  { bg: '#D97706', rounded: 'rounded-tr-[100px] rounded-tl-xl rounded-br-xl rounded-bl-sm', label: 'Amber (2)' },
  { bg: '#059669', rounded: 'rounded-bl-[100px] rounded-tl-xl rounded-br-xl rounded-tr-sm', label: 'Green (3)' },
  { bg: '#2563EB', rounded: 'rounded-br-[100px] rounded-tr-xl rounded-bl-xl rounded-tl-sm', label: 'Blue (4)' },
];

export const SimonSaysGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt }) => {
  const [seq, setSeq] = useState<number[]>(() => [Math.floor(Math.random() * 4)]);
  const [userIdx, setUserIdx] = useState(0);
  const [playingBack, setPlayingBack] = useState(true);
  const [litPad, setLitPad] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [ended, setEnded] = useState<'mistake' | 'timeout' | null>(null);
  const timerRef = useRef<number[]>([]);

  const clearTimers = () => { timerRef.current.forEach(clearTimeout); timerRef.current = []; };

  const playSequence = useCallback((s: number[]) => {
    clearTimers(); setPlayingBack(true); setUserIdx(0);
    s.forEach((pad, i) => {
      timerRef.current.push(window.setTimeout(() => { setLitPad(pad); playBeepSound(TONES[pad], 0.16); }, 420 + i * 540));
      timerRef.current.push(window.setTimeout(() => setLitPad(null), 740 + i * 540));
    });
    timerRef.current.push(window.setTimeout(() => setPlayingBack(false), 480 + s.length * 540));
  }, []);

  useEffect(() => { playSequence(seq); return clearTimers; }, [seq, playSequence]);
  useEffect(() => {
    if (ended) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded('timeout'), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [ended]);

  const handlePad = useCallback((pad: number) => {
    if (playingBack || ended) return;
    setLitPad(pad); setTimeout(() => setLitPad(null), 160);
    if (pad !== seq[userIdx]) { playBeepSound(140, 0.25); setEnded('mistake'); return; }
    playBeepSound(TONES[pad], 0.12);
    if (userIdx + 1 >= seq.length) {
      if (seq.length >= 4) onGameWin();
      setPlayingBack(true);
      timerRef.current.push(window.setTimeout(() => setSeq((prev) => [...prev, Math.floor(Math.random() * 4)]), 480));
    } else setUserIdx((u) => u + 1);
  }, [playingBack, ended, seq, userIdx, onGameWin]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (['1', '2', '3', '4'].includes(e.key)) handlePad(Number(e.key) - 1); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [handlePad]);

  return (
    <div className="space-y-3 select-none text-center w-full max-w-lg mx-auto">
      <div className="flex justify-between items-center text-xs font-bold px-1 tabular-nums"><span>Round {seq.length}</span><span>Time: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span></div>
      <div className="p-6 border rounded-2xl flex flex-col items-center relative overflow-hidden" style={mt.cardStyle}>
        <div className="relative grid grid-cols-2 gap-3 w-72 h-72 sm:w-80 sm:h-80">
          {PADS.map((p, id) => (
            <button key={id} type="button" onPointerDown={() => handlePad(id)} disabled={playingBack} aria-label={p.label}
              className={`${p.rounded} transition-all duration-100 cursor-pointer border-2 ${litPad === id ? 'scale-95 brightness-150 ring-4 ring-white/80' : 'opacity-80 hover:opacity-95'}`}
              style={{ backgroundColor: p.bg, borderColor: mt.theme.borders }}
            />
          ))}
          <div className="absolute inset-0 m-auto w-20 h-20 rounded-full border-2 flex flex-col items-center justify-center shadow-lg pointer-events-none" style={mt.windowStyle}>
            <span className="text-lg font-black tabular-nums">{seq.length}</span>
            <span className="text-[10px] uppercase font-bold opacity-75">{playingBack ? 'Watch' : 'Go!'}</span>
          </div>
        </div>
        {ended && <BreakGameEndOverlay title={ended === 'mistake' ? 'Wrong Pattern!' : "Time's Up!"} subtitle={`Reached Round ${seq.length}`} onReplay={() => { setEnded(null); setTimeLeft(120); setSeq([Math.floor(Math.random() * 4)]); }} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
