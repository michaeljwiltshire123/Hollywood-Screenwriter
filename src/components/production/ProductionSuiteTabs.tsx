import React, { useRef } from 'react';
import { ScreenplayDocument } from '../../types';
import { AppThemeConfig } from '../../lib/themePresets';
import { getModalTheme } from '../../lib/modalTheme';
import { Upload, X } from 'lucide-react';

interface ProductionSuiteTabsProps {
  activeTab: 'CALLSHEET' | 'RISK' | 'RELEASES';
  script: ScreenplayDocument;
  onChangeScript: (updated: ScreenplayDocument) => void;
  onSelectTab: (tab: 'CALLSHEET' | 'RISK' | 'RELEASES') => void;
  themeConfig?: AppThemeConfig;
}

export const ProductionSuiteTabs: React.FC<ProductionSuiteTabsProps> = ({
  activeTab, script, onChangeScript, onSelectTab, themeConfig,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const mt = getModalTheme(themeConfig);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      onChangeScript({ ...script, productionLogoUrl: event.target?.result as string });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const tabs = [
    { id: 'CALLSHEET' as const, label: 'Shooting Schedule & Call Sheet' },
    { id: 'RISK' as const, label: 'Health & Safety (H&S)' },
    { id: 'RELEASES' as const, label: 'Release Forms' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-2 border-b overflow-x-auto text-xs font-bold scrollbar-none" style={mt.subCardStyle}>
      <input type="file" ref={fileInputRef} accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoUpload} className="hidden" />
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelectTab(t.id)}
          className="px-3.5 py-2 rounded-lg transition flex items-center gap-2 shrink-0 cursor-pointer border hover:opacity-90"
          style={activeTab === t.id ? mt.primaryBtnStyle : mt.secondaryBtnStyle}
        >
          <span>{t.label}</span>
        </button>
      ))}

      <div className="ml-auto flex items-center gap-2 shrink-0">
        {script.productionLogoUrl && (
          <div className="flex items-center gap-1.5 border px-2 py-1 rounded-lg text-xs" style={mt.cardStyle}>
            <img src={script.productionLogoUrl} alt="Logo" className="h-5 max-w-[70px] object-contain rounded bg-white/60 px-0.5" />
            <button type="button" onClick={() => onChangeScript({ ...script, productionLogoUrl: undefined })} className="p-0.5 hover:text-rose-500 cursor-pointer" style={mt.mutedStyle} title="Remove logo"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3.5 py-2 rounded-lg transition flex items-center gap-2 shrink-0 cursor-pointer border shadow-sm active:scale-95 hover:opacity-90" style={mt.secondaryBtnStyle}>
          <Upload className="w-4 h-4" style={mt.accentStyle} /><span>Attach Logo</span>
        </button>
      </div>
    </div>
  );
};
