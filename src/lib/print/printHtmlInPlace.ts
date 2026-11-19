import { openPrintPreview } from './printPreviewBus';

const PRINT_ROOT_ID = '__app_print_root';
const PRINT_STYLE_ID = '__app_print_style';

export interface PrintOptions {
  onDownloadPdf?: () => void | Promise<void>;
}

function isEmbeddedPreview(): boolean {
  try {
    return window.self !== window.top;
  } catch {
    return true;
  }
}

function extractPrintParts(html: string): { title: string; styles: string; body: string } {
  const titleMatch = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const styleMatches = Array.from(html.matchAll(/<style[^>]*>([\s\S]*?)<\/style>/gi));
  const rawStyles = styleMatches.map((m) => m[1]).join('\n');
  const styles = rawStyles.replace(/\bbody\b/gi, `#${PRINT_ROOT_ID}`);
  const bodyMatch = html.match(/<body[^>]*>([\s\S]*?)<\/body>/i);
  const body = bodyMatch ? bodyMatch[1] : html;
  return { title: titleMatch ? titleMatch[1].trim() : 'Print Document', styles, body };
}

function cleanupPrintNodes(prevTitle: string): void {
  document.getElementById(PRINT_ROOT_ID)?.remove();
  document.getElementById(PRINT_STYLE_ID)?.remove();
  if (prevTitle && document.title !== prevTitle) document.title = prevTitle;
}

export function triggerDomPrint(htmlContent: string): void {
  const prevTitle = document.title;
  cleanupPrintNodes(prevTitle);
  const { title, styles, body } = extractPrintParts(htmlContent);

  const styleEl = document.createElement('style');
  styleEl.id = PRINT_STYLE_ID;
  styleEl.textContent = `
    #${PRINT_ROOT_ID} { display: none; }
    @media print {
      html, body { background: #ffffff !important; margin: 0 !important; padding: 0 !important; height: auto !important; overflow: visible !important; }
      body > *:not(#${PRINT_ROOT_ID}) { display: none !important; }
      #${PRINT_ROOT_ID} { display: block !important; position: static !important; width: 100% !important; background: #ffffff !important; color: #111111 !important; }
      ${styles}
    }
  `;
  document.head.appendChild(styleEl);

  const rootEl = document.createElement('div');
  rootEl.id = PRINT_ROOT_ID;
  rootEl.innerHTML = body;
  document.body.appendChild(rootEl);

  if (title) document.title = title;
  const done = () => cleanupPrintNodes(prevTitle);
  window.addEventListener('afterprint', done, { once: true });

  const pendingImgs = Array.from(rootEl.querySelectorAll('img')).filter((img) => !img.complete);
  if (pendingImgs.length === 0) {
    window.print();
    setTimeout(done, 60000);
    return;
  }

  let triggered = false;
  const triggerOnce = () => {
    if (triggered) return;
    triggered = true;
    window.print();
    setTimeout(done, 60000);
  };
  const fallbackTimer = setTimeout(triggerOnce, 800);
  let remaining = pendingImgs.length;
  const onImgDone = () => {
    remaining -= 1;
    if (remaining <= 0) { clearTimeout(fallbackTimer); triggerOnce(); }
  };
  pendingImgs.forEach((img) => {
    img.addEventListener('load', onImgDone, { once: true });
    img.addEventListener('error', onImgDone, { once: true });
  });
}

export function printHtmlInPlace(htmlContent: string, options?: PrintOptions): void {
  if (isEmbeddedPreview()) {
    const { title } = extractPrintParts(htmlContent);
    openPrintPreview({ htmlContent, title, onDownloadPdf: options?.onDownloadPdf });
    return;
  }
  triggerDomPrint(htmlContent);
}
