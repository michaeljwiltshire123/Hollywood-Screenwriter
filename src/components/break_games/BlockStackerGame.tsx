import React, { useEffect, useRef, useState, useCallback } from 'react';
import { ArrowDown } from 'lucide-react';
import { GameScreenProps } from './breakGameTypes';
import { playBeepSound } from './breakAudio';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';
import { StackerState, drawStackerFrame } from './blockStackerRender';

const SCALE = [523, 587, 659, 698, 784, 880, 987, 1046];
const initState = (): StackerState => ({
  stack: [{ x: 90, width: 120 }], debris: [], currentX: 0, currentWidth: 120,
  dir: 1, speed: 2.6, camY: 0, flash: 0, perfectStreak: 0, gameOver: false,
});

export const BlockStackerGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt }) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const [gameOver, setGameOver] = useState(false);
  const [score, setScore] = useState(0);
  const [height, setHeight] = useState(1);
  const [timeLeft, setTimeLeft] = useState(180);
  const st = useRef<StackerState>(initState());
  const mtRef = useRef(mt); mtRef.current = mt;

  const dropBlock = useCallback(() => {
    const s = st.current;
    if (s.gameOver) return;
    const top = s.stack[s.stack.length - 1], curY = 288 - 30 - s.stack.length * 24 + s.camY;
    const perfect = Math.abs(s.currentX - top.x) <= 4;
    const left = perfect ? top.x : Math.max(s.currentX, top.x);
    const right = perfect ? top.x + top.width : Math.min(s.currentX + s.currentWidth, top.x + top.width);
    const newWidth = right - left;
    if (newWidth <= 0) {
      playBeepSound(180, 0.16); s.debris.push({ x: s.currentX, y: curY, w: s.currentWidth, vy: 1.5, alpha: 1 });
      s.gameOver = true; setGameOver(true); return;
    }
    if (perfect) { s.perfectStreak += 1; s.flash = 1; playBeepSound(SCALE[Math.min(SCALE.length - 1, s.perfectStreak - 1)], 0.12); }
    else {
      s.perfectStreak = 0; playBeepSound(480 + s.stack.length * 16, 0.08);
      if (s.currentX < left) s.debris.push({ x: s.currentX, y: curY, w: left - s.currentX, vy: 1, alpha: 1 });
      if (s.currentX + s.currentWidth > right) s.debris.push({ x: right, y: curY, w: s.currentX + s.currentWidth - right, vy: 1, alpha: 1 });
    }
    s.stack.push({ x: left, width: newWidth });
    s.currentWidth = newWidth; s.currentX = s.dir > 0 ? 300 - newWidth : 0; s.dir *= -1;
    s.speed = Math.min(8.5, s.speed * 1.055);
    setScore((sc) => sc + (perfect ? 50 : 25)); setHeight(s.stack.length);
    if (s.stack.length === 8) onGameWin();
  }, [onGameWin]);

  useEffect(() => {
    if (gameOver) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? ((st.current.gameOver = true), setGameOver(true), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [gameOver]);

  useEffect(() => {
    const canvas = canvasRef.current, ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return;
    let id: number, last = performance.now();
    const render = (now: number) => {
      const dt = Math.min(2.5, (now - last) / 16.667); last = now;
      const dpr = Math.min(2, window.devicePixelRatio || 1);
      if (canvas.width !== Math.round(300 * dpr)) { canvas.width = Math.round(300 * dpr); canvas.height = Math.round(288 * dpr); }
      ctx.setTransform(canvas.width / 300, 0, 0, canvas.height / 288, 0, 0);
      drawStackerFrame(ctx, st.current, mtRef.current.theme.accentButtons, mtRef.current.theme.isDark, dt);
      id = requestAnimationFrame(render);
    };
    id = requestAnimationFrame(render);
    return () => cancelAnimationFrame(id);
  }, []);

  useEffect(() => {
    const k = (e: KeyboardEvent) => { if (e.code === 'Space') { e.preventDefault(); dropBlock(); } };
    window.addEventListener('keydown', k); return () => window.removeEventListener('keydown', k);
  }, [dropBlock]);

  const restart = () => { st.current = initState(); setGameOver(false); setScore(0); setHeight(1); setTimeLeft(180); };

  return (
    <div className="space-y-3 text-center select-none w-full max-w-lg mx-auto">
      <div className="flex justify-between items-center text-xs font-bold px-1 tabular-nums" style={mt.mutedStyle}><span>Score: {score}</span><span>Height: {height}</span><span>Time: {Math.floor(timeLeft / 60)}:{String(timeLeft % 60).padStart(2, '0')}</span></div>
      <div onPointerDown={dropBlock} className="border rounded-2xl relative overflow-hidden flex items-center justify-center shadow-inner cursor-pointer touch-none p-2" style={mt.cardStyle}>
        <canvas ref={canvasRef} className="w-full max-w-[380px] aspect-[300/288] block" />
        {gameOver && <BreakGameEndOverlay title={timeLeft === 0 ? `Time's Up! Height: ${height}` : `Tower Collapsed! Score: ${score}`} onReplay={restart} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
      {!gameOver && <button onClick={dropBlock} className="w-full py-3 rounded-xl font-bold text-xs uppercase tracking-wider flex items-center justify-center gap-2 shadow cursor-pointer" style={mt.primaryBtnStyle}><ArrowDown className="w-4 h-4" /><span>Drop Block [Space]</span></button>}
    </div>
  );
};
