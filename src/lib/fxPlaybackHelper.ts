import { TimbrePreset } from './tableReadTypes';
import { synthesiseMespeakWav } from './mespeakSynth';
import { buildFxAudioGraph, FX_RACK_SPECS, FxGraphHandle } from './webAudioFxRack';

let sharedCtx: AudioContext | null = null;
function getAudioCtx(): AudioContext | null {
  if (typeof window === 'undefined') return null;
  const Ctx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
  if (!Ctx) return null;
  if (!sharedCtx) sharedCtx = new Ctx();
  if (sharedCtx.state === 'suspended') sharedCtx.resume().catch(() => {});
  return sharedCtx;
}

export interface ActiveFxPlayback {
  setSpeedRatio: (newRate: number) => void;
  stop: () => void;
}

function scheduleKaraokeTicks(
  text: string,
  durationSec: number,
  onBoundary?: (idx: number, len: number) => void
): number | null {
  if (!onBoundary || !text.trim()) return null;
  const tokens: { idx: number; len: number }[] = [];
  const regex = /\S+/g;
  let match: RegExpExecArray | null;
  while ((match = regex.exec(text)) !== null) tokens.push({ idx: match.index, len: match[0].length });
  if (tokens.length === 0) return null;

  const stepMs = Math.max(85, (durationSec * 920) / tokens.length);
  let i = 0;
  onBoundary(tokens[0].idx, tokens[0].len);
  return window.setInterval(() => {
    i++;
    if (i < tokens.length) onBoundary(tokens[i].idx, tokens[i].len);
  }, stepMs);
}

export async function playMespeakFxLine(
  text: string,
  timbre: TimbrePreset,
  speedRatio: number,
  charOffset: number,
  isParenthetical: boolean,
  isStillActive: () => boolean,
  onBoundary?: (charIndex: number, charLength?: number) => void,
  onEnd?: () => void
): Promise<ActiveFxPlayback | null> {
  const ctx = getAudioCtx();
  const wav = synthesiseMespeakWav(text, timbre, 1.0, charOffset, 'ANY', isParenthetical);
  if (!ctx || !wav) { onEnd?.(); return null; }

  let stopped = false;
  let graph: FxGraphHandle | null = null;
  let tickTimer: number | null = null;
  let endTimer: number | null = null;

  const stop = () => {
    if (stopped) return;
    stopped = true;
    if (tickTimer) { clearInterval(tickTimer); tickTimer = null; }
    if (endTimer) { clearTimeout(endTimer); endTimer = null; }
    if (graph) {
      try { graph.source.onended = null; graph.source.stop(); } catch { /* ignore */ }
      graph.cleanup();
      graph = null;
    }
  };

  try {
    const decoded = await ctx.decodeAudioData(wav.slice(0));
    if (stopped || !isStillActive()) return null;

    graph = buildFxAudioGraph(ctx, decoded, timbre, speedRatio, isParenthetical);
    tickTimer = scheduleKaraokeTicks(text, decoded.duration / (graph.source.playbackRate.value || 1), onBoundary);

    graph.source.onended = () => {
      if (stopped || !isStillActive()) return;
      const tailMs = Math.max(40, Math.round((FX_RACK_SPECS[timbre]?.tailSec ?? 0.08) * 1000));
      endTimer = window.setTimeout(() => { if (!stopped && isStillActive()) { stop(); onEnd?.(); } }, tailMs);
    };
    graph.source.start(0);
  } catch {
    if (!stopped && isStillActive()) onEnd?.();
  }

  return {
    stop,
    setSpeedRatio: (newRate: number) => {
      if (!graph || stopped) return;
      const base = FX_RACK_SPECS[timbre]?.playbackRate ?? 1.0;
      graph.source.playbackRate.value = Math.max(0.45, Math.min(4.0, base * Math.max(0.5, newRate)));
    },
  };
}
