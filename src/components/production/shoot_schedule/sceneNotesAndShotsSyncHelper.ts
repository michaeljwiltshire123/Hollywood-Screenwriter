import { ScreenplayElement, ShotInfo, ShotSetupItem, CharacterMetadata } from '../../../types';

export function extractSceneNotes(
  elements: ScreenplayElement[],
  scId: string,
  sceneChars: string[],
  characterBibles?: Record<string, CharacterMetadata>,
  scriptShots?: ShotInfo[],
  productionNotes?: string
): string {
  const parts: string[] = [];

  // 1. NOTE elements belonging to this scene heading block only
  const scIdx = elements.findIndex((e) => e.id === scId);
  if (scIdx >= 0) {
    const nextIdx = elements.findIndex((e, i) => i > scIdx && e.type === 'SCENE HEADING');
    const block = elements.slice(scIdx, nextIdx >= 0 ? nextIdx : elements.length);
    block.forEach((el) => {
      if (el.type === 'NOTE' && el.content?.trim()) {
        parts.push(el.content.trim());
      }
    });
  }

  if (productionNotes?.trim()) {
    parts.push(productionNotes.trim());
  }

  return sanitizeNotes(Array.from(new Set(parts)).join(' | '));
}

export function sanitizeNotes(notes: string = ''): string {
  if (!notes) return '';
  return notes
    .split(' | ')
    .filter((part) => {
      const p = part.trim();
      if (!p) return false;
      if (p.toLowerCase().includes('dolly') || p.toLowerCase().includes('handheld')) return false;
      return true;
    })
    .join(' | ');
}

export function mapScriptShotsToSetupItems(
  shots: ShotInfo[] = [],
  sceneHeadingId: string,
  sceneNum: string
): ShotSetupItem[] {
  const matching = shots.filter((s) => s.sceneHeadingId === sceneHeadingId);
  return matching.map((s, idx) => {
    const suffix = String.fromCharCode(65 + Math.min(25, idx));
    return {
      id: s.id || `shot-${Date.now()}-${idx}`,
      shotNumber: s.shotNumber || `${sceneNum}${suffix}`,
      setup: s.shotType || (idx === 0 ? 'Wide Shot' : 'Medium Shot'),
      lens: s.lens || '',
      description: s.description || s.otherNotes || s.movementDetail || '',
      estimatedTimeMinutes: s.estimatedTimeMin || 15,
      status: 'PLANNED' as const,
    };
  });
}
