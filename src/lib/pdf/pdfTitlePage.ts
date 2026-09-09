import { jsPDF } from 'jspdf';
import { TitlePage } from '../../types';

/**
 * Renders an industry-standard screenplay Title Page on the first page of the PDF
 */
export function renderPdfTitlePage(doc: jsPDF, titlePage: TitlePage, fallbackTitle: string): void {
  const title = (titlePage?.title || fallbackTitle || 'UNTITLED SCREENPLAY').toUpperCase();
  const credit = titlePage?.credit || 'Written by';
  const author = titlePage?.author || '';
  const source = titlePage?.source || '';
  const contact = titlePage?.contact || '';
  const date = titlePage?.date || '';
  const draftColor = titlePage?.draftColor || 'White Draft';

  // Centered Title Block in Upper/Middle of page (around y = 280)
  doc.setFont('courier', 'bold');
  doc.setFontSize(18);
  doc.text(title, 306, 280, { align: 'center', maxWidth: 420 });

  doc.setFont('courier', 'normal');
  doc.setFontSize(12);
  doc.text(credit, 306, 330, { align: 'center' });

  if (author) {
    doc.setFont('courier', 'bold');
    doc.setFontSize(13);
    doc.text(author, 306, 355, { align: 'center', maxWidth: 420 });
  }

  if (source) {
    doc.setFont('courier', 'normal');
    doc.setFontSize(11);
    doc.text(source, 306, 395, { align: 'center', maxWidth: 400 });
  }

  // Bottom Left: Contact Info
  if (contact) {
    doc.setFont('courier', 'normal');
    doc.setFontSize(10);
    const contactLines = doc.splitTextToSize(contact, 220);
    doc.text(contactLines, 108, 680);
  }

  // Bottom Right: Date and Draft details
  doc.setFont('courier', 'normal');
  doc.setFontSize(10);
  let bottomY = 680;
  if (date) {
    doc.text(date, 504, bottomY, { align: 'right' });
    bottomY += 14;
  }
  if (draftColor) {
    doc.text(draftColor, 504, bottomY, { align: 'right' });
  }
}
