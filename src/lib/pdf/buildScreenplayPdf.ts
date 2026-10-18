import { jsPDF } from 'jspdf';
import { ScreenplayDocument } from '../../types';
import { renderPdfTitlePage } from './pdfTitlePage';
import { getElementRenderConfig } from './pdfElementRenderer';
import {
  findSpeakingCharacterForDialogue,
  getCharacterHighlightColor,
  hexToRgb,
} from '../actorHighlighting';
import { extractCharacters } from '../screenplayUtils';
import { drawPdfDialogueHighlight } from './pdfDialogueHighlighter';

/**
 * Builds a jsPDF document containing the Hollywood Title Page and Script Body
 */
export function buildScreenplayPdfDocument(
  script: ScreenplayDocument,
  isActorPdfOverride?: boolean
): jsPDF {
  const doc = new jsPDF({ orientation: 'portrait', unit: 'pt', format: 'letter' });
  const topMargin = 72;
  const bottomMargin = 72;
  const pageHeight = 792;
  const maxUsableY = pageHeight - bottomMargin;
  const lineHeight = 14;

  const isActorMode = isActorPdfOverride ?? Boolean(script.isActorHighlightingActive);
  const allCharacters = isActorMode
    ? extractCharacters(script.elements).map((c) => c.name)
    : [];

  // 1. Render Hollywood Title Page on Page 1
  renderPdfTitlePage(doc, script.titlePage, script.title);

  // 2. Start Screenplay Body on Page 2
  doc.addPage();
  let currentPageNumber = 1;
  let currentY = topMargin;

  const addNewBodyPage = () => {
    doc.addPage();
    currentPageNumber += 1;
    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    doc.text(`${currentPageNumber}.`, 540, 48, { align: 'right' });
    currentY = topMargin;
  };

  for (let i = 0; i < script.elements.length; i++) {
    const elem = script.elements[i];
    if (!elem.content && elem.type !== 'SCENE HEADING') continue;

    const config = getElementRenderConfig(elem);
    doc.setFont('courier', config.fontStyle);
    doc.setFontSize(config.fontSize);

    const lines: string[] = doc.splitTextToSize(config.text, config.maxWidth);
    const elementHeight = lines.length * lineHeight;
    const lookahead = elem.type === 'CHARACTER' || elem.type === 'PARENTICAL' ? 40 : 0;

    if (currentY + config.spaceBefore + elementHeight + lookahead > maxUsableY) {
      addNewBodyPage();
    } else {
      currentY += config.spaceBefore;
    }

    doc.setFont('courier', config.fontStyle);
    doc.setFontSize(config.fontSize);

    let rgb = null;
    if (isActorMode && elem.type === 'DIALOGUE') {
      const speaker = findSpeakingCharacterForDialogue(script.elements, i);
      if (speaker) {
        const hex = getCharacterHighlightColor(speaker, script.characterBibles, allCharacters);
        rgb = hexToRgb(hex);
      }
    }

    for (const line of lines) {
      if (currentY + lineHeight > maxUsableY) {
        addNewBodyPage();
        doc.setFont('courier', config.fontStyle);
        doc.setFontSize(config.fontSize);
      }

      if (rgb) {
        drawPdfDialogueHighlight(doc, config.x, currentY, doc.getTextWidth(line), lineHeight, rgb);
      }

      const options = config.align === 'right' ? { align: 'right' as const } : undefined;
      doc.text(line, config.x, currentY, options);
      currentY += lineHeight;
    }

    currentY += config.spaceAfter;
  }

  return doc;
}
