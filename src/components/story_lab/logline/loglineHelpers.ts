import { LoglineData } from '../../../types';

export function generateLiveLoglineTemplates(d: LoglineData): string[] {
  const h = d.hook.trim();
  const p = d.protagonist.trim();
  const g = d.goal.trim();
  const o = d.obstacle.trim();
  const s = d.stakes.trim();

  const parts = [
    p ? (p.toLowerCase().startsWith('a ') || p.toLowerCase().startsWith('an ') || p.toLowerCase().startsWith('the ') ? p : `a ${p}`) : 'a protagonist',
    g ? `must ${g}` : 'must achieve their goal',
    o ? `despite ${o}` : '',
    s ? `before ${s}` : '',
    h ? `(${h})` : '',
  ].filter(Boolean);

  const shuffledParts = [d.order[0], d.order[1], d.order[2]]
    .map((idx) => {
      if (idx === 0) return h ? `${h}, ${parts[0]}` : parts[0];
      if (idx === 1) return parts[1];
      if (idx === 2) return parts[2];
      return '';
    })
    .filter(Boolean);

  const t1 = `${shuffledParts.join(' ')} ${parts.slice(3).join(' ')}`.trim();
  const t2 = h ? `${h}, ${parts[0]} ${parts.slice(1).join(' ')}`.trim() : t1;
  const t3 = `${parts[0]} ${parts.slice(1).join(' ')} ${h ? `— ${h}` : ''}`.trim();

  return Array.from(new Set([t1, t2, t3].filter(Boolean)));
}

export function countLoglineWords(text: string): number {
  return (text || '').trim().split(/\s+/).filter(Boolean).length;
}
