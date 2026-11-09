import React from 'react';
import { Calendar, Layers } from 'lucide-react';
import { SmartChipSortPopover } from './SmartChipSortPopover';
import { PrioritySortMode } from './prioritySortOps';
import { ScheduleRowItem } from '../../../types';
import { UnitFilterDropdown } from './UnitFilterDropdown';

export type ScheduleFilterType = 'ALL' | 'CAST' | 'LOCATION';
export type ScheduleViewMode = 'DAILY' | 'FULL_LIST';

interface ShootScheduleTitleBannerProps {
  viewMode?: ScheduleViewMode;
  activeFilter: ScheduleFilterType;
  isPriorityPopoverOpen?: boolean;
  priorityMode?: PrioritySortMode;
  scopeText?: string;
  initialPriorityItems?: string[];
  scheduleRows?: ScheduleRowItem[];
  onClosePriorityPopover?: () => void;
  onApplyPrioritySort?: (mode: PrioritySortMode, orderedItems: string[]) => void;
  onToggleViewMode?: (mode: ScheduleViewMode) => void;
  onSelectFilter: (filter: ScheduleFilterType) => void;
  onOpenPrintModal: () => void;
  watermarkLogoUrl?: string;
  activeUnitFilter?: number | 'ALL';
  unitsList?: number[];
  onSelectUnitFilter?: (unit: number | 'ALL') => void;
  onCreateNewUnit?: () => void;
}

export const ShootScheduleTitleBanner: React.FC<ShootScheduleTitleBannerProps> = ({
  viewMode = 'DAILY', activeFilter, isPriorityPopoverOpen, priorityMode, scopeText, initialPriorityItems, scheduleRows, onClosePriorityPopover, onApplyPrioritySort, onToggleViewMode, onSelectFilter, onOpenPrintModal, watermarkLogoUrl,
  activeUnitFilter = 'ALL', unitsList = [1], onSelectUnitFilter = () => {}, onCreateNewUnit = () => {},
}) => {
  const deptPills = [
    { id: 'CAST' as const, label: '👤 Cast Members' },
    { id: 'LOCATION' as const, label: '📍 Scene Settings' },
  ];

  return (
    <div className="bg-slate-950 text-white rounded-t-xl overflow-visible border border-slate-900 shadow-md">
      <div className="px-6 py-3.5 border-b border-slate-900 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-3">
          {watermarkLogoUrl && <img src={watermarkLogoUrl} alt="Logo" className="h-9 max-w-[120px] object-contain rounded bg-white/10 p-1 border border-white/20" />}
          <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white uppercase">Shoot Schedule & Production Suite</h1>
        </div>
        <button id="tour-print-export" onClick={onOpenPrintModal} className="px-3.5 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs flex items-center gap-2 transition cursor-pointer shadow-sm active:scale-95"><span>🖨️ Print / Export PDF</span></button>
      </div>

      <div className="px-6 py-2.5 bg-slate-900/90 flex flex-wrap items-center justify-between gap-3 border-b border-slate-800 text-xs overflow-visible">
        <div className="flex items-center gap-3">
          <div id="tour-view-toggle" className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800 font-bold">
            <button type="button" onClick={() => onToggleViewMode?.('DAILY')} className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${viewMode === 'DAILY' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}><Calendar className="w-3.5 h-3.5" /><span>Daily</span></button>
            <button type="button" onClick={() => onToggleViewMode?.('FULL_LIST')} className={`px-3 py-1 rounded-md transition flex items-center gap-1.5 cursor-pointer ${viewMode === 'FULL_LIST' ? 'bg-amber-500 text-slate-950 shadow-xs' : 'text-slate-400 hover:text-slate-200'}`}><Layers className="w-3.5 h-3.5" /><span>Full List</span></button>
          </div>
          <div id="tour-unit-filter">
            <UnitFilterDropdown
              activeUnitFilter={activeUnitFilter}
              unitsList={unitsList}
              onSelectUnitFilter={onSelectUnitFilter}
              onCreateNewUnit={onCreateNewUnit}
            />
          </div>
        </div>

        <div id="tour-sort-controls" className="relative flex flex-wrap items-center gap-1.5">
          <span className="font-bold text-slate-400 mr-1">Sort by:</span>
          {deptPills.map((pill) => {
            const isActive = activeFilter === pill.id;
            return <button key={pill.id} onClick={() => onSelectFilter(pill.id)} className={`px-3 py-1 rounded-md text-xs font-bold transition cursor-pointer border flex items-center gap-1 ${isActive ? 'bg-amber-500 text-slate-950 border-amber-400 shadow-sm' : 'bg-slate-800 text-slate-200 hover:bg-slate-700 border-slate-700 shadow-xs'}`}>{pill.label}</button>;
          })}
          <SmartChipSortPopover
            isOpen={Boolean(isPriorityPopoverOpen)}
            mode={priorityMode || 'CAST'}
            scopeText={scopeText || ''}
            initialItems={initialPriorityItems || []}
            scheduleRows={scheduleRows || []}
            onClose={onClosePriorityPopover || (() => {})}
            onApplyPrioritySort={onApplyPrioritySort || (() => {})}
          />
        </div>
      </div>
    </div>
  );
};
