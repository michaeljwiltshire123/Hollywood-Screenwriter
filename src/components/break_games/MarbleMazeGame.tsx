import React, { useState, useEffect, useCallback, useRef } from 'react';
import { SkipForward, ChevronUp, ChevronDown, ChevronLeft, ChevronRight } from 'lucide-react';
import { GameScreenProps } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { generateSlideMaze, slidePos, MazeLevel } from './marbleMazeGen';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';

const CELL = 36;

export const MarbleMazeGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt }) => {
  const [maze, setMaze] = useState<MazeLevel>(() => generateSlideMaze(9));
  const [pos, setPos] = useState(() => maze.start);
  const [level, setLevel] = useState(1);
  const [moves, setMoves] = useState(0);
  const [timeLeft, setTimeLeft] = useState(120);
  const [ended, setEnded] = useState(false);
  const swipeStart = useRef<{ x: number; y: number } | null>(null);

  const loadNext = useCallback((nextLvl: number) => {
    const m = generateSlideMaze(9);
    setMaze(m); setPos(m.start); setLevel(nextLvl); setMoves(0);
  }, []);

  useEffect(() => {
    if (ended) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded(true), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [ended]);

  const move = useCallback((dr: number, dc: number) => {
    if (ended) return;
    const nxt = slidePos(maze.grid, pos.r, pos.c, dr, dc, maze.goal);
    if (nxt.r === pos.r && nxt.c === pos.c) { playBeepSound(200, 0.04); return; }
    playBeepSound(540, 0.05); setPos(nxt); setMoves((m) => m + 1);
    if (nxt.r === maze.goal.r && nxt.c === maze.goal.c) {
      playBeepSound(880, 0.12);
      if (level >= 3) onGameWin();
      setTimeout(() => loadNext(level + 1), 200);
    }
  }, [ended, maze, pos, level, onGameWin, loadNext]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'ArrowUp' || e.key === 'w') { e.preventDefault(); move(-1, 0); }
      if (e.key === 'ArrowDown' || e.key === 's') { e.preventDefault(); move(1, 0); }
      if (e.key === 'ArrowLeft' || e.key === 'a') { e.preventDefault(); move(0, -1); }
      if (e.key === 'ArrowRight' || e.key === 'd') { e.preventDefault(); move(0, 1); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [move]);

  const handleSwipeEnd = (e: React.PointerEvent) => {
    if (!swipeStart.current) return;
    const dx = e.clientX - swipeStart.current.x, dy = e.clientY - swipeStart.current.y;
    swipeStart.current = null;
    if (Math.max(Math.abs(dx), Math.abs(dy)) < 18) return;
    if (Math.abs(dx) > Math.abs(dy)) move(0, dx > 0 ? 1 : -1);
    else move(dy > 0 ? 1 : -1, 0);
  };

  const padBtn = 'w-11 h-11 border rounded-xl flex items-center justify-center cursor-pointer transition active:scale-95 shadow-xs hover:opacity-85';
  return (
    <div className="space-y-3 select-none w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center text-xs font-bold px-1 tabular-nums">
        <span>Level {level} · Moves: {moves}</span>
        <span>Time: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
      </div>
      <div className="p-4 border rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-6 relative overflow-hidden" style={mt.cardStyle}>
        <div onPointerDown={(e) => { swipeStart.current = { x: e.clientX, y: e.clientY }; }} onPointerUp={handleSwipeEnd}
          className="relative p-1.5 rounded-xl border-2 touch-none cursor-grab active:cursor-grabbing shadow-inner shrink-0" style={{ ...mt.subCardStyle, width: 9 * CELL + 16, height: 9 * CELL + 16 }}>
          <div className="grid grid-cols-9">
            {maze.grid.flatMap((row, r) => row.map((cell, c) => (
              <div key={`${r}-${c}`} style={{ width: CELL, height: CELL, backgroundColor: cell === 1 ? mt.theme.primaryText : 'transparent', borderColor: cell === 1 ? mt.theme.borders : 'rgba(128,128,128,0.12)' }}
                className={`flex items-center justify-center ${cell === 1 ? 'opacity-90 border-[0.5px]' : 'border-[0.5px]'}`}>
                {r === maze.goal.r && c === maze.goal.c && <span className="w-5 h-5 rounded-full bg-emerald-500/20 border-2 border-emerald-500 flex items-center justify-center text-[11px] text-emerald-500 animate-pulse">★</span>}
              </div>
            )))}
          </div>
          <div className="absolute rounded-full shadow-md transition-all duration-150 ease-out pointer-events-none"
            style={{ width: CELL - 8, height: CELL - 8, left: 8 + pos.c * CELL + 4, top: 8 + pos.r * CELL + 4, background: `radial-gradient(circle at 32% 28%, #FFFFFF, ${mt.theme.accentButtons})` }} />
        </div>
        <div className="flex sm:flex-col items-center gap-4">
          <div className="grid grid-cols-3 gap-1.5">
            <div /><button type="button" aria-label="Up" onClick={() => move(-1, 0)} className={padBtn} style={mt.secondaryBtnStyle}><ChevronUp className="w-5 h-5" /></button><div />
            <button type="button" aria-label="Left" onClick={() => move(0, -1)} className={padBtn} style={mt.secondaryBtnStyle}><ChevronLeft className="w-5 h-5" /></button>
            <button type="button" aria-label="Down" onClick={() => move(1, 0)} className={padBtn} style={mt.secondaryBtnStyle}><ChevronDown className="w-5 h-5" /></button>
            <button type="button" aria-label="Right" onClick={() => move(0, 1)} className={padBtn} style={mt.secondaryBtnStyle}><ChevronRight className="w-5 h-5" /></button>
          </div>
          <button type="button" onClick={() => loadNext(level + 1)} className="px-4 py-2 border rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer shadow-xs hover:opacity-85" style={mt.secondaryBtnStyle}>
            <SkipForward className="w-3.5 h-3.5" /><span>Skip Level</span>
          </button>
        </div>
        {ended && <BreakGameEndOverlay title={`Time's Up! Reached Level ${level}`} onReplay={() => { loadNext(1); setTimeLeft(120); setEnded(false); }} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
