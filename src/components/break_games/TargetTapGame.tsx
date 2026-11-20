import React, { useEffect, useRef, useState, useCallback } from 'react';
import { GameScreenProps } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';
import { Orb, TargetFx, TARGET_W, TARGET_H, spawnOrb, renderTargetArena } from './targetTapRender';

const makeState = (now: number) => ({
  good: Array.from({ length: 4 }, () => spawnOrb(false, now)) as Orb[],
  decoys: [spawnOrb(true, now), spawnOrb(true, now)] as Orb[],
  fx: [] as TargetFx[], combo: 0, won: false,
});

export const TargetTapGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt }) => {
  const [score, setScore] = useState(0);
  const [combo, setCombo] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [ended, setEnded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const st = useRef(makeState(performance.now()));
  const mtRef = useRef(mt); mtRef.current = mt;

  const restart = useCallback(() => {
    st.current = makeState(performance.now());
    setScore(0); setCombo(0); setTimeLeft(60); setEnded(false);
  }, []);

  useEffect(() => {
    if (ended) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded(true), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [ended]);

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let id: number, last = performance.now();
    const loop = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.667); last = now;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(TARGET_W * dpr)) { canvas.width = Math.round(TARGET_W * dpr); canvas.height = Math.round(TARGET_H * dpr); }
      ctx.setTransform(canvas.width / TARGET_W, 0, 0, canvas.height / TARGET_H, 0, 0);
      renderTargetArena(ctx, st.current.good, st.current.decoys, st.current.fx, mtRef.current.theme.accentButtons, ended, now, dt);
      id = requestAnimationFrame(loop);
    };
    id = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(id);
  }, [ended]);

  const handleTap = (e: React.PointerEvent<HTMLCanvasElement>) => {
    if (ended || !canvasRef.current) return;
    const now = performance.now(), rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * TARGET_W, y = ((e.clientY - rect.top) / rect.height) * TARGET_H;
    const gIdx = st.current.good.findIndex((t) => (x - t.x) ** 2 + (y - t.y) ** 2 <= (t.r + 5) ** 2);
    if (gIdx !== -1) {
      const hit = st.current.good[gIdx]; st.current.good[gIdx] = spawnOrb(false, now);
      const nextCombo = st.current.combo + 1; st.current.combo = nextCombo; setCombo(nextCombo);
      const pts = 10 + Math.min(20, (nextCombo - 1) * 5);
      playBeepSound(620 + Math.min(6, nextCombo) * 55, 0.08);
      st.current.fx.push({ x: hit.x, y: hit.y, text: nextCombo > 1 ? `+${pts} ×${nextCombo}` : `+${pts}`, color: mt.theme.accentText, t: now });
      setScore((s) => { const n = s + pts; if (n >= 100 && !st.current.won) { st.current.won = true; onGameWin(); } return n; });
      return;
    }
    const dIdx = st.current.decoys.findIndex((t) => (x - t.x) ** 2 + (y - t.y) ** 2 <= (t.r + 3) ** 2);
    st.current.combo = 0; setCombo(0); playBeepSound(190, 0.12);
    if (dIdx !== -1) {
      const hit = st.current.decoys[dIdx]; st.current.decoys[dIdx] = spawnOrb(true, now);
      st.current.fx.push({ x: hit.x, y: hit.y, text: '-15', color: '#DC2626', t: now });
      setScore((s) => Math.max(0, s - 15));
    }
  };

  return (
    <div className="space-y-3 select-none w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center text-xs font-bold px-1 tabular-nums">
        <span>Score: {score} {combo > 1 ? `· ×${combo}` : ''}</span><span>Tap ★ · Avoid Red ✕</span><span>Time: {timeLeft}s</span>
      </div>
      <div className="p-2 border rounded-2xl relative overflow-hidden flex items-center justify-center touch-none" style={mt.cardStyle}>
        <canvas ref={canvasRef} onPointerDown={handleTap} className="w-full max-w-[480px] aspect-[360/260] cursor-crosshair block" />
        {ended && <BreakGameEndOverlay title={`Time's Up! Score: ${score}`} subtitle="Goal: 100+ points" onReplay={restart} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
