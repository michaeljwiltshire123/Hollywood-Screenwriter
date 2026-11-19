import React, { useState } from 'react';
import { RiskAssessmentItem, ScreenplayDocument } from '../../../types';
import { ModalThemeStyles } from '../../../lib/modalTheme';
import { Plus } from 'lucide-react';
import { HsExportActions } from './HsExportActions';
import { HazardRowItem } from './HazardRowItem';

interface HazardChecklistSectionProps {
  script: ScreenplayDocument;
  hazards: RiskAssessmentItem[];
  mt: ModalThemeStyles;
  onAdd: () => void;
  onRemove: (id: string) => void;
  onChangeField: (id: string, field: keyof RiskAssessmentItem, val: string) => void;
}

export const HazardChecklistSection: React.FC<HazardChecklistSectionProps> = ({
  script, hazards, mt, onAdd, onRemove, onChangeField,
}) => {
  const [filter, setFilter] = useState<'ALL' | 'HIGH' | 'MED' | 'LOW'>('ALL');
  const visible = filter === 'ALL' ? hazards : hazards.filter((h) => h.riskLevel === filter);

  return (
    <div id="tour-risk-table" className="border rounded-2xl p-6 space-y-5" style={mt.cardStyle}>
      <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b" style={mt.borderStyle}>
        <div className="space-y-1">
          <h3 className="text-sm font-bold">Automatic Set Hazard Checklist</h3>
          <p className="text-xs" style={mt.mutedStyle}>
            Detected automatically from your script scenes. Click straight into any box to edit wording or add your own checks.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-1 p-1 rounded-lg border" style={mt.subCardStyle}>
            {(['ALL', 'HIGH', 'MED', 'LOW'] as const).map((lvl) => (
              <button
                key={lvl}
                type="button"
                onClick={() => setFilter(lvl)}
                className="px-2.5 py-1.5 rounded text-xs font-semibold cursor-pointer transition"
                style={filter === lvl ? mt.primaryBtnStyle : { color: mt.theme.mutedText, backgroundColor: 'transparent' }}
              >
                {lvl === 'ALL' ? `All (${hazards.length})` : lvl}
              </button>
            ))}
          </div>

          <button
            type="button"
            onClick={onAdd}
            className="px-3.5 py-2 border rounded-lg text-xs font-bold flex items-center gap-1.5 transition cursor-pointer hover:opacity-85"
            style={mt.secondaryBtnStyle}
          >
            <Plus className="w-4 h-4" style={mt.accentStyle} />
            <span>Add Hazard</span>
          </button>
          <HsExportActions sheetType="hazards" script={script} hazards={hazards} mt={mt} />
        </div>
      </div>

      {visible.length === 0 ? (
        <div className="py-10 text-center space-y-3">
          <p className="text-sm" style={mt.mutedStyle}>No hazards match this priority filter.</p>
          <button type="button" onClick={() => setFilter('ALL')} className="px-4 py-2 rounded-lg border text-xs font-bold cursor-pointer" style={mt.secondaryBtnStyle}>
            Show all hazards
          </button>
        </div>
      ) : (
        <div className="divide-y" style={mt.borderStyle}>
          {visible.map((r, idx) => (
            <HazardRowItem key={r.id} item={r} index={idx} mt={mt} onChangeField={onChangeField} onRemove={onRemove} />
          ))}
        </div>
      )}
    </div>
  );
};
