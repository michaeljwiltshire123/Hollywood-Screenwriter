import { ScreenplayDocument } from '../types';
import { buildScreenplayPdfDocument } from './pdf/buildScreenplayPdf';
import { generateScriptHtml } from './print/generateScriptHtml';

/**
 * Robust screenplay printer designed to work both inside sandboxed iframe previews
 * and top-level browser tabs.
 */
export function triggerScriptPrint(script: ScreenplayDocument): void {
  try {
    const doc = buildScreenplayPdfDocument(script);
    const pdfBlob = doc.output('blob');
    const blobUrl = URL.createObjectURL(pdfBlob);

    // Method 1: Create a hidden iframe with PDF source and print
    const existingIframe = document.getElementById('__screenplay_pdf_print_frame');
    if (existingIframe) existingIframe.remove();

    const iframe = document.createElement('iframe');
    iframe.id = '__screenplay_pdf_print_frame';
    iframe.style.position = 'fixed';
    iframe.style.right = '0';
    iframe.style.bottom = '0';
    iframe.style.width = '0';
    iframe.style.height = '0';
    iframe.style.border = '0';
    iframe.src = blobUrl;
    document.body.appendChild(iframe);

    iframe.onload = () => {
      try {
        iframe.contentWindow?.focus();
        iframe.contentWindow?.print();
      } catch (e) {
        console.warn('Iframe print restricted, triggering fallback window', e);
        openPrintWindowFallback(script, blobUrl);
      }
    };
  } catch (err) {
    console.error('PDF print generation failed, falling back to HTML DOM print', err);
    domHtmlPrintFallback(script);
  }
}

function openPrintWindowFallback(script: ScreenplayDocument, blobUrl?: string): void {
  try {
    if (blobUrl) {
      const win = window.open(blobUrl, '_blank');
      if (win) {
        win.focus();
        return;
      }
    }
  } catch (e) {
    console.warn('Window open blob blocked', e);
  }
  domHtmlPrintFallback(script);
}

function domHtmlPrintFallback(script: ScreenplayDocument): void {
  try {
    const htmlContent = generateScriptHtml(script);
    const oldContainer = document.getElementById('__screenplay_print_container');
    if (oldContainer) oldContainer.remove();

    const bodyMatch = htmlContent.match(/<body[^>]*>([\s\S]*)<\/body>/i);
    const innerBody = bodyMatch ? bodyMatch[1] : htmlContent;

    const printContainer = document.createElement('div');
    printContainer.id = '__screenplay_print_container';
    printContainer.className = 'screenplay-print-only';
    printContainer.innerHTML = innerBody;
    document.body.appendChild(printContainer);

    setTimeout(() => {
      window.print();
    }, 50);
  } catch (e) {
    console.error('HTML DOM print fallback failed:', e);
    window.print();
  }
}
