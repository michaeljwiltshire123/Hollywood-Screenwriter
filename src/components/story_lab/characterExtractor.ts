import { ScreenplayDocument, SceneInfo } from '../../types';
import { CharacterFortuneOption } from './characterFortuneTypes';

// Deep, high-contrast saturated colours strictly designed for high visibility on light backgrounds
export const DARK_CHARACTER_COLOURS = [
  '#be123c', // Deep Crimson Rose
  '#1d4ed8', // Dark Royal Blue
  '#047857', // Forest Emerald
  '#b45309', // Deep Amber / Ochre
  '#6d28d9', // Deep Violet
  '#0e7490', // Dark Cyan / Teal
  '#be185d', // Deep Magenta
  '#c2410c', // Dark Rust Orange
];

export function findEstablishedProtagonist(script?: ScreenplayDocument): string | null {
  if (!script?.characterBibles) return null;
  const entries = Object.entries(script.characterBibles);
  for (const [name, meta] of entries) {
    const combined = `${name} ${meta.attitude || ''} ${meta.coreMotivation || ''} ${meta.actorNotes || ''}`.toUpperCase();
    if (combined.includes('PROTAGONIST') || combined.includes('LEAD') || combined.includes('HERO') || combined.includes('MAIN')) {
      return name.trim().toUpperCase();
    }
  }
  return null;
}

export function extractScriptCharacters(
  script?: ScreenplayDocument,
  scenes: SceneInfo[] = []
): CharacterFortuneOption[] {
  const charactersSet = new Set<string>();

  if (script?.characterBibles) {
    Object.keys(script.characterBibles).forEach((name) => {
      const clean = name.trim().toUpperCase();
      if (clean) charactersSet.add(clean);
    });
  }

  scenes.forEach((sc) => {
    (sc.characters || []).forEach((c) => {
      const clean = c.trim().toUpperCase();
      if (clean) charactersSet.add(clean);
    });
  });

  if (script?.elements) {
    script.elements.forEach((el) => {
      if (el.type === 'CHARACTER') {
        const clean = el.content.replace(/\s*\(.*?\)\s*/g, '').trim().toUpperCase();
        if (clean) charactersSet.add(clean);
      }
    });
  }

  const result: CharacterFortuneOption[] = [];
  let colIdx = 0;
  charactersSet.forEach((name) => {
    // Always assign a deep, high-contrast dark colour so lines and tags are 100% visible
    const color = DARK_CHARACTER_COLOURS[colIdx % DARK_CHARACTER_COLOURS.length];
    result.push({ id: name, name, color });
    colIdx += 1;
  });

  return result;
}
