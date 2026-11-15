import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { SprintVaultItem } from './ideaSprintTypes';

interface IdeaVaultItemListProps {
  vaultItems: SprintVaultItem[];
}

export const IdeaVaultItemList: React.FC<IdeaVaultItemListProps> = ({ vaultItems }) => {
  const [openIds, setOpenIds] = useState<Record<string, boolean>>({});

  if (vaultItems.length === 0) {
    return (
      <p className="text-xs text-slate-500 py-3 text-center italic">
        No saved sprint lists yet. Run a Speed Brainstorming Sprint to store ideas in your vault!
      </p>
    );
  }

  const toggleItem = (id: string) => {
    setOpenIds((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  return (
    <div className="max-h-72 overflow-y-auto space-y-2 pr-1 font-sans">
      {vaultItems.map((item) => {
        const isOpen = Boolean(openIds[item.id]);
        const allIdeas = item.rawList && item.rawList.length > 0
          ? item.rawList
          : [item.primaryIdea, ...(item.backupIdeas || [])].filter((x): x is string => Boolean(x));

        return (
          <div key={item.id} className="bg-slate-50 border border-slate-200 rounded-xl overflow-hidden transition-all">
            <button
              type="button"
              onClick={() => toggleItem(item.id)}
              className="w-full p-2.5 text-left flex items-center justify-between gap-2 hover:bg-slate-100 transition cursor-pointer text-xs font-bold text-slate-800"
            >
              <span className="truncate">"{item.question}"</span>
              {isOpen ? (
                <ChevronDown className="w-4 h-4 text-amber-600 shrink-0" />
              ) : (
                <ChevronRight className="w-4 h-4 text-slate-400 shrink-0" />
              )}
            </button>

            {isOpen && (
              <div className="p-3 border-t border-slate-200/80 bg-white space-y-1.5 text-xs text-slate-700 animate-in fade-in duration-100">
                {allIdeas.map((idea, idx) => (
                  <div key={idx} className="flex items-start gap-2 py-0.5 leading-relaxed">
                    <span className="text-amber-500 font-bold shrink-0">•</span>
                    <span>{idea}</span>
                  </div>
                ))}
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
};
