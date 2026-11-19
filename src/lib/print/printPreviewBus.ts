export interface PrintPreviewRequest {
  htmlContent: string;
  title: string;
  onDownloadPdf?: () => void | Promise<void>;
}

type Listener = (req: PrintPreviewRequest | null) => void;
const listeners = new Set<Listener>();

export function subscribePrintPreview(listener: Listener): () => void {
  listeners.add(listener);
  return () => {
    listeners.delete(listener);
  };
}

export function openPrintPreview(req: PrintPreviewRequest): void {
  listeners.forEach((fn) => fn(req));
}

export function closePrintPreview(): void {
  listeners.forEach((fn) => fn(null));
}
