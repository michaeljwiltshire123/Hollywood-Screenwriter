import React from 'react';
import { Phone, Trash2 } from 'lucide-react';

interface Contact { id: string; name: string; role: string; phone: string; }

interface EmergencyContactsColProps {
  emergencyContactName: string;
  emergencyContactPhone: string;
  additionalContacts: Contact[];
  onChangeEmergencyName: (name: string) => void;
  onChangeEmergencyPhone: (phone: string) => void;
  onAddContact: (contact: Contact) => void;
  onDeleteContact: (id: string) => void;
  onUpdateContact?: (id: string, field: 'name' | 'phone', val: string) => void;
}

export const EmergencyContactsCol: React.FC<EmergencyContactsColProps> = ({
  emergencyContactName, emergencyContactPhone, additionalContacts = [],
  onChangeEmergencyName, onChangeEmergencyPhone, onAddContact, onDeleteContact, onUpdateContact,
}) => {
  const handleAddNew = () => onAddContact({ id: 'c_' + Math.random().toString(36).substring(2, 7), name: '', role: 'Crew', phone: '' });

  return (
    <div className="space-y-1 font-sans text-xs">
      <div className="flex items-center justify-between">
        <span className="font-bold text-red-700 uppercase tracking-tight flex items-center gap-1 text-[11px]">
          <Phone className="w-3 h-3 text-red-600" /><span>Emergency Contact:</span>
        </span>
        <button type="button" onClick={handleAddNew} className="text-sky-600 hover:text-sky-700 font-bold hover:underline text-[11px] cursor-pointer">+ Add Contact</button>
      </div>

      <div className="grid grid-cols-2 gap-1.5">
        <input type="text" value={emergencyContactName} onChange={(e) => onChangeEmergencyName(e.target.value)} className="w-full border border-slate-300 rounded px-1.5 py-0.5 bg-slate-50 hover:bg-white text-slate-800 text-xs" />
        <input type="text" value={emergencyContactPhone} onChange={(e) => onChangeEmergencyPhone(e.target.value)} className="w-full border border-slate-300 rounded px-1.5 py-0.5 bg-slate-50 hover:bg-white font-mono text-slate-800 text-xs" />
      </div>

      {additionalContacts.map((c) => (
        <div key={c.id} className="grid grid-cols-12 gap-1 items-center pt-0.5">
          <div className="col-span-5"><input type="text" value={c.name} onChange={(e) => onUpdateContact ? onUpdateContact(c.id, 'name', e.target.value) : undefined} className="w-full border border-slate-300 rounded px-1.5 py-0.5 bg-slate-50 hover:bg-white text-slate-800 text-xs" /></div>
          <div className="col-span-6"><input type="text" value={c.phone} onChange={(e) => onUpdateContact ? onUpdateContact(c.id, 'phone', e.target.value) : undefined} className="w-full border border-slate-300 rounded px-1.5 py-0.5 bg-slate-50 hover:bg-white font-mono text-slate-800 text-xs" /></div>
          <div className="col-span-1 text-center"><button type="button" onClick={() => onDeleteContact(c.id)} className="text-slate-400 hover:text-red-600 transition cursor-pointer"><Trash2 className="w-3.5 h-3.5 inline" /></button></div>
        </div>
      ))}
    </div>
  );
};
