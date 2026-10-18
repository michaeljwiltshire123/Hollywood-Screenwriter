import { ScreenplayElement, CharacterMetadata } from '../types';

export interface PastelColor {
  name: string;
  hex: string;
  label: string;
}

export const PASTEL_PALETTE: readonly PastelColor[] = [
  { name: 'Soft Yellow', hex: '#FEF9C3', label: 'Yellow' },
  { name: 'Mint', hex: '#DCFCE7', label: 'Mint' },
  { name: 'Sky Blue', hex: '#E0F2FE', label: 'Sky Blue' },
  { name: 'Lavender', hex: '#F3E8FF', label: 'Lavender' },
  { name: 'Peach', hex: '#FFEDD5', label: 'Peach' },
  { name: 'Rose', hex: '#FFE4E6', label: 'Rose' },
  { name: 'Buttercup', hex: '#FEF08A', label: 'Buttercup' },
  { name: 'Seafoam', hex: '#A7F3D0', label: 'Seafoam' },
  { name: 'Powder Blue', hex: '#BAE6FD', label: 'Powder' },
  { name: 'Lilac', hex: '#E9D5FF', label: 'Lilac' },
  { name: 'Apricot', hex: '#FED7AA', label: 'Apricot' },
  { name: 'Blush Pink', hex: '#FCE7F3', label: 'Blush' },
] as const;

export function getCharacterHighlightColor(
  charName: string,
  characterBibles?: Record<string, CharacterMetadata>,
  allSpeakingCharacters?: string[]
): string {
  const clean = charName.trim().toUpperCase();
  if (characterBibles?.[clean]?.highlightColor) {
    return characterBibles[clean].highlightColor!;
  }

  // Auto-assign distinct default pastel colours to speaking characters if unset
  if (allSpeakingCharacters && allSpeakingCharacters.length > 0) {
    const idx = allSpeakingCharacters.findIndex((c) => c.trim().toUpperCase() === clean);
    if (idx !== -1) {
      return PASTEL_PALETTE[idx % PASTEL_PALETTE.length].hex;
    }
  }

  // Fallback hash for any unindexed speaking characters
  let hash = 0;
  for (let j = 0; j < clean.length; j++) {
    hash = (hash << 5) - hash + clean.charCodeAt(j);
    hash |= 0;
  }
  return PASTEL_PALETTE[Math.abs(hash) % PASTEL_PALETTE.length].hex;
}

export function findSpeakingCharacterForDialogue(
  elements: ScreenplayElement[],
  dialogueIndex: number
): string | null {
  for (let i = dialogueIndex - 1; i >= 0; i--) {
    const elem = elements[i];
    if (elem.type === 'CHARACTER') {
      return elem.content
        .replace(/\s*\(.*?\)/g, '')
        .replace(/DUAL/gi, '')
        .trim()
        .toUpperCase();
    }
    if (elem.type === 'PARENTICAL') {
      continue;
    }
    break;
  }
  return null;
}

export function hexToRgb(hex: string): { r: number; g: number; b: number } {
  const cleaned = hex.replace('#', '');
  const bigint = parseInt(cleaned, 16);
  return {
    r: (bigint >> 16) & 255,
    g: (bigint >> 8) & 255,
    b: bigint & 255,
  };
}
