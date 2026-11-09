import React, { useState } from 'react';
import { useTimeWheelScroller } from './useTimeWheelScroller';

interface TimeWheelPickerModalProps {
  isOpen: boolean;
  initialTime: string;
  rowDescription?: string;
  onClose: () => void;
  onSetTime: (newTime: string) => void;
}

export const TimeWheelPickerModal: React.FC<TimeWheelPickerModalProps> = ({
  isOpen, initialTime, rowDescription, onClose, onSetTime,
}) => {
  const parts = (initialTime || '08:00 AM').trim().split(/[:\s]+/);
  const [hour, setHour] = useState<number>(() => Math.max(1, Math.min(12, parseInt(parts[0], 10) || 8)));
  const [min, setMin] = useState<number>(() => Math.max(0, Math.min(59, parseInt(parts[1], 10) || 0)));
  const [period, setPeriod] = useState<'AM' | 'PM'>(() => (parts[2] || 'AM').toUpperCase() === 'PM' ? 'PM' : 'AM');

  const stepHr = (d: number) => setHour((h) => (h + d - 1 + 12) % 12 + 1);
  const stepMin = (d: number) => setMin((m) => (m + d + 60) % 60);
  const toggleAmpm = () => setPeriod((p) => (p === 'AM' ? 'PM' : 'AM'));

  const hrCtrl = useTimeWheelScroller(stepHr);
  const minCtrl = useTimeWheelScroller(stepMin);
  const ampmCtrl = useTimeWheelScroller(() => toggleAmpm());

  if (!isOpen) return null;
  const prevHr = (hour - 2 + 12) % 12 + 1;
  const nextHr = hour % 12 + 1;
  const prevMin = (min - 1 + 60) % 60;
  const nextMin = (min + 1) % 60;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-2xl w-full max-w-xs overflow-hidden font-sans">
        <div className="p-4 border-b border-sky-400">
          <div className="text-xl font-bold text-sky-500">
            {hour}:{min < 10 ? `0${min}` : min} {period}
          </div>
          {rowDescription && <div className="text-[11px] text-slate-500 truncate mt-0.5">{rowDescription}</div>}
        </div>

        <div className="py-6 px-4 grid grid-cols-3 gap-2 text-center select-none relative">
          <div className="absolute inset-x-4 top-1/2 -translate-y-1/2 h-10 border-y border-sky-400 pointer-events-none" />

          {/* Hour Column */}
          <div onWheel={hrCtrl.handleWheel} className="flex flex-col items-center cursor-ns-resize">
            <button onPointerDown={() => hrCtrl.startHold(-1)} onPointerUp={hrCtrl.stopHold} onPointerLeave={hrCtrl.stopHold} className="text-sm text-slate-400 hover:text-slate-700 py-1">{prevHr}</button>
            <div className="text-xl font-bold text-slate-900 py-1.5">{hour}</div>
            <button onPointerDown={() => hrCtrl.startHold(1)} onPointerUp={hrCtrl.stopHold} onPointerLeave={hrCtrl.stopHold} className="text-sm text-slate-400 hover:text-slate-700 py-1">{nextHr}</button>
          </div>

          {/* Minute Column */}
          <div onWheel={minCtrl.handleWheel} className="flex flex-col items-center cursor-ns-resize">
            <button onPointerDown={() => minCtrl.startHold(-1)} onPointerUp={minCtrl.stopHold} onPointerLeave={minCtrl.stopHold} className="text-sm text-slate-400 hover:text-slate-700 py-1">{prevMin < 10 ? `0${prevMin}` : prevMin}</button>
            <div className="text-xl font-bold text-slate-900 py-1.5">{min < 10 ? `0${min}` : min}</div>
            <button onPointerDown={() => minCtrl.startHold(1)} onPointerUp={minCtrl.stopHold} onPointerLeave={minCtrl.stopHold} className="text-sm text-slate-400 hover:text-slate-700 py-1">{nextMin < 10 ? `0${nextMin}` : nextMin}</button>
          </div>

          {/* AM/PM Column */}
          <div onWheel={ampmCtrl.handleWheel} className="flex flex-col items-center cursor-pointer">
            <button onClick={toggleAmpm} className="text-sm text-slate-300 hover:text-slate-500 py-1">{period === 'AM' ? 'PM' : 'AM'}</button>
            <div onClick={toggleAmpm} className="text-xl font-bold text-slate-900 py-1.5">{period}</div>
            <button onClick={toggleAmpm} className="text-sm text-slate-300 hover:text-slate-500 py-1">{period === 'AM' ? 'PM' : 'AM'}</button>
          </div>
        </div>

        <div className="grid grid-cols-2 border-t border-slate-200 text-sm font-semibold">
          <button onClick={onClose} className="py-3 text-slate-700 hover:bg-slate-50 border-r border-slate-200 transition cursor-pointer">Cancel</button>
          <button onClick={() => onSetTime(`${hour}:${min < 10 ? `0${min}` : min} ${period}`)} className="py-3 text-sky-600 hover:bg-sky-50 transition cursor-pointer">Set</button>
        </div>
      </div>
    </div>
  );
};
