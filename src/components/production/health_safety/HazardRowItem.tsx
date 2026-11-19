import React from 'react';
import { RiskAssessmentItem } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { Trash2 } from 'lucide-react';

interface HazardRowItemProps {
  item: RiskAssessmentItem;
  index: number;
  mt: ModalThemeStyles;
  onChangeField: (id: string, field: keyof RiskAssessmentItem, val: string) => void;
  onRemove: (id: string) => void;
}

export const HazardRowItem: React.FC<HazardRowItemProps> = ({
  item: r, index, mt, onChangeField, onRemove,
}) => (
  <div className="py-5 first:pt-2 last:pb-2 space-y-4">
    <div className="flex flex-wrap items-center justify-between gap-3">
      <div className="flex flex-wrap items-center gap-3 flex-1 min-w-[240px]">
        <span className="text-xs font-mono tabular-nums opacity-60">{String(index + 1).padStart(2, '0')}</span>
        <input
          type="text"
          value={r.category}
          placeholder="Hazard category (e.g. Night Shoot, Rooftop Rigging)"
          onChange={(e) => onChangeField(r.id, 'category', e.target.value)}
          className="text-sm font-bold border-b border-transparent focus:border-current px-2 py-1 rounded bg-transparent focus:outline-none min-w-[200px] flex-1 max-w-sm"
          style={{ color: mt.theme.primaryText, backgroundColor: mt.inputStyle.backgroundColor }}
        />
        {r.sceneRefs && (
          <span className="text-xs font-mono" style={mt.mutedStyle}>· {r.sceneRefs}</span>
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2.5">
        <select
          aria-label="Priority"
          value={r.riskLevel}
          onChange={(e) => onChangeField(r.id, 'riskLevel', e.target.value)}
          className={`border rounded-lg px-3 py-2 text-xs font-bold cursor-pointer ${
            r.riskLevel === 'HIGH' ? 'text-rose-500' : r.riskLevel === 'MED' ? 'text-amber-500' : 'text-emerald-600'
          }`}
          style={{ backgroundColor: mt.inputStyle.backgroundColor, borderColor: mt.theme.borders }}
        >
          <option value="HIGH">High Priority</option>
          <option value="MED">Medium Priority</option>
          <option value="LOW">Low Priority</option>
        </select>

        <input
          type="text"
          value={r.responsiblePerson}
          placeholder="Responsible person (e.g. 1st AD)"
          onChange={(e) => onChangeField(r.id, 'responsiblePerson', e.target.value)}
          className="border rounded-lg px-3 py-2 text-xs w-44"
          style={mt.inputStyle}
        />

        <button
          type="button"
          onClick={() => onRemove(r.id)}
          className="p-2 hover:bg-rose-500/15 text-rose-500 rounded-lg transition cursor-pointer"
          title="Remove hazard"
        >
          <Trash2 className="w-4 h-4" />
        </button>
      </div>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
      <label className="space-y-1.5 block">
        <span className="text-xs font-semibold block" style={mt.mutedStyle}>Identified hazard</span>
        <textarea
          rows={3}
          value={r.hazard}
          placeholder="Describe what could go wrong on set..."
          onChange={(e) => onChangeField(r.id, 'hazard', e.target.value)}
          className="w-full border rounded-xl p-3.5 text-sm leading-relaxed resize-y"
          style={mt.inputStyle}
        />
      </label>

      <label className="space-y-1.5 block">
        <span className="text-xs font-semibold block" style={mt.mutedStyle}>Suggested safety controls</span>
        <textarea
          rows={3}
          value={r.controlMeasures}
          placeholder="Describe practical precautions, equipment, or crew roles..."
          onChange={(e) => onChangeField(r.id, 'controlMeasures', e.target.value)}
          className="w-full border rounded-xl p-3.5 text-sm leading-relaxed resize-y"
          style={mt.inputStyle}
        />
      </label>
    </div>
  </div>
);
