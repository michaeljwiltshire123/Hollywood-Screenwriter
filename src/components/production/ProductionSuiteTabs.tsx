import React, { useRef } from 'react';
import { ScreenplayDocument } from '../../types';
import { Upload, X } from 'lucide-react';

interface ProductionSuiteTabsProps {
  activeTab: 'CALLSHEET' | 'RISK' | 'RELEASES';
  script: ScreenplayDocument;
  onChangeScript: (updated: ScreenplayDocument) => void;
  onSelectTab: (tab: 'CALLSHEET' | 'RISK' | 'RELEASES') => void;
}

export const ProductionSuiteTabs: React.FC<ProductionSuiteTabsProps> = ({
  activeTab, script, onChangeScript, onSelectTab,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleLogoUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (event) => {
      const dataUrl = event.target?.result as string;
      onChangeScript({ ...script, productionLogoUrl: dataUrl });
    };
    reader.readAsDataURL(file);
    e.target.value = '';
  };

  const tabs = [
    { id: 'CALLSHEET' as const, label: 'Shooting Schedule & Call Sheet' },
    { id: 'RISK' as const, label: 'Risk Assessment & Safety' },
    { id: 'RELEASES' as const, label: 'Release Forms' },
  ];

  return (
    <div className="flex items-center gap-1.5 p-2 bg-slate-900 border-b border-slate-800 overflow-x-auto text-xs font-bold scrollbar-none">
      <input type="file" ref={fileInputRef} accept="image/png,image/jpeg,image/webp,image/svg+xml" onChange={handleLogoUpload} className="hidden" />
      {tabs.map((t) => (
        <button
          key={t.id}
          onClick={() => onSelectTab(t.id)}
          className={`px-3.5 py-2 rounded-lg transition flex items-center gap-2 shrink-0 cursor-pointer ${
            activeTab === t.id ? 'bg-amber-500 text-slate-950 shadow-sm' : 'text-slate-400 hover:text-slate-100 hover:bg-slate-800'
          }`}
        >
          <span>{t.label}</span>
        </button>
      ))}

      <div className="ml-auto flex items-center gap-2 shrink-0">
        {script.productionLogoUrl && (
          <div className="flex items-center gap-1.5 bg-slate-950 border border-slate-700/80 px-2 py-1 rounded-lg text-xs">
            <img src={script.productionLogoUrl} alt="Logo" className="h-5 max-w-[70px] object-contain rounded bg-white/10 px-0.5" />
            <button type="button" onClick={() => onChangeScript({ ...script, productionLogoUrl: undefined })} className="p-0.5 text-slate-400 hover:text-rose-400 cursor-pointer" title="Remove logo"><X className="w-3.5 h-3.5" /></button>
          </div>
        )}
        <button type="button" onClick={() => fileInputRef.current?.click()} className="px-3.5 py-2 rounded-lg transition flex items-center gap-2 shrink-0 cursor-pointer bg-slate-800 hover:bg-slate-700 text-amber-300 border border-amber-500/40 hover:border-amber-400 shadow-sm active:scale-95">
          <Upload className="w-4 h-4 text-amber-400" /><span>Attach Logo</span>
        </button>
      </div>
    </div>
  );
};
