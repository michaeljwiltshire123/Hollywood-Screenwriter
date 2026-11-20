import React, { useState, useEffect, useCallback } from 'react';
import { RefreshCw, Lightbulb } from 'lucide-react';
import { GameScreenProps, WordChoice } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { pickUnscrambleWords, scrambleLetters } from './wordUnscrambleData';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';

export const WordUnscrambleGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt, scriptWords }) => {
  const [words, setWords] = useState<WordChoice[]>(() => pickUnscrambleWords(scriptWords, 6));
  const [idx, setIdx] = useState(0);
  const current = words[idx], target = current.word;
  const [tiles, setTiles] = useState<string[]>(() => scrambleLetters(target));
  const [slotTile, setSlotTile] = useState<(number | null)[]>(() => Array(target.length).fill(null));
  const [locked, setLocked] = useState<boolean[]>(() => Array(target.length).fill(false));
  const [hintUsed, setHintUsed] = useState(false);
  const [timeLeft, setTimeLeft] = useState(180);
  const [ended, setEnded] = useState<'won' | 'timeout' | null>(null);

  const loadWord = useCallback((w: string) => { setTiles(scrambleLetters(w)); setSlotTile(Array(w.length).fill(null)); setLocked(Array(w.length).fill(false)); setHintUsed(false); }, []);
  const restart = () => { const f = pickUnscrambleWords(scriptWords, 6); setWords(f); setIdx(0); loadWord(f[0].word); setTimeLeft(180); setEnded(null); };
  useEffect(() => { if (ended) return; const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded('timeout'), 0) : p - 1)), 1000); return () => clearInterval(t); }, [ended]);

  const pickTile = useCallback((tileIdx: number) => {
    if (ended || slotTile.includes(tileIdx)) return;
    const empty = slotTile.findIndex((t, i) => !locked[i] && t === null);
    if (empty === -1) return;
    playBeepSound(580, 0.03); setSlotTile((p) => p.map((v, i) => (i === empty ? tileIdx : v)));
  }, [ended, slotTile, locked]);

  const submit = useCallback(() => {
    if (ended) return;
    const nextLocked = slotTile.map((ti, i) => locked[i] || (ti !== null && tiles[ti] === target[i]));
    setLocked(nextLocked); setSlotTile((p) => p.map((ti, i) => (nextLocked[i] ? ti : null)));
    if (nextLocked.every(Boolean)) {
      playBeepSound(850, 0.12);
      if (idx + 1 >= words.length) { onGameWin(); setEnded('won'); }
      else { setIdx(idx + 1); loadWord(words[idx + 1].word); }
    } else playBeepSound(260, 0.08);
  }, [ended, slotTile, locked, tiles, target, idx, words, onGameWin, loadWord]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (ended) return;
      if (e.key === 'Backspace') { e.preventDefault(); const i = slotTile.map((t, k) => (!locked[k] && t !== null ? k : -1)).filter((k) => k >= 0).pop(); if (i !== undefined) setSlotTile((p) => p.map((v, k) => (k === i ? null : v))); }
      else if (e.key === 'Enter') { e.preventDefault(); submit(); }
      else if (/^[a-zA-Z]$/.test(e.key)) { const ch = e.key.toUpperCase(); const ti = tiles.findIndex((t, k) => t === ch && !slotTile.includes(k)); if (ti !== -1) pickTile(ti); }
    };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [ended, slotTile, locked, tiles, pickTile, submit]);

  const useHint = () => {
    const open = locked.findIndex((ok) => !ok);
    if (hintUsed || ended || open === -1) return;
    const ti = tiles.findIndex((t, k) => t === target[open] && (!slotTile.includes(k) || (slotTile.findIndex((s) => s === k) !== open && !locked[slotTile.findIndex((s) => s === k)])));
    if (ti === -1) return;
    playBeepSound(720, 0.08); setLocked((l) => l.map((v, i) => (i === open ? true : v)));
    setSlotTile((p) => p.map((v, i) => (i === open ? ti : v === ti ? null : v))); setHintUsed(true);
  };

  const shuffleTiles = () => {
    const lockedMap = new Map<number, string>();
    locked.forEach((ok, si) => { if (ok && slotTile[si] !== null) lockedMap.set(si, tiles[slotTile[si]!]); });
    const fresh = scrambleLetters(target); setTiles(fresh);
    const used = new Set<number>();
    setSlotTile(locked.map((ok, si) => { if (!ok) return null; const ni = fresh.findIndex((f, k) => f === lockedMap.get(si) && !used.has(k)); used.add(ni); return ni; }));
  };

  const usedSet = new Set(slotTile.filter((t): t is number => t !== null));
  return (
    <div className="space-y-3 select-none w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center text-xs font-bold px-1 tabular-nums"><span>Word {idx + 1} / {words.length}</span><span>Time: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span></div>
      <div className="p-6 border rounded-2xl space-y-5 text-center relative overflow-hidden" style={mt.cardStyle}>
        <div className="flex items-center justify-between gap-3">
          <div className="flex gap-1.5 flex-1">{words.map((_, i) => <div key={i} className="h-1.5 flex-1 rounded-full transition" style={i <= idx ? mt.primaryBtnStyle : mt.subCardStyle} />)}</div>
          <span className="text-[11px] font-bold tracking-wide shrink-0" style={current.origin === 'bank' ? mt.mutedStyle : mt.accentStyle}>{current.origin === 'bank' ? 'Screenwriting Term' : `★ From your script · ${current.origin}`}</span>
        </div>
        <div className="flex flex-wrap justify-center gap-2 py-2">
          {slotTile.map((ti, i) => (
            <button key={i} type="button" onClick={() => !locked[i] && ti !== null && setSlotTile((p) => p.map((v, k) => (k === i ? null : v)))} className={`w-11 h-12 rounded-xl border-2 font-mono font-black text-lg flex items-center justify-center transition ${locked[i] ? 'bg-emerald-600 text-white border-emerald-500 shadow-xs' : 'cursor-pointer hover:opacity-90'}`} style={locked[i] ? undefined : mt.inputStyle}>{ti !== null ? tiles[ti] : ''}</button>
          ))}
        </div>
        <div className="flex flex-wrap justify-center gap-2 p-3 rounded-xl border" style={mt.subCardStyle}>
          {tiles.map((ch, i) => <button key={i} type="button" disabled={usedSet.has(i)} onClick={() => pickTile(i)} className={`w-11 h-11 rounded-xl border font-mono font-bold text-base transition shadow-xs ${usedSet.has(i) ? 'opacity-15 cursor-default' : 'cursor-pointer hover:scale-105 active:scale-95'}`} style={mt.secondaryBtnStyle}>{ch}</button>)}
        </div>
        <div className="flex gap-2.5 pt-1">
          <button type="button" onClick={submit} className="flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer shadow-xs" style={mt.primaryBtnStyle}>Check Guess</button>
          <button type="button" onClick={shuffleTiles} className="px-4 py-2.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-85" style={mt.secondaryBtnStyle}><RefreshCw className="w-3.5 h-3.5" /><span>Shuffle</span></button>
          <button type="button" disabled={hintUsed} onClick={useHint} className="px-4 py-2.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-40 hover:opacity-85" style={mt.secondaryBtnStyle}><Lightbulb className="w-3.5 h-3.5" /><span>Hint</span></button>
        </div>
        {ended && <BreakGameEndOverlay title={ended === 'won' ? 'All Words Unscrambled!' : "Time's Up!"} subtitle={`Solved ${ended === 'won' ? words.length : idx} / ${words.length} words`} onReplay={restart} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
