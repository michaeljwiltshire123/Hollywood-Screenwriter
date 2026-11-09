import { ScheduleRowItem } from '../../../types';
import { parseMinutesFromTimeStr } from './scheduleTimingOps';

export function renderDayGanttTimelineHtml(rows: ScheduleRowItem[]): string {
  if (rows.length === 0) return '<div style="color: #64748b; font-style: italic;">No items scheduled.</div>';

  const rowData = rows.map((r) => {
    const startMins = parseMinutesFromTimeStr(r.time);
    const durHours = r.durationHours || 1.0;
    const endMins = startMins + durHours * 60;
    return { ...r, startMins, durHours, endMins };
  });

  const minMins = Math.min(...rowData.map((d) => d.startMins));
  const maxMins = Math.max(...rowData.map((d) => d.endMins));
  const startHour = Math.floor(minMins / 60);
  const endHour = Math.max(startHour + 8, Math.ceil(maxMins / 60));
  const totalHours = Math.max(1, endHour - startHour);
  const totalMinsSpan = totalHours * 60;

  const hoursArray: number[] = [];
  for (let h = startHour; h <= endHour; h++) hoursArray.push(h);

  const headerTicksHtml = hoursArray.map((h) => {
    const displayH = String(h).padStart(2, '0') + ':00';
    return `<div style="flex: 1; text-align: left; font-size: 9px; font-weight: bold; color: #475569; border-left: 1px solid #cbd5e1; padding-left: 2px;">${displayH}</div>`;
  }).join('');

  const rowsHtml = rowData.map((r) => {
    const offsetMins = Math.max(0, r.startMins - startHour * 60);
    const leftPct = ((offsetMins / totalMinsSpan) * 100).toFixed(2);
    const widthPct = (((r.durHours * 60) / totalMinsSpan) * 100).toFixed(2);
    const barBg = r.type === 'BREAK' ? '#f59e0b' : r.intExt?.toLowerCase().includes('ext') ? '#0284c7' : '#7c3aed';

    let currentShotOffsetMins = offsetMins;
    const shotLinesHtml = (r.shots && r.shots.length > 0) ? r.shots.map((s, sIdx) => {
      const sMins = s.estimatedTimeMinutes || 30;
      const sLeftPct = ((currentShotOffsetMins / totalMinsSpan) * 100).toFixed(2);
      const sWidthPct = ((sMins / totalMinsSpan) * 100).toFixed(2);
      currentShotOffsetMins += sMins;
      const lineColor = sIdx % 2 === 0 ? '#38bdf8' : '#818cf8';
      return `
        <div style="position: absolute; left: ${sLeftPct}%; width: ${sWidthPct}%; bottom: 2px; height: 4px; background: ${lineColor}; border-radius: 2px;" title="${s.shotNumber} (${sMins}m)">
          <span style="position: absolute; top: -11px; left: 0; font-size: 8px; font-weight: 800; font-family: monospace; color: #0369a1;">${s.shotNumber}</span>
        </div>
      `;
    }).join('') : '';

    return `
      <div style="display: flex; align-items: center; border-bottom: 1px solid #e2e8f0; padding: 4px 0; min-height: 32px;">
        <div style="width: 250px; flex-shrink: 0; padding-right: 10px;">
          <div style="font-weight: bold; font-size: 11px; color: #0f172a; white-space: nowrap; overflow: hidden; text-overflow: ellipsis;">
            ${r.time} — ${r.description}
          </div>
          ${r.shots && r.shots.length > 0 ? `
            <div style="font-size: 9px; color: #0284c7; font-weight: bold; margin-top: 1px;">
              ${r.shots.length} planned setup${r.shots.length > 1 ? 's' : ''} (${r.shots.reduce((acc, s) => acc + (s.estimatedTimeMinutes || 30), 0)}m total)
            </div>
          ` : ''}
        </div>
        <div style="flex: 1; position: relative; height: 26px; background: #f8fafc; border-radius: 4px; border: 1px solid #e2e8f0;">
          <div style="position: absolute; top: 0; bottom: 0; left: 0; right: 0; display: flex;">
            ${hoursArray.map(() => '<div style="flex: 1; border-left: 1px dashed #e2e8f0;"></div>').join('')}
          </div>
          <div style="position: absolute; left: ${leftPct}%; width: ${widthPct}%; top: 2px; height: 14px; background: ${barBg}; border-radius: 3px; display: flex; align-items: center; justify-content: center; color: white; font-size: 9px; font-weight: bold; overflow: hidden; box-shadow: 0 1px 2px rgba(0,0,0,0.15);">
            <span>${r.durHours}h</span>
          </div>
          ${shotLinesHtml}
        </div>
      </div>
    `;
  }).join('');

  return `
    <div style="width: 100%; border: 1px solid #cbd5e1; border-radius: 6px; overflow: hidden; background: white; margin-top: 8px;">
      <div style="display: flex; background: #f1f5f9; padding: 6px 0; border-bottom: 2px solid #cbd5e1;">
        <div style="width: 250px; flex-shrink: 0; font-size: 10px; font-weight: 800; text-transform: uppercase; color: #334155; padding-left: 8px;">Scheduled Activity / Shot Sub-bars</div>
        <div style="flex: 1; display: flex;">${headerTicksHtml}</div>
      </div>
      <div style="padding: 4px 8px;">${rowsHtml}</div>
    </div>
  `;
}
