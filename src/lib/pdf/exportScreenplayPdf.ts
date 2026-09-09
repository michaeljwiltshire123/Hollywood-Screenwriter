import { ScreenplayDocument } from '../../types';
import { buildScreenplayPdfDocument } from './buildScreenplayPdf';

/**
 * Generates and downloads a clean, industry-standard vector text PDF screenplay
 */
export function exportScreenplayPdf(script: ScreenplayDocument): void {
  const doc = buildScreenplayPdfDocument(script);

  const safeTitle = (script.title || 'screenplay')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+|_+$/g, '');
  doc.save(`${safeTitle || 'screenplay'}.pdf`);
}
