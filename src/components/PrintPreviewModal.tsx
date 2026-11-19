import React, { useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { FileDown, Printer, X } from 'lucide-react';
import { AppThemeConfig } from '../lib/themePresets';
import { getModalTheme } from '../lib/modalTheme';
import { PrintPreviewRequest, subscribePrintPreview } from '../lib/print/printPreviewBus';
import { exportHtmlToPdf } from '../lib/print/htmlToPdfExporter';

export const PrintPreviewModal: React.FC<{ themeConfig?: AppThemeConfig }> = ({ themeConfig }) => {
  const [req, setReq] = useState<PrintPreviewRequest | null>(null);
  const [isSaving, setIsSaving] = useState(false);
  const mt = getModalTheme(themeConfig);

  useEffect(() => subscribePrintPreview(setReq), []);

  useEffect(() => {
    if (!req) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setReq(null); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [req]);

  if (!req) return null;

  const handleSavePdf = async () => {
    if (isSaving) return;
    setIsSaving(true);
    try {
      if (req.onDownloadPdf) await req.onDownloadPdf();
      else await exportHtmlToPdf(req.htmlContent, req.title);
    } finally {
      setIsSaving(false);
    }
  };

  return createPortal(
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-3 sm:p-6 backdrop-blur-xs font-sans" style={mt.overlayStyle} onClick={() => setReq(null)}>
      <div className="w-full max-w-5xl h-[88vh] rounded-2xl border shadow-2xl flex flex-col overflow-hidden" style={mt.windowStyle} onClick={(e) => e.stopPropagation()}>
        <div className="px-4 py-3 border-b flex flex-wrap items-center justify-between gap-3 shrink-0" style={mt.borderStyle}>
          <div className="min-w-0">
            <h3 className="text-sm font-bold truncate flex items-center gap-2">
              <Printer className="w-4 h-4 shrink-0" style={mt.accentStyle} />
              <span>Print Preview — {req.title}</span>
            </h3>
            <p className="text-xs mt-0.5" style={mt.mutedStyle}>Save a print-ready PDF directly to your computer, or close to return to your saved work.</p>
          </div>

          <div className="flex items-center gap-2 shrink-0">
            <button type="button" onClick={() => { void handleSavePdf(); }} disabled={isSaving} className="px-4 py-2 rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm hover:opacity-90 disabled:opacity-60" style={mt.primaryBtnStyle}>
              <FileDown className="w-4 h-4" />
              <span>{isSaving ? 'Preparing PDF...' : 'Save Print-Ready PDF'}</span>
            </button>
            <button type="button" onClick={() => setReq(null)} className="px-3.5 py-2 rounded-lg border text-xs font-bold flex items-center gap-1.5 transition cursor-pointer hover:opacity-80" style={mt.secondaryBtnStyle}>
              <X className="w-4 h-4" />
              <span>Save and close without printing</span>
            </button>
          </div>
        </div>

        <div className="flex-1 p-4 overflow-hidden bg-slate-900/10">
          <iframe title="Print Preview Document" srcDoc={req.htmlContent} className="w-full h-full bg-white rounded-lg border shadow-inner" style={mt.borderStyle} />
        </div>
      </div>
    </div>,
    document.body
  );
};
