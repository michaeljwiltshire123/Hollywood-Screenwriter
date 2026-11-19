import React from 'react';
import { ToolboxAttendee } from '../../../types/healthSafety';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { Plus, Trash2, Users } from 'lucide-react';

interface ToolboxCrewListProps {
  attendees: ToolboxAttendee[];
  mt: ModalThemeStyles;
  onPullFromCallSheet: () => void;
  onAdd: () => void;
  onChange: (updated: ToolboxAttendee[]) => void;
}

export const ToolboxCrewList: React.FC<ToolboxCrewListProps> = ({
  attendees, mt, onPullFromCallSheet, onAdd, onChange,
}) => (
  <div className="space-y-3 pt-4 border-t" style={mt.borderStyle}>
    <div className="flex flex-wrap items-center justify-between gap-2">
      <div>
        <h4 className="text-sm font-bold">Cast &amp; Crew Sign-Off Sheet ({attendees.length})</h4>
        <p className="text-xs" style={mt.mutedStyle}>
          Add known cast and crew now—Print, PDF, and Word exports include 6 extra blank handwritten lines for set.
        </p>
      </div>
      <div className="flex flex-wrap items-center gap-2">
        <button type="button" onClick={onPullFromCallSheet} className="px-3 py-2 border rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-85" style={mt.secondaryBtnStyle}>
          <Users className="w-3.5 h-3.5" style={mt.accentStyle} /><span>Import from Call Sheet</span>
        </button>
        <button type="button" onClick={onAdd} className="px-3 py-2 border rounded-lg text-xs font-bold flex items-center gap-1.5 cursor-pointer hover:opacity-85" style={mt.secondaryBtnStyle}>
          <Plus className="w-3.5 h-3.5" style={mt.accentStyle} /><span>Add Person</span>
        </button>
      </div>
    </div>

    {attendees.length === 0 ? (
      <div className="py-6 px-4 rounded-xl border border-dashed text-center text-xs" style={{ ...mt.subCardStyle, ...mt.mutedStyle }}>
        No cast or crew listed yet. Click <strong>Import from Call Sheet</strong> or <strong>Add Person</strong>, or export straight away for a blank sign-off sheet.
      </div>
    ) : (
      <div className="space-y-2.5">
        {attendees.map((a) => (
          <div key={a.id} className="grid grid-cols-1 sm:grid-cols-12 gap-2.5 items-center">
            <input type="text" value={a.name} placeholder="Full name" onChange={(e) => onChange(attendees.map((x) => x.id === a.id ? { ...x, name: e.target.value } : x))} className="sm:col-span-5 border rounded-lg px-3 py-2.5 text-sm" style={mt.inputStyle} />
            <input type="text" value={a.role} placeholder="Role or department" onChange={(e) => onChange(attendees.map((x) => x.id === a.id ? { ...x, role: e.target.value } : x))} className="sm:col-span-4 border rounded-lg px-3 py-2.5 text-sm" style={mt.inputStyle} />
            <label className="sm:col-span-2 flex items-center gap-2 px-2 py-2 text-xs font-medium cursor-pointer select-none">
              <input type="checkbox" checked={a.signed} onChange={(e) => onChange(attendees.map((x) => x.id === a.id ? { ...x, signed: e.target.checked } : x))} className="w-4 h-4" />
              <span>Briefed</span>
            </label>
            <button type="button" onClick={() => onChange(attendees.filter((x) => x.id !== a.id))} className="sm:col-span-1 text-rose-500 p-2 hover:bg-rose-500/15 rounded-lg cursor-pointer justify-self-end" title="Remove person"><Trash2 className="w-4 h-4" /></button>
          </div>
        ))}
      </div>
    )}
  </div>
);
