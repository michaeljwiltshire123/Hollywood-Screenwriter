import { ShotSetupItem } from '../../../types';

export function renderCallSheetShotBadgesHtml(shots?: ShotSetupItem[]): string {
  if (!shots || shots.length === 0) return '';

  const badges = shots.map((s) => {
    const formattedDesc = (s.description || '')
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/\n/g, '<br/>');

    return `
      <div style="display: flex; align-items: flex-start; gap: 8px; background: #f0f9ff; border: 1px solid #bae6fd; border-radius: 4px; padding: 5px 8px; margin-top: 4px;">
        <span style="font-weight: 900; font-family: monospace; color: #0284c7; font-size: 10px; background: #e0f2fe; padding: 1px 5px; border-radius: 3px; border: 1px solid #7dd3fc; margin-top: 1px;">${s.shotNumber}</span>
        <div style="flex: 1;">
          <div style="display: flex; align-items: baseline; gap: 6px;">
            <span style="font-weight: bold; color: #0369a1; font-size: 10px;">${s.setup}</span>
            <span style="color: #64748b; font-size: 9px; font-family: monospace;">(${s.lens})</span>
            <span style="font-weight: bold; color: #d97706; font-size: 9px; font-family: monospace;">${s.estimatedTimeMinutes || 30}m</span>
          </div>
          ${formattedDesc ? `<div style="color: #334155; font-size: 10px; margin-top: 2px; line-height: 1.4; white-space: pre-wrap;">${formattedDesc}</div>` : ''}
        </div>
      </div>
    `;
  }).join('');

  return `<div style="margin-top: 6px; space-y: 3px;">${badges}</div>`;
}
