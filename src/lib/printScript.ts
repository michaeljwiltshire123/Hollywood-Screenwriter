import { ScreenplayDocument } from '../types';
import { exportScreenplayPdf } from './pdf/exportScreenplayPdf';
import { generateScriptHtml } from './print/generateScriptHtml';
import { printHtmlInPlace } from './print/printHtmlInPlace';

/**
 * Prints the screenplay cleanly in place (or opens Print Preview inside embedded previews)
 * without ever opening a new browser tab or leaving the workspace.
 */
export function triggerScriptPrint(script: ScreenplayDocument): void {
  try {
    printHtmlInPlace(generateScriptHtml(script), { onDownloadPdf: () => exportScreenplayPdf(script) });
  } catch (err) {
    console.error('In-place script print failed, using DOM print container:', err);
    domHtmlPrintFallback(script);
  }
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
    document.body.classList.add('printing-screenplay');

    window.addEventListener('afterprint', () => {
      document.body.classList.remove('printing-screenplay');
      printContainer.remove();
    }, { once: true });

    window.print();
  } catch (e) {
    document.body.classList.remove('printing-screenplay');
    console.error('HTML DOM print fallback failed:', e);
    window.print();
  }
}
