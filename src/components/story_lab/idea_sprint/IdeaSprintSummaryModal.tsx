import React, { useState } from 'react';
import { Trophy, Check, FolderPlus } from 'lucide-react';
import { calculateSprintRank } from './ideaSprintRankHelper';
import { SprintApplyResult, SprintVaultItem } from './ideaSprintTypes';
import { IdeaSprintSummaryItem } from './IdeaSprintSummaryItem';

interface SummaryProps {
  isOpen: boolean;
  question: string;
  durationMins: number;
  rawLines: string[];
  onApply: (result: SprintApplyResult) => void;
  onCancel: () => void;
}

export const IdeaSprintSummaryModal: React.FC<SummaryProps> = ({
  isOpen, question, durationMins, rawLines, onApply, onCancel,
}) => {
  const cleanIdeas = rawLines.map((s) => s.trim().replace(/^\d+\.\s*/, '')).filter(Boolean);
  const [primaryIndex, setPrimaryIndex] = useState<number | null>(null);
  const [backupIndices, setBackupIndices] = useState<number[]>([]);
  const [saveToVault, setSaveToVault] = useState<boolean>(true);

  if (!isOpen) return null;
  const rank = calculateSprintRank(cleanIdeas.length);

  const handleSelectPrimary = (newIdx: number) => {
    if (newIdx === primaryIndex) {
      setPrimaryIndex(null);
      return;
    }
    const oldPrimary = primaryIndex;
    setPrimaryIndex(newIdx);
    if (oldPrimary !== null) {
      setBackupIndices([oldPrimary, ...backupIndices.filter((i) => i !== newIdx && i !== oldPrimary)].slice(0, 2));
    } else {
      setBackupIndices(backupIndices.filter((i) => i !== newIdx));
    }
  };

  const toggleBackup = (idx: number) => {
    if (idx === primaryIndex) return;
    setBackupIndices(backupIndices.includes(idx) ? backupIndices.filter((i) => i !== idx) : backupIndices.length < 2 ? [...backupIndices, idx] : backupIndices);
  };

  const handleConfirm = () => {
    const primary = primaryIndex !== null ? (cleanIdeas[primaryIndex] || '') : '';
    const backups = backupIndices.map((i) => cleanIdeas[i]).filter(Boolean);
    const vaultItem: SprintVaultItem = {
      id: `sprint-${Date.now()}`,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      question, durationMins, ideaCount: cleanIdeas.length, rankTitle: rank.rankTitle,
      primaryIdea: primary, backupIdeas: backups, rawList: cleanIdeas,
    };
    onApply({ primaryIdea: primary, backupIdeas: backups, saveToVault, vaultItem });
  };

  return (
    <div className="fixed inset-0 z-80 bg-black/70 backdrop-blur-xs flex items-center justify-center p-4 animate-in fade-in duration-150 font-sans">
      <div className="bg-white border border-slate-200 rounded-2xl max-w-xl w-full p-6 shadow-2xl space-y-4 text-slate-900">
        <div className="flex items-center justify-between border-b border-slate-100 pb-3">
          <div className="flex items-center gap-2">
            <Trophy className="w-5 h-5 text-amber-500" />
            <h3 className="font-extrabold text-base text-slate-900">Sprint Complete!</h3>
          </div>
          <span className={`px-2.5 py-1 rounded-full text-xs font-black uppercase ${rank.badgeColor}`}>
            {rank.rankTitle} • {cleanIdeas.length} Ideas
          </span>
        </div>

        <p className="text-xs text-slate-600 leading-relaxed">
          Select <strong>1 Primary Idea</strong> for your story card, and up to <strong>2 Backup Ideas</strong> to sleep on.
        </p>

        <div className="max-h-56 overflow-y-auto space-y-2 pr-1">
          {cleanIdeas.map((idea, idx) => (
            <IdeaSprintSummaryItem key={idx} idea={idea} idx={idx} isPrimary={primaryIndex === idx} isBackup={backupIndices.includes(idx)} onSelectPrimary={handleSelectPrimary} onToggleBackup={toggleBackup} />
          ))}
        </div>

        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
          <label className="flex items-center gap-2 text-xs font-bold text-slate-700 cursor-pointer">
            <input type="checkbox" checked={saveToVault} onChange={(e) => setSaveToVault(e.target.checked)} className="rounded text-amber-500 w-4 h-4" />
            <FolderPlus className="w-4 h-4 text-amber-600" />
            <span>Add full list to Idea Vault</span>
          </label>
          <div className="flex items-center gap-2">
            <button type="button" onClick={onCancel} className="px-3.5 py-2 text-xs font-bold text-slate-600 bg-slate-100 rounded-lg">Discard</button>
            <button type="button" onClick={handleConfirm} className="px-5 py-2 text-xs font-black text-slate-950 bg-amber-500 hover:bg-amber-400 rounded-lg flex items-center gap-1.5 shadow-md cursor-pointer">
              <span>APPLY TO STORY</span>
              <Check className="w-4 h-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
