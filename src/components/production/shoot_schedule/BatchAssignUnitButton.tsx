import React, { useState } from 'react';
import { Layers, Plus, Check } from 'lucide-react';
import { getUnitLabel, MAX_UNITS } from './multiUnitOps';

interface BatchAssignUnitButtonProps {
  unitsList: number[];
  onAssignSelectedToUnit: (unitNum: number) => void;
  onCreateAndAssignUnit: () => void;
}

export const BatchAssignUnitButton: React.FC<BatchAssignUnitButtonProps> = ({
  unitsList,
  onAssignSelectedToUnit,
  onCreateAndAssignUnit,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleClickMain = () => {
    if (unitsList.length <= 1) {
      onCreateAndAssignUnit();
    } else {
      setIsOpen(!isOpen);
    }
  };

  return (
    <div className="relative inline-block font-sans">
      <button
        type="button"
        onClick={handleClickMain}
        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 border border-amber-400 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
        title="Assign selected scenes to a filming unit"
      >
        <Layers className="w-3.5 h-3.5" />
        <span>Assign to Unit</span>
        {unitsList.length > 1 && <span className="text-[10px] opacity-70">▾</span>}
      </button>

      {isOpen && unitsList.length > 1 && (
        <div className="absolute left-0 top-full mt-2 z-50 w-52 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Assign Selected To:</span>
            </div>
          </div>

          <div className="space-y-1">
            {unitsList.map((unitNum) => (
              <button
                key={unitNum}
                type="button"
                onClick={() => {
                  onAssignSelectedToUnit(unitNum);
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 rounded-lg flex items-center justify-between font-semibold text-xs hover:bg-slate-50 text-slate-700 transition cursor-pointer"
              >
                <span>{getUnitLabel(unitNum)}</span>
                <Check className="w-3.5 h-3.5 text-amber-600 opacity-0 hover:opacity-100" />
              </button>
            ))}

            {unitsList.length < MAX_UNITS && (
              <button
                type="button"
                onClick={() => {
                  onCreateAndAssignUnit();
                  setIsOpen(false);
                }}
                className="w-full text-left px-3 py-2 mt-1 rounded-lg border border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-100/60 text-amber-900 text-xs font-bold flex items-center gap-2 transition cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5 text-amber-600" />
                <span>Create {getUnitLabel(unitsList.length + 1)}</span>
              </button>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
