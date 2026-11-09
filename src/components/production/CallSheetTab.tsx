import React from 'react';
import { ScreenplayDocument, CharacterInfo } from '../../types';
import { ShootScheduleTitleBanner } from './shoot_schedule/ShootScheduleTitleBanner';
import { CallSheetAdminSection } from './CallSheetAdminSection';
import { BatchActionsBar } from './shoot_schedule/BatchActionsBar';
import { InteractiveScheduleGrid } from './shoot_schedule/InteractiveScheduleGrid';
import { RethemedGanttChart } from './shoot_schedule/RethemedGanttChart';
import { ScheduleModals } from './shoot_schedule/ScheduleModals';
import { useShootScheduleState } from './shoot_schedule/useShootScheduleState';

interface CallSheetTabProps {
  script: ScreenplayDocument;
  characters: CharacterInfo[];
  onChangeScript: (updated: ScreenplayDocument) => void;
  watermarkLogoUrl?: string;
}

export const CallSheetTab: React.FC<CallSheetTabProps> = ({ script, characters, onChangeScript, watermarkLogoUrl }) => {
  const logo = watermarkLogoUrl || script.productionLogoUrl;
  const state = useShootScheduleState(script, characters, onChangeScript, logo);

  return (
    <div className="space-y-0 max-w-6xl mx-auto font-sans antialiased">
      <ShootScheduleTitleBanner
        viewMode={state.scheduleViewMode}
        activeFilter={state.activeFilter}
        isPriorityPopoverOpen={state.isPriorityDrawerOpen}
        priorityMode={state.priorityMode}
        scopeText={state.scopeText}
        initialPriorityItems={state.initialPriorityItems}
        scheduleRows={state.rows}
        onClosePriorityPopover={state.handleClosePriorityDrawer}
        onApplyPrioritySort={state.handleApplyPrioritySort}
        onToggleViewMode={state.handleToggleViewMode}
        onSelectFilter={state.handleSelectFilter}
        onOpenPrintModal={() => state.setIsPrintModalOpen(true)}
        watermarkLogoUrl={logo}
        activeUnitFilter={state.activeUnitFilter}
        unitsList={state.unitsList}
        onSelectUnitFilter={state.handleSelectUnitFilter}
        onCreateNewUnit={state.handleCreateNewUnit}
      />
      <CallSheetAdminSection title={script.title} state={state} />
      <BatchActionsBar
        selectedCount={state.selectedRowIds.size}
        onDeleteSelected={state.handleDeleteSelected}
        onClearSelection={state.handleClearSelection}
        days={state.days}
        activeDayNumber={state.activeDayNumber}
        onMoveSelectedToDay={state.handleMoveSelectedToDay}
        onMoveSelectedToNewDay={state.handleMoveSelectedToNewDay}
        unitsList={state.unitsList}
        onAssignSelectedToUnit={state.handleAssignSelectedToUnit}
        onCreateAndAssignUnit={state.handleCreateAndAssignUnit}
      />
      {state.activeDay?.isRestDay && state.scheduleViewMode === 'DAILY' ? (
        <div className="p-12 text-center bg-white border border-slate-300 my-0 shadow-xs">
          <div className="text-sm font-bold text-slate-800 uppercase tracking-wide">
            Company Rest Day — Day {state.activeDayNumber} ({state.activeDay.dateStr})
          </div>
          <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
            No filming scheduled. Toggle the moon icon above to convert to an active shoot day.
          </p>
        </div>
      ) : (
        <InteractiveScheduleGrid
          rows={state.rows}
          selectedRowIds={state.selectedRowIds}
          activeFilter={state.activeFilter}
          workingHoursStr={state.workingHoursStr}
          onOpenWorkingHoursPicker={() => state.setIsWorkingHoursPickerOpen(true)}
          onLocationChangePrompt={state.handleLocationChangePrompt}
          onToggleSelectRow={state.handleToggleSelectRow}
          onToggleSelectAll={state.handleToggleSelectAll}
          onAddLineBelow={state.handleAddLineBelow}
          onContextMenu={(e, id) => { e.preventDefault(); state.setContextMenu({ mouseX: e.clientX, mouseY: e.clientY, rowId: id }); }}
          onUpdateField={state.handleUpdateField}
          onOpenTimeWheel={(rowId, time, description) => state.setTimeWheelTarget({ rowId, time, description })}
          onReorderRows={state.handleReorderRows}
          onToggleExpand={state.handleToggleExpandShotList}
          onAddShot={state.handleAddShotSetup}
          onDeleteShot={state.handleDeleteShotSetup}
          onUpdateShot={state.handleUpdateShotSetup}
          unitsList={state.unitsList}
          onCreateUnitRow={state.handleCreateAndAssignRowToUnit}
        />
      )}
      <RethemedGanttChart
        rows={state.rows}
        days={state.days}
        ganttViewMode={state.ganttViewMode}
        onToggleGanttViewMode={state.handleToggleGanttViewMode}
        shootStartTime={state.rows[0]?.time || '07:00 AM'}
        onUpdateTime={(rowId, newTime) => state.handleUpdateField(rowId, 'time', newTime)}
        onUpdateDuration={(rowId, newDur) => state.handleUpdateField(rowId, 'durationHours', newDur)}
      />
      <ScheduleModals state={state} />
    </div>
  );
};
