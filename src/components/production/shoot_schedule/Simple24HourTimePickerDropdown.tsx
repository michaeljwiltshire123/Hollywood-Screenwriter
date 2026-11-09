import React, { useState, useEffect, useRef } from 'react';
import { Clock, Check, X } from 'lucide-react';
import { generate24HourTimeSlots, findClosestTimeSlotIndex } from './timeSlotGenerator';
import { ensure24HourTimeStr } from './schedule24HourTimingOps';

interface Simple24HourTimePickerDropdownProps {
  isOpen: boolean;
  currentTimeStr: string;
  rowDescription?: string;
  onClose: () => void;
  onSelectTime: (newTimeStr: string) => void;
}

export const Simple24HourTimePickerDropdown: React.FC<Simple24HourTimePickerDropdownProps> = ({
  isOpen, currentTimeStr, rowDescription, onClose, onSelectTime,
}) => {
  const slots = generate24HourTimeSlots();
  const initial24h = ensure24HourTimeStr(currentTimeStr);
  const [typedTime, setTypedTime] = useState(initial24h);
  const listRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (isOpen) {
      const active24 = ensure24HourTimeStr(currentTimeStr);
      setTypedTime(active24);
      const closestIdx = findClosestTimeSlotIndex(active24, slots);
      setTimeout(() => {
        if (listRef.current) {
          const item = listRef.current.children[closestIdx] as HTMLElement;
          if (item) item.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
        }
      }, 50);
    }
  }, [isOpen, currentTimeStr]);

  if (!isOpen) return null;

  const handleCustomSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (typedTime.trim()) {
      onSelectTime(ensure24HourTimeStr(typedTime));
      onClose();
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs font-sans animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xs p-4 space-y-3 text-slate-800">
        <div className="flex items-center justify-between border-b border-slate-100 pb-2">
          <div className="flex items-center gap-1.5 font-black text-xs text-slate-900 uppercase tracking-wide">
            <Clock className="w-4 h-4 text-amber-500" />
            <span>Select Filming Time (24h)</span>
          </div>
          <button type="button" onClick={onClose} className="text-slate-400 hover:text-slate-700 p-1 rounded cursor-pointer">
            <X className="w-4 h-4" />
          </button>
        </div>

        {rowDescription && (
          <div className="text-[11px] font-semibold text-slate-500 truncate bg-slate-50 px-2 py-1 rounded-md border border-slate-100">
            {rowDescription}
          </div>
        )}

        <form onSubmit={handleCustomSubmit} className="flex gap-1.5">
          <input
            type="text"
            value={typedTime}
            onChange={(e) => setTypedTime(e.target.value)}
            placeholder="e.g. 14:30"
            className="flex-1 bg-slate-50 border border-slate-300 focus:border-amber-500 focus:bg-white focus:outline-none rounded-lg px-2.5 py-1.5 text-xs font-mono font-bold text-slate-900"
          />
          <button type="submit" className="px-3 py-1.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold rounded-lg text-xs transition cursor-pointer">
            Set
          </button>
        </form>

        <div ref={listRef} className="space-y-1 max-h-56 overflow-y-auto pr-1 text-xs">
          {slots.map((slot) => {
            const isSelected = slot.timeStr === initial24h;
            return (
              <button
                key={slot.timeStr}
                type="button"
                onClick={() => {
                  onSelectTime(slot.timeStr);
                  onClose();
                }}
                className={`w-full text-left px-3 py-1.5 rounded-lg flex items-center justify-between font-mono font-bold text-xs transition cursor-pointer ${
                  isSelected
                    ? 'bg-amber-500 text-slate-950 shadow-xs'
                    : 'hover:bg-slate-100 text-slate-800'
                }`}
              >
                <span>{slot.label}</span>
                {isSelected && <Check className="w-3.5 h-3.5 text-slate-950" />}
              </button>
            );
          })}
        </div>
      </div>
    </div>
  );
};
