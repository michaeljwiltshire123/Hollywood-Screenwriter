import React, { useState, useEffect, useCallback, useRef } from 'react';
import { GameScreenProps } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { loadFullTriviaPool, pickTriviaQuestions, TriviaQuestion } from './triviaData';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';

const KEYS = ['A', 'B', 'C', 'D'];

export const TriviaBlitzGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt }) => {
  const [pool, setPool] = useState<TriviaQuestion[] | null>(null);
  const [questions, setQuestions] = useState<TriviaQuestion[]>([]);
  const [idx, setIdx] = useState(0);
  const [score, setScore] = useState(0);
  const [selected, setSelected] = useState<number | null>(null);
  const [timeLeft, setTimeLeft] = useState(120);
  const [ended, setEnded] = useState<'won' | 'timeout' | null>(null);
  const timerRef = useRef<number | null>(null);

  useEffect(() => {
    let alive = true;
    loadFullTriviaPool().then((loaded) => {
      if (!alive) return;
      setPool(loaded);
      setQuestions(pickTriviaQuestions(4, loaded));
    });
    return () => { alive = false; if (timerRef.current) clearTimeout(timerRef.current); };
  }, []);

  const restart = useCallback(() => {
    if (timerRef.current) { clearTimeout(timerRef.current); timerRef.current = null; }
    setQuestions(pickTriviaQuestions(4, pool ?? undefined));
    setIdx(0); setScore(0); setSelected(null); setTimeLeft(120); setEnded(null);
  }, [pool]);

  useEffect(() => {
    if (ended || questions.length === 0) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded('timeout'), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [ended, questions.length]);

  const handleAnswer = useCallback((optionIdx: number) => {
    if (selected !== null || ended || !questions[idx]) return;
    setSelected(optionIdx);
    const correct = optionIdx === questions[idx].answer;
    if (correct) { playBeepSound(800, 0.1); setScore((s) => s + 1); }
    else playBeepSound(220, 0.12);
    timerRef.current = window.setTimeout(() => {
      timerRef.current = null;
      setSelected(null);
      if (idx + 1 >= questions.length) { onGameWin(); setEnded('won'); }
      else setIdx((i) => i + 1);
    }, 700);
  }, [selected, ended, questions, idx, onGameWin]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => { if (['1', '2', '3', '4'].includes(e.key)) handleAnswer(Number(e.key) - 1); };
    window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey);
  }, [handleAnswer]);

  const curr = questions[idx];
  if (!curr) {
    return (
      <div className="w-full p-8 border rounded-2xl text-center text-sm font-bold" style={{ ...mt.cardStyle, ...mt.mutedStyle }}>
        Loading cinema question bank...
      </div>
    );
  }

  return (
    <div className="space-y-2.5 select-none w-full">
      <div className="flex justify-between items-center text-xs sm:text-sm font-bold px-1 tabular-nums">
        <span>Question {idx + 1} / 4 · Score: {score}</span><span>Time: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span>
      </div>
      <div className="flex gap-1.5 px-1">{questions.map((_, i) => <div key={i} className="h-1.5 flex-1 rounded-full transition" style={i <= idx ? mt.primaryBtnStyle : mt.subCardStyle} />)}</div>
      <div className="p-4 sm:p-5 border rounded-2xl space-y-4 relative overflow-hidden" style={mt.cardStyle}>
        <div className="space-y-1 text-center">
          {curr.cat && <div className="text-xs font-bold uppercase tracking-wider" style={mt.accentStyle}>{curr.cat}</div>}
          <h4 className="text-lg sm:text-xl font-bold leading-snug">{curr.q}</h4>
        </div>
        <div className="grid grid-cols-1 gap-2.5">
          {curr.options.map((opt, i) => {
            const stateClass = selected === null ? '' : i === curr.answer ? 'bg-emerald-600 text-white border-emerald-500' : i === selected ? 'bg-rose-600 text-white border-rose-500' : 'opacity-55';
            return (
              <button key={i} type="button" onClick={() => handleAnswer(i)} className={`p-3.5 border rounded-xl text-sm font-semibold leading-snug transition cursor-pointer text-left flex items-center gap-3 ${stateClass}`} style={selected === null || (i !== curr.answer && i !== selected) ? mt.secondaryBtnStyle : undefined}>
                <span className="w-7 h-7 rounded-lg border flex items-center justify-center text-xs font-bold shrink-0" style={mt.borderStyle}>{KEYS[i]}</span>
                <span>{opt}</span>
              </button>
            );
          })}
        </div>
        {ended && <BreakGameEndOverlay title={ended === 'won' ? 'Trivia Complete!' : "Time's Up!"} subtitle={`You scored ${score} / 4`} onReplay={restart} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
