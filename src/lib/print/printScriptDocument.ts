import { ScreenplayDocument } from '../../types';
import { generateScriptHtml } from './generateScriptHtml';

/**
 * Sends a clean, fully formatted screenplay (Title Page + Script Body)
 * directly to the printer without any UI controls or app chrome.
 */
export function printScriptDocument(script: ScreenplayDocument): void {
  try {
    const htmlContent = generateScriptHtml(script);

    // Look for existing print iframe or create a new one
    let iframe = document.getElementById('__screenplay_print_iframe') as HTMLIFrameElement | null;
    if (!iframe) {
      iframe = document.createElement('iframe');
      iframe.id = '__screenplay_print_iframe';
      iframe.setAttribute(
        'style',
        'position: fixed; top: 0; left: 0; width: 1px; height: 1px; opacity: 0; border: none; pointer-events: none; z-index: -9999;'
      );
      document.body.appendChild(iframe);
    }

    const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
    if (!iframeDoc) {
      throw new Error('Unable to access print frame document');
    }

    iframeDoc.open();
    iframeDoc.write(htmlContent);
    iframeDoc.close();

    // Trigger printing once loaded
    setTimeout(() => {
      try {
        iframe?.contentWindow?.focus();
        iframe?.contentWindow?.print();
      } catch {
        // Fallback for sandboxed browser restrictions
        const printWindow = window.open('', '_blank');
        if (printWindow) {
          printWindow.document.write(htmlContent);
          printWindow.document.close();
          printWindow.focus();
          printWindow.print();
        }
      }
    }, 250);
  } catch (err: any) {
    console.error('Print screenplay failed:', err);
    window.print();
  }
}
