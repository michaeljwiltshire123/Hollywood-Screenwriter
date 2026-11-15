import React, { useState } from 'react';
import { Archive, ChevronDown, X } from 'lucide-react';
import { SprintVaultItem } from './ideaSprintTypes';
import { IdeaVaultItemList } from './IdeaVaultItemList';

interface VaultProps {
  vaultItems: SprintVaultItem[];
  onClearVault?: () => void;
}

export const IdeaVaultDropdown: React.FC<VaultProps> = ({ vaultItems, onClearVault }) => {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="relative font-sans">
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="px-3 py-1.5 bg-amber-500/10 hover:bg-amber-500/20 text-amber-900 border border-amber-300 rounded-lg text-xs font-bold transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
      >
        <Archive className="w-3.5 h-3.5 text-amber-600" />
        <span>Idea Vault ({vaultItems.length})</span>
        <ChevronDown className="w-3.5 h-3.5 text-amber-600" />
      </button>

      {isOpen && (
        <div className="absolute left-0 top-full mt-2 w-80 sm:w-96 bg-white border border-slate-200 rounded-2xl shadow-2xl z-50 p-4 space-y-3 animate-in fade-in duration-150">
          <div className="flex items-center justify-between border-b border-slate-100 pb-2">
            <div className="flex items-center gap-1.5 text-amber-900 font-extrabold text-xs uppercase tracking-wider">
              <Archive className="w-4 h-4 text-amber-600" />
              <span>Sprint Idea Vault</span>
            </div>
            <button type="button" onClick={() => setIsOpen(false)} className="text-slate-400 hover:text-slate-600 p-0.5">
              <X className="w-4 h-4" />
            </button>
          </div>

          <IdeaVaultItemList vaultItems={vaultItems} />

          {vaultItems.length > 0 && onClearVault && (
            <div className="pt-2 border-t border-slate-100 flex justify-end items-center text-[11px]">
              <button type="button" onClick={onClearVault} className="font-bold text-rose-600 hover:text-rose-800">Clear Vault</button>
            </div>
          )}
        </div>
      )}
    </div>
  );
};
