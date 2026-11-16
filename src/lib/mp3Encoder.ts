import { Mp3Encoder } from '@breezystack/lamejs';

export function floatSamplesToInt16(samples: Float32Array): Int16Array {
  const pcm16 = new Int16Array(samples.length);
  for (let i = 0; i < samples.length; i++) {
    const s = Math.max(-1, Math.min(1, samples[i]));
    pcm16[i] = s < 0 ? s * 0x8000 : s * 0x7fff;
  }
  return pcm16;
}

export function encodePcmToWavBlob(samples: Float32Array, sampleRate: number): Blob {
  const pcm16 = floatSamplesToInt16(samples);
  const buffer = new ArrayBuffer(44 + pcm16.length * 2);
  const view = new DataView(buffer);
  const writeStr = (pos: number, str: string) => {
    for (let i = 0; i < str.length; i++) view.setUint8(pos + i, str.charCodeAt(i));
  };

  writeStr(0, 'RIFF');
  view.setUint32(4, 36 + pcm16.length * 2, true);
  writeStr(8, 'WAVE');
  writeStr(12, 'fmt ');
  view.setUint32(16, 16, true);
  view.setUint16(20, 1, true);
  view.setUint16(22, 1, true);
  view.setUint32(24, sampleRate, true);
  view.setUint32(28, sampleRate * 2, true);
  view.setUint16(32, 2, true);
  view.setUint16(34, 16, true);
  writeStr(36, 'data');
  view.setUint32(40, pcm16.length * 2, true);
  new Int16Array(buffer, 44).set(pcm16);

  return new Blob([buffer], { type: 'audio/wav' });
}

export function encodePcmToMp3Blob(samples: Float32Array, sampleRate: number, kbps = 128): Blob {
  const pcm16 = floatSamplesToInt16(samples);
  const encoder = new Mp3Encoder(1, sampleRate, kbps);
  const mp3Parts: Uint8Array<ArrayBuffer>[] = [];
  const blockSize = 1152;

  for (let i = 0; i < pcm16.length; i += blockSize) {
    const slice = pcm16.subarray(i, i + blockSize);
    const mp3buf = encoder.encodeBuffer(slice);
    if (mp3buf.length > 0) {
      const copy = new Uint8Array(new ArrayBuffer(mp3buf.length));
      copy.set(mp3buf);
      mp3Parts.push(copy);
    }
  }

  const tail = encoder.flush();
  if (tail.length > 0) {
    const copy = new Uint8Array(new ArrayBuffer(tail.length));
    copy.set(tail);
    mp3Parts.push(copy);
  }
  return new Blob(mp3Parts, { type: 'audio/mp3' });
}
