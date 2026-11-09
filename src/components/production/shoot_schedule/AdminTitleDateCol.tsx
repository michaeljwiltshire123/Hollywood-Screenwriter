import React from 'react';

interface AdminTitleDateColProps {
  title: string;
  dateFrom: string;
  dateTo: string;
  onChangeDateFrom: (date: string) => void;
  onChangeDateTo: (date: string) => void;
}

export const AdminTitleDateCol: React.FC<AdminTitleDateColProps> = ({
  title,
  dateFrom,
  dateTo,
  onChangeDateFrom,
  onChangeDateTo,
}) => {
  return (
    <div className="space-y-1.5">
      <div className="font-bold text-slate-900 tracking-wide">
        TITLE: <span className="font-semibold text-slate-700">{title || 'Untitled Screenplay'}</span>
      </div>
      <div id="tour-dates-picker" className="inline-flex flex-wrap items-center gap-1.5 p-1 rounded-md bg-slate-50 border border-slate-200 text-[11px] text-slate-700">
        <span className="font-bold text-slate-800">DATES:</span>
        <input
          type="date"
          value={dateFrom}
          onChange={(e) => onChangeDateFrom(e.target.value)}
          className="px-1.5 py-0.5 border border-slate-300 rounded bg-slate-50 text-slate-800 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-slate-500 cursor-pointer"
        />
        <span className="text-slate-400">to</span>
        <input
          type="date"
          value={dateTo}
          onChange={(e) => onChangeDateTo(e.target.value)}
          className="px-1.5 py-0.5 border border-slate-300 rounded bg-slate-50 text-slate-800 text-[11px] font-mono focus:outline-none focus:ring-1 focus:ring-slate-500 cursor-pointer"
        />
      </div>
    </div>
  );
};
