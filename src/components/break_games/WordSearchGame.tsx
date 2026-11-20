import React, { useState, useEffect, useCallback } from 'react';
import { GameScreenProps } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { generateWordSearch, getLineCells, WordSearchPuzzle } from './wordSearchGen';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';

const FOUND_COLORS = ['#059669', '#2563EB', '#D97706', '#7C3AED', '#DB2777'];

export const WordSearchGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt, scriptWords }) => {
  const [puzzle, setPuzzle] = useState<WordSearchPuzzle>(() => generateWordSearch(8, 5, scriptWords));
  const [foundWords, setFoundWords] = useState<string[]>([]);
  const [cellColors, setCellColors] = useState<Record<string, string>>({});
  const [dragStart, setDragStart] = useState<[number, number] | null>(null);
  const [dragCells, setDragCells] = useState<[number, number][]>([]);
  const [timeLeft, setTimeLeft] = useState(120);
  const [ended, setEnded] = useState<'won' | 'timeout' | null>(null);

  const restart = useCallback(() => {
    setPuzzle(generateWordSearch(8, 5, scriptWords)); setFoundWords([]); setCellColors({});
    setDragStart(null); setDragCells([]); setTimeLeft(120); setEnded(null);
  }, [scriptWords]);

  useEffect(() => {
    if (ended) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded('timeout'), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [ended]);

  const finishDrag = useCallback(() => {
    if (!dragStart || dragCells.length < 2) { setDragStart(null); setDragCells([]); return; }
    const forward = dragCells.map(([r, c]) => puzzle.grid[r][c]).join('');
    const reverse = forward.split('').reverse().join('');
    const matched = puzzle.words.find((w) => !foundWords.includes(w.word) && (w.word === forward || w.word === reverse));
    if (matched) {
      playBeepSound(780, 0.1);
      const col = FOUND_COLORS[foundWords.length % FOUND_COLORS.length];
      const nextWords = [...foundWords, matched.word];
      const nextColors = { ...cellColors };
      dragCells.forEach(([r, c]) => { nextColors[`${r}-${c}`] = col; });
      setFoundWords(nextWords); setCellColors(nextColors);
      if (nextWords.length >= puzzle.words.length) { onGameWin(); setEnded('won'); }
    } else playBeepSound(240, 0.05);
    setDragStart(null); setDragCells([]);
  }, [dragStart, dragCells, puzzle, foundWords, cellColors, onGameWin]);

  const handleTouchMove = (e: React.PointerEvent) => {
    if (!dragStart) return;
    const el = document.elementFromPoint(e.clientX, e.clientY) as HTMLElement | null;
    const cell = el?.dataset?.cell;
    if (!cell) return;
    const [r, c] = cell.split('-').map(Number);
    setDragCells(getLineCells(dragStart[0], dragStart[1], r, c));
  };

  const activeSet = new Set(dragCells.map(([r, c]) => `${r}-${c}`));
  const preview = dragCells.map(([r, c]) => puzzle.grid[r][c]).join('');

  return (
    <div className="space-y-3 select-none w-full max-w-xl mx-auto" onPointerUp={finishDrag}>
      <div className="flex justify-between items-center text-xs font-bold px-1 tabular-nums">
        <span>Found: {foundWords.length} / {puzzle.words.length}</span>
        <span className="font-mono tracking-widest text-sm" style={mt.accentStyle}>{preview || 'DRAG TO SELECT'}</span>
        <span>Time: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
      </div>
      <div className="p-4 border rounded-2xl flex flex-col sm:flex-row items-center justify-center gap-5 relative overflow-hidden" style={mt.cardStyle}>
        <div onPointerMove={handleTouchMove} className="grid grid-cols-8 gap-1.5 w-full max-w-[360px] p-2.5 rounded-xl border touch-none shrink-0" style={mt.subCardStyle}>
          {puzzle.grid.map((row, r) => row.map((ch, c) => {
            const key = `${r}-${c}`, isSel = activeSet.has(key), foundCol = cellColors[key];
            return (
              <button key={key} type="button" data-cell={key} onPointerDown={() => { setDragStart([r, c]); setDragCells([[r, c]]); }}
                className="aspect-square w-full rounded-lg font-mono font-black text-sm flex items-center justify-center cursor-pointer transition"
                style={isSel ? mt.primaryBtnStyle : foundCol ? { backgroundColor: foundCol, color: '#FFFFFF', borderColor: foundCol } : mt.secondaryBtnStyle}
              >{ch}</button>
            );
          }))}
        </div>
        <div className="flex sm:flex-col flex-wrap gap-2.5 justify-center sm:min-w-[130px] text-xs font-bold">
          {puzzle.words.map((item) => (
            <span key={item.word} title={item.origin === 'bank' ? undefined : `From your script · ${item.origin}`}
              className={`px-3 py-1.5 rounded-lg border text-center ${foundWords.includes(item.word) ? 'line-through opacity-45' : ''}`}
              style={foundWords.includes(item.word) ? { ...mt.subCardStyle, ...mt.mutedStyle } : { ...mt.subCardStyle, ...mt.accentStyle }}
            >{item.origin === 'bank' ? item.word : `★ ${item.word}`}</span>
          ))}
        </div>
        {ended && <BreakGameEndOverlay title={ended === 'won' ? 'All Hidden Words Found!' : "Time's Up!"} subtitle={`Found ${foundWords.length} / ${puzzle.words.length} words`} onReplay={restart} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
