import { CallSheetData } from '../../../types';

export function createScheduleContactHandlers(
  callData: CallSheetData,
  update: (updated: Partial<CallSheetData>) => void
) {
  return {
    emergencyContactName: callData.emergencyContactName ?? '',
    emergencyContactPhone: callData.emergencyContactPhone ?? '',
    additionalContacts: callData.additionalContacts || [],
    handleChangeEmergencyName: (name: string) => update({ emergencyContactName: name }),
    handleChangeEmergencyPhone: (phone: string) => update({ emergencyContactPhone: phone }),
    handleAddContact: (c: { id: string; name: string; role: string; phone: string }) =>
      update({ additionalContacts: [...(callData.additionalContacts || []), c] }),
    handleDeleteContact: (id: string) =>
      update({ additionalContacts: (callData.additionalContacts || []).filter((c) => c.id !== id) }),
    handleUpdateContact: (id: string, field: 'name' | 'phone', val: string) =>
      update({
        additionalContacts: (callData.additionalContacts || []).map((c) =>
          c.id === id ? { ...c, [field]: val } : c
        ),
      }),
  };
}
