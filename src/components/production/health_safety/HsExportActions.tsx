import React from 'react';
import { RiskAssessmentItem, ScreenplayDocument } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { Printer, FileDown, FileText } from 'lucide-react';
import { buildHsPrintHtml, HsSheetType } from './hsHtmlTemplates';
import { printHsHtml } from './hsPrintHelper';
import { exportHsPdf } from './hsPdfExporter';
import { exportHsWord } from './hsWordExporter';

interface HsExportActionsProps {
  sheetType: HsSheetType;
  script: ScreenplayDocument;
  hazards: RiskAssessmentItem[];
  mt: ModalThemeStyles;
  labelPrefix?: string;
}

export const HsExportActions: React.FC<HsExportActionsProps> = ({
  sheetType, script, hazards, mt, labelPrefix,
}) => (
  <div className="flex flex-wrap items-center gap-1.5">
    <button
      type="button"
      onClick={() => printHsHtml(buildHsPrintHtml(sheetType, script, hazards), { onDownloadPdf: () => exportHsPdf(sheetType, script, hazards) })}
      className="px-3 py-1.5 rounded text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-sm active:scale-95 hover:opacity-90"
      style={mt.primaryBtnStyle}
    >
      <Printer className="w-3.5 h-3.5" />
      <span>{labelPrefix ? `Print ${labelPrefix}` : 'Print'}</span>
    </button>
    <button
      type="button"
      onClick={() => { void exportHsPdf(sheetType, script, hazards); }}
      className="px-2.5 py-1.5 border rounded text-xs font-bold flex items-center gap-1 transition cursor-pointer hover:opacity-85"
      style={mt.secondaryBtnStyle}
    >
      <FileDown className="w-3.5 h-3.5" style={mt.accentStyle} />
      <span>PDF</span>
    </button>
    <button
      type="button"
      onClick={() => { void exportHsWord(sheetType, script, hazards); }}
      className="px-2.5 py-1.5 border rounded text-xs font-bold flex items-center gap-1 transition cursor-pointer hover:opacity-85"
      style={mt.secondaryBtnStyle}
    >
      <FileText className="w-3.5 h-3.5" style={mt.accentStyle} />
      <span>Word</span>
    </button>
  </div>
);
