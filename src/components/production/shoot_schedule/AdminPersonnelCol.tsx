import React from 'react';

interface AdminPersonnelColProps {
  directorName: string;
  producerName: string;
  onChangeDirector: (dir: string) => void;
  onChangeProducer: (prod: string) => void;
}

export const AdminPersonnelCol: React.FC<AdminPersonnelColProps> = ({
  directorName,
  producerName,
  onChangeDirector,
  onChangeProducer,
}) => {
  return (
    <div className="space-y-1 font-sans text-xs">
      <div className="flex items-center gap-1">
        <span className="font-bold text-slate-900 shrink-0">DIRECTOR:</span>
        <input
          type="text"
          value={directorName}
          onChange={(e) => onChangeDirector(e.target.value)}
          className="border border-slate-300 rounded px-1.5 py-0.5 bg-slate-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-800 text-xs w-36"
        />
      </div>
      <div className="flex items-center gap-1">
        <span className="font-bold text-slate-900 shrink-0">PRODUCER:</span>
        <input
          type="text"
          value={producerName}
          onChange={(e) => onChangeProducer(e.target.value)}
          className="border border-slate-300 rounded px-1.5 py-0.5 bg-slate-50 hover:bg-white focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-400 text-slate-800 text-xs w-36"
        />
      </div>
    </div>
  );
};
