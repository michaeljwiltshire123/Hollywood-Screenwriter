import { TimbrePreset } from './tableReadTypes';

export interface FxRackSpec {
  playbackRate: number;
  ringFreq?: number;
  ringDepth?: number;
  lfoFreq?: number;
  distortion?: number;
  echoSec?: number;
  echoFeedback?: number;
  filterType?: BiquadFilterType;
  filterFreq?: number;
  tailSec: number;
}

export const FX_RACK_SPECS: Partial<Record<TimbrePreset, FxRackSpec>> = {
  CHIPMUNK: { playbackRate: 1.55, filterType: 'highpass', filterFreq: 420, tailSec: 0.05 },
  BABY:     { playbackRate: 1.32, filterType: 'highpass', filterFreq: 320, tailSec: 0.05 },
  OLD:      { playbackRate: 0.88, distortion: 18, filterType: 'bandpass', filterFreq: 1150, tailSec: 0.08 },
  MONSTER:  { playbackRate: 0.62, distortion: 42, echoSec: 0.14, echoFeedback: 0.28, filterType: 'lowpass', filterFreq: 1400, tailSec: 0.45 },
  ROBOT:    { playbackRate: 0.96, ringFreq: 85, ringDepth: 0.55, filterType: 'bandpass', filterFreq: 1350, tailSec: 0.12 },
  ALIEN:    { playbackRate: 0.92, ringFreq: 145, ringDepth: 0.48, lfoFreq: 5.5, echoSec: 0.18, echoFeedback: 0.35, tailSec: 0.55 },
  GHOST:    { playbackRate: 0.82, echoSec: 0.26, echoFeedback: 0.52, filterType: 'highpass', filterFreq: 480, tailSec: 0.85 },
  SURFER:   { playbackRate: 0.90, echoSec: 0.09, echoFeedback: 0.22, filterType: 'lowpass', filterFreq: 2600, tailSec: 0.28 },
};

function makeDistortionCurve(amount: number): Float32Array<ArrayBuffer> {
  const curve = new Float32Array(new ArrayBuffer(256 * 4));
  for (let i = 0; i < 256; i++) {
    const x = (i * 2) / 256 - 1;
    curve[i] = ((3 + amount) * x * 20 * (Math.PI / 180)) / (Math.PI + amount * Math.abs(x));
  }
  return curve;
}

export interface FxGraphHandle {
  source: AudioBufferSourceNode;
  effectiveDurationSec: number;
  cleanup: () => void;
}

export function buildFxAudioGraph(
  ctx: BaseAudioContext,
  buffer: AudioBuffer,
  timbre: TimbrePreset,
  extraRate = 1.0,
  isParenthetical = false
): FxGraphHandle {
  const spec = FX_RACK_SPECS[timbre] || { playbackRate: 1.0, tailSec: 0.05 };
  const source = ctx.createBufferSource();
  source.buffer = buffer;
  const appliedRate = Math.max(0.45, Math.min(4.0, spec.playbackRate * Math.max(0.5, extraRate)));
  source.playbackRate.value = appliedRate;

  const stops: (() => void)[] = [];
  let head: AudioNode = source;
  if (spec.filterType && spec.filterFreq) {
    const eq = ctx.createBiquadFilter();
    eq.type = spec.filterType; eq.frequency.value = spec.filterFreq;
    if (spec.filterType === 'bandpass') eq.Q.value = 1.1;
    head.connect(eq); head = eq;
  }
  if (spec.distortion) {
    const shaper = ctx.createWaveShaper();
    shaper.curve = makeDistortionCurve(spec.distortion);
    head.connect(shaper); head = shaper;
  }
  if (spec.ringFreq && spec.ringDepth) {
    const carrier = ctx.createOscillator();
    carrier.type = timbre === 'ROBOT' ? 'square' : 'sine'; carrier.frequency.value = spec.ringFreq;
    const modDepth = ctx.createGain(); modDepth.gain.value = spec.ringDepth;
    const ringGain = ctx.createGain(); ringGain.gain.value = 1.0 - spec.ringDepth * 0.4;
    if (spec.lfoFreq) {
      const lfo = ctx.createOscillator(); const lfoGain = ctx.createGain();
      lfo.frequency.value = spec.lfoFreq; lfoGain.gain.value = 55;
      lfo.connect(lfoGain).connect(carrier.frequency); lfo.start(0);
      stops.push(() => { try { lfo.stop(); lfo.disconnect(); } catch { /* ignore */ } });
    }
    carrier.connect(modDepth).connect(ringGain.gain); carrier.start(0);
    stops.push(() => { try { carrier.stop(); carrier.disconnect(); } catch { /* ignore */ } });
    head.connect(ringGain); head = ringGain;
  }
  const master = ctx.createGain();
  master.gain.value = isParenthetical ? 0.42 : timbre === 'GHOST' ? 0.85 : 1.0;
  head.connect(master);
  if (spec.echoSec && spec.echoFeedback) {
    const delay = ctx.createDelay(1.0); delay.delayTime.value = spec.echoSec;
    const fb = ctx.createGain(); fb.gain.value = spec.echoFeedback;
    const damp = ctx.createBiquadFilter(); damp.type = 'lowpass'; damp.frequency.value = 1800;
    head.connect(delay); delay.connect(damp).connect(fb).connect(delay); damp.connect(master);
  }
  master.connect(ctx.destination);
  const cleanup = () => { stops.forEach((fn) => fn()); try { source.disconnect(); master.disconnect(); } catch { /* ignore */ } };
  return { source, effectiveDurationSec: buffer.duration / appliedRate + spec.tailSec, cleanup };
}
