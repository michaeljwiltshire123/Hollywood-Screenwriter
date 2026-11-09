import React, { useState } from 'react';
import { Layers, Plus, Check } from 'lucide-react';
import { getUnitLabel, MAX_UNITS } from './multiUnitOps';

interface UnitFilterDropdownProps {
  activeUnitFilter: number | 'ALL';
  unitsList: number[];
  onSelectUnitFilter: (unit: number | 'ALL') => void;
  onCreateNewUnit: () => void;
}

export const UnitFilterDropdown: React.FC<UnitFilterDropdownProps> = ({
  activeUnitFilter,
  unitsList,
  onSelectUnitFilter,
  onCreateNewUnit,
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const displayLabel = activeUnitFilter === 'ALL' ? 'All Units' : getUnitLabel(activeUnitFilter);

  return (
    <div className="relative inline-block font-sans">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-1.5 transition cursor-pointer shadow-xs active:scale-95"
        title="Filter schedule by shooting unit"
      >
        <Layers className="w-3.5 h-3.5" />
        <span>{displayLabel}</span>
        <span className="text-[10px] opacity-70">▾</span>
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 z-50 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 text-slate-800 animate-in fade-in zoom-in-95 duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
            <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
              <Layers className="w-3.5 h-3.5 text-amber-500" />
              <span>Shooting Units</span>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 uppercase tracking-wider">Filter</span>
          </div>

          <div className="space-y-1">
            <button
              type="button"
              onClick={() => {
                onSelectUnitFilter('ALL');
                setIsOpen(false);
              }}
              className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between font-bold text-xs transition cursor-pointer ${
                activeUnitFilter === 'ALL'
                  ? 'bg-amber-50 text-amber-950 border border-amber-200/80 shadow-2xs'
                  : 'hover:bg-slate-50 text-slate-700'
              }`}
            >
              <span>All Units (Master)</span>
              {activeUnitFilter === 'ALL' && <Check className="w-3.5 h-3.5 text-amber-600" />}
            </button>

            {unitsList.map((unitNum) => {
              const isSelected = activeUnitFilter === unitNum;
              return (
                <button
                  key={unitNum}
                  type="button"
                  onClick={() => {
                    onSelectUnitFilter(unitNum);
                    setIsOpen(false);
                  }}
                  className={`w-full text-left px-3 py-2 rounded-lg flex items-center justify-between font-semibold text-xs transition cursor-pointer ${
                    isSelected
                      ? 'bg-amber-50 text-amber-950 border border-amber-200/80 font-bold shadow-2xs'
                      : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span>{getUnitLabel(unitNum)}</span>
                  {isSelected && <Check className="w-3.5 h-3.5 text-amber-600" />}
                </button>
              );
            })}

            {unitsList.length < MAX_UNITS && (
              <button
                type="button"
                onClick={() => {
                  onCreateNewUnit();
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
