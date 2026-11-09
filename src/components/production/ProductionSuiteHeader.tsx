import React from 'react';
import { Calendar, X } from 'lucide-react';
import { HowDoIUseButton } from './tour/HowDoIUseButton';

interface ProductionSuiteHeaderProps {
  title: string;
  scenesCount: number;
  charactersCount: number;
  onOpenTour: () => void;
  onClose: () => void;
}

export const ProductionSuiteHeader: React.FC<ProductionSuiteHeaderProps> = ({
  title, scenesCount, charactersCount, onOpenTour, onClose,
}) => {
  return (
    <div className="flex items-center justify-between p-4 border-b border-slate-800 bg-slate-900/90 font-sans">
      <div className="flex items-center gap-3">
        <div className="p-2 bg-amber-500/10 border border-amber-500/30 rounded-xl text-amber-400">
          <Calendar className="w-5 h-5" />
        </div>
        <div>
          <h2 className="text-base font-extrabold text-slate-100 uppercase tracking-wider flex items-center gap-2">
            Production Schedule & Call Sheet Suite
          </h2>
          <p className="text-xs text-slate-400 font-mono">
            {title || 'UNTITLED SCREENPLAY'} • {scenesCount} Scenes • {charactersCount} Cast Members
          </p>
        </div>
      </div>

      <div className="flex items-center gap-6 sm:gap-48">
        <HowDoIUseButton onClick={onOpenTour} />
        <button
          onClick={onClose}
          className="p-1.5 hover:bg-slate-800 text-slate-400 hover:text-white rounded-lg transition cursor-pointer"
          title="Close Pre-Production Suite"
        >
          <X className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
};
