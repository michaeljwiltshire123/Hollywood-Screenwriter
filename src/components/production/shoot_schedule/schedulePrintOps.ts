import { ShootScheduleDaySheet, CallSheetData } from '../../../types';
import { renderDayGanttTimelineHtml } from './printGanttHtmlHelper';
import { renderCallSheetShotBadgesHtml } from './printShotBadgesHelper';
import { formatTruncatedDate } from './exportDateFormatHelper';
import { filterRowsByUnit, getUnitLabel, getUnitShortLabel } from './multiUnitOps';
import { UnitPrintMode } from './PrintExportModal';

export function executeSchedulePrint(
  projectTitle: string,
  daysToPrint: ShootScheduleDaySheet[],
  isMasterAll: boolean,
  callData?: CallSheetData,
  author?: string,
  watermarkLogoUrl?: string,
  unitOption?: { mode: UnitPrintMode; unitNumber?: number }
) {
  const printWindow = window.open('', '_blank');
  if (!printWindow) return;

  const totalDays = daysToPrint.length;
  const dateFromFormatted = formatTruncatedDate(callData?.dateFrom || daysToPrint[0]?.dateStr || '');
  const dateToFormatted = formatTruncatedDate(callData?.dateTo || daysToPrint[daysToPrint.length - 1]?.dateStr || '');

  const filterDayRows = (rows: typeof daysToPrint[0]['rows'], targetUnit?: number) => {
    if (!targetUnit) return rows;
    return filterRowsByUnit(rows, targetUnit);
  };

  const bodyContent = daysToPrint.map((day) => {
    const dayDateFormatted = formatTruncatedDate(day.dateStr);

    if (unitOption?.mode === 'SEPARATE') {
      const unitsPresent = Array.from(new Set(day.rows.map((r) => r.unitNumber || 1))).sort((a, b) => a - b);
      return unitsPresent.map((uNum) => {
        const uRows = filterDayRows(day.rows, uNum);
        return renderSingleDayPrintPage(
          day, totalDays, dayDateFormatted, uRows, projectTitle, dateFromFormatted, dateToFormatted,
          callData, author, watermarkLogoUrl, getUnitLabel(uNum)
        );
      }).join('');
    }

    const filteredRows = unitOption?.mode === 'SINGLE' && unitOption.unitNumber
      ? filterDayRows(day.rows, unitOption.unitNumber)
      : day.rows;

    const unitSubtitle = unitOption?.mode === 'SINGLE' && unitOption.unitNumber
      ? getUnitLabel(unitOption.unitNumber)
      : undefined;

    return renderSingleDayPrintPage(
      day, totalDays, dayDateFormatted, filteredRows, projectTitle, dateFromFormatted, dateToFormatted,
      callData, author, watermarkLogoUrl, unitSubtitle
    );
  }).join('');

  const documentTitle = `${projectTitle || 'Screenplay'} Call Shooting Schedule`;
  printWindow.document.write(`<!DOCTYPE html><html><head><title>${documentTitle}</title><style>@page { size: letter landscape; margin: 0; } body { margin: 0; padding: 0; background: #fff; -webkit-print-color-adjust: exact; print-color-adjust: exact; }</style></head><body>${bodyContent}<script>window.onload = function() { window.print(); };</script></body></html>`);
  printWindow.document.close();
}

