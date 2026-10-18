import { ScreenplayDocument } from '../../types';
import { buildScreenplayPdfDocument } from './buildScreenplayPdf';

/**
 * Generates and downloads a clean, industry-standard vector text PDF screenplay
 * Supports standard screenplay PDF and Actor's PDF with pastel dialogue highlights
 */
export function exportScreenplayPdf(script: ScreenplayDocument, isActorPdf?: boolean): void {
  const isActorMode = isActorPdf ?? Boolean(script.isActorHighlightingActive);
  const doc = buildScreenplayPdfDocument(script, isActorMode);

  const safeTitle = (script.title || 'screenplay')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  const suffix = isActorMode ? '_actors_script' : '';
  doc.save(`${safeTitle || 'screenplay'}${suffix}.pdf`);
}
