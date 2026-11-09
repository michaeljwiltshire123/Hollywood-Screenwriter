import React, { useState } from 'react';
import { Trash2, X, Calendar, ArrowRight } from 'lucide-react';
import { ShootScheduleDaySheet } from '../../../types';
import { BatchAssignUnitButton } from './BatchAssignUnitButton';

interface BatchActionsBarProps {
  selectedCount: number;
  onDeleteSelected: () => void;
  onClearSelection: () => void;
  days: ShootScheduleDaySheet[];
  activeDayNumber: number;
  onMoveSelectedToDay: (targetDayNum: number) => void;
  onMoveSelectedToNewDay: () => void;
  unitsList?: number[];
  onAssignSelectedToUnit?: (unitNum: number) => void;
  onCreateAndAssignUnit?: () => void;
}

export const BatchActionsBar: React.FC<BatchActionsBarProps> = ({
  selectedCount, onDeleteSelected, onClearSelection, days, activeDayNumber,
  onMoveSelectedToDay, onMoveSelectedToNewDay,
  unitsList = [1], onAssignSelectedToUnit = () => {}, onCreateAndAssignUnit = () => {},
}) => {
  const [showDayMenu, setShowDayMenu] = useState(false);
  if (selectedCount === 0) return null;

  const otherDays = days.filter((d) => d.dayNumber !== activeDayNumber);

  return (
    <div className="bg-slate-900 border-x border-t border-slate-800 text-white px-4 py-2.5 flex items-center justify-between animate-in fade-in slide-in-from-top-1 duration-150 shadow-md relative">
      <div className="flex items-center gap-2 text-xs font-semibold">
        <span className="w-2 h-2 rounded-full bg-amber-400" />
        <span>{selectedCount} row{selectedCount > 1 ? 's' : ''} selected</span>
      </div>

      <div className="flex items-center gap-2 relative">
        <BatchAssignUnitButton
          unitsList={unitsList}
          onAssignSelectedToUnit={onAssignSelectedToUnit}
          onCreateAndAssignUnit={onCreateAndAssignUnit}
        />

        <div className="relative">
          <button
            onClick={() => setShowDayMenu(!showDayMenu)}
            className="px-3 py-1 bg-sky-600 hover:bg-sky-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
          >
            <Calendar className="w-3.5 h-3.5" />
            <span>Move to Day...</span>
          </button>

          {showDayMenu && (
            <div className="absolute right-0 bottom-full mb-2 w-56 bg-white border border-slate-200 rounded-xl shadow-2xl p-3 text-slate-800 z-50 text-xs animate-in fade-in zoom-in-95 duration-150">
              <div className="flex items-center justify-between border-b border-slate-100 pb-2 mb-2">
                <div className="flex items-center gap-1.5 font-bold text-xs text-slate-900">
                  <Calendar className="w-3.5 h-3.5 text-sky-500" />
                  <span>Select Target Day</span>
                </div>
              </div>

              <div className="space-y-1">
                {otherDays.map((d) => (
                  <button
                    key={d.dayNumber}
                    onClick={() => { setShowDayMenu(false); onMoveSelectedToDay(d.dayNumber); }}
                    className="w-full text-left px-3 py-2 rounded-lg hover:bg-slate-50 text-slate-700 font-semibold flex items-center justify-between transition cursor-pointer"
                  >
                    <span>Day {d.dayNumber} ({d.dateStr})</span>
                    <ArrowRight className="w-3.5 h-3.5 text-sky-500" />
                  </button>
                ))}
                <button
                  onClick={() => { setShowDayMenu(false); onMoveSelectedToNewDay(); }}
                  className="w-full text-left px-3 py-2 mt-1 rounded-lg border border-dashed border-amber-300 hover:border-amber-400 bg-amber-50/50 hover:bg-amber-100/60 text-amber-900 text-xs font-bold flex items-center justify-between transition cursor-pointer"
                >
                  <span>+ Create New Following Day</span>
                  <ArrowRight className="w-3.5 h-3.5 text-amber-600" />
                </button>
              </div>
            </div>
          )}
        </div>

        <button
          onClick={onDeleteSelected}
          className="px-3 py-1 bg-rose-600 hover:bg-rose-500 text-white rounded text-xs font-bold flex items-center gap-1.5 transition cursor-pointer shadow-xs"
        >
          <Trash2 className="w-3.5 h-3.5" />
          <span>Delete ({selectedCount})</span>
        </button>

        <button
          onClick={onClearSelection}
          className="px-2.5 py-1 bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white rounded text-xs font-semibold flex items-center gap-1 transition cursor-pointer"
        >
          <X className="w-3.5 h-3.5" />
          <span>Clear</span>
        </button>
      </div>
    </div>
  );
};
