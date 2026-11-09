import React, { useState } from 'react';
import { Printer, FileText, X, Layers, ChevronDown } from 'lucide-react';
import { getUnitLabel } from './multiUnitOps';

export type UnitPrintMode = 'SEPARATE' | 'COMBINED' | 'SINGLE';

interface PrintExportModalProps {
  isOpen: boolean;
  activeDayNumber: number;
  totalDays: number;
  unitsList?: number[];
  onClose: () => void;
  onPrintCurrentDay: (unitOption?: { mode: UnitPrintMode; unitNumber?: number }) => void;
  onPrintAllDays: (unitOption?: { mode: UnitPrintMode; unitNumber?: number }) => void;
}

export const PrintExportModal: React.FC<PrintExportModalProps> = ({
  isOpen,
  activeDayNumber,
  totalDays,
  unitsList = [1],
  onClose,
  onPrintCurrentDay,
  onPrintAllDays,
}) => {
  const [printMode, setPrintMode] = useState<UnitPrintMode>('COMBINED');
  const [selectedUnit, setSelectedUnit] = useState<number>(1);

  if (!isOpen) return null;

  const handlePrintCurrent = () => {
    onPrintCurrentDay({ mode: printMode, unitNumber: printMode === 'SINGLE' ? selectedUnit : undefined });
    onClose();
  };

  const handlePrintAll = () => {
    onPrintAllDays({ mode: printMode, unitNumber: printMode === 'SINGLE' ? selectedUnit : undefined });
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in font-sans">
      <div className="bg-white rounded-2xl border border-slate-300 shadow-2xl w-full max-w-md p-5 space-y-4 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-200 pb-2.5">
          <div className="flex items-center gap-2">
            <Printer className="w-4 h-4 text-amber-600" />
            <h3 className="text-sm font-black text-slate-900 uppercase tracking-tight">Print & PDF Export Options</h3>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-700 cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        <p className="text-xs text-slate-600">
          Select whether to print the active daily call sheet or full production schedule, and configure filming unit preferences:
        </p>

        {/* Unit Selection Options */}
        <div className="space-y-1.5 bg-slate-50 p-2.5 rounded-xl border border-slate-200 text-xs">
          <div className="font-bold text-[10px] uppercase text-slate-500 tracking-wider mb-1">
            Unit Print Scope:
          </div>
          <div className="grid grid-cols-3 gap-1.5">
            <button
              type="button"
              onClick={() => setPrintMode('SEPARATE')}
              className={`p-1.5 rounded-lg border text-center font-bold text-[11px] transition cursor-pointer ${
                printMode === 'SEPARATE'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              Print Units Separately
            </button>
            <button
              type="button"
              onClick={() => setPrintMode('COMBINED')}
              className={`p-1.5 rounded-lg border text-center font-bold text-[11px] transition cursor-pointer ${
                printMode === 'COMBINED'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              Combine All Units
            </button>
            <button
              type="button"
              onClick={() => setPrintMode('SINGLE')}
              className={`p-1.5 rounded-lg border text-center font-bold text-[11px] transition cursor-pointer ${
                printMode === 'SINGLE'
                  ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-xs'
                  : 'bg-white text-slate-700 hover:bg-slate-100 border-slate-300'
              }`}
            >
              Choose Unit
            </button>
          </div>

          {printMode === 'SINGLE' && (
            <div className="pt-2 flex items-center justify-between gap-2 animate-in fade-in">
              <span className="font-semibold text-slate-600 text-xs">Target Unit:</span>
              <div className="relative inline-block flex-1">
                <select
                  value={selectedUnit}
                  onChange={(e) => setSelectedUnit(parseInt(e.target.value, 10))}
                  className="w-full appearance-none bg-white font-bold py-1 px-3 pr-8 rounded-lg border border-slate-300 text-xs cursor-pointer focus:outline-none focus:ring-2 focus:ring-amber-500"
                >
                  {unitsList.map((u) => (
                    <option key={u} value={u}>
                      {getUnitLabel(u)}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 absolute right-2.5 top-2 pointer-events-none text-slate-500" />
              </div>
            </div>
          )}
        </div>

        <div className="space-y-2 text-xs">
          <button
            type="button"
            onClick={handlePrintCurrent}
            className="w-full p-3 text-left rounded-xl border border-slate-200 hover:border-amber-500 hover:bg-amber-50/50 transition cursor-pointer flex items-center gap-3"
          >
            <div className="p-2 bg-amber-100 text-amber-800 rounded-lg shrink-0">
              <FileText className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Print Current Day (Day {activeDayNumber})</div>
              <div className="text-[11px] text-slate-500">Single day call sheet & shot stripboard</div>
            </div>
          </button>

          <button
            type="button"
            onClick={handlePrintAll}
            className="w-full p-3 text-left rounded-xl border border-slate-200 hover:border-blue-500 hover:bg-blue-50/50 transition cursor-pointer flex items-center gap-3"
          >
            <div className="p-2 bg-blue-100 text-blue-800 rounded-lg shrink-0">
              <Printer className="w-4 h-4" />
            </div>
            <div>
              <div className="font-bold text-slate-900">Print All Days ({totalDays} Days)</div>
              <div className="text-[11px] text-slate-500">Master multi-day production schedule</div>
            </div>
          </button>
        </div>
      </div>
    </div>
  );
};
