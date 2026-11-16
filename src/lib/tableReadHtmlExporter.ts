import { ScreenplayDocument } from '../types';

/**
 * Generates an offline Standalone Rehearsal Web Player (.html)
 * An actor can open this single file on any phone or computer with live voice synthesis
 */
export function generateRehearsalPlayerHtml(
  script: ScreenplayDocument,
  mutedCharacterNames: string[],
  speed = 1.0
): string {
  const sanitizedScript = JSON.stringify(script);
  const sanitizedMuted = JSON.stringify(mutedCharacterNames);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>${script.title || 'Screenplay'} - Actor Rehearsal Studio</title>
  <style>
    body { font-family: monospace; background: #0F172A; color: #E2E8F0; margin: 0; padding: 20px; }
    .card { max-width: 720px; margin: 0 auto; background: #1E293B; border-radius: 12px; padding: 24px; border: 1px solid #334155; }
    h1 { margin-top: 0; color: #F59E0B; font-size: 18px; text-transform: uppercase; }
    .muted-badge { background: #E11D48; color: white; padding: 2px 8px; border-radius: 4px; font-size: 11px; }
    button { background: #D97706; color: white; border: none; padding: 10px 20px; font-weight: bold; border-radius: 8px; cursor: pointer; }
    .element { margin: 12px 0; padding: 8px; border-radius: 6px; }
    .active { background: #334155; border-left: 4px solid #D97706; }
    .your-turn { color: #FB7185; font-weight: bold; }
  </style>
</head>
<body>
  <div class="card">
    <h1>🎭 ${script.title || 'Screenplay'} • Rehearsal Audio Track</h1>
    <p>Rehearsing for: <span class="muted-badge">${mutedCharacterNames.join(', ') || 'Full Cast'}</span> (Muted for live rehearsal)</p>
    <div style="margin: 16px 0; display:flex; gap:12px; align-items:center;">
      <button id="playBtn" onclick="togglePlay()">START REHEARSAL</button>
      <label>Speed: <input id="speed" type="range" min="0.5" max="3.0" step="0.1" value="${speed}" onchange="updateSpeed()"><span id="speedVal">${speed}x</span></label>
    </div>
    <div id="scriptContainer"></div>
  </div>
  <script>
    const script = ${sanitizedScript};
    const muted = new Set(${sanitizedMuted}.map(s => s.toUpperCase()));
    let idx = 0, playing = false, rate = ${speed};
    const synth = window.speechSynthesis;
    function render() {
      const c = document.getElementById('scriptContainer');
      c.innerHTML = script.elements.map((e, i) => \`
        <div id="el-\${i}" class="element \${i === idx ? 'active' : ''}">
          <div style="font-size:10px; opacity:0.6">\${e.type}</div>
          <div>\${e.content}</div>
          \${i === idx && isElementMuted(e) ? '<div class="your-turn">🎙️ YOUR TURN TO READ! (Press Spacebar to proceed)</div>' : ''}
        </div>
      \`).join('');
      const cur = document.getElementById('el-' + idx);
      if (cur) cur.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }
    function isElementMuted(e) {
      if (e.type === 'CHARACTER') return false; // Never speak character headers
      if (e.type === 'DIALOGUE') {
        for (let i = idx - 1; i >= 0; i--) {
          if (script.elements[i].type === 'CHARACTER') return muted.has(script.elements[i].content.trim().toUpperCase());
          if (script.elements[i].type === 'PARENTICAL') continue;
          break;
        }
      }
      return false;
    }
    function speakNext() {
      if (!playing || idx >= script.elements.length) { playing = false; return; }
      render();
      const el = script.elements[idx];
      if (el.type === 'CHARACTER') { idx++; speakNext(); return; }
      if (isElementMuted(el)) {
        const words = (el.content || '').split(/\\s+/).length;
        setTimeout(() => { if (playing) { idx++; speakNext(); } }, Math.max(2000, words * 420));
      } else if (el.content && el.content.trim()) {
        const u = new SpeechSynthesisUtterance(el.content);
        u.rate = rate;
        u.onend = () => { if (playing) { idx++; speakNext(); } };
        synth.speak(u);
      } else { idx++; speakNext(); }
    }
    function togglePlay() {
      playing = !playing;
      document.getElementById('playBtn').innerText = playing ? 'PAUSE' : 'START REHEARSAL';
      if (playing) speakNext(); else synth.cancel();
    }
    function updateSpeed() {
      rate = parseFloat(document.getElementById('speed').value);
      document.getElementById('speedVal').innerText = rate + 'x';
    }
    window.onkeydown = (e) => { if (e.code === 'Space') { e.preventDefault(); if (playing) { synth.cancel(); idx++; speakNext(); } } };
    render();
  </script>
</body>
</html>`;
}
