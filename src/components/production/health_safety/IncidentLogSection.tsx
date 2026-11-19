import React from 'react';
import { RiskAssessmentItem, ScreenplayDocument } from '../../../types';
import { IncidentLogEntry } from '../../../types/healthSafety';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { Plus, Trash2 } from 'lucide-react';
import { getResolvedIncidents } from './hsDefaultData';
import { HsExportActions } from './HsExportActions';

interface IncidentLogSectionProps {
  script: ScreenplayDocument;
  hazards: RiskAssessmentItem[];
  mt: ModalThemeStyles;
  onUpdateIncidents: (updated: IncidentLogEntry[]) => void;
}

export const IncidentLogSection: React.FC<IncidentLogSectionProps> = ({
  script, hazards, mt, onUpdateIncidents,
}) => {
  const incidents = getResolvedIncidents(script);

  const addIncident = () => onUpdateIncidents([
    {
      id: `inc-${Date.now()}`,
      dateTime: new Date().toLocaleString('en-GB', { dateStyle: 'short', timeStyle: 'short' }),
      location: script.callSheetData?.locationName || '',
      personInvolved: '',
      summary: '',
      actionTaken: '',
      reportedBy: script.healthSafetyData?.briefing?.safetyOfficer || '',
    },
    ...incidents,
  ]);

  const updateField = (id: string, field: keyof IncidentLogEntry, val: string) =>
    onUpdateIncidents(incidents.map((i) => (i.id === id ? { ...i, [field]: val } : i)));

  return (
    <div className="border rounded-2xl p-6 space-y-5" style={mt.cardStyle}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b" style={mt.borderStyle}>
        <div className="space-y-1">
          <h3 className="text-sm font-bold">On-Set Incident &amp; Near-Miss Log ({incidents.length})</h3>
          <p className="text-xs" style={mt.mutedStyle}>
            Log incidents or near-misses in full detail. Print, PDF, and Word exports automatically add 6 blank rows for clipboards.
          </p>
        </div>
        <div className="flex flex-wrap items-center gap-2">
          <button type="button" onClick={addIncident} className="px-3.5 py-2 border rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-85" style={mt.secondaryBtnStyle}>
            <Plus className="w-4 h-4" style={mt.accentStyle} /><span>Log Incident</span>
          </button>
          <HsExportActions sheetType="incidents" script={script} hazards={hazards} mt={mt} />
        </div>
      </div>

      {incidents.length === 0 ? (
        <div className="py-10 px-6 border border-dashed rounded-xl text-center space-y-3" style={mt.subCardStyle}>
          <p className="text-sm font-medium">No incidents or near-misses logged yet.</p>
          <p className="text-xs max-w-md mx-auto" style={mt.mutedStyle}>
            Use the buttons above to print a blank clipboard sheet before shooting, or record an incident on screen below.
          </p>
          <button type="button" onClick={addIncident} className="px-4 py-2 rounded-lg text-xs font-bold inline-flex items-center gap-1.5 cursor-pointer hover:opacity-90" style={mt.primaryBtnStyle}>
            <Plus className="w-4 h-4" /><span>Log First Incident</span>
          </button>
        </div>
      ) : (
        <div className="divide-y" style={mt.borderStyle}>
          {incidents.map((item, idx) => (
            <div key={item.id} className="py-5 first:pt-2 last:pb-2 space-y-4">
              <div className="flex items-center justify-between gap-2">
                <span className="text-xs font-bold font-mono tabular-nums" style={mt.mutedStyle}>Entry {String(idx + 1).padStart(2, '0')}</span>
                <button type="button" onClick={() => onUpdateIncidents(incidents.filter((x) => x.id !== item.id))} className="px-2.5 py-1.5 text-xs font-semibold text-rose-500 hover:bg-rose-500/15 rounded-lg inline-flex items-center gap-1 cursor-pointer">
                  <Trash2 className="w-3.5 h-3.5" /><span>Remove</span>
                </button>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3">
                <label className="space-y-1 block"><span className="text-xs font-semibold block" style={mt.mutedStyle}>Date &amp; time</span><input type="text" value={item.dateTime} onChange={(e) => updateField(item.id, 'dateTime', e.target.value)} className="w-full border rounded-lg px-3 py-2 text-sm" style={mt.inputStyle} /></label>
                <label className="space-y-1 block"><span className="text-xs font-semibold block" style={mt.mutedStyle}>Set location</span><input type="text" value={item.location} onChange={(e) => updateField(item.id, 'location', e.target.value)} placeholder="Scene or area" className="w-full border rounded-lg px-3 py-2 text-sm" style={mt.inputStyle} /></label>
                <label className="space-y-1 block"><span className="text-xs font-semibold block" style={mt.mutedStyle}>Person involved</span><input type="text" value={item.personInvolved} onChange={(e) => updateField(item.id, 'personInvolved', e.target.value)} placeholder="Name & role" className="w-full border rounded-lg px-3 py-2 text-sm" style={mt.inputStyle} /></label>
                <label className="space-y-1 block"><span className="text-xs font-semibold block" style={mt.mutedStyle}>Reported by</span><input type="text" value={item.reportedBy} onChange={(e) => updateField(item.id, 'reportedBy', e.target.value)} placeholder="Officer or crew member" className="w-full border rounded-lg px-3 py-2 text-sm" style={mt.inputStyle} /></label>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="space-y-1.5 block"><span className="text-xs font-semibold block" style={mt.mutedStyle}>What happened</span><textarea rows={4} value={item.summary} onChange={(e) => updateField(item.id, 'summary', e.target.value)} placeholder="Describe the incident or near-miss clearly..." className="w-full border rounded-xl p-3.5 text-sm leading-relaxed resize-y" style={mt.inputStyle} /></label>
                <label className="space-y-1.5 block"><span className="text-xs font-semibold block" style={mt.mutedStyle}>First aid &amp; corrective action</span><textarea rows={4} value={item.actionTaken} onChange={(e) => updateField(item.id, 'actionTaken', e.target.value)} placeholder="Record treatment, hospital visit, or fix put in place..." className="w-full border rounded-xl p-3.5 text-sm leading-relaxed resize-y" style={mt.inputStyle} /></label>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
