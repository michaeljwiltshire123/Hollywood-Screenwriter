import React, { useState, useEffect, useCallback, useRef } from 'react';
import { Lightbulb, SkipForward } from 'lucide-react';
import { GameScreenProps } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { loadFullEmojiPool, pickEmojiMovies, checkEmojiGuess, formatTitlePattern, EmojiMovie } from './emojiMoviesData';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';

export const EmojiPlotterGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt }) => {
  const [pool, setPool] = useState<EmojiMovie[] | null>(null);
  const [movies, setMovies] = useState<EmojiMovie[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [guess, setGuess] = useState('');
  const [showClue, setShowClue] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [feedback, setFeedback] = useState<{ text: string; ok: boolean } | null>(null);
  const [shake, setShake] = useState(false);
  const [timeLeft, setTimeLeft] = useState(120);
  const [ended, setEnded] = useState<'won' | 'timeout' | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    loadFullEmojiPool().then((loaded) => {
      if (!alive) return;
      setPool(loaded); setMovies(pickEmojiMovies(5, loaded));
    });
    return () => { alive = false; if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const restart = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setMovies(pickEmojiMovies(5, pool ?? undefined)); setIdx(0); setScore(0);
    setGuess(''); setShowClue(false); setRevealed(false); setFeedback(null); setTimeLeft(120); setEnded(null);
  }, [pool]);

  useEffect(() => {
    if (ended || movies.length === 0) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded('timeout'), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [ended, movies.length]);

  const advance = useCallback((scored: boolean) => {
    if (scored) setScore((s) => s + 1);
    setGuess(''); setShowClue(false); setRevealed(false); setFeedback(null);
    if (idx + 1 >= movies.length) { onGameWin(); setEnded('won'); }
    else setIdx((i) => i + 1);
  }, [idx, movies.length, onGameWin]);

  const handleSkip = () => {
    if (ended || !movies[idx]) return;
    if (revealed) { if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; } advance(false); return; }
    if (timerRef.current) return;
    playBeepSound(300, 0.09); setRevealed(true);
    setFeedback({ text: `Answer: ${movies[idx].title}`, ok: false });
    timerRef.current = window.setTimeout(() => { timerRef.current = null; advance(false); }, 1800);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (ended || !movies[idx] || revealed || timerRef.current || !guess.trim()) return;
    const match = checkEmojiGuess(guess, movies[idx].title);
    if (match === 'exact') { playBeepSound(850, 0.12); advance(true); return; }
    if (match === 'fuzzy') {
      playBeepSound(850, 0.12); setRevealed(true);
      setFeedback({ text: `Accepted: ${movies[idx].title}`, ok: true });
      timerRef.current = window.setTimeout(() => { timerRef.current = null; advance(true); }, 850);
      return;
    }
    playBeepSound(220, 0.12); setShake(true); setTimeout(() => setShake(false), 300);
    setFeedback(match === 'close' ? { text: 'So close! Check spelling or tap Clue.', ok: false } : null);
  };

  const curr = movies[idx];
  if (!curr) return <div className="w-full p-8 border rounded-2xl text-center text-sm font-bold" style={{ ...mt.cardStyle, ...mt.mutedStyle }}>Loading film &amp; TV emoji bank...</div>;

  return (
    <div className="space-y-3 select-none w-full">
      <div className="flex justify-between items-center text-xs sm:text-sm font-bold px-1 tabular-nums"><span>Title {idx + 1} / 5 · Score: {score}</span><span>Time: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span></div>
      <div className="p-5 border rounded-2xl space-y-4 text-center relative overflow-hidden" style={mt.cardStyle}>
        <div className="text-xs font-bold uppercase tracking-wider" style={mt.accentStyle}>{curr.type === 'TV' ? 'TV Show' : 'Film'}</div>
        <div className="text-6xl py-1 tracking-wider">{curr.emojis}</div>
        <div className="font-mono text-sm sm:text-base tracking-[0.18em] font-bold opacity-90">{revealed ? curr.title : formatTitlePattern(curr.title, showClue)}</div>
        {showClue && <div className="text-xs sm:text-sm italic" style={mt.mutedStyle}>Clue: {curr.clue}</div>}
        {feedback && <div className={`text-xs sm:text-sm font-bold ${feedback.ok ? 'text-emerald-500' : ''}`} style={feedback.ok ? undefined : mt.accentStyle}>{feedback.text}</div>}
        <form onSubmit={handleSubmit} className="space-y-3">
          <input type="text" value={guess} onChange={(e) => setGuess(e.target.value)} disabled={revealed} placeholder="Type film or TV title (spelling is forgiving)..." className={`w-full border rounded-xl p-3.5 text-center font-bold text-sm uppercase transition ${shake ? 'border-rose-500' : ''}`} style={mt.inputStyle} />
          <div className="flex gap-2.5">
            <button type="submit" disabled={revealed} className="flex-1 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider cursor-pointer disabled:opacity-50" style={mt.primaryBtnStyle}>Submit</button>
            <button type="button" disabled={revealed} onClick={() => setShowClue(true)} className="px-4 py-2.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer disabled:opacity-50" style={mt.secondaryBtnStyle}><Lightbulb className="w-3.5 h-3.5" /><span>Clue</span></button>
            <button type="button" onClick={handleSkip} className="px-4 py-2.5 border rounded-xl text-xs font-bold flex items-center gap-1.5 cursor-pointer" style={mt.secondaryBtnStyle}><SkipForward className="w-3.5 h-3.5" /><span>{revealed ? 'Next' : 'Skip'}</span></button>
          </div>
        </form>
        {ended && <BreakGameEndOverlay title={ended === 'won' ? 'All 5 Titles Complete!' : "Time's Up!"} subtitle={`Guessed ${score} / 5`} onReplay={restart} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
