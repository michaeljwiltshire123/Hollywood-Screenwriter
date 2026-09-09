import { ScreenplayElement } from '../../types';

export interface RenderConfig {
  text: string;
  fontStyle: 'normal' | 'bold' | 'italic';
  fontSize: number;
  x: number;
  align?: 'left' | 'right' | 'center';
  maxWidth: number;
  spaceBefore: number;
  spaceAfter: number;
}

/**
 * Returns rendering instructions and dimensions for standard screenplay elements
 */
export function getElementRenderConfig(elem: ScreenplayElement): RenderConfig {
  const c = elem.content || '';

  if (elem.type === 'SCENE HEADING') {
    return { text: c.toUpperCase(), fontStyle: 'bold', fontSize: 12, x: 108, maxWidth: 432, spaceBefore: 18, spaceAfter: 12 };
  }
  if (elem.type === 'CHARACTER') {
    return { text: c.toUpperCase(), fontStyle: 'bold', fontSize: 12, x: 252, maxWidth: 250, spaceBefore: 12, spaceAfter: 0 };
  }
  if (elem.type === 'PARENTICAL') {
    const parenthesized = c.startsWith('(') && c.endsWith(')') ? c : `(${c})`;
    return { text: parenthesized, fontStyle: 'italic', fontSize: 12, x: 216, maxWidth: 200, spaceBefore: 0, spaceAfter: 0 };
  }
  if (elem.type === 'DIALOGUE') {
    return { text: c, fontStyle: 'normal', fontSize: 12, x: 180, maxWidth: 250, spaceBefore: 0, spaceAfter: 12 };
  }
  if (elem.type === 'TRANSITION') {
    return { text: c.toUpperCase(), fontStyle: 'bold', fontSize: 12, x: 540, align: 'right', maxWidth: 250, spaceBefore: 12, spaceAfter: 12 };
  }
  if (elem.type === 'SHOT') {
    return { text: c.toUpperCase(), fontStyle: 'bold', fontSize: 12, x: 108, maxWidth: 432, spaceBefore: 14, spaceAfter: 12 };
  }
  if (elem.type === 'NOTE') {
    return { text: `[[ NOTE: ${c} ]]`, fontStyle: 'italic', fontSize: 11, x: 108, maxWidth: 432, spaceBefore: 6, spaceAfter: 10 };
  }
  return { text: c, fontStyle: 'normal', fontSize: 12, x: 108, maxWidth: 432, spaceBefore: 0, spaceAfter: 12 };
}
