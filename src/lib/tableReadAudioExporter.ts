import { ScreenplayDocument } from '../types';
import { CharacterVoiceConfig, TimbrePreset } from './tableReadTypes';
import { calculateRehearsalGapSeconds } from './rehearsalGapTimer';
import { resolveVoicePersona } from './speechVoiceManager';
import { synthesiseMespeakWav } from './mespeakSynth';
import { buildFxAudioGraph, FX_RACK_SPECS } from './webAudioFxRack';
import { encodePcmToMp3Blob, encodePcmToWavBlob } from './mp3Encoder';

const EXPORT_SR = 22050;

function renderTone(freq: number, sec: number, vol = 0.2): Float32Array {
  const n = Math.max(1, Math.floor(EXPORT_SR * sec));
  const out = new Float32Array(n);
  for (let i = 0; i < n; i++) out[i] = Math.sin((2 * Math.PI * freq * i) / EXPORT_SR) * vol * Math.sin((Math.PI * i) / n);
  return out;
}

async function renderSpokenChunk(
  text: string, timbre: TimbrePreset, speed: number, charIdx: number, accent?: 'GB' | 'US' | 'AU' | 'ANY', isParen = false
): Promise<Float32Array | null> {
  const wav = synthesiseMespeakWav(text, timbre, FX_RACK_SPECS[timbre] ? 1.0 : speed, charIdx, accent, isParen);
  if (!wav) return null;
  const OfflineCtx = window.OfflineAudioContext || (window as unknown as { webkitOfflineAudioContext: typeof OfflineAudioContext }).webkitOfflineAudioContext;
  if (!OfflineCtx) return null;

  const probeCtx = new OfflineCtx(1, 256, EXPORT_SR);
  const decoded = await probeCtx.decodeAudioData(wav.slice(0));
  const spec = FX_RACK_SPECS[timbre];
  const appliedRate = spec ? Math.max(0.45, Math.min(4.0, spec.playbackRate * Math.max(0.5, speed))) : 1.0;
  const outSec = Math.max(0.15, decoded.duration / appliedRate + (spec?.tailSec ?? 0.04));
  const renderCtx = new OfflineCtx(1, Math.ceil(outSec * EXPORT_SR), EXPORT_SR);

  if (spec) {
    const g = buildFxAudioGraph(renderCtx, decoded, timbre, speed, isParen);
    g.source.start(0);
  } else {
    const src = renderCtx.createBufferSource();
    const gain = renderCtx.createGain();
    gain.gain.value = isParen ? 0.45 : 0.95;
    src.buffer = decoded;
    src.connect(gain).connect(renderCtx.destination);
    src.start(0);
  }
  const rendered = await renderCtx.startRendering();
  return rendered.getChannelData(0);
}

export async function generateRehearsalAudio(
  script: ScreenplayDocument,
  mutedCharacterNames: string[],
  speed = 1.0,
  voiceMap: Record<string, CharacterVoiceConfig> = {},
  narratorVoice: CharacterVoiceConfig = { voiceURI: '', timbre: 'NARRATOR' },
  format: 'wav' | 'mp3' = 'mp3',
  onProgress?: (pct: number) => void
): Promise<Blob> {
  const mutedSet = new Set(mutedCharacterNames.map((s) => s.toUpperCase()));
  const castOrder = Array.from(new Set(script.elements.filter((e) => e.type === 'CHARACTER').map((e) => e.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, ''))));
  const chunks: Float32Array[] = [renderTone(523.25, 0.22), renderTone(659.25, 0.28), new Float32Array(Math.floor(EXPORT_SR * 0.35))];

  let activeSpeaker = '';
  const total = Math.max(1, script.elements.length);
  for (let i = 0; i < script.elements.length; i++) {
    if (onProgress && i % 2 === 0) {
      onProgress(Math.min(95, Math.round((i / total) * 90)));
      await new Promise((r) => setTimeout(r, 0));
    }
    const elem = script.elements[i];
    if (elem.type === 'CHARACTER') {
      activeSpeaker = elem.content.trim().toUpperCase().replace(/\s*\(.*?\)\s*/g, '').replace(/DUAL/gi, '').trim();
      continue;
    }
    if (elem.type !== 'PARENTICAL' && elem.type !== 'DIALOGUE') activeSpeaker = '';
    if (!elem.content?.trim()) continue;

    if (activeSpeaker && mutedSet.has(activeSpeaker) && elem.type === 'DIALOGUE') {
      chunks.push(renderTone(440, 0.14, 0.18), new Float32Array(Math.floor(EXPORT_SR * (calculateRehearsalGapSeconds(elem.content) / Math.max(0.5, speed)))));
      chunks.push(renderTone(330, 0.11, 0.14), new Float32Array(Math.floor(EXPORT_SR * 0.2)));
      continue;
    }

    const cfg = activeSpeaker ? voiceMap[activeSpeaker] || { voiceURI: '', timbre: 'MALE' } : narratorVoice;
    const persona = resolveVoicePersona(cfg.voiceURI);
    const charIdx = activeSpeaker ? Math.max(0, castOrder.indexOf(activeSpeaker)) : 0;
    const pcm = await renderSpokenChunk(elem.content, cfg.timbre || 'NARRATOR', speed, charIdx, persona?.accentHint, elem.type === 'PARENTICAL');
    if (pcm) chunks.push(pcm, new Float32Array(Math.floor(EXPORT_SR * 0.22)));
  }

  chunks.push(renderTone(523.25, 0.32));
  const merged = new Float32Array(chunks.reduce((sum, c) => sum + c.length, 0));
  let offset = 0;
  chunks.forEach((c) => { merged.set(c, offset); offset += c.length; });
  onProgress?.(98);
  await new Promise((r) => setTimeout(r, 0));
  const blob = format === 'mp3' ? encodePcmToMp3Blob(merged, EXPORT_SR) : encodePcmToWavBlob(merged, EXPORT_SR);
  onProgress?.(100);
  return blob;
}
