import React from 'react';
import { ShootScheduleAdminBox } from './shoot_schedule/ShootScheduleAdminBox';
import { useShootScheduleState } from './shoot_schedule/useShootScheduleState';

interface CallSheetAdminSectionProps {
  title: string;
  state: ReturnType<typeof useShootScheduleState>;
}

export const CallSheetAdminSection: React.FC<CallSheetAdminSectionProps> = ({ title, state }) => {
  return (
    <ShootScheduleAdminBox
      title={title}
      dateFrom={state.dateFrom}
      dateTo={state.dateTo}
      days={state.days}
      activeDayNumber={state.activeDayNumber}
      directorName={state.directorName}
      producerName={state.producerName}
      emergencyContactName={state.emergencyContactName}
      emergencyContactPhone={state.emergencyContactPhone}
      additionalContacts={state.additionalContacts}
      activeActorCount={state.activeActorCount}
      isAllShotsExpanded={state.isAllShotsExpanded}
      onAutoSortExtFirst={state.handleAutoSortExtFirst}
      onToggleAllShotsExpanded={state.handleToggleAllShotsExpanded}
      onChangeDateFrom={state.handleChangeDateFrom}
      onChangeDateTo={state.handleChangeDateTo}
      onSelectDay={state.handleSelectDay}
      onToggleRestDay={state.handleToggleRestDay}
      onChangeDirector={state.handleChangeDirector}
      onChangeProducer={state.handleChangeProducer}
      onChangeEmergencyName={state.handleChangeEmergencyName}
      onChangeEmergencyPhone={state.handleChangeEmergencyPhone}
      onAddContact={state.handleAddContact}
      onDeleteContact={state.handleDeleteContact}
      onUpdateContact={state.handleUpdateContact}
    />
  );
};
