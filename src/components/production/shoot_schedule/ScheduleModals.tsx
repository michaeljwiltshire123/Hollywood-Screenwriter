import React from 'react';
import { ShootScheduleContextMenu } from './ShootScheduleContextMenu';
import { Simple24HourTimePickerDropdown } from './Simple24HourTimePickerDropdown';
import { PrintExportModal } from './PrintExportModal';
import { WorkingHoursPickerModal } from './WorkingHoursPickerModal';
import { WorkingHoursChoiceModal } from './WorkingHoursChoiceModal';
import { LocationAssignChoiceModal } from './LocationAssignChoiceModal';
import { useShootScheduleState } from './useShootScheduleState';

interface ScheduleModalsProps {
  state: ReturnType<typeof useShootScheduleState>;
}

export const ScheduleModals: React.FC<ScheduleModalsProps> = ({ state }) => {
  return (
    <>
      <ShootScheduleContextMenu
        menu={state.contextMenu}
        onClose={() => state.setContextMenu(null)}
        onAddLineBelow={state.handleAddLineBelow}
        onDeleteRow={state.handleDeleteRow}
      />
      <Simple24HourTimePickerDropdown
        isOpen={Boolean(state.timeWheelTarget)}
        currentTimeStr={state.timeWheelTarget?.time || '07:00'}
        rowDescription={state.timeWheelTarget?.description}
        onClose={() => state.setTimeWheelTarget(null)}
        onSelectTime={(newTime) => {
          if (state.timeWheelTarget?.rowId) {
            state.handleSet24HourTimeDirect(state.timeWheelTarget.rowId, newTime);
          }
        }}
      />
      <WorkingHoursPickerModal
        isOpen={state.isWorkingHoursPickerOpen}
        currentStart={state.workingHoursStart}
        currentWrap={state.workingHoursWrap}
        onClose={() => state.setIsWorkingHoursPickerOpen(false)}
        onSave={state.handleSaveWorkingHoursPicker}
      />
      <WorkingHoursChoiceModal
        isOpen={Boolean(state.workingHoursChoicePending)}
        startTime={state.workingHoursChoicePending?.start || '07:00 AM'}
        wrapTime={state.workingHoursChoicePending?.wrap || '05:00 PM'}
        onClose={() => state.setWorkingHoursChoicePending(null)}
        onApplyCurrentDayOnly={state.handleApplyWorkingHoursCurrentDayOnly}
        onApplyUniversally={state.handleApplyWorkingHoursUniversally}
      />
      <LocationAssignChoiceModal
        isOpen={Boolean(state.locationPromptTarget)}
        sceneSetting={state.locationPromptTarget?.sceneSetting || ''}
        sceneNumber={state.locationPromptTarget?.sceneNumber || '1'}
        filmingLocation={state.locationPromptTarget?.filmingLocation || ''}
        onClose={() => state.setLocationPromptTarget(null)}
        onAssignToAll={state.handleAssignToAllMatchingSettings}
        onAssignToThisOnly={() => state.setLocationPromptTarget(null)}
      />
      <PrintExportModal
        isOpen={state.isPrintModalOpen}
        activeDayNumber={state.activeDayNumber}
        totalDays={state.days.length}
        unitsList={state.unitsList}
        onClose={() => state.setIsPrintModalOpen(false)}
        onPrintCurrentDay={state.handlePrintCurrentDay}
        onPrintAllDays={state.handlePrintAllDays}
      />
    </>
  );
};
