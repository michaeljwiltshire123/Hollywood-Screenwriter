import React, { useState, useEffect, useRef, useCallback } from 'react';
import { GameScreenProps } from './breakGameTypes';
import { playPopSound, playBeepSound } from './breakAudio';
import { BUBBLE_LEVELS, BubbleNode, PopFx, SHEET_W, SHEET_H, buildBubbleSheet } from './bubbleWrapShapes';
import { renderBubbleSheet } from './bubbleWrapRenderer';
import { BreakGameEndOverlay } from './BreakGameEndOverlay';

const POP_MSGS = ['pop!', 'cut!', 'snap!', 'ping!', 'beep!'];

export const BubbleWrapGame: React.FC<GameScreenProps> = ({ onBackToMenu, onGameWin, mt }) => {
  const [levelIdx, setLevelIdx] = useState(0);
  const [poppedCount, setPoppedCount] = useState(0);
  const [totalPopped, setTotalPopped] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [ended, setEnded] = useState(false);
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const bubblesRef = useRef<BubbleNode[]>(buildBubbleSheet(BUBBLE_LEVELS[0]));
  const fxRef = useRef<PopFx[]>([]);
  const hoverRef = useRef(-1);
  const draggingRef = useRef(false);
  const rafRef = useRef<number | null>(null);
  const advancingRef = useRef(false);
  const bannerRef = useRef<{ text: string; t: number } | null>(null);
  const mtRef = useRef(mt);
  mtRef.current = mt;

  const drawFrame = useCallback(() => {
    const canvas = canvasRef.current, ctx = canvas?.getContext('2d');
    if (!canvas || !ctx) return false;
    const dpr = Math.min(2, window.devicePixelRatio || 1);
    const w = Math.round(SHEET_W * dpr), h = Math.round(SHEET_H * dpr);
    if (canvas.width !== w || canvas.height !== h) { canvas.width = w; canvas.height = h; }
    ctx.setTransform(w / SHEET_W, 0, 0, h / SHEET_H, 0, 0);
    return renderBubbleSheet(ctx, bubblesRef.current, fxRef.current, hoverRef.current, performance.now(), mtRef.current, dpr, bannerRef.current);
  }, []);

  const scheduleDraw = useCallback(() => {
    if (rafRef.current !== null) return;
    const step = () => { rafRef.current = null; if (drawFrame()) rafRef.current = requestAnimationFrame(step); };
    if (drawFrame()) rafRef.current = requestAnimationFrame(step);
  }, [drawFrame]);

  const restartGame = useCallback(() => {
    advancingRef.current = false; bannerRef.current = null; bubblesRef.current = buildBubbleSheet(BUBBLE_LEVELS[0]);
    fxRef.current = []; hoverRef.current = -1;
    setLevelIdx(0); setPoppedCount(0); setTotalPopped(0); setTimeLeft(60); setEnded(false);
    scheduleDraw();
  }, [scheduleDraw]);

  useEffect(() => {
    drawFrame();
    return () => { if (rafRef.current !== null) { cancelAnimationFrame(rafRef.current); rafRef.current = null; } };
  }, [drawFrame, mt.theme.name, mt.theme.isDark]);

  useEffect(() => {
    if (ended) return;
    const t = setInterval(() => setTimeLeft((p) => (p <= 1 ? (setEnded(true), 0) : p - 1)), 1000);
    return () => clearInterval(t);
  }, [ended]);

  const hitBubble = (e: React.PointerEvent<HTMLCanvasElement>, shouldPop: boolean) => {
    if (ended || advancingRef.current || !canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width) * SHEET_W;
    const y = ((e.clientY - rect.top) / rect.height) * SHEET_H;
    const list = bubblesRef.current;
    const found = list.findIndex((b) => (x - b.x) ** 2 + (y - b.y) ** 2 <= (b.r + 2) ** 2);
    if (found !== hoverRef.current) { hoverRef.current = found; scheduleDraw(); }
    if (!shouldPop || found === -1 || list[found].popped) return;
    const now = performance.now();
    list[found].popped = true; list[found].popTime = now; playPopSound();
    fxRef.current.push({ x: list[found].x, y: list[found].y, r: list[found].r, text: POP_MSGS[Math.floor(Math.random() * POP_MSGS.length)], startTime: now });
    const count = list.filter((b) => b.popped).length;
    setPoppedCount(count); setTotalPopped((tp) => tp + 1);
    if (count >= 30) {
      advancingRef.current = true; onGameWin(); playBeepSound(880, 0.12);
      setTimeout(() => {
        const nextIdx = levelIdx + 1, nextShape = BUBBLE_LEVELS[nextIdx % BUBBLE_LEVELS.length];
        bubblesRef.current = buildBubbleSheet(nextShape);
        bannerRef.current = { text: `LEVEL ${nextIdx + 1} · ${nextShape.toUpperCase()}!`, t: performance.now() };
        hoverRef.current = -1; setLevelIdx(nextIdx); setPoppedCount(0); advancingRef.current = false; scheduleDraw();
      }, 340);
    }
    scheduleDraw();
  };

  const shape = BUBBLE_LEVELS[levelIdx % BUBBLE_LEVELS.length];
  return (
    <div className="space-y-3 select-none w-full max-w-xl mx-auto">
      <div className="flex justify-between items-center text-xs font-bold px-1 tabular-nums">
        <span>Level {levelIdx + 1} · {shape}</span><span>Sheet: {poppedCount} / 30</span><span>Time: {timeLeft}s</span>
      </div>
      <div className="p-3 border rounded-2xl relative overflow-hidden flex items-center justify-center touch-none" style={mt.cardStyle}>
        <canvas ref={canvasRef} onPointerDown={(e) => { draggingRef.current = true; hitBubble(e, true); }} onPointerMove={(e) => hitBubble(e, draggingRef.current)} onPointerUp={() => { draggingRef.current = false; }} onPointerLeave={() => { draggingRef.current = false; hoverRef.current = -1; scheduleDraw(); }} className="w-full max-w-[480px] aspect-[360/290] cursor-pointer block" />
        {ended && <BreakGameEndOverlay title="Time's Up!" subtitle={`Total popped: ${totalPopped} bubbles · Reached Level ${levelIdx + 1}`} onReplay={restartGame} onBackToMenu={onBackToMenu} mt={mt} />}
      </div>
    </div>
  );
};
