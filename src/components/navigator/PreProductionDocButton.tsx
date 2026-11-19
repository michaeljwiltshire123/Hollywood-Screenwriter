import React from 'react';
import { FileText, ArrowUpRight } from 'lucide-react';
import { AppThemeConfig } from '../../lib/themePresets';

interface PreProductionDocButtonProps {
  onOpenProductionSchedule?: () => void;
  themeConfig?: AppThemeConfig;
}

export const PreProductionDocButton: React.FC<PreProductionDocButtonProps> = ({
  onOpenProductionSchedule,
  themeConfig,
}) => {
  if (!onOpenProductionSchedule) return null;
  const isDark = Boolean(themeConfig?.isDark);
  const borderCol = isDark ? '#F59E0B' : '#D97706';

  return (
    <button
      type="button"
      onClick={onOpenProductionSchedule}
      className="w-full group relative overflow-hidden p-3 border-2 rounded-xl text-xs font-bold flex items-center justify-between transition-all duration-150 cursor-pointer shadow-md hover:-translate-y-0.5 hover:shadow-lg active:scale-[0.99] mb-3"
      style={{
        backgroundColor: isDark ? '#181A20' : '#FFFBEB',
        borderColor: borderCol,
        color: isDark ? '#F8FAFC' : '#1C1917',
        boxShadow: '0 4px 12px -2px rgba(217, 119, 6, 0.25)',
      }}
      title="Open Production Schedule, Call Sheet, Health & Safety & Release Forms"
    >
      <div className="flex items-center gap-2.5 min-w-0">
        <div
          className="p-2 rounded-lg shrink-0 shadow-xs text-white"
          style={{ backgroundColor: '#D97706' }}
        >
          <FileText className="w-4 h-4" />
        </div>
        <div className="text-left leading-tight min-w-0">
          <div className="font-extrabold text-[13px] tracking-tight truncate">
            Pre-Production Docs
          </div>
          <div
            className="text-[10px] font-sans font-semibold mt-0.5 truncate"
            style={{ color: isDark ? '#FCD34D' : '#B45309' }}
          >
            Call sheets, H&amp;S &amp; releases
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-1 text-[10px] font-sans font-extrabold uppercase px-2.5 py-1.5 rounded-lg transition shrink-0 ml-2 text-white shadow-xs"
        style={{ backgroundColor: '#D97706' }}
      >
        <span>Open</span>
        <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </button>
  );
};
