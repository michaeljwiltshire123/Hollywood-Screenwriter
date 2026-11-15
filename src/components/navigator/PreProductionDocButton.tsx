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

  return (
    <button
      type="button"
      onClick={onOpenProductionSchedule}
      className="w-full group relative overflow-hidden p-2.5 border rounded-lg text-xs font-bold flex items-center justify-between transition-all duration-200 cursor-pointer shadow-sm active:scale-[0.99] mb-3 hover:opacity-95"
      style={{
        backgroundColor: themeConfig?.sceneCards || '#F4ECE0',
        borderColor: themeConfig?.borders || '#E4D3B9',
        color: themeConfig?.primaryText || '#433422',
      }}
      title="Open Production Schedule, Call Sheet & Pre-Production Suite"
    >
      <div className="flex items-center gap-2.5">
        <div
          className="p-2 rounded-md border shrink-0 shadow-xs"
          style={{
            backgroundColor: themeConfig?.accentButtons || '#8C6239',
            borderColor: themeConfig?.accentButtons || '#8C6239',
            color: '#FFFFFF',
          }}
        >
          <FileText className="w-4 h-4" />
        </div>
        <div className="text-left leading-tight">
          <div className="font-bold text-xs tracking-wide flex items-center gap-1.5">
            <span>Pre-Production Docs</span>
          </div>
          <div className="text-[10px] font-mono opacity-75 font-normal mt-0.5">
            Call sheets, risk assessment & schedule
          </div>
        </div>
      </div>

      <div
        className="flex items-center gap-1 text-[10px] font-mono font-bold uppercase border px-2 py-1 rounded transition shrink-0 ml-2"
        style={{
          backgroundColor: themeConfig?.topBottomBars || '#FBF6EF',
          borderColor: themeConfig?.borders || '#E4D3B9',
          color: themeConfig?.accentText || '#8C6239',
        }}
      >
        <span>Suite</span>
        <ArrowUpRight className="w-3 h-3 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
      </div>
    </button>
  );
};
