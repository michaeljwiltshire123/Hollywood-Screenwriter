import React, { useState, useEffect, useMemo, useCallback } from 'react';
import { Eye } from 'lucide-react';
import { GameScreenProps } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { generatePosterSlices, createShuffledBoard } from './slidingPosterArt';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';

export const SlidingPuzzleGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt }) => {
  const slices = useMemo(() => generatePosterSlices(), []);
  const [board, setBoard] = useState<(number | null)[]>(() => createShuffledBoard());
  const [moves, setMoves] = useState(0);
  const [peek, setPeek] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [ended, setEnded] = useState<'won' | 'timeout' | null>(null);

  const restart = useCallback(() => {
    setBoard(createShuffledBoard()); setMoves(0); setPeek(false); setTimeLeft(180); setEnded(null);
  }, []);

  useEffect(() => {
    if (ended) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded('timeout'), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [ended]);

  const slideTile = useCallback((idx: number) => {
    if (ended || idx < 0 || idx > 8) return;
    const empty = board.indexOf(null);
    const r0 = Math.floor(idx / 3), c0 = idx % 3, r1 = Math.floor(empty / 3), c1 = empty % 3;
    if (r0 !== r1 && c0 !== c1) return;
    const step = r0 === r1 ? Math.sign(c0 - c1) : Math.sign(r0 - r1) * 3;
    const next = [...board];
    for (let cur = empty; cur !== idx; cur += step) next[cur] = next[cur + step];
    next[idx] = null;
    playBeepSound(620, 0.05); setBoard(next); setMoves((m) => m + 1);
    if (next.every((v, i) => v === (i === 8 ? null : i))) { playBeepSound(880, 0.14); onGameWin(); setEnded('won'); }
  }, [ended, board, onGameWin]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const empty = board.indexOf(null), r = Math.floor(empty / 3), c = empty % 3;
      if (e.key === 'ArrowUp' && r < 2) { e.preventDefault(); slideTile((r + 1) * 3 + c); }
      if (e.key === 'ArrowDown' && r > 0) { e.preventDefault(); slideTile((r - 1) * 3 + c); }
      if (e.key === 'ArrowLeft' && c < 2) { e.preventDefault(); slideTile(r * 3 + c + 1); }
      if (e.key === 'ArrowRight' && c > 0) { e.preventDefault(); slideTile(r * 3 + c - 1); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [board, slideTile]);

  const shown = peek ? [0, 1, 2, 3, 4, 5, 6, 7, null] : board;
  return (
    <div className="space-y-3 select-none text-center w-full max-w-lg mx-auto">
      <div className="flex justify-between items-center text-xs font-bold px-1 tabular-nums">
        <span>Moves: {moves}</span>
        <button type="button" onPointerDown={() => setPeek(true)} onPointerUp={() => setPeek(false)} onPointerLeave={() => setPeek(false)} className="px-3 py-1.5 border rounded-lg flex items-center gap-1.5 text-xs cursor-pointer" style={mt.secondaryBtnStyle}>
          <Eye className="w-3.5 h-3.5" /><span>Hold to Peek</span>
        </button>
        <span>Time: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
      </div>
      <div className="p-5 border rounded-2xl flex flex-col items-center relative overflow-hidden" style={mt.cardStyle}>
        <div className="grid grid-cols-3 gap-2 p-2.5 rounded-xl border w-80 h-80 sm:w-[340px] sm:h-[340px]" style={mt.subCardStyle}>
          {shown.map((val, idx) => (
            <button key={idx} type="button" onClick={() => !peek && slideTile(idx)} className={`rounded-lg overflow-hidden flex items-center justify-center transition ${val === null ? 'border-2 border-dashed opacity-35' : 'cursor-pointer shadow hover:scale-[1.02] active:scale-95'}`} style={val === null ? mt.borderStyle : mt.secondaryBtnStyle}>
              {val !== null ? <img src={slices[val]} alt={`Poster tile ${val + 1}`} className="w-full h-full object-cover block pointer-events-none" /> : null}
            </button>
          ))}
        </div>
        {ended && <BreakGameEndOverlay title={ended === 'won' ? 'Poster Completed!' : "Time's Up!"} subtitle={`Completed in ${moves} moves`} onReplay={restart} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
