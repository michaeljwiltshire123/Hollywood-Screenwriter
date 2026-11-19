import { ScreenplayDocument } from '../../types';
import { generateScriptHtml } from './generateScriptHtml';
import { printHtmlInPlace } from './printHtmlInPlace';

/**
 * Sends a clean, fully formatted screenplay (Title Page + Script Body)
 * directly to the printer without opening a new tab or showing app chrome.
 */
export function printScriptDocument(script: ScreenplayDocument): void {
  printHtmlInPlace(generateScriptHtml(script));
}