function renderSingleDayPrintPage(
  day: ShootScheduleDaySheet, totalDays: number, dayDateFormatted: string,
  rows: typeof day.rows, projectTitle: string, dateFromFormatted: string, dateToFormatted: string,
  callData?: CallSheetData, author?: string, watermarkLogoUrl?: string, unitSubtitle?: string
) {
  return `
    <div style="position: relative; page-break-after: always; padding: 10mm 15mm; font-family: sans-serif; color: #0f172a;">
      <div style="position: absolute; top: 10mm; right: 15mm; font-size: 11px; font-weight: bold; color: #475569; background: #f1f5f9; padding: 4px 10px; border-radius: 4px; border: 1px solid #cbd5e1;">
        Day ${day.dayNumber} of ${totalDays} (${dayDateFormatted})${unitSubtitle ? ` — ${unitSubtitle}` : ''}
      </div>
      <div style="border-bottom: 3px solid #0f172a; padding-bottom: 12px; margin-bottom: 16px; display: flex; align-items: center; gap: 16px;">
        ${watermarkLogoUrl ? `<img src="${watermarkLogoUrl}" alt="Logo" style="height: 48px; max-width: 140px; object-fit: contain; border-radius: 4px; padding: 2px; border: 1px solid #e2e8f0;" />` : ''}
        <div style="flex: 1;">
          <h1 style="font-size: 20px; font-weight: 900; margin: 0; text-transform: uppercase;">CALL SHEET — ${projectTitle || 'SCREENPLAY'}${unitSubtitle ? ` (${unitSubtitle.toUpperCase()})` : ''}</h1>
          <div style="display: flex; flex-wrap: wrap; gap: 20px; font-size: 11px; color: #334155; margin-top: 6px; font-weight: 600;">
            <div><strong>Director:</strong> ${callData?.directorName || author || 'Director'}</div>
            <div><strong>Producer:</strong> ${callData?.producerName || 'Producer'}</div>
            <div><strong>Dates:</strong> ${dateFromFormatted} to ${dateToFormatted}</div>
            ${(callData?.emergencyContactName || callData?.emergencyContactPhone) ? `<div><strong>Emergency:</strong> ${callData.emergencyContactName ? `${callData.emergencyContactName} ` : ''}${callData.emergencyContactPhone ? `(${callData.emergencyContactPhone})` : ''}</div>` : ''}
          </div>
        </div>
      </div>

      ${day.isRestDay ? `<div style="padding: 40px; text-align: center; background: #f8fafc; border: 1px dashed #cbd5e1; font-weight: bold;">COMPANY REST DAY — NO FILMING SCHEDULED</div>` : `
        <table style="width: 100%; border-collapse: collapse; font-size: 11px; margin-bottom: 24px;">
          <thead><tr style="background: #0f172a; color: #ffffff; text-transform: uppercase; font-size: 10px;"><th style="padding: 8px; border: 1px solid #334155;">Time</th><th style="padding: 8px; border: 1px solid #334155;">Scene #</th><th style="padding: 8px; border: 1px solid #334155;">Unit</th><th style="padding: 8px; border: 1px solid #334155;">Int/Ext</th><th style="padding: 8px; border: 1px solid #334155;">Location</th><th style="padding: 8px; border: 1px solid #334155;">Scene Description & Shot List</th><th style="padding: 8px; border: 1px solid #334155;">Day/Night</th><th style="padding: 8px; border: 1px solid #334155;">Cast</th></tr></thead>
          <tbody>${rows.map((r) => `<tr style="border-bottom: 1px solid #cbd5e1; ${r.type === 'BREAK' ? 'background: #fefce8;' : ''}"><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; font-family: monospace;">${r.time}</td><td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${r.sceneNumber || '—'}</td><td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center; font-weight: bold;">${getUnitShortLabel(r.unitNumber)}</td><td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${r.intExt || '—'}</td><td style="padding: 8px; border: 1px solid #cbd5e1; font-weight: bold; color: #0f766e;">${r.location || '—'}</td><td style="padding: 8px; border: 1px solid #cbd5e1;"><div style="font-weight: ${r.type === 'SCENE' ? 'bold' : 'normal'}; font-size: 11px;">${r.description}</div>${renderCallSheetShotBadgesHtml(r.shots)}</td><td style="padding: 8px; border: 1px solid #cbd5e1; text-align: center;">${r.dayNight || '—'}</td><td style="padding: 8px; border: 1px solid #cbd5e1;">${(r.characterTags || []).join(', ') || '—'}</td></tr>`).join('')}</tbody>
        </table>
        <div style="page-break-before: always; border-top: 2px dashed #94a3b8; padding-top: 20px;">
          <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px;">
            <h2 style="font-size: 16px; font-weight: 800; text-transform: uppercase; margin: 0; color: #0f172a;">Day ${day.dayNumber} — Production Gantt Chart & Timeline</h2>
            <div style="font-size: 11px; font-weight: bold; color: #475569;">Day ${day.dayNumber} of ${totalDays}</div>
          </div>
          ${renderDayGanttTimelineHtml(rows)}
        </div>
      `}
    </div>
  `;
}
