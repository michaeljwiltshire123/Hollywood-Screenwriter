import React from 'react';
import { RiskAssessmentItem, ScreenplayDocument } from '../../../types';
import { ToolboxBriefingData } from '../../../types/healthSafety';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { Sparkles } from 'lucide-react';
import { getResolvedBriefing } from './hsDefaultData';
import { HsExportActions } from './HsExportActions';
import { ToolboxCrewList } from './ToolboxCrewList';

interface ToolboxTalkSectionProps {
  script: ScreenplayDocument;
  hazards: RiskAssessmentItem[];
  mt: ModalThemeStyles;
  onUpdateBriefing: (updated: ToolboxBriefingData) => void;
}

export const ToolboxTalkSection: React.FC<ToolboxTalkSectionProps> = ({
  script, hazards, mt, onUpdateBriefing,
}) => {
  const b = getResolvedBriefing(script);
  const setField = <K extends keyof ToolboxBriefingData>(k: K, val: ToolboxBriefingData[K]) =>
    onUpdateBriefing({ ...b, [k]: val });

  const pullFromCallSheet = () => {
    const existingNames = new Set(b.attendees.map((a) => a.name.toLowerCase()));
    const cs = script.callSheetData;
    const extras = [
      cs?.directorName ? { name: cs.directorName, role: 'Director' } : null,
      cs?.producerName ? { name: cs.producerName, role: 'Producer' } : null,
      cs?.dopName ? { name: cs.dopName, role: 'DOP / Camera' } : null,
      ...(cs?.characters || []).map((c) => c.actorName ? { name: c.actorName, role: `Cast (${c.characterName})` } : null),
    ].filter((x): x is { name: string; role: string } => Boolean(x && !existingNames.has(x.name.toLowerCase())));
    if (extras.length === 0) return;
    setField('attendees', [
      ...b.attendees,
      ...extras.map((e, i) => ({ id: `att-cs-${Date.now()}-${i}`, name: e.name, role: e.role, signed: false })),
    ]);
  };

  const insertHazardsIntoNotes = () => {
    const summary = hazards.map((h) => `• ${h.category}: ${h.controlMeasures}`).join('\n');
    setField('keyBriefingNotes', b.keyBriefingNotes ? `${b.keyBriefingNotes}\n\n${summary}` : summary);
  };

  return (
    <div className="border rounded-2xl p-6 space-y-6" style={mt.cardStyle}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b" style={mt.borderStyle}>
        <div className="space-y-1">
          <h3 className="text-sm font-bold">Daily Safety Briefing (Toolbox Talk)</h3>
          <p className="text-xs" style={mt.mutedStyle}>
            Write your morning set talk below. Print, PDF, and Word exports keep your notes and add 6 blank sign-off lines.
          </p>
        </div>
        <HsExportActions sheetType="briefing" script={script} hazards={hazards} mt={mt} />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <label className="space-y-1.5 block"><span className="text-xs font-semibold block" style={mt.mutedStyle}>Shoot date</span>
          <input type="text" value={b.shootDate} onChange={(e) => setField('shootDate', e.target.value)} className="w-full border rounded-lg px-3 py-2.5 text-sm" style={mt.inputStyle} />
        </label>
        <label className="space-y-1.5 block"><span className="text-xs font-semibold block" style={mt.mutedStyle}>Location</span>
          <input type="text" value={b.location} onChange={(e) => setField('location', e.target.value)} placeholder="e.g. Riverside Studio 2" className="w-full border rounded-lg px-3 py-2.5 text-sm" style={mt.inputStyle} />
        </label>
        <label className="space-y-1.5 block"><span className="text-xs font-semibold block" style={mt.mutedStyle}>Safety officer / 1st AD</span>
          <input type="text" value={b.safetyOfficer} onChange={(e) => setField('safetyOfficer', e.target.value)} placeholder="Full name" className="w-full border rounded-lg px-3 py-2.5 text-sm" style={mt.inputStyle} />
        </label>
        <label className="space-y-1.5 block"><span className="text-xs font-semibold block" style={mt.mutedStyle}>Weather forecast</span>
          <input type="text" value={b.weatherSummary} onChange={(e) => setField('weatherSummary', e.target.value)} placeholder="e.g. Dry, 14°C, light breeze" className="w-full border rounded-lg px-3 py-2.5 text-sm" style={mt.inputStyle} />
        </label>
      </div>

      <div className="space-y-2">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <label htmlFor="briefing-notes-area" className="text-xs font-semibold" style={mt.mutedStyle}>
            Morning briefing notes &amp; safety reminders
          </label>
          <button type="button" onClick={insertHazardsIntoNotes} className="px-3 py-1.5 border rounded-lg text-xs font-semibold flex items-center gap-1.5 cursor-pointer hover:opacity-85" style={mt.secondaryBtnStyle}>
            <Sparkles className="w-3.5 h-3.5" style={mt.accentStyle} /><span>Insert active hazards to edit</span>
          </button>
        </div>
        <textarea id="briefing-notes-area" rows={5} value={b.keyBriefingNotes} onChange={(e) => setField('keyBriefingNotes', e.target.value)} placeholder="Write the key safety points to cover before camera roll..." className="w-full border rounded-xl p-4 text-sm leading-relaxed resize-y" style={mt.inputStyle} />
      </div>

      <ToolboxCrewList
        attendees={b.attendees}
        mt={mt}
        onPullFromCallSheet={pullFromCallSheet}
        onAdd={() => setField('attendees', [...b.attendees, { id: `att-${Date.now()}`, name: '', role: '', signed: false }])}
        onChange={(updated) => setField('attendees', updated)}
      />
    </div>
  );
};
