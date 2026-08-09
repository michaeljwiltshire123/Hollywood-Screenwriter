import React from 'react';
import { SceneInfo } from '../../types';
import { Clock, Sun, Coffee, MapPin, Flag } from 'lucide-react';

export interface ScheduleItem {
  id: string;
  type: 'SCENE' | 'BREAK';
  title: string;
  sceneNumber?: string;
  heading?: string;
  durationHours: number;
  isExterior?: boolean;
  isNight?: boolean;
  location?: string;
}

interface GanttChartProps {
  scenes?: SceneInfo[];
  scheduleItems?: ScheduleItem[];
  shootStartTime?: string; // e.g. "07:00"
}

export const GanttChart: React.FC<GanttChartProps> = ({
  scenes = [],
  scheduleItems,
  shootStartTime = '07:00',
}) => {
  const startHourBase = parseInt(shootStartTime.split(':')[0] || '7', 10);
  const startMinuteBase = parseInt(shootStartTime.split(':')[1] || '0', 10) / 60;
  const dayStart = Math.max(5, Math.min(10, startHourBase + startMinuteBase));
  const totalHours = 12; // 12-hour filming window

  // If scheduleItems is not provided, convert scenes + default breaks into scheduleItems
  const items: ScheduleItem[] = scheduleItems || [];
  
  if (!scheduleItems || scheduleItems.length === 0) {
    items.push({
      id: 'break-crew-call',
      type: 'BREAK',
      title: 'CREW CALL & BREAKFAST',
      durationHours: 1.0,
    });

    scenes.forEach((sc, idx) => {
      if (idx === 3) {
        items.push({
          id: 'break-lunch',
          type: 'BREAK',
          title: '🍽️ LUNCH BREAK & COMPANY REST',
          durationHours: 1.0,
        });
      }

      const dur = Math.max(0.75, Number((sc.lengthLines / 25).toFixed(1)));
      items.push({
        id: `sc-item-${sc.id}`,
        type: 'SCENE',
        title: `SC #${sc.sceneNumber}: ${sc.heading}`,
        sceneNumber: sc.sceneNumber,
        heading: sc.heading,
        durationHours: dur,
        isExterior: sc.heading.includes('EXT.'),
        isNight: sc.heading.includes('NIGHT'),
        location: sc.heading,
      });
    });

    items.push({
      id: 'break-wrap',
      type: 'BREAK',
      title: '🎬 WRAP & EQUIPMENT TEARDOWN',
      durationHours: 0.75,
    });
  }

  // Calculate timeline start and end times for each item
  let cursor = dayStart;
  const events = items.map((it) => {
    const start = cursor;
    const dur = it.durationHours || 1.0;
    cursor += dur;
    return {
      ...it,
      startHour: start,
      endHour: cursor,
    };
  });

  const hourTicks = Array.from({ length: totalHours + 1 }, (_, i) => Math.floor(dayStart) + i);

  const formatHourString = (hrNum: number) => {
    const h = Math.floor(hrNum) % 24;
    const m = Math.round((hrNum % 1) * 60);
    const mStr = m < 10 ? `0${m}` : `${m}`;
    const hStr = h < 10 ? `0${h}` : `${h}`;
    return `${hStr}:${mStr}`;
  };

  return (
    <div className="bg-slate-900 border border-slate-800 rounded-xl p-4 space-y-4 shadow-lg overflow-hidden">
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-800 pb-3">
        <div className="flex items-center gap-2">
          <Clock className="w-4 h-4 text-amber-400" />
          <h3 className="text-xs font-bold uppercase tracking-wider text-slate-100">
            Filming Day Production Schedule & Visual Gantt Chart
          </h3>
        </div>
        <div className="flex flex-wrap items-center gap-3 text-[10px] text-slate-400 font-medium">
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-amber-500 inline-block" /> Crew Call / Prep
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-indigo-600 inline-block" /> INT Scene
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-sky-600 inline-block" /> EXT Scene
          </span>
          <span className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded bg-emerald-600 inline-block" /> Company Break
          </span>
        </div>
      </div>

      {/* Clean Table Gantt Chart */}
      <div className="overflow-x-auto">
        <div className="min-w-[700px] space-y-2">
          {/* Header Time Ticks Grid */}
          <div className="grid grid-cols-12 gap-1 text-[10px] font-mono font-bold text-slate-400 border-b border-slate-800 pb-2">
            <div className="col-span-4 text-slate-300 uppercase tracking-wider">
              Activity / Scene Block
            </div>
            <div className="col-span-8 grid grid-cols-12 gap-0.5 text-center">
              {hourTicks.slice(0, 12).map((hr) => (
                <div key={hr} className="bg-slate-950/80 py-1 rounded border border-slate-800 text-[9px]">
                  {String(hr % 24).padStart(2, '0')}:00
                </div>
              ))}
            </div>
          </div>

          {/* Event Rows */}
          <div className="space-y-1.5 pt-1">
            {events.map((evt) => {
              const startOffset = Math.max(0, ((evt.startHour - dayStart) / totalHours) * 100);
              const widthPct = Math.min(100 - startOffset, (evt.durationHours / totalHours) * 100);

              const isBreak = evt.type === 'BREAK';
              const isExt = evt.isExterior;

              const barColor = isBreak
                ? evt.title.includes('CREW CALL')
                  ? 'bg-amber-500 text-slate-950 border-amber-400 font-bold'
                  : 'bg-emerald-600 text-white border-emerald-400 font-bold'
                : isExt
                ? 'bg-sky-600 text-white border-sky-400'
                : 'bg-indigo-600 text-white border-indigo-400';

              return (
                <div
                  key={evt.id}
                  className="grid grid-cols-12 gap-2 items-center p-2 bg-slate-950/90 border border-slate-800 rounded-lg hover:border-slate-700 transition"
                >
                  {/* Left Label Column (Fixed 4 cols = Never Cut Off) */}
                  <div className="col-span-4 pr-2 border-r border-slate-800 flex items-center justify-between gap-2 min-w-0">
                    <div className="min-w-0 flex-1">
                      <div className="text-xs font-bold text-slate-100 truncate flex items-center gap-1.5">
                        {isBreak ? (
                          <Coffee className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                        ) : (
                          <Flag className="w-3.5 h-3.5 text-sky-400 shrink-0" />
                        )}
                        <span className="truncate">{evt.title}</span>
                      </div>
                      <div className="text-[10px] text-slate-400 font-mono flex items-center gap-2">
                        <span>{formatHourString(evt.startHour)} - {formatHourString(evt.endHour)}</span>
                        <span>({evt.durationHours}h)</span>
                      </div>
                    </div>
                  </div>

                  {/* Right Timeline Grid (8 cols) */}
                  <div className="col-span-8 relative h-7 bg-slate-900/80 rounded border border-slate-850 overflow-hidden">
                    <div
                      className={`absolute top-0 bottom-0 rounded px-2 py-0.5 border shadow-xs flex items-center justify-between text-[10px] truncate transition-all ${barColor}`}
                      style={{
                        left: `${startOffset}%`,
                        width: `${Math.max(4, widthPct)}%`,
                      }}
                      title={`${evt.title} (${formatHourString(evt.startHour)} - ${formatHourString(evt.endHour)})`}
                    >
                      <span className="truncate font-bold pr-1">{evt.title}</span>
                      <span className="text-[9px] font-mono opacity-90 shrink-0">
                        {evt.durationHours}h
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
