import React, { useMemo } from 'react';
import { ScheduleRowItem, ShootScheduleDaySheet } from '../../../types';
import { Clock, Calendar } from 'lucide-react';
import { GanttEventRow, GanttEventItem } from './GanttEventRow';
import { parse24HourMinutes } from './schedule24HourTimingOps';

interface RethemedGanttChartProps {
  rows: ScheduleRowItem[];
  days?: ShootScheduleDaySheet[];
  ganttViewMode?: 'CURRENT' | 'ALL';
  onToggleGanttViewMode?: (mode: 'CURRENT' | 'ALL') => void;
  onUpdateTime?: (rowId: string, newTime: string) => void;
  onUpdateDuration?: (rowId: string, newDur: number) => void;
}

export const RethemedGanttChart: React.FC<RethemedGanttChartProps> = ({
  rows, days = [], ganttViewMode = 'CURRENT', onToggleGanttViewMode, onUpdateTime, onUpdateDuration,
}) => {
  const { dayStart, totalHours, hourTicks, dayGroups } = useMemo(() => {
    const targetDays = ganttViewMode === 'ALL' && days.length > 0 ? days : [{ dayNumber: 1, dateStr: 'Current Day', title: 'Day 1', isRestDay: false, rows }];
    
    let allEvents: GanttEventItem[] = [];
    const groups = targetDays.map((d) => {
      const evts: GanttEventItem[] = (d.rows || []).map((r) => {
        const startHour = parse24HourMinutes(r.time) / 60;
        return { ...r, startHour, endHour: startHour + (r.durationHours || 1.0) };
      });
      allEvents = allEvents.concat(evts);
      return { dayNumber: d.dayNumber, dateStr: d.dateStr, events: evts };
    });

    if (allEvents.length === 0) return { dayStart: 7, totalHours: 10, hourTicks: [7, 8, 9, 10, 11, 12, 13, 14, 15, 16], dayGroups: groups };
    const minHour = Math.floor(Math.min(...allEvents.map((e) => e.startHour)));
    const start = Math.max(0, Math.min(23, minHour));
    const maxEnd = allEvents.reduce((m, e) => Math.max(m, e.endHour), start + 8);
    const span = Math.max(8, Math.min(24, Math.ceil(maxEnd - start) + 1));
    return { dayStart: start, totalHours: span, hourTicks: Array.from({ length: span }, (_, i) => (start + i) % 24), dayGroups: groups };
  }, [rows, days, ganttViewMode]);

  return (
    <div id="tour-gantt-chart" className="bg-white border border-slate-300 rounded-b-xl p-4 space-y-3 shadow-xs font-sans">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-200 pb-2.5">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-600" />
          <h3 className="text-xs font-black uppercase tracking-wider text-slate-900">Timeline / Overview</h3>
        </div>
        <div className="flex items-center gap-3">
          {onToggleGanttViewMode && (
            <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs font-semibold">
              <button onClick={() => onToggleGanttViewMode('CURRENT')} className={`px-2.5 py-1 rounded-md transition ${ganttViewMode === 'CURRENT' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'}`}>Current Day</button>
              <button onClick={() => onToggleGanttViewMode('ALL')} className={`px-2.5 py-1 rounded-md transition ${ganttViewMode === 'ALL' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600'}`}>Entire Project</button>
            </div>
          )}
        </div>
      </div>
      <div className="overflow-x-auto">
        <div className="min-w-[700px] space-y-2">
          <div className="grid grid-cols-12 gap-1 text-[10px] font-mono font-bold bg-slate-900 text-slate-100 p-2 rounded">
            <div className="col-span-4 uppercase tracking-wider text-[9px]">Activity</div>
            <div className="col-span-8 flex justify-between gap-0.5 text-center text-[9px]">
              {hourTicks.map((hr) => (
                <div key={hr} className="flex-1 bg-slate-800 py-0.5 rounded text-[9px] font-mono">{String(hr).padStart(2, '0')}:00</div>
              ))}
            </div>
          </div>
          <div className="space-y-3 pt-1">
            {dayGroups.map((group) => (
              <div key={group.dayNumber} className="space-y-1.5">
                {ganttViewMode === 'ALL' && (
                  <div className="flex items-center gap-2 py-1 px-2 bg-slate-100 border-l-4 border-amber-500 rounded text-[11px] font-bold text-slate-800 mt-2">
                    <Calendar className="w-3.5 h-3.5 text-amber-600" />
                    <span>Day {group.dayNumber} — {group.dateStr}</span>
                  </div>
                )}
                {group.events.map((evt) => (
                  <GanttEventRow key={evt.id} evt={evt} dayStart={dayStart} totalHours={totalHours} onUpdateTime={onUpdateTime} onUpdateDuration={onUpdateDuration} />
                ))}
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
