import React from 'react';
import { AdminTitleDateCol } from './AdminTitleDateCol';
import { AdminPersonnelCol } from './AdminPersonnelCol';
import { EmergencyContactsCol } from './EmergencyContactsCol';
import { AdminActionsCol } from './AdminActionsCol';
import { ShootScheduleDayTabs } from './ShootScheduleDayTabs';
import { ShootScheduleDaySheet } from '../../../types';

interface ShootScheduleAdminBoxProps {
  title: string;
  dateFrom: string;
  dateTo: string;
  days: ShootScheduleDaySheet[];
  activeDayNumber: number;
  directorName: string;
  producerName: string;
  emergencyContactName: string;
  emergencyContactPhone: string;
  additionalContacts: { id: string; name: string; role: string; phone: string }[];
  activeActorCount: number;
  isAllShotsExpanded?: boolean;
  onAutoSortExtFirst: () => void;
  onToggleAllShotsExpanded?: () => void;
  onChangeDateFrom: (date: string) => void;
  onChangeDateTo: (date: string) => void;
  onSelectDay: (num: number) => void;
  onToggleRestDay: (num: number) => void;
  onChangeDirector: (dir: string) => void;
  onChangeProducer: (prod: string) => void;
  onChangeEmergencyName: (name: string) => void;
  onChangeEmergencyPhone: (phone: string) => void;
  onAddContact: (c: { id: string; name: string; role: string; phone: string }) => void;
  onDeleteContact: (id: string) => void;
  onUpdateContact?: (id: string, field: 'name' | 'phone', val: string) => void;
}

export const ShootScheduleAdminBox: React.FC<ShootScheduleAdminBoxProps> = ({
  title, dateFrom, dateTo, days, activeDayNumber, directorName, producerName,
  emergencyContactName, emergencyContactPhone, additionalContacts, activeActorCount,
  isAllShotsExpanded, onAutoSortExtFirst, onToggleAllShotsExpanded,
  onChangeDateFrom, onChangeDateTo, onSelectDay, onToggleRestDay, onChangeDirector, onChangeProducer,
  onChangeEmergencyName, onChangeEmergencyPhone, onAddContact, onDeleteContact, onUpdateContact,
}) => {
  return (
    <div id="tour-admin-bar" className="bg-white border-x border-b border-slate-300 p-3 text-xs text-slate-800 shadow-xs font-sans">
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 items-start">
        <div className="border-r border-slate-200 pr-3">
          <AdminTitleDateCol title={title} dateFrom={dateFrom} dateTo={dateTo} onChangeDateFrom={onChangeDateFrom} onChangeDateTo={onChangeDateTo} />
        </div>
        <div className="border-r border-slate-200 pr-3">
          <AdminPersonnelCol directorName={directorName} producerName={producerName} onChangeDirector={onChangeDirector} onChangeProducer={onChangeProducer} />
        </div>
        <div className="border-r border-slate-200 pr-3">
          <EmergencyContactsCol emergencyContactName={emergencyContactName} emergencyContactPhone={emergencyContactPhone} additionalContacts={additionalContacts} onChangeEmergencyName={onChangeEmergencyName} onChangeEmergencyPhone={onChangeEmergencyPhone} onAddContact={onAddContact} onDeleteContact={onDeleteContact} onUpdateContact={onUpdateContact} />
        </div>
        <div>
          <AdminActionsCol activeActorCount={activeActorCount} isAllShotsExpanded={isAllShotsExpanded} onAutoSortExtFirst={onAutoSortExtFirst} onToggleAllShotsExpanded={onToggleAllShotsExpanded} />
        </div>
      </div>
      <ShootScheduleDayTabs days={days} activeDayNumber={activeDayNumber} onSelectDay={onSelectDay} onToggleRestDay={onToggleRestDay} />
    </div>
  );
};
