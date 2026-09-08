import { ElementType } from '../types';

export interface ShortcutDefinition {
  keyLabel: string;
  type: ElementType;
  label: string;
  code: string;
}

export const FORMAT_SHORTCUTS: ShortcutDefinition[] = [
  { keyLabel: 'Shift + Alt + S', code: 'KeyS', type: 'SCENE HEADING', label: 'Scene Heading' },
  { keyLabel: 'Shift + Alt + A', code: 'KeyA', type: 'ACTION', label: 'Action' },
  { keyLabel: 'Shift + Alt + C', code: 'KeyC', type: 'CHARACTER', label: 'Character' },
  { keyLabel: 'Shift + Alt + P', code: 'KeyP', type: 'PARENTICAL', label: 'Parenthetical' },
  { keyLabel: 'Shift + Alt + D', code: 'KeyD', type: 'DIALOGUE', label: 'Dialogue' },
  { keyLabel: 'Shift + Alt + T', code: 'KeyT', type: 'TRANSITION', label: 'Transition' },
];

export function getElementTypeFromKeyboardEvent(e: {
  altKey: boolean;
  shiftKey: boolean;
  ctrlKey: boolean;
  metaKey: boolean;
  key: string;
  code: string;
}): ElementType | null {
  if (e.ctrlKey || e.metaKey) return null;

  // Primary: Shift + Alt + [Letter] (avoids browser menu conflicts)
  if (e.shiftKey && e.altKey) {
    const code = e.code;
    const keyLower = (e.key || '').toLowerCase();
    if (code === 'KeyS' || keyLower === 's') return 'SCENE HEADING';
    if (code === 'KeyA' || keyLower === 'a') return 'ACTION';
    if (code === 'KeyC' || keyLower === 'c') return 'CHARACTER';
    if (code === 'KeyP' || keyLower === 'p') return 'PARENTICAL';
    if (code === 'KeyD' || keyLower === 'd') return 'DIALOGUE';
    if (code === 'KeyT' || keyLower === 't') return 'TRANSITION';
  }

  // Alt + Number (1..8) or fallback Alt + Letter
  if (e.altKey) {
    const key = e.key;
    const code = e.code;
    const keyLower = (key || '').toLowerCase();
    if (key === '1' || code === 'Digit1') return 'SCENE HEADING';
    if (key === '2' || code === 'Digit2') return 'ACTION';
    if (key === '3' || code === 'Digit3') return 'CHARACTER';
    if (key === '4' || code === 'Digit4') return 'PARENTICAL';
    if (key === '5' || code === 'Digit5') return 'DIALOGUE';
    if (key === '6' || code === 'Digit6') return 'TRANSITION';
    if (key === '7' || code === 'Digit7') return 'SHOT';
    if (key === '8' || code === 'Digit8') return 'NOTE';

    if (code === 'KeyS' || keyLower === 's') return 'SCENE HEADING';
    if (code === 'KeyA' || keyLower === 'a') return 'ACTION';
    if (code === 'KeyC' || keyLower === 'c') return 'CHARACTER';
    if (code === 'KeyP' || keyLower === 'p') return 'PARENTICAL';
    if (code === 'KeyD' || keyLower === 'd') return 'DIALOGUE';
    if (code === 'KeyT' || keyLower === 't') return 'TRANSITION';
  }

  return null;
}
