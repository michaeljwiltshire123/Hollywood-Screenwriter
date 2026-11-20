import React, { useState, useEffect, useCallback } from 'react';
import { GameScreenProps } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { SudokuDifficulty, SUDOKU_MODES, SudokuPuzzle, generateSudoku, hasConflict } from './miniSudokuGen';
import { SudokuBoardGrid } from './SudokuBoardGrid';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';

const DIFFS: SudokuDifficulty[] = ['Easy', 'Medium', 'Hard'];

export const MiniSudokuGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt }) => {
  const [diff, setDiff] = useState<SudokuDifficulty | null>(null);
  const [puzzle, setPuzzle] = useState<SudokuPuzzle>(() => generateSudoku('Easy'));
  const [sel, setSel] = useState<[number, number] | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [ended, setEnded] = useState<'won' | 'timeout' | null>(null);

  const startMode = useCallback((d: SudokuDifficulty) => {
    setDiff(d); setPuzzle(generateSudoku(d));
    setSel(null); setTimeLeft(SUDOKU_MODES[d].time); setEnded(null);
  }, []);

  useEffect(() => {
    if (!diff || ended) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded('timeout'), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [diff, ended]);

  const setNum = useCallback((num: number) => {
    if (!sel || ended) return;
    const [r, c] = sel;
    if (puzzle.fixed[r][c]) return;
    playBeepSound(num ? 620 : 340, 0.05);
    const nextBoard = puzzle.board.map((row, ri) => row.map((v, ci) => (ri === r && ci === c ? num : v)));
    setPuzzle((prev) => ({ ...prev, board: nextBoard }));
    if (nextBoard.every((row, ri) => row.every((v, ci) => v > 0 && !hasConflict(nextBoard, ri, ci, puzzle.boxR, puzzle.boxC)))) {
      playBeepSound(880, 0.14); onGameWin(); setEnded('won');
    }
  }, [sel, ended, puzzle.fixed, puzzle.board, puzzle.boxR, puzzle.boxC, onGameWin]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (!diff || ended) return;
      if (/^[1-9]$/.test(e.key) && Number(e.key) <= puzzle.size) setNum(Number(e.key));
      else if (e.key === 'Backspace' || e.key === 'Delete' || e.key === '0') setNum(0);
      else if (sel && ['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) {
        e.preventDefault();
        const [r, c] = sel, n = puzzle.size;
        const dr = e.key === 'ArrowUp' ? -1 : e.key === 'ArrowDown' ? 1 : 0;
        const dc = e.key === 'ArrowLeft' ? -1 : e.key === 'ArrowRight' ? 1 : 0;
        setSel([(r + dr + n) % n, (c + dc + n) % n]);
      }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [diff, ended, puzzle.size, sel, setNum]);

  if (!diff) {
    return (
      <div className="p-6 sm:p-8 border rounded-2xl text-center space-y-5 w-full" style={mt.cardStyle}>
        <div className="font-bold text-base">Choose Sudoku Difficulty</div>
        <div className="grid grid-cols-3 gap-3">
          {DIFFS.map((d) => {
            const { size, time } = SUDOKU_MODES[d];
            return (
              <button key={d} type="button" onClick={() => startMode(d)} className="py-4 px-3 rounded-xl border font-bold text-xs sm:text-sm cursor-pointer space-y-1 transition hover:opacity-90" style={mt.primaryBtnStyle}>
                <div>{d}</div>
                <div className="text-[11px] opacity-85">{size}×{size} · {time / 60}m</div>
              </button>
            );
          })}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-2.5 select-none text-center w-full">
      <div className="flex justify-between items-center text-xs sm:text-sm font-bold px-1 tabular-nums"><span>{diff} {puzzle.size}×{puzzle.size}</span><span>Time: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span></div>
      <div className="p-3 sm:p-4 border rounded-2xl flex flex-col items-center gap-3 relative overflow-hidden" style={mt.cardStyle}>
        <SudokuBoardGrid puzzle={puzzle} sel={sel} onSelect={setSel} mt={mt} />
        <div className="flex flex-wrap justify-center gap-1.5 sm:gap-2">
          {Array.from({ length: puzzle.size }, (_, i) => i + 1).map((n) => (
            <button key={n} type="button" onClick={() => setNum(n)} className="w-9 h-10 sm:w-10 sm:h-11 rounded-xl border font-bold text-sm sm:text-base cursor-pointer" style={mt.secondaryBtnStyle}>{n}</button>
          ))}
          <button type="button" onClick={() => setNum(0)} className="px-3.5 h-10 sm:h-11 rounded-xl border font-bold text-xs cursor-pointer" style={mt.secondaryBtnStyle}>Clear</button>
        </div>
        {ended && <BreakGameEndOverlay title={ended === 'won' ? 'Sudoku Solved!' : "Time's Up!"} onReplay={() => setDiff(null)} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
