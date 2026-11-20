import React, { useState, useEffect, useCallback } from 'react';
import { GameScreenProps } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';

type Difficulty = 'Easy' | 'Medium' | 'Hard';
const ICONS = ['🎬', '🎥', '🎟️', '🍿', '🏆', '⭐'];
const MODES: { id: Difficulty; hint: string; delay: number; peek: number }[] = [
  { id: 'Easy', hint: '2s Preview', delay: 800, peek: 2000 },
  { id: 'Medium', hint: '0.8s Peek', delay: 520, peek: 800 },
  { id: 'Hard', hint: 'No Peek', delay: 300, peek: 0 },
];

const buildDeck = () => [...ICONS, ...ICONS].sort(() => Math.random() - 0.5).map((icon, id) => ({ id, icon, flipped: false, matched: false }));

export const MemoryMatchGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt }) => {
  const [diff, setDiff] = useState<Difficulty | null>(null);
  const [cards, setCards] = useState(buildDeck);
  const [sel, setSel] = useState<number[]>([]);
  const [moves, setMoves] = useState(0);
  const [streak, setStreak] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [ended, setEnded] = useState<'won' | 'timeout' | null>(null);

  const startGame = useCallback((d: Difficulty) => {
    const mode = MODES.find((m) => m.id === d)!;
    const deck = buildDeck();
    setDiff(d); setSel([]); setMoves(0); setStreak(0); setTimeLeft(60); setEnded(null);
    if (mode.peek > 0) {
      setCards(deck.map((c) => ({ ...c, flipped: true })));
      setTimeout(() => setCards((prev) => prev.map((c) => ({ ...c, flipped: false }))), mode.peek);
    } else setCards(deck);
  }, []);

  useEffect(() => {
    if (!diff || ended) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded('timeout'), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [diff, ended]);

  const handleCardClick = (id: number) => {
    if (!diff || ended || sel.length >= 2 || cards[id].flipped || cards[id].matched) return;
    playBeepSound(520, 0.05);
    const next = cards.map((c) => (c.id === id ? { ...c, flipped: true } : c));
    const nextSel = [...sel, id];
    setCards(next); setSel(nextSel);
    if (nextSel.length === 2) {
      setMoves((m) => m + 1);
      const [a, b] = nextSel, delay = MODES.find((m) => m.id === diff)!.delay;
      if (next[a].icon === next[b].icon) {
        playBeepSound(780 + streak * 60, 0.1); setStreak((s) => s + 1);
        const matched = next.map((c) => (c.id === a || c.id === b ? { ...c, matched: true } : c));
        setCards(matched); setSel([]);
        if (matched.every((c) => c.matched)) { onGameWin(); setEnded('won'); }
      } else {
        setStreak(0);
        setTimeout(() => { setCards((p) => p.map((c) => (c.id === a || c.id === b ? { ...c, flipped: false } : c))); setSel([]); }, delay);
      }
    }
  };

  if (!diff) {
    return (
      <div className="p-8 border rounded-2xl text-center space-y-5 w-full max-w-lg mx-auto" style={mt.cardStyle}>
        <div className="font-bold text-base">Select Difficulty (60s)</div>
        <div className="grid grid-cols-3 gap-3">
          {MODES.map((m) => (
            <button key={m.id} onClick={() => startGame(m.id)} className="py-4 px-3 rounded-xl border font-bold text-sm cursor-pointer space-y-1" style={mt.primaryBtnStyle}>
              <div>{m.id}</div><div className="text-[11px] opacity-80 font-normal">{m.hint}</div>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3 select-none text-center w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center text-xs font-bold px-1 tabular-nums">
        <span>{diff} · Moves: {moves} {streak > 1 ? `· ×${streak}` : ''}</span><span>Time: {timeLeft}s</span>
      </div>
      <div className="p-5 border rounded-2xl grid grid-cols-4 gap-3 relative overflow-hidden" style={mt.cardStyle}>
        {cards.map((c) => (
          <button key={c.id} onClick={() => handleCardClick(c.id)} className={`h-22 sm:h-24 rounded-xl text-3xl flex items-center justify-center border font-bold transition-transform duration-200 cursor-pointer shadow ${c.flipped || c.matched ? 'scale-100' : 'hover:scale-[1.03]'} ${c.matched ? 'opacity-65 ring-2 ring-emerald-500/60' : ''}`} style={c.flipped || c.matched ? mt.windowStyle : mt.primaryBtnStyle}>
            {c.flipped || c.matched ? c.icon : '✦'}
          </button>
        ))}
        {ended && <BreakGameEndOverlay title={ended === 'won' ? 'All 6 Pairs Matched!' : "Time's Up!"} subtitle={`Completed in ${moves} moves`} onReplay={() => setDiff(null)} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
